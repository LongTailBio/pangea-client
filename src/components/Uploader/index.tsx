import React from 'react';
import Uppy from '@uppy/core';
import AwsS3Multipart, { AwsS3Part } from '@uppy/aws-s3-multipart';
import { DragDrop, StatusBar, Dashboard, DashboardModal } from '@uppy/react';

import { getCompanionHost } from '../../services/api/utils';
import { pangeaFetch } from '../../services/api/coreApi';

import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import '@uppy/status-bar/dist/style.css';
import '@uppy/dashboard/dist/style.css'

type MaybePromise<T> = T | Promise<T>

interface S3UploaderProps {
  getRootUrl: () => string;
  uploadDone: () => void;
  upload: boolean;

  width?: number;
  height?: number;
}

interface S3UploaderState {
  didComplete: boolean;
  uploadId: string;
  uploadUrls: string[];
  rootUrl: string;
}

interface S3PartData {uploadId: string; key: string; body: Blob; number: number}

export class S3Uploader extends React.Component<S3UploaderProps, S3UploaderState> {
  private uppy: Uppy.Uppy;

  state = {
    didComplete: false,
    uploadId: '',
    uploadUrls: [],
    rootUrl: '',
  };

  constructor(props: S3UploaderProps) {
    super(props);
    this.uppy = Uppy<Uppy.StrictTypes>({
      restrictions: {
        maxNumberOfFiles: 1,
      },
      autoProceed: false,
    });

    this.myCreateMultipartUpload = this.myCreateMultipartUpload.bind(this)
    this.myPrepareUploadPart = this.myPrepareUploadPart.bind(this)
    this.myCompleteMultipartUpload = this.myCompleteMultipartUpload.bind(this)

    this.uppy.use(AwsS3Multipart, {
      limit: 4,
      prepareUploadPart: this.myPrepareUploadPart,
      createMultipartUpload: this.myCreateMultipartUpload,
      completeMultipartUpload: this.myCompleteMultipartUpload,
    })

    // this.uppy.on('complete', this.handleUppyComplete);
    // this.uppy.on('error', this.props.onUploadError);
  }

  myCreateMultipartUpload(file: Uppy.UppyFile):
    MaybePromise<{ uploadId: string; key: string }>
  {
    const chunkSize = 5 * 1024 * 1024;
    const n_parts: number = Math.ceil(file.size / chunkSize);
    const url = this.props.getRootUrl() + '/upload_s3';
    const body = {
      'filename': file.name,
      'n_parts': n_parts,
      'stance': 'upload-multipart',
    };
    const result = pangeaFetch(url, 'POST', JSON.stringify(body))
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        const uploadId = data['upload_id'] as string;
        const uploadUrls = data['urls'] as string[];
        this.setState({uploadId, uploadUrls})
        return {
          uploadId: uploadId,
          key: 'this key does not matter we do not use it',
        }
      })
    return result;
  }

  myPrepareUploadPart(file: Uppy.UppyFile, partData: {uploadId: string; key: string; body: Blob; number: number}):
    MaybePromise<{ url: string }>
  {
    const { uploadId, key, body, number } = partData;
    return { url: this.state.uploadUrls[number - 1] }
  }

  myCompleteMultipartUpload(file: Uppy.UppyFile, opts: { uploadId: string; key: string; parts: AwsS3Part[] }): MaybePromise<{}>
  {
    const { uploadId, key, parts } = opts;
    const url = this.props.getRootUrl() + '/complete_upload_s3';
    const body = {
      'upload_id': this.state.uploadId,
      'parts': parts,
    };
    return pangeaFetch(url, 'POST', JSON.stringify(body))
      .then((response) => {
        this.props.uploadDone()
        return {}
      });
  }

  componentDidUpdate() {
    if(this.props.upload){
      this.uppy.upload();
    }
  }

  componentWillUnmount(): void {
    this.uppy.close();
  }

  handleUppyComplete = (result: Uppy.UploadResult): void => {
    if (result.successful.length > 0) {
      const url = result.successful[0].uploadURL;
      console.log(`Successful S3 upload: ${url}`);
    }
  };

  render(): React.ReactElement | null {
    const { didComplete } = this.state;

    if (didComplete) {
      return (
        <p>
          Your submission has been submitted. You will be notified when the
          upload completes.
        </p>
      );
    }

    return (
      <Dashboard
        uppy={this.uppy}
        showProgressDetails={true}
        hideUploadButton={true}
        width={this.props.width ? this.props.width : 750} 
        height={this.props.height ? this.props.height : 200}
       />
    );
  }
}

export default S3Uploader;
