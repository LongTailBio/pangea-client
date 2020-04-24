import * as React from 'react';
import { Well } from 'react-bootstrap';

import DropdownSelect from '../../../../../../controls/DropdownSelect';

type ControlsProps = {
  metrics: string[];
  activeMetric: string;
  handleMetricChange(metric?: string): void;
};

const GenericGeneControls: React.SFC<ControlsProps> = (props) => {
  return (
    <Well>
      <DropdownSelect
        label="Metric"
        options={props.metrics}
        activeOption={props.activeMetric}
        handleOptionChange={props.handleMetricChange}
      />
    </Well>
  );
};

export default GenericGeneControls;
