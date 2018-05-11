import * as React from 'react';
import * as Highcharts from 'highcharts';
import { Row, Col } from 'react-bootstrap';

import HeatmapPlot, { HeatMapProps } from '../../../../display_modules/plots/HeatmapPlot';
import HighChartsPlot from '../../../plots/HighChartsPlot';
import { HeatMapDatum } from '../../../../display_modules/plots/HeatmapPlot/util/heatmap';
import { MacrobesType } from '../../../../services/api/models/queryResult';
import { SvgRefProps } from '../../../components/DisplayContainer/d3';

export interface MacrobesProps extends SvgRefProps {
  data: MacrobesType;
  isSingleton?: boolean;
}

export default class MacrobesContainer extends React.Component<MacrobesProps, {}> {

  chartOptions(): Highcharts.Options {
    const sampleName: string = Object.keys(this.props.data.samples)[0],
          dataSet: {[key: string]: number} = this.props.data.samples[sampleName],
          macrobeNames: string[] = Object.keys(dataSet);

    const data = macrobeNames.map(macrobe => dataSet[macrobe]);

    const chartOptions: Highcharts.Options = {
      chart: {
        type: 'column',
      },
      title: {
        text: null,
      },
      legend: {
        enabled: true,
      },
      xAxis: {
        categories: macrobeNames.map(name => name.displayFormat()),
      },
      yAxis: {
        title: {
          text: 'RPKM',
        },
      },
      exporting: {
        enabled: false,
      },
      series: [{name: sampleName, data}],
    };

    return chartOptions;
  }

  heatmapOptions(): HeatMapProps {
    const sampleNames: string[] = Object.keys(this.props.data.samples),
          macrobeNames: string[] = Object.keys(this.props.data.samples[sampleNames[0]]);

    const newValues: HeatMapDatum[] = [];
    sampleNames.forEach((columnName, column) => {
      macrobeNames.forEach((rowName, row) => {
        newValues.push({
          x: column,
          y: row,
          value: this.props.data.samples[columnName][rowName],
        });
      });
    });

    const result = {
      axis: {
        x: sampleNames.map(name => ({name: name.displayFormat()})),
        y: macrobeNames.map(name => name.displayFormat()),
      },
      data: newValues,
      buckets: 10,
      maxAxisNameLength: 100,
      axisNameSize: 12,
      legend: {
        precision: 3,
        name: 'z-score',
      },
      svgRef: this.props.svgRef,
    };

    return result;
  }

  render() {
    const isSingleton = this.props.isSingleton || false;

    if (isSingleton) {
      const chartOptions = this.chartOptions();
      return (
        <Row>
          <Col lg={12}>
            <HighChartsPlot
              chartId="macrobes"
              options={chartOptions}
              chartRef={() => {}} // tslint:disable-line no-empty
            />
          </Col>
        </Row>
      );
    }

    const chartProps = this.heatmapOptions();

    return (
      <Row>
        <Col lg={12}>
          <HeatmapPlot {...chartProps} />
        </Col>
      </Row>
    );
  }

}
