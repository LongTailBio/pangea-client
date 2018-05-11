import * as React from 'react';
import { CancelTokenSource } from 'axios';

import GenericGeneModule, { GenericGeneProps } from '../components/GenericGeneModule';
import { getAnalysisResult } from '../../services/api';
import { GenericGeneType } from '../../services/api/models/queryResult';

export default class MethylModule extends GenericGeneModule {

  constructor(props: GenericGeneProps) {
    super(props);

    this.title = 'Methyltransferase Abundance';
    this.description = (
      <div>
        <p>The abundance of microbial methyltransferase genes. {' '}
          These genes are responsible for genetic regulation.</p>
        <p>Samples are compared directly to amino acid sequences. Displayed values {' '}
          the log10 of Reads per Kilobase per Millions (RPKM) or Reads per {' '}
          Kilobase per Millions per Genome Base (RPKMG).</p>
      </div>
    );

    this.chartId = 'methyl-chart';
    this.yAxisTitle = 'Abundance';
  }

  /** @inheritdoc */
  fetchData(sourceToken: CancelTokenSource) {
    return getAnalysisResult<GenericGeneType>(this.props.uuid, 'methyltransferases', sourceToken);
  }

}
