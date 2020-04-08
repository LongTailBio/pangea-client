import * as React from 'react';
import { Row, Col, } from 'react-bootstrap';
import Plot from 'react-plotly.js';
import WorldMapPanel from './components/worldmap'
import TaxaMetadataPanel from './components/taxametadata'
import TaxaAbundancePanel from './components/taxonabundancepanel'
import SampleMetadataPanel from './components/samplemetadata'
import SampleSunburstPanel from './components/samplesunburst'

import './assets/css/web-css.css'
import './assets/css/nucleo-icons.css'
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

    constructor(props: MetasubMapProps) {
        super(props);
        this.state = {
            taxonName: 'Geodermatophilus obscurus',
            sampleUUID: "2db67623-a5ca-46cd-ac26-29b867b0a44c",
        };
        this.onMapClick = this.onMapClick.bind(this);
        this.onSunburstClick = this.onSunburstClick.bind(this);
    }

    onMapClick(sampleUUID: string){
        this.setState({sampleUUID})
    }

    onSunburstClick(taxonName: string){
        console.log('!! ' + taxonName)
        if (taxonName){
            console.log('!! !! ' + taxonName)
            this.setState({taxonName})
        }
    }

  componentDidMount() {
      var taxonName = 'Geodermatophilus obscurus'
      var sampleUUID = "2db67623-a5ca-46cd-ac26-29b867b0a44c"
      this.setState({taxonName, sampleUUID})
  }

  render() {
    return (
        <>
          {(this.state.sampleUUID && this.state.taxonName) &&
            <Row>
                <Col lg={8}>
                    <Row>
                        <WorldMapPanel
                            taxonName={this.state.taxonName}
                            onClickAction={this.onMapClick}
                        />
                    </Row>
                    <Row>
                        <TaxaAbundancePanel taxonName={'Geodermatophilus obscurus'} />
                    </Row>
                </Col>
                <Col lg={4}>
                    <SampleSunburstPanel
                        sampleUUID={this.state.sampleUUID}
                        onClickAction={this.onSunburstClick}
                    />
                    <SampleMetadataPanel sampleUUID={this.state.sampleUUID} />
                    <TaxaMetadataPanel taxonName={'Geodermatophilus obscurus'}  taxonAbundance={0.123} />
                </Col>
            </Row>
          }    
        </>
    )
  }


}


export default MetasubMap;
