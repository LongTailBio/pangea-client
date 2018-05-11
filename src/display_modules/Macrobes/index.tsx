import * as React from 'react';
import { CancelTokenSource } from 'axios';

import D3DisplayContainer from '../components/DisplayContainer/d3';
import { DisplayContainerProps } from '../components/DisplayContainer';
import { MacrobesType } from '../../services/api/models/queryResult';
import { getAnalysisResult } from '../../services/api';

import MacrobesContainer from './components/MacrobesContainer';

interface MacrobesProps extends DisplayContainerProps {
  isSingleton?: boolean;
}

export default class MacrobesModule extends D3DisplayContainer<MacrobesType, MacrobesProps> {

  constructor(props: DisplayContainerProps) {
    super(props);

    this.title = 'Abundance of Common Organisms';
    this.description = (
      <div>
        <p>Each sample is compared to representative genetic sequences from a set of common
           organisms. Higher values indicate that a sample has more sequence similar to 
           the target.</p>
        <p>Values account for similarity to the human genome. Displayed values are z-scores indicating
           the relative abundance of a species compared to other samples in the group.</p>
      </div>
    );
  }

  /** @inheritdoc */
  fetchData(sourceToken: CancelTokenSource) {
    return getAnalysisResult<MacrobesType>(this.props.uuid, 'macrobe_abundance', sourceToken);
  }

  /** @inheritdoc */
  plotContainer(data: MacrobesType): JSX.Element {
    return (
      <MacrobesContainer
        data={data}
        svgRef={el => this.svgCanvas = el}
        isSingleton={this.props.isSingleton}
      />
    );
  }
}
