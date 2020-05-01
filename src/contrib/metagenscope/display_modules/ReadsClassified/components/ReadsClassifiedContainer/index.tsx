import * as React from 'react';
import * as Highcharts from 'highcharts';

import { ChartRefProps } from '../../../components/DisplayContainer/highcharts';
import HighChartsPlot from '../../../plots/HighChartsPlot';
import { ReadsClassifiedType } from '../../../../services/api/models/queryResult';

interface ReadsClassifiedProps extends ChartRefProps {
  isSingleton?: boolean;
  data: ReadsClassifiedType;
}

const sampleGroupOptions = function(data: ReadsClassifiedType): Highcharts.Options {
  const seriesMap: {[key: string]: number[]} = {
    viral: [],
    archaeal: [],
    bacterial: [],
    host: [],
    nonhost_macrobial: [],
    nonfungal_eukaryotic: [],
    fungal: [],
    unknown: [],
  };

  const sampleNames = Object.keys(data.samples)
    .sort((n1, n2) => data.samples[n1].unknown - data.samples[n2].unknown);
  sampleNames.map(sampleName => {
    const sample = data.samples[sampleName];
    seriesMap.viral.push(sample.viral);
    seriesMap.archaeal.push(sample.archaeal);
    seriesMap.bacterial.push(sample.bacterial);
    seriesMap.host.push(sample.host);
    seriesMap.nonhost_macrobial.push(sample.nonhost_macrobial);
    seriesMap.nonfungal_eukaryotic.push(sample.nonfungal_eukaryotic);
    seriesMap.fungal.push(sample.fungal);
    seriesMap.unknown.push(sample.unknown);
  });

  const seriesNames = Object.keys(seriesMap);
  const series: Highcharts.IndividualSeriesOptions[] = seriesNames.map(seriesName => {
    const seriesData = seriesMap[seriesName];
    if (seriesName === 'host') {
      seriesName = 'human';  // TODO: this is a hack for Milken
    } else if (seriesName === 'nonhost_macrobial') {
      seriesName = 'non-human_macrobial';  // TODO: this is a hack for Milken
    }
    return {
      name: seriesName.displayFormat(),
      data: seriesData,
    };
  });

  const chartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: sampleNames,
    },
    yAxis: {
      min: 0, max: 1,
      title: {
        text: 'Proportion of Reads Classified',
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
        stacking: 'normal',
        dataLabels: {
          enabled: false,
          color: 'white',
        },
      },
    },
    exporting: {
      enabled: false,
    },
    series,
  };

  return chartOptions;
};

const sampleOptions = function(data: ReadsClassifiedType): Highcharts.Options {
  const sampleName = Object.keys(data.samples)[0];
  const sample = data.samples[sampleName];

  const seriesNames = Object.keys(sample);
  const seriesData: Highcharts.DataPoint[] = seriesNames.map(seriesName => {
    return {
      name: seriesName.displayFormat(),
      y: sample[seriesName],
    };
  });

  const chartOptions = {
    chart: {
      type: 'pie',
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            }
        }
    },
    title: {
      text: 'Proportion of Reads Classified',
    },
    pane: {
      size: '80%',
    },
    xAxis: {
      categories: seriesNames.map(name => name.displayFormat()),
      tickmarkPlacement: 'on',
      lineWidth: 0,
    },

    yAxis: {
      gridLineInterpolation: 'polygon',
      lineWidth: 0,
      min: 0,
    },

    legend: { enabled: false},

    series: [{
      name: 'Fraction',
      colorByPoint: true,
      data: seriesData,
    }],

    exporting: {
      enabled: false,
    },
   };

  return chartOptions;
};

const ReadsClassifiedContainer: React.SFC<ReadsClassifiedProps> = (props) => {

  const isSingleton = props.isSingleton || false;
  const chartOptions = isSingleton
    ? sampleOptions(props.data)
    : sampleGroupOptions(props.data);

  return (
    <HighChartsPlot
      chartId="reads-classified"
      options={chartOptions}
      chartRef={props.chartRef}
    />
  );
};

export default ReadsClassifiedContainer;
