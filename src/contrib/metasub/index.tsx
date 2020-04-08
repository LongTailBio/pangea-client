import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import WorldMapPanel from './components/worldmap';
import TaxaMetadataPanel from './components/taxametadata';
import TaxaAbundancePanel from './components/taxonabundancepanel';
import SampleMetadataPanel from './components/samplemetadata';
import SampleSunburstPanel from './components/samplesunburst';
import TaxonEntryBar from './components/taxonentrybar';

import './assets/css/web-css.css';
import './assets/css/nucleo-icons.css';
// import './assets/css/black-dashboard.css';

import './assets/css/jquery-ui.css';
import './assets/css/mapbox-gl.css';
import './css/metasub.css';

interface MetasubMapProps {
  taxonName: string;
  sampleUUID: string;
}

interface MetasubMapState {
  taxonName: string;
  sampleUUID: string;
  searchBar: string;
}

class MetasubMap extends React.Component<MetasubMapProps, MetasubMapState> {
  state = {
    taxonName: 'Geodermatophilus obscurus',
    sampleUUID: '2db67623-a5ca-46cd-ac26-29b867b0a44c',
    searchBar: '',
  };

  onMapClick = (sampleUUID: string) => this.setState({ sampleUUID });

  onSunburstClick = (taxonName: string) => {
    if (taxonName) {
      this.setState({ taxonName });
    }
  };

  // handleSubmitSearch = (_event: React.FormEvent<HTMLFormElement>) => {
  //   _event.preventDefault();
  //   var taxon = this.state.searchBar
  //   taxon = taxon[0].toUpperCase() + taxon.substr(1).toLowerCase()
  //   this.setState({ searchBar: '', taxonName: taxon });

  // }

  render() {
    const { sampleUUID, taxonName } = this.state;

    if (!sampleUUID || !taxonName) {
      console.log('Encountered empty uuid or taxon name');
      return <></>;
    }

    return (
      <>
        <Row>
          <Col lg={8}>
            <h3>
              Taxon <i>{taxonName}</i>
            </h3>
            <TaxonEntryBar onSubmitAction={this.onSunburstClick} />
            <Row>
              <WorldMapPanel
                taxonName={taxonName}
                onClickAction={this.onMapClick}
              />
            </Row>
            <TaxaMetadataPanel taxonName={taxonName} taxonAbundance={0.123} />
            <Row>
              <TaxaAbundancePanel taxonName={taxonName} />
            </Row>
          </Col>

          <Col lg={4}>
            <Link to={`/samples/${sampleUUID}`}>
              <h3>Sample</h3>
            </Link>
            <SampleSunburstPanel
              sampleUUID={sampleUUID}
              onClickAction={this.onSunburstClick}
            />
            <SampleMetadataPanel sampleUUID={sampleUUID} />
          </Col>
        </Row>
      </>
    );
  }
}

export default MetasubMap;
