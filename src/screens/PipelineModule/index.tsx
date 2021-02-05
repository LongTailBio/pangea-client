import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

import { usePangeaAxios, PaginatedResult } from '../../services/api';
import { PipelineModuleType } from '../../services/api/models/pipelineModule';
import { EditableDescriptionPanel } from './components/EditableDescription';
import { EditableLongDescriptionPanel } from './components/EditableLongDescription';

interface PipelineModuleScreenProps {
  uuid: string;
}

const useModule = (uuid: string) => {
  const [pipelineModule] = usePangeaAxios<PipelineModuleType>(
    `/pipeline_modules/${uuid}`,
  );

  const data = {
    mymodule: pipelineModule.data,
  };
  const loading = pipelineModule.loading ;
  const error = pipelineModule.error || undefined;
  return [{ data, loading, error }];
};


export const PipelineModuleScreen = (props: PipelineModuleScreenProps) => {
  const [{ data, loading, error }] = useModule(props.uuid);

  if (loading) {
    return (
      <Row>
        <h1>Loading...</h1>
        <h2>Pipeline Module</h2>
      </Row>
    );
  }

  if (error) {
    const { status } = error.response || {};
    const title = status === 404 ? 'Not Found' : 'Error';
    return (
      <Row>
        <h1>{title}</h1>
        <h2>Pipeline Module</h2>
        <p>{error.message}</p>
      </Row>
    );
  }

  const { mymodule } = data;
  const parentPath = `/pipelines/${mymodule.pipeline}`;

  return (
    <>
      <Row>
        <h1>{mymodule.name}</h1>
        <h2>Pipeline Module</h2>
        <p>{'Version: "'}{mymodule.version}{'"'}</p>
        <p>{'Created At: '}{new Date(mymodule.created_at).toLocaleString()}</p>
        <Link to={parentPath}>Parent</Link>
      </Row>
      <Row>
        <EditableDescriptionPanel pipelineModule={mymodule}/>     
      </Row>
      <Row>
        <EditableLongDescriptionPanel pipelineModule={mymodule}/>        
      </Row>
      <Row>
        <Col lg={6}>
          <h3>Upstream Modules</h3>
          {mymodule.dependency_modules.length > 0 && (
            <ul>
            {mymodule.dependency_modules.map(([uuid, name, version], ind) => (
              <li key={uuid}>
                <Link to={`/pipeline-modules/${uuid}`}>
                  {name}{" "}{version}
                </Link>
              </li>   
            ))}
            </ul>
          )}
          {mymodule.dependency_modules.length === 0 && (
            <h4>No dependencies.</h4>
          )}
        </Col>
        <Col lg={6}>
          <h3>Downstream Modules</h3>
          {mymodule.downstream_modules.length > 0 && (
            <ul>
            {mymodule.downstream_modules.map(([uuid, name, version], ind) => (
              <li key={uuid}>
                <Link to={`/pipeline-modules/${uuid}`}>
                  {name}{" "}{version}
                </Link>
              </li>   
            ))}
            </ul>
          )}
          {mymodule.downstream_modules.length === 0 && (
            <h4>No dependencies.</h4>
          )}
        </Col>
      </Row>
      <Row>
        <h3>Metadata</h3>
        <Col lg={12}>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(mymodule.metadata).map(key => (
                <tr key={key}>
                  <th scope="row">{key}</th>
                  <td>{JSON.stringify(mymodule.metadata[key])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Col>
      </Row>
    </>
  );
};

export default PipelineModuleScreen;
