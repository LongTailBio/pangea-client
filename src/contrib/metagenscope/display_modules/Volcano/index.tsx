import * as React from 'react';
import { CancelTokenSource } from 'axios';

import HighchartsDisplayContainer from '../components/DisplayContainer/highcharts';
import { DisplayContainerProps } from '../components/DisplayContainer';
import { VolcanoType } from '../../services/api/models/queryResult';

import { VolcanoContainer } from './components/VolcanoContainer';

export class VolcanoModule extends HighchartsDisplayContainer<VolcanoType> {

  constructor(props: DisplayContainerProps) {
    super(props);

    this.title = 'Differential Abundance';
    this.moduleName = 'metagenscope::v0.1.0::volcano';
    this.fieldName = 'volcano';
    this.description = (
      <div>
        <p>This chart shows features that are both high abundance and consistently
          changed between conditions.</p>
        <p>Samples with the selected metadata attribute are compared to all samples
           without that attribute. Each point represents a particular feature: the X
           position corresponds to how much more a feature is represented in selected
           samples, the Y position is a stastical value measuring how likely a change
           is due to random chance.</p>
        <p>P-Values are calculated using a two-sided non-parametric Mann-Whitney-U test.
           Positive X values are overrepresented in the slected group, negative are
           underrepresented.</p>
      </div>
    );
  }

  /** @inheritdoc */
  plotContainer(data: VolcanoType): JSX.Element {
    return <VolcanoContainer data={data} chartRef={el => this.chart = el} />;
  }
}
