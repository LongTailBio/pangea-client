import * as React from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';

type DropdownSelectProps = {
  label: string;
  options: string[];
  activeOption: string;
  controlId?: string;
  handleOptionChange(newOption: string): void;
};

const DropdownSelect: React.SFC<DropdownSelectProps> = (props) => {
  return (
    <form>
      <FormGroup controlId={props.controlId}>
        <ControlLabel>{props.label}</ControlLabel>
        <select
          className="form-control"
          value={props.activeOption}
          onChange={event => props.handleOptionChange(event.currentTarget.value)}
        >
          {props.options.map((option, index) => {
            return (
              <option key={index} value={option}>{option.displayFormat()}</option>
            );
          })}
        </select>
      </FormGroup>
    </form>
  );
};

export default DropdownSelect;
