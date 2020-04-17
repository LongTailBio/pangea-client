import * as React from 'react';
import { Row } from 'react-bootstrap';
import { usePangeaAxios } from '../../../services/api';
import {
  SurfacesTaxonResult,
  SurfaceTaxonAbundance,
} from '../services/api/models/surfaceTaxonAbundance';
import Plot from 'react-plotly.js';

interface TaxaMaterialAbundancePanelProps {
  taxonName: string;
}

const generateUrl = (taxonName: string): string => {
  const urlSafeName = encodeURIComponent(taxonName);
  return `/contrib/metasub/search_materials?format=json&query=${urlSafeName}`;
};

const TaxaMaterialAbundancePanel = (props: TaxaMaterialAbundancePanelProps) => {
  const [{ data, loading, error }, refetch] = usePangeaAxios<{
    [key: string]: SurfacesTaxonResult;
  }>({ url: '', method: 'GET' }, { manual: true });

  React.useEffect(() => {
    refetch({ url: generateUrl(props.taxonName) });
  }, [props.taxonName]);

  const currentData = ((data || {}).results || {})[props.taxonName];

  if (loading || currentData === undefined) {
    return (
      <>
        <Row>
          <h1>Loading...</h1>
          <h2>Taxon Abundance</h2>
        </Row>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Row>
          <h1>Error</h1>
          <h2>Taxon Abundance</h2>
          <p>{error}</p>
        </Row>
      </>
    );
  }

  const surfaceAbundances: { [key: string]: SurfaceTaxonAbundance } = currentData; //['results'][props.taxonName];
  const plotData: Partial<Plotly.PlotData>[] = Object.keys(surfaceAbundances).filter(
      function(surfaceName: string): boolean {
        return (surfaceName.length > 0) && (
          surfaceAbundances[surfaceName].all_relative_abundances.length >= 10
        )
      },      
    ).map(
    function(surfaceName: string): Partial<Plotly.PlotData> {
      return {
        y: surfaceAbundances[surfaceName].all_relative_abundances,
        type: 'box',
        name: surfaceAbundances[surfaceName].material_name,
      }
    },
  );
  const layout = {
    title: '<i>' + props.taxonName + '</i> Abundance on Surfaces',
    margin: { l: 20, r: 0, b: 0, t: 30 },
    width: 700,
    height: 400,
  };
  return <Plot data={plotData} layout={layout} />;
};

export default TaxaMaterialAbundancePanel;