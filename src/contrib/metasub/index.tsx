import * as React from 'react';
import { Row, Col, } from 'react-bootstrap';
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

}

const MetasubMap = (props: MetasubMapProps) => {
    return (
        <>
            <head>
                <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css" />
                <link rel='stylesheet' href='https://api.mapbox.com/mapbox-gl-js/v1.8.1/mapbox-gl.css' />        
            </head>
            <div>
                <Row>
                <Col lg={8}>
                    <WorldMapPanel taxonName="Escherichia coli" />
                    <TaxaAbundancePanel taxonName="Escherichia coli" />
                </Col>
                <Col lg={4}>
                    <SampleSunburstPanel sampleUUID="bb81df30-50ab-442b-b799-3322e48bf740" />
                    <SampleMetadataPanel sampleUUID="bb81df30-50ab-442b-b799-3322e48bf740" />
                    <TaxaMetadataPanel taxonName="Escherichia coli" taxonAbundance={0.123} />
                </Col>
                </Row>
            </div>
        </>
    )
}

export default MetasubMap;
