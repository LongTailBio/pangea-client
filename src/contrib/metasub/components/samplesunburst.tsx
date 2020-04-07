import * as React from 'react';
import { Row, Col, } from 'react-bootstrap';
import { usePangeaAxios } from '../../../services/api';
import { SampleType } from '../../../services/api/models/sample';
import { SunburstTaxa } from '../services/api/models/sunburstTaxa'
import Plot from 'react-plotly.js';

interface SampleSunburstPanelProps {
  sampleUUID: string
}

const SampleSunburstPanel = (props: SampleSunburstPanelProps) => {
  const url = '/contrib/metasub/sample_sunburst/' + props.sampleUUID + '?format=json&min_abundance=0.005'
  const [{ data, loading, error }] = usePangeaAxios<SunburstTaxa>(
    { url: url, method: 'GET' }
  );
  if (loading) {
    return (
      <>
        <Row>
          <h1>Loading...</h1>
          <h2> MetaSUB Map</h2>
        </Row>
      </>
    );
  }
  const plotData: Partial<Plotly.PlotData>[] = [{
    type: "sunburst",
    labels: data.taxa,
    parents: data.parents,
    values:  data.abundances,
    outsidetextfont: {size: 20, color: "#377eb8"},
    leaf: {opacity: 0.4},
    marker: {line: {width: 2}},
  }];
  const layout = {
    margin: {l: 0, r: 0, b: 0, t: 0},
    width: 1500,
    height: 1500
  };
  return (
     <Plot data={plotData} layout={layout} />
  )
}

export default SampleSunburstPanel
