import React from "react";
import Uppy from "@uppy/core";
import AwsS3Multipart from "@uppy/aws-s3-multipart";
import { DragDrop, StatusBar } from "@uppy/react";

import { getCompanionHost } from "../../../services/api/utils";

import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";
import "@uppy/status-bar/dist/style.css";

interface Covid19UploaderProps {
  userId: number;
  onUploadError(err: Error): void;
  onCompleteUpload(userId: number, url: string): void;
}

interface Covid19UploaderState {
  didComplete: boolean;
}

class Covid19Uploader extends React.Component<
  Covid19UploaderProps,
  Covid19UploaderState
> {
  private uppy: Uppy.Uppy;

  state = {
    didComplete: false
  };

  constructor(props: Covid19UploaderProps) {
    super(props);

    this.uppy = Uppy<Uppy.StrictTypes>({
      meta: { contrib_module: "covid19" },
      restrictions: { maxNumberOfFiles: 1 },
      autoProceed: true
    });

    const { authToken } = window.localStorage;
    this.uppy.use(AwsS3Multipart, {
      limit: 4,
      companionUrl: getCompanionHost(),
      companionHeaders: {
        "X-Pangea-Token": authToken
      }
    });

    this.uppy.on("complete", this.handleUppyComplete);
    this.uppy.on("error", this.props.onUploadError);
  }

  componentWillUnmount() {
    this.uppy.close();
  }

  handleUppyComplete = (result: Uppy.UploadResult) => {
    if (result.successful.length > 0) {
      const url = result.successful[0].uploadURL;
      console.log(`Successful S3 upload: ${url}`);
      this.props.onCompleteUpload(this.props.userId, url);
    }
  };

  render() {
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
      <>
        <DragDrop uppy={this.uppy} note="Raw reads only" />
        <br />
        <StatusBar uppy={this.uppy} showProgressDetails={true} />
      </>
    );
  }
}

export default Covid19Uploader;
