import * as React from 'react';
import { Well } from 'react-bootstrap';

import RadioSelect from '../../../../../controls/RadioSelect';

type ControlsProps = {
  metrics: string[];
  activeMetric: string;
  handleMetricChange(metric?: string): void;
};

const PathwaysControls: React.SFC<ControlsProps> = (props) => {
  return (
    <Well>
      <RadioSelect
        label="Metric"
        options={props.metrics}
        activeOption={props.activeMetric}
        handleOptionChange={props.handleMetricChange}
      />
    </Well>
  );
};

export default PathwaysControls;
