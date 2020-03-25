import * as React from 'react';
import { Button } from 'react-bootstrap';

export enum DisplayModuleState {
  Loading = 'LOADING',
  Error = 'ERROR',
  Pending = 'PENDING',
  Working = 'WORKING',
  Success = 'SUCCESS',
}

export interface StatusMonitorProps {
  state: DisplayModuleState;
  retry?: () => void;
}

export const StatusMonitor: React.StatelessComponent<StatusMonitorProps> = props => {
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
        {props.state === DisplayModuleState.Loading && (
          <h3>Fetching module...</h3>
        )}
        {props.state === DisplayModuleState.Error && (
          <div>
            <h3>There was an error fetching the module.</h3>
            {props.retry && <Button bsStyle="warning" onClick={props.retry} />}
          </div>
        )}
        {props.state === DisplayModuleState.Pending && (
          <h3>This module is waiting to begin processing.</h3>
        )}
        {props.state === DisplayModuleState.Working && (
          <h3>This module is currently being processed.</h3>
        )}
      </div>
    </div>
  );
};
