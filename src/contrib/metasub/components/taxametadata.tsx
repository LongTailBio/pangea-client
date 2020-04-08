import * as React from 'react';
import CSS from 'csstype';
import { Row, Col } from 'react-bootstrap';
import { usePangeaAxios } from '../../../services/api';
import { MicrobeAnnotation } from '../../treeoflife/services/api/models/microbeAnnotation';

import '../assets/css/web-css.css';
import '../assets/css/nucleo-icons.css';
// import './assets/css/black-dashboard.css';

import '../assets/css/jquery-ui.css';
import '../assets/css/mapbox-gl.css';
import '../css/metasub.css';

const binaryFirstStyles: CSS.Properties = {
  backgroundColor: '#b39a7f',
  color: 'black',
};

const binarySecondStyles: CSS.Properties = {
  backgroundColor: '#7fb399',
  color: 'black',
};

interface AnnotationProps {
  keys: string;
  name: string;
  value: string | undefined;
  testVal: string[];
  testVal2?: string[];
}

function BinaryAnnotation(props: AnnotationProps) {
  let displayVals = (
    <>
      <span style={binaryFirstStyles} className="highlighted taxa-legend-key">
        {props.keys[0]}
      </span>
      <span style={binarySecondStyles} className="taxa-legend-key">
        {props.keys[1]}
      </span>
    </>
  );
  if (props.value && props.testVal.includes(props.value.toLowerCase())) {
    displayVals = (
      <>
        <span style={binaryFirstStyles} className="taxa-legend-key">
          {props.keys[0]}
        </span>
        <span
          style={binarySecondStyles}
          className="taxa-legend-key highlighted"
        >
          {props.keys[1]}
        </span>
      </>
    );
  }
  return (
    <>
      <td className="td_meta_key">{props.name}</td>
      <td className="td_meta_val">{displayVals}</td>
    </>
  );
}

const ternaryFirstStyles: CSS.Properties = {
  backgroundColor: '#d9ef8b',
  color: 'black',
};

const ternarySecondStyles: CSS.Properties = {
  backgroundColor: '#fee08b',
  color: 'black',
};

const ternaryThirdStyles: CSS.Properties = {
  backgroundColor: '#f46d43',
  color: 'black',
};

function TernaryAnnotation(props: AnnotationProps) {
  let displayVals = (
    <>
      <span style={ternaryFirstStyles} className="taxa-legend-key highlighted">
        {props.keys[0]}
      </span>
      <span style={ternarySecondStyles} className="taxa-legend-key">
        {props.keys[1]}
      </span>
      <span style={ternaryThirdStyles} className="taxa-legend-key">
        {props.keys[2]}
      </span>
    </>
  );
  if (props.value && props.testVal.includes(props.value.toLowerCase())) {
    displayVals = (
      <>
        <span style={ternaryFirstStyles} className="taxa-legend-key">
          {props.keys[0]}
        </span>
        <span
          style={ternarySecondStyles}
          className="taxa-legend-key highlighted"
        >
          {props.keys[1]}
        </span>
        <span style={ternaryThirdStyles} className="taxa-legend-key">
          {props.keys[2]}
        </span>
      </>
    );
  }
  if (
    props.value &&
    props.testVal2 &&
    props.testVal2.includes(props.value.toLowerCase())
  ) {
    displayVals = (
      <>
        <span style={ternaryFirstStyles} className="taxa-legend-key">
          {props.keys[0]}
        </span>
        <span style={ternarySecondStyles} className="taxa-legend-key">
          {props.keys[1]}
        </span>
        <span
          style={ternaryThirdStyles}
          className="taxa-legend-key highlighted"
        >
          {props.keys[2]}
        </span>
      </>
    );
  }
  return (
    <>
      <td className="td_meta_key">{props.name}</td>
      <td>{displayVals}</td>
    </>
  );
}

interface TaxaMetadataPanelProps {
  taxonName: string;
  taxonAbundance: number;
}

const generateUrl = (taxonName: string): string => {
  const urlSafeName = encodeURIComponent(taxonName);
  return `/contrib/treeoflife/annotate?format=json&query=${urlSafeName}`;
};

const TaxaMetadataPanel = (props: TaxaMetadataPanelProps) => {
  const [{ data, loading, error }, refetch] = usePangeaAxios<{
    [key: string]: MicrobeAnnotation;
  }>({ url: '', method: 'GET' }, { manual: true });
  React.useEffect(() => {
    refetch({ url: generateUrl(props.taxonName) });
  }, [props.taxonName]);

  const currentData = (data || {})[props.taxonName];

  if (loading || currentData === undefined) {
    return (
      <>
        <Row>
          <h1>Loading...</h1>
          <h2>Taxon Info</h2>
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
  const annotation = currentData;
  return (
    <div className="card card-chart">
      <div className="card-body">
        <div className="" id="taxaMetadata">
          <div className="table-responsive ps" id="sunburst_taxa_metadata_div">
            <table className="table" id="sunburst_taxa_metadata_table">
              <tbody>
                <tr id="sunburst_taxon_gram_row" className="sunburts_taxon_row">
                  <BinaryAnnotation
                    name="Gram-stain"
                    keys="-+"
                    value={annotation['gram_stain']}
                    testVal={['positive']}
                  />
                  <BinaryAnnotation
                    name="Anti-microbial susceptible"
                    keys="NY"
                    value={annotation['antimicrobial_susceptibility']}
                    testVal={['yes', 'susceptible', 'maybe', 'always']}
                  />
                </tr>
                <tr
                  id="sunburst_taxon_biofilm_row"
                  className="sunburts_taxon_row"
                >
                  <BinaryAnnotation
                    name="Biofilm forming"
                    keys="NY"
                    value={annotation['biofilm_forming']}
                    testVal={['yes', 'forms_biofilms', 'maybe', 'always']}
                  />
                  <BinaryAnnotation
                    name="Spore forming"
                    keys="NY"
                    value={annotation['spore_forming']}
                    testVal={['yes', 'forms_spores', 'maybe', 'always']}
                  />
                </tr>
                <tr
                  id="sunburst_taxon_extremophile_row"
                  className="sunburts_taxon_row"
                >
                  <BinaryAnnotation
                    name="Extremophile"
                    keys="NY"
                    value={annotation['extreme_environment']}
                    testVal={['yes', 'extremophile', 'extremophiles']}
                  />
                  <BinaryAnnotation
                    name="Plant pathogen"
                    keys="NY"
                    value={annotation['plant_pathogen']}
                    testVal={['yes', 'maybe', 'always']}
                  />
                </tr>
                <tr
                  id="sunburst_taxon_animal_pathogen_row"
                  className="sunburts_taxon_row"
                >
                  <BinaryAnnotation
                    name="Animal pathogen"
                    keys="NY"
                    value={annotation['animal_pathogen']}
                    testVal={['yes', 'maybe', 'always']}
                  />
                  <TernaryAnnotation
                    name="Pathogenicity"
                    keys="123"
                    value={annotation['pathogenicity']}
                    testVal={['2', '2.0']}
                    testVal2={['3', '3.0']}
                  />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxaMetadataPanel;
