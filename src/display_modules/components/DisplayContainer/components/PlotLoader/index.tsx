import * as React from 'react';
import { ProgressBar } from 'react-bootstrap';

export interface PlotLoaderProps {
  percentComplete: number;
}

export const PlotLoader: React.StatelessComponent<PlotLoaderProps> = props => {
  return (
    <div
      style={{
        display: 'table',
        width: '100%',
        height: '400px',
        background: '#F8F8F8',
      }}
    >
      <div
        style={{
          display: 'table-cell',
          verticalAlign: 'middle',
          padding: '0 15%',
        }}
      >
        <p>Loading...</p>
        <ProgressBar
          bsStyle="success"
          now={props.percentComplete}
          key={2}
          active={true}
        />
      </div>
    </div>
  );
};
