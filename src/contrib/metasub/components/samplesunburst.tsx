import * as React from 'react';
import { usePangeaAxios } from '../../../services/api';
import { SampleType } from '../../../services/api/models/sample';
import Plot from 'react-plotly.js';

interface SampleSunburstPanelProps {
  sampleUUID: string
}

const SampleSunburstPanel = (props: SampleSunburstPanelProps) => {
  const xs: number[] = [0, 1, 2, 3];
  const ys: number[] = [0, 1, 4, 9];
  const data: Partial<Plotly.PlotData>[] = [{
    type: "scatter",
    x: xs,
    y: ys,
  }];
  const layout = {
    margin: {l: 0, r: 0, b: 0, t: 0},
    width: 500,
    height: 500
  };
  return (
     <Plot data={data} layout={layout} />
  )
}

export default SampleSunburstPanel
