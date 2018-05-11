import * as React from 'react';
import { CancelTokenSource } from 'axios';

import D3DisplayContainer from '../components/DisplayContainer/d3';
import { DisplayContainerProps } from '../components/DisplayContainer';
import { PathwaysType } from '../../services/api/models/queryResult';
import { getAnalysisResult } from '../../services/api';

import BetaDiversityContainer from './components/PathwaysContainer';

interface PathwaysProps extends DisplayContainerProps {
  isSingleton?: boolean;
}

export default class PathwaysModule extends D3DisplayContainer<PathwaysType, PathwaysProps> {

  constructor(props: DisplayContainerProps) {
    super(props);

    this.title = 'Biochemical Functional Pathway Abundance';
    this.description = (
      <div>
        <p>The relative abundance of biochemical and metabolic pathways found in your sample.</p>
        <p>The abundance of groups of genes with known metabolic or biochemical functions. {' '}
           The abundance of individual genes may be seen above.</p>
        <p>Source: <a href="https://bitbucket.org/biobakery/humann2/wiki/Home" target="_blank">Humann2</a></p>
      </div>
    );
  }

  /** @inheritdoc */
  fetchData(sourceToken: CancelTokenSource) {
    return getAnalysisResult<PathwaysType>(this.props.uuid, 'pathways', sourceToken);
  }

  /** @inheritdoc */
  plotContainer(data: PathwaysType): JSX.Element {
    return (
      <BetaDiversityContainer
        data={data}
        svgRef={el => this.svgCanvas = el}
        isSingleton={this.props.isSingleton}
      />
    );
  }
}
