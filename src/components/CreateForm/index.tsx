import React from 'react';
import {
  Popover, OverlayTrigger, Button, Glyphicon
} from 'react-bootstrap';

import CSS from 'csstype';


export const multilineText: CSS.Properties = {
  whiteSpace: 'pre-line',
};

const popoverDescription = (description: React.ReactNode) => (
  <Popover id="popover-description" title="" arrowOffsetLeft="300" style={multilineText}>
    {description}
  </Popover>
);

export interface InfoButtonProps {
    desc: string;
}


export const InfoButton = (props: InfoButtonProps) => {
    return (
      <OverlayTrigger
        trigger="click"
        rootClose={true}
        placement="bottom"
        overlay={popoverDescription(props.desc)}
      >
        <Button bsStyle="link" bsSize="large">
          <Glyphicon glyph="info-sign" />
        </Button>
      </OverlayTrigger>
    )
}