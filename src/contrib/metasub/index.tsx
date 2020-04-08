import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import WorldMapPanel from './components/worldmap';
import TaxaMetadataPanel from './components/taxametadata';
import TaxaAbundancePanel from './components/taxonabundancepanel';
import SampleMetadataPanel from './components/samplemetadata';
import SampleSunburstPanel from './components/samplesunburst';

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
}

class MetasubMap extends React.Component<MetasubMapProps, MetasubMapState> {
  state = {
    taxonName: 'Geodermatophilus obscurus',
    sampleUUID: '2db67623-a5ca-46cd-ac26-29b867b0a44c',
  };

  onMapClick = (sampleUUID: string) => this.setState({ sampleUUID });

  onSunburstClick = (taxonName: string) => {
    console.log(`onSunburstClick: '${taxonName}'`);
    if (taxonName) {
      this.setState({ taxonName });
    }
  };

  render() {
    const { sampleUUID, taxonName } = this.state;

    if (!sampleUUID || !taxonName) {
      console.log('Encountered empty uuid or taxon name');
      return <></>;
    }

    return (
      <Row>
        <Col lg={8}>
          <Row>
            <WorldMapPanel
              taxonName={taxonName}
              onClickAction={this.onMapClick}
            />
          </Row>
          <Row>
            <TaxaAbundancePanel taxonName={taxonName} />
          </Row>
        </Col>
        
        <Col lg={4}>
          <SampleSunburstPanel
            sampleUUID={sampleUUID}
            onClickAction={this.onSunburstClick}
          />
          <SampleMetadataPanel sampleUUID={sampleUUID} />
          <TaxaMetadataPanel
            taxonName={taxonName}
            taxonAbundance={0.123}
          />

        </Col>
      </Row>
    );
  }
}

export default MetasubMap;
