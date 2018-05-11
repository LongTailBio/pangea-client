import * as React from 'react';
import { CancelTokenSource } from 'axios';

import GenericGeneModule, { GenericGeneProps } from '../components/GenericGeneModule';
import { getAnalysisResult } from '../../services/api';
import { GenericGeneType } from '../../services/api/models/queryResult';

export default class CARDModule extends GenericGeneModule {

  constructor(props: GenericGeneProps) {
    super(props);

    this.title = 'Antimicrobial Resistance (AMR) Abundance';
    this.description = (
      <div>
        <p>The abundance of Antibiotic Resisitant Genes as defined by the {' '}
          Comprehensive Antibiotic Resistance Database (CARD).</p>
        <p>Samples are compared directly to amino acid sequences. Displayed values {' '}
          the log10 of Reads per Kilobase per Millions (RPKM) or Reads per {' '}
          Kilobase per Millions per Genome Base (RPKMG).</p>
      </div>
    );

    this.chartId = 'card-amr-chart';
    this.yAxisTitle = 'Abundance';
  }

  /** @inheritdoc */
  fetchData(sourceToken: CancelTokenSource) {
    return getAnalysisResult<GenericGeneType>(this.props.uuid, 'card_amr_genes', sourceToken);
  }

}
