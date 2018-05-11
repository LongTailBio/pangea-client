import * as React from 'react';
import { CancelTokenSource } from 'axios';

import GenericGeneModule, { GenericGeneProps } from '../components/GenericGeneModule';
import { getAnalysisResult } from '../../services/api';
import { GenericGeneType } from '../../services/api/models/queryResult';

export default class Humann2NormalizeModule extends GenericGeneModule {

  constructor(props: GenericGeneProps) {
    super(props);

    this.title = 'Functional Gene Abundance';
    this.description = (
      <div>
        <p>The abundance of genes with known metabolic or biochemical functions. These genes {' '}
          are organized into pathways, chains of interrelated functions. The abundance of {' '}
          various pathways may be seen below.</p>
        <p>These genes measure how a bacterial community survives in an environment.</p>
        <p>Samples are compared directly to amino acid sequences. Displayed values {' '}
          the log10 of Reads per Kilobase per Millions (RPKM) or Reads per {' '}
          Kilobase per Millions per Genome Base (RPKMG).</p>
      </div>
    );

    this.chartId = 'humann2-normalize-chart';
    this.yAxisTitle = 'Abundance';
  }

  /** @inheritdoc */
  fetchData(sourceToken: CancelTokenSource) {
    return getAnalysisResult<GenericGeneType>(this.props.uuid, 'functional_genes', sourceToken);
  }

}
