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
          <h2>Sample Metadata</h2>
        </Row>
      </>
    );
  }

  const metadata = data.metadata;

  return (
      <>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Feature</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(metadata).map(key => (
              <tr key={key}>
                <th scope="row">{key}</th>
                <td>{metadata[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )
}

export default SampleMetadataPanel;
