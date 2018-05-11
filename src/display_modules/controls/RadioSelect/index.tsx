import * as React from 'react';
import { FormGroup, Radio, ControlLabel } from 'react-bootstrap';

type RadioSelectProps = {
  label: string;
  options: string[];
  activeOption: string;
  handleOptionChange(newOption: string): void;
};

const RadioSelect: React.SFC<RadioSelectProps> = (props) => {
  return (
    <form>
      <FormGroup>
        <ControlLabel>{props.label}</ControlLabel>
        {props.options.map((option, index) => {
          const checked = option === props.activeOption;
          return (
            <Radio
              key={index}
              name="plotSource"
              checked={checked}
              onChange={() => props.handleOptionChange(option)}
            >
              {option.displayFormat()}
            </Radio>
          );
        })}
      </FormGroup>
    </form>
  );
};

export default RadioSelect;
