import * as React from 'react';
import { MenuItem } from 'react-bootstrap';

export interface DownloadButtonItemProps {
  title: string;
  action(): void;
}

export const DownloadButtonItem = (props: DownloadButtonItemProps) => {
  return <MenuItem onClick={props.action}>{props.title}</MenuItem>;
};
