import * as React from 'react';

import TaxaMetadataPanel from './components/taxametadata'
import SampleMetadataPanel from './components/samplemetadata'
import SampleSunburstPanel from './components/samplesunburst'

import './assets/css/web-css.css'
import './assets/css/nucleo-icons.css'
import './assets/css/black-dashboard.css';

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
                <SampleMetadataPanel sampleUUID="bb81df30-50ab-442b-b799-3322e48bf740" />
                <TaxaMetadataPanel taxonName="Escherichia coli" taxonAbundance={0.123} />
                <SampleSunburstPanel sampleUUID="bb81df30-50ab-442b-b799-3322e48bf740" />
            </div>
        </>
    )
}

export default MetasubMap;
