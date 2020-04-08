import * as React from 'react';
import { Row, Col, } from 'react-bootstrap';
import { usePangeaAxios } from '../../../services/api';
import { SampleType } from '../../../services/api/models/sample';
import { CitiesTaxonResult, CityTaxonAbundance } from '../services/api/models/cityTaxonAbundance'
import Plot from 'react-plotly.js';


interface TaxaAbundancePanelProps {
    taxonName: string;
}

const generateUrl = (taxonName: string): string => {
  const urlSafeName = encodeURIComponent(taxonName);
  return `/contrib/metasub/search_cities?format=json&query=${urlSafeName}`;
};

const TaxaAbundancePanel = (props: TaxaAbundancePanelProps) => {
  const [{ data, loading, error }, refetch] = usePangeaAxios<{[key: string]: CitiesTaxonResult}>(
    { url: '', method: 'GET' },
    { manual: true },
  );

  React.useEffect(() => {
    console.log('refetch B')
    refetch({ url: generateUrl(props.taxonName) });
  }, [props.taxonName]);

  const currentData = ((data || {}).results || {})[props.taxonName];

  if (loading || currentData === undefined) {
    return (
      <>
        <Row>
          <h1>Loading...</h1>
          <h2> MetaSUB Map</h2>
        </Row>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Row>
          <h1>Error</h1>
          <h2> MetaSUB Map</h2>
          <p>{error}</p>
        </Row>
      </>
    );
  }

  const cityAbundances: {[key: string]: CityTaxonAbundance} = currentData; //['results'][props.taxonName];
  const plotData: Partial<Plotly.PlotData>[] = Object.keys(cityAbundances).map(
    function(cityName: string): Partial<Plotly.PlotData> {
      return {
        y: cityAbundances[cityName].all_relative_abundances,
        type: 'box',
        name: cityAbundances[cityName].city_name,
      }
    }
  )
  const layout = {
      title: '<i>' + props.taxonName + '</i> Abundance in Cities',
    margin: {l: 20, r: 0, b: 0, t: 30},
    width: 700,
    height: 400
  };
  return (
     <Plot data={plotData} layout={layout} />
  )
}

export default TaxaAbundancePanel
