import * as React from 'react';
import { FormGroup, Radio, ControlLabel } from 'react-bootstrap';

type PlotSourceProps = {
  activeSource: string;
  sources: string[];
  handleSourceChange(newSource: string): void;
};

class SelectSource extends React.Component<PlotSourceProps, {}> {
  render() {
    return (
      <form>
        <FormGroup>
          <ControlLabel>Select Data Source:</ControlLabel>
          {this.props.sources.map((source, index) => {
            const checked = source === this.props.activeSource;
            return (
              <Radio
                key={index}
                name="plotSource"
                checked={checked}
                onChange={() => this.props.handleSourceChange(source)}
              >
                {source.displayFormat()}
              </Radio>
            );
          })}
        </FormGroup>
      </form>
    );
  }
}

export default SelectSource;
