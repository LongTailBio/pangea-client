import React from "react";
import Uppy from "@uppy/core";
import AwsS3Multipart from "@uppy/aws-s3-multipart";
import { DragDrop, StatusBar } from "@uppy/react";
import { getCompanionHost } from "../../services/api/utils";

import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";
import "@uppy/status-bar/dist/style.css";

class Covid19 extends React.Component<{}, {}> {
  private uppy: Uppy.Uppy;

  constructor(props: {}) {
    super(props);

    this.uppy = Uppy<Uppy.StrictTypes>({
      meta: {},
      restrictions: { maxNumberOfFiles: 1 },
      autoProceed: true
    });

    // const { authToken } = window.localStorage;
    this.uppy.use(AwsS3Multipart, {
      limit: 4,
      companionUrl: getCompanionHost()
      // serverHeaders: {
      //   "X-Pangea-Token": authToken
      // },
      // companionHeaders: {
      //   "X-Pangea-Token": authToken
      // }
    });

    this.uppy.on("complete", this.handleUppyComplete);
  }

  componentWillUnmount() {
    this.uppy.close();
  }

  handleUppyComplete = (result: Uppy.UploadResult) => {
    console.log(result);
    const url = result.successful[0].uploadURL;
    console.log(`Successful S3 upload: ${url}`);
  };

  render() {
    return (
      <>
        <h1>COVID-19</h1>
        <DragDrop uppy={this.uppy} note="Raw reads only" />
        <br />
        <StatusBar uppy={this.uppy} showProgressDetails={true} />
      </>
    );
  }
}

export default Covid19;
