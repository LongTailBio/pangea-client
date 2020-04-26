import * as React from 'react';
import * as d3 from 'd3';
import * as Highcharts from 'highcharts';

import { Row, Col } from 'react-bootstrap';

import { ChartRefProps } from '../../../components/DisplayContainer/highcharts';
import HighChartsPlot from '../../../plots/HighChartsPlot';
import { MicrobeDirectoryType } from '../../../../services/api/models/queryResult';

import MicrobeDirectoryControls from './components/MicrobeDirectoryControls';

const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

const formatText = (text: string) => {
  let toReturn = text;
  toReturn = toReturn.replace('_', ' ');
  toReturn = toTitleCase(toReturn);
  return toReturn;
};

// Property name --> propert value --> data
// type PropertyMapType = {
//   [key: string]: {
//     [key: string]: number[];
//   };
// };

const baseOptions: Highcharts.Options = {
  chart: {
    type: 'column',
  },
  title: {
    text: null,
  },
  yAxis: {
    title: {
      text: 'Microbe Directory Annotations',
    },
    stackLabels: {
      enabled: false,
      style: {
        fontWeight: 'bold',
        color: 'gray',
      },
    },
  },
  tooltip: {
    headerFormat: '<b>{point.x}</b><br/>',
    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
  },
  plotOptions: {
    column: {
      stacking: 'percent',
      dataLabels: {
        enabled: false,
        color: 'white',
      },
    },
  },
  exporting: {
    enabled: false,
  },
};

const sampleOptions = (data: MicrobeDirectoryType): Highcharts.Options => {
  const sampleName = Object.keys(data.samples)[0],
        sample = data.samples[sampleName],
        columns = Object.keys(sample),
        series: Highcharts.IndividualSeriesOptions[] = [];

  columns.forEach((column, index) => {
    const columnData = sample[column],
          columnBuckets = Object.keys(columnData); // of which each "bucket" is a percentage
    columnBuckets.forEach(bucket => {
      const percentage = columnData[bucket];

      const seriesData: number[] = Array(columns.length);
      seriesData.fill(0); // everything is "0" except for the item of interest
      seriesData[index] = percentage; // this it the item of interest

      series.push({
        name: bucket.displayFormat(),
        data: seriesData,
      });
    });
  });

  const columnsFormatted = columns.map(column => formatText(column));
  const seriesOptions: Highcharts.Options = {
    xAxis: {
      categories: columnsFormatted,
    },
    legend: {
      enabled: false,
    },
    series,
  };

  return seriesOptions;
};

const groupOptions = function(data: MicrobeDirectoryType, activeProperty: string): Highcharts.Options {
  const sampleNames = Object.keys(data.samples),
        propertyValues = Object.keys(data.samples[sampleNames[0]][activeProperty]);

  const series = propertyValues.map(propertyValue => {
    const seriesData = sampleNames.map(sampleName => {
      return data.samples[sampleName][activeProperty][propertyValue];
    });
    const seriesItem: Highcharts.IndividualSeriesOptions = {
      name: propertyValue.displayFormat(),
      data: seriesData,
    };
    return seriesItem;
  });

  const seriesOptions: Highcharts.Options = {
    xAxis: {
      categories: sampleNames,
    },
    series,
  };

  return seriesOptions;
};

export interface MicrobeDirectoryProps extends ChartRefProps {
  data: MicrobeDirectoryType;
  isSingleton?: boolean;
}

export interface MicrobeDirectoryState {
  activeProperty: string;
  propertyValues: string[];
}

export class MicrobeDirectoryContainer extends React.Component<MicrobeDirectoryProps, MicrobeDirectoryState> {

  protected color: d3.ScaleOrdinal<string, string>;

  constructor(props: MicrobeDirectoryProps) {
    super(props);

    const sampleNames = Object.keys(this.props.data.samples);
    const propertyNames = Object.keys(this.props.data.samples[sampleNames[0]]);
    this.color = d3.scaleOrdinal(d3.schemeCategory10);

    this.state = {
      activeProperty: propertyNames[0],
      propertyValues: propertyNames,
    };

    this.handlePropertyChange = this.handlePropertyChange.bind(this);
  }

  handlePropertyChange(property: string) {
    this.setState({
      activeProperty: property,
    });
  }

  render() {
    const data = this.props.data,
          isSingleton = this.props.isSingleton || false,
          activeProperty = this.state.activeProperty,
          seriesOptions = isSingleton ? sampleOptions(data) : groupOptions(data, activeProperty),
          chartOptions = Object.assign(baseOptions, seriesOptions);

    if (isSingleton) {
      return (
        <Row>
          <Col lg={12}>
            <HighChartsPlot
              chartId="microbe-directory"
              options={chartOptions}
              chartRef={this.props.chartRef}
            />
          </Col>
        </Row>
      );
    }

    const sampleNames = Object.keys(data.samples),
          propertyNames = Object.keys(data.samples[sampleNames[0]]);

    return (
      <Row>
        <Col lg={9}>
          <HighChartsPlot
            chartId="microbe-directory"
            options={chartOptions}
            chartRef={this.props.chartRef}
          />
        </Col>
        <Col lg={3}>
            <MicrobeDirectoryControls
              properties={propertyNames}
              activeProperty={activeProperty}
              handlePropertyChange={this.handlePropertyChange}
            />
          </Col>
      </Row>
    );
  }

}

export default MicrobeDirectoryContainer;
