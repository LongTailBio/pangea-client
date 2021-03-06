import * as React from 'react';
import { Row } from 'react-bootstrap';
import { usePangeaAxios } from '../../../services/api';
import { SunburstTaxa } from '../services/api/models/sunburstTaxa';
import Plot from 'react-plotly.js';

interface SampleSunburstPanelProps {
  sampleUUID: string;
  onClickAction: (taxonName: string) => void;
}


const SampleSunburstPanel = (props: SampleSunburstPanelProps) => {
  // const url =
  //   '/contrib/metasub/sample_sunburst/' +
  //   props.sampleUUID +
  //   '?format=json&min_abundance=0.005';
  // const [{ data, loading, error }] = usePangeaAxios<SunburstTaxa>({
  //   url: url,
  //   method: 'GET',
  // });
  // if (loading) {
  //   return (
  //     <>
  //       <Row>
  //         <h1>Loading...</h1>
  //         <h2>Sample Taxa</h2>
  //       </Row>
  //     </>
  //   );
  // }
  // if (error) {
  //   return (
  //     <>
  //       <Row>
  //         <h1>Error</h1>
  //         <h2>Sample Taxa</h2>
  //         <p>{error}</p>
  //       </Row>
  //     </>
  //   );
  // }
  // const plotData: Partial<Plotly.PlotData>[] = [
  //   {
  //     type: 'sunburst',
  //     labels: data.taxa,
  //     parents: data.parents,
  //     values: data.abundances,
  //     outsidetextfont: { size: 20, color: '#377eb8' },
  //     leaf: { opacity: 0.4 },
  //     marker: { line: { width: 2 } },
  //   },
  // ];
  // const layout = {
  //   margin: { l: 0, r: 0, b: 0, t: 0 },
  //   width: 350,
  //   height: 350,
  // };
  // return (
  //   <>
  //     <Plot
  //       data={plotData}
  //       layout={layout}
  //       onClick={e =>
  //         props.onClickAction(
  //           e.points[0]?.value
  //             ? e.points[0]?.label
  //               ? e.points[0]?.label
  //               : ''
  //             : '',
  //         )
  //       }
  //     />
  //     <h5>Click a sample on the map to see it here.</h5>
  //     <h5>Click a species here to see it on the map.</h5>
  //   </>
  // );
  return (<></>)
};

export default SampleSunburstPanel;
