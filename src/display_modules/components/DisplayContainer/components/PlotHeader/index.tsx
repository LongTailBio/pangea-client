import * as React from 'react';
import { Popover, OverlayTrigger, Button, Glyphicon } from 'react-bootstrap';

import { DownloadButton, DownloadButtonAction } from './components/DownloadButton';

export interface PlotHeaderProps {
  title: string;
  description: React.ReactNode;
  downloadPng(): void;
  downloadCsv(): void;
}

export const PlotHeader: React.StatelessComponent<PlotHeaderProps> = (props) => {
  const popoverDescription = (description: React.ReactNode) => (
    <Popover id="popover-description" title="" arrowOffsetLeft="300">
      {description}
    </Popover>
  );

  const actions: DownloadButtonAction[] = [
    // Re-enable download actions at some point:
    // https://github.com/LongTailBio/metagenscope-client/issues/85

    // {
    //   title: 'Download PNG image',
    //   action: props.downloadPng,
    // },
    // {
    //   title: 'Download CSV data',
    //   action: props.downloadCsv,
    // },
  ];

  return (
    <h2 style={{marginTop: '50px'}}>
      <div className="pull-right">
        <DownloadButton actions={actions} />
      </div>
      {props.title}
      <OverlayTrigger
        trigger="click"
        rootClose={true}
        placement="bottom"
        overlay={popoverDescription(props.description)}
      >
        <Button bsStyle="link" bsSize="large"><Glyphicon glyph="info-sign" /></Button>
      </OverlayTrigger>
    </h2>
  );
};
