import * as React from 'react';
import { Row } from 'react-bootstrap';
import { usePangeaAxios } from '../../../services/api';
import Plot from 'react-plotly.js';
import {
  OneTaxonResult,
  TaxaSearchResults,
} from '../services/api/models/taxaSearchResult';

interface WorldMapPanelProps {
  taxonName: string;
  onClickAction: (sampleName: string) => void;
}

const generateUrl = (taxonName: string): string => {
  const urlSafeName = encodeURIComponent(taxonName);
  return `/contrib/metasub/search_samples?format=json&query=${urlSafeName}`;
};

const WorldMapPanel = (props: WorldMapPanelProps) => {
  // const [{ data, loading, error }, refetch] = usePangeaAxios<TaxaSearchResults>(
  //   { url: '', method: 'GET' },
  //   { manual: true },
  // );

  // React.useEffect(() => {
  //   refetch({ url: generateUrl(props.taxonName) });
  // }, [props.taxonName]);

  // const currentData = ((data || {}).results || {})[props.taxonName];

  // if (loading || currentData === undefined) {
  //   return (
  //     <>
  //       <Row>
  //         <h1>Loading...</h1>
  //         <h2> MetaSUB Map</h2>
  //       </Row>
  //     </>
  //   );
  // }

  // if (error) {
  //   return (
  //     <>
  //       <Row>
  //         <h1>Error</h1>
  //         <h2> MetaSUB Map</h2>
  //         <p>{error}</p>
  //       </Row>
  //     </>
  //   );
  // }

  // const lats: number[] = currentData.map(
  //   sample => sample.sample_metadata['city_latitude'],
  // );
  // const lons: number[] = currentData.map(
  //   sample => sample.sample_metadata['city_longitude'],
  // );
  // const sizes: number[] = currentData.map(
  //   sample => (1000 * 1000 * sample.relative_abundance) ** (1 / 4),
  // );
  // const labels: string[] = currentData.map(sample => {
  //   const { sample_name, relative_abundance } = sample;
  //   const friendlyAbundance = Math.round(
  //     1000 * 1000 * relative_abundance,
  //   ).toLocaleString();
  //   return `${sample_name}: ${friendlyAbundance} ppm`;
  // });
  // const nameMap: { [key: string]: string } = { '': '' };
  // currentData.forEach((sample: OneTaxonResult) => {
  //   nameMap[sample.sample_name] = sample.sample_uuid;
  // });

  // const plotData: Partial<Plotly.PlotData>[] = [
  //   {
  //     type: 'scattergeo',
  //     mode: 'markers',
  //     lon: lons,
  //     lat: lats,
  //     text: labels,
  //     hoverinfo: 'text',
  //     marker: {
  //       size: sizes,
  //     },
  //   },
  // ];

  // const layout = {
  //   // title: '<i>' + props.taxonName + '</i>',
  //   font: {
  //     size: 6,
  //   },
  //   titlefont: {
  //     size: 16,
  //   },
  //   geo: {
  //     resolution: 50,
  //   },
  //   margin: { l: 0, r: 0, b: 0, t: 0 },
  //   width: 700,
  //   height: 400,
  // };

  // return (
  //   <Plot
  //     data={plotData}
  //     layout={layout}
  //     onClick={e =>
  //       props.onClickAction(
  //         nameMap[e.points[0]?.text ? e.points[0]?.text.split(':')[0] : ''],
  //       )
  //     }
  //   />
  // );
  return (<></>)
};

export default WorldMapPanel;
