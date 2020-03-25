import * as React from 'react';
import { Dropdown, Glyphicon } from 'react-bootstrap';

import { DownloadButtonItem } from './components/DownloadButtonItem';

export interface DownloadButtonProps {
  actions: {
    title: string;
    action(): void;
  }[];
}

export const DownloadButton = (props: DownloadButtonProps) => {
  return (
    <Dropdown
      id="split-button-pull-right"
      disabled={props.actions.length === 0}
      pullRight={true}
    >
      <Dropdown.Toggle noCaret={true}>
        <Glyphicon glyph="download-alt" />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {props.actions.map((action, index) => (
          <DownloadButtonItem key={index} {...action} />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};
