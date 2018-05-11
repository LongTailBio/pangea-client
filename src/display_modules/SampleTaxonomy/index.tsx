import * as React from 'react';
import { CancelTokenSource } from 'axios';

import D3DisplayContainer from '../components/DisplayContainer/d3';
import { DisplayContainerProps } from '../components/DisplayContainer';
import { SampleTaxonomyType } from '../../services/api/models/queryResult';
import { getAnalysisResult } from '../../services/api';

import { SampleTaxonomyContainer } from './components/SampleTaxonomyContainer';

export class SampleTaxonomyModule extends D3DisplayContainer<SampleTaxonomyType> {

  constructor(props: DisplayContainerProps) {
    super(props);

    this.title = 'Sample Taxonomy';
    this.description = (
      <div>
        <p>The size of each group is proportional to its prevalence.</p>
        <p>Click on a group to zoom in, click in the center to zoom out.</p>
        <p>Human microbiomes typically have two prominent groups of bacteria: {' '}
          the Bacteroides and the Firmicutes. However most enviromental samples {' '}
          collected so far have a much wider diversity of species. The health {' '}
          implications of different bacteria in the environment is an ongoing {' '}
          area of research.</p>
      </div>
    );
  }

  /** @inheritdoc */
  fetchData(sourceToken: CancelTokenSource) {
    return getAnalysisResult<SampleTaxonomyType>(this.props.uuid, 'taxa_tree', sourceToken);
  }

  /** @inheritdoc */
  plotContainer(data: SampleTaxonomyType): JSX.Element {
    return <SampleTaxonomyContainer data={data} svgRef={el => this.svgCanvas = el} />;
  }
}