import * as React from 'react';
import { Popover, OverlayTrigger, Button, Glyphicon } from 'react-bootstrap';

export interface PlotHeaderProps {
  title: string | undefined;
  description: React.ReactNode;
  downloadPng(): void;
  downloadCsv(): void;
}

export const PlotHeader: React.StatelessComponent<PlotHeaderProps> = props => {
  const popoverDescription = (description: React.ReactNode) => (
    <Popover id="popover-description" title="" arrowOffsetLeft="300">
      {description}
    </Popover>
  );

  return (
    <h2 style={{ marginTop: '50px' }}>
      {props.title}
      <div className="pull-right">
        <OverlayTrigger
          trigger="click"
          rootClose={true}
          placement="bottom"
          overlay={popoverDescription(props.description)}
        >
          <Button bsStyle="link" bsSize="large">
            <Glyphicon glyph="info-sign" /> About
          </Button>
        </OverlayTrigger>
      </div>
    </h2>
  );
};
