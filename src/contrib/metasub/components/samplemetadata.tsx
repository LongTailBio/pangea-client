import * as React from 'react';
import { Row, Col, } from 'react-bootstrap';
import { usePangeaAxios } from '../../../services/api';
import { SampleType } from '../../../services/api/models/sample';

interface SampleMetadataPanelProps {
  sampleUUID: string
}

const SampleMetadataPanel = (props: SampleMetadataPanelProps) => {
  const [{ data, loading, error} ] = usePangeaAxios<SampleType>(`/samples/${props.sampleUUID}`);
  if (loading) {
    return (
      <>
        <Row>
          <h1>Loading...</h1>
          <h2> MetaSUB Map</h2>
        </Row>
      </>
    );
  }

  const metadata = data.metadata;

  return (
    <Row className="perfect-scrollbar-on ps">
      <Col lg={12} md={12}>
        <div id="taxaMetadata">
          <div className="card card-chart">
            <div className="card-header">
              <h5 className="card-category">Sample View</h5>
            </div>
            <div className="card-body">
              <div id="city_metadata" className="card-body">
                <h4 id="city_name_header">Hover or click on a sample</h4>
                <div className="table-responsive ps" id="city_metadata_div">
                  <table className="table " id="city_metadata_table">
                    <tbody>
                      <tr><td>Sample Id</td><td id="city_metadata_sample_name">{metadata.name}</td></tr>
                      <tr><td>Project</td><td id="city_metadata_project">{metadata.project}</td></tr>
                      <tr><td>Surface</td><td id="city_metadata_surface">{metadata.surface}</td></tr>
                      <tr><td>Material</td><td id="city_metadata_material">{metadata.material}</td></tr>
                      <tr><td># of reads</td><td id="city_metadata_numreads">{metadata.num_reads}</td></tr>
                      <tr><td>City Population</td><td id="city_metadata_citypopulation">{metadata.city_population}</td></tr>
                      <tr><td>City Elevation</td><td id="city_metadata_cityelevation">{metadata.city_elevation}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  )
}

export default SampleMetadataPanel;
