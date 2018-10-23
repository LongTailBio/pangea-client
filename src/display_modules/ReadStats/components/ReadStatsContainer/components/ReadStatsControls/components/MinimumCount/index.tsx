import * as React from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';

interface MinimumCountProps {
  activeCount: number;
  handleCountChange(newCount: number): void;
}

const MinimumCount: React.SFC<MinimumCountProps> = props => {
  return (
    <form>
      <FormGroup>
        <ControlLabel>Minimum Read Count</ControlLabel>
        <input
          type="number"
          value={props.activeCount}
          onChange={event => props.handleCountChange(event.currentTarget.valueAsNumber)}
        />
      </FormGroup>
    </form>
  );
};

export default MinimumCount;
