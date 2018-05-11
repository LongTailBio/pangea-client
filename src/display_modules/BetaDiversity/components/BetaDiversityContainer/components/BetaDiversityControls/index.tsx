import * as React from 'react';
import { Well } from 'react-bootstrap';

import DropdownSelect from '../../../../../controls/DropdownSelect';

type ControlsProps = {
  ranks: string[];
  metrics: string[];
  tools: string[];
  activeRank: string;
  activeMetric: string;
  activeTool: string;
  handleRankChange(rank?: string): void;
  handleMetricChange(metric?: string): void;
  handleToolChange(tool?: string): void;
};

const BetaDiversityControls: React.SFC<ControlsProps> = (props) => {
  return (
    <Well>
      <DropdownSelect
        label="Rank"
        options={props.ranks}
        activeOption={props.activeRank}
        handleOptionChange={props.handleRankChange}
      />
      <DropdownSelect
        label="Metric"
        options={props.metrics}
        activeOption={props.activeMetric}
        handleOptionChange={props.handleMetricChange}
      />
      <DropdownSelect
        label="Tool"
        options={props.tools}
        activeOption={props.activeTool}
        handleOptionChange={props.handleToolChange}
      />
    </Well>
  );
};

export default BetaDiversityControls;
