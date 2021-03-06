import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

import { usePangeaAxios, PaginatedResult } from '../../services/api';
import { AnalysisResultType } from '../../services/api/models/analysisResult';
import { AnalysisResultFieldType } from '../../services/api/models/analysisResultField';
import { CreateFieldFormPage } from './components/CreateField';


type ARType = 'sample' | 'sample-group';

interface AnalysisResultScreenProps {
  uuid: string;
  kind: ARType;
}

const useGroup = (kind: ARType, uuid: string) => {
  const arPath = kind === 'sample' ? 'sample_ars' : 'sample_group_ars';
  const [analysisResult] = usePangeaAxios<AnalysisResultType>(
    `/${arPath}/${uuid}`,
  );

  const fieldPath =
    kind === 'sample' ? 'sample_ar_fields' : 'sample_group_ar_fields';
  const [fields] = usePangeaAxios<PaginatedResult<AnalysisResultFieldType>>(
    `/${fieldPath}?analysis_result_id=${uuid}`,
  );

  const data = {
    analysisResult: analysisResult.data,
    fields: fields.data,
  };
  const loading = analysisResult.loading || fields.loading;
  const error = analysisResult.error || fields.error || undefined;
  return [{ data, loading, error }];
};

const formatField = (field: AnalysisResultFieldType): ReactNode => {
  const { stored_data: storedData } = field;
  const isStoredS3Field = storedData['__type__'] === 's3';
  const isStoredSRAField = storedData['__type__'] === 'sra';
  if (isStoredS3Field) {
    if (storedData['presigned_url']) {
      return <a href={storedData['presigned_url']}>{field.name}</a>;
    } else {
      const endpoint = storedData['endpoint_url'];
      const path = storedData['uri'].slice(5);
      const s3Path = `${endpoint}/${path}`;
      return <a href={s3Path}>{field.name}</a>;
    }
  } else if (isStoredSRAField) {
    return <a href={storedData['url']}>{field.name}</a>;
  } else {
    return `${field.name} ${JSON.stringify(storedData)}`;
  }
};


export const AnalysisResultScreen = (props: AnalysisResultScreenProps) => {
  const [{ data, loading, error }] = useGroup(props.kind, props.uuid);

  if (loading) {
    return (
      <Row>
        <h1>Loading...</h1>
        <h2>Analysis Result</h2>
      </Row>
    );
  }

  if (error) {
    const { status } = error.response || {};
    const title = status === 404 ? 'Not Found' : 'Error';
    return (
      <Row>
        <h1>{title}</h1>
        <h2>Analysis Result</h2>
        <p>{error.message}</p>
      </Row>
    );
  }

  const parentPath =
    props.kind === 'sample'
      ? `/samples/${data.analysisResult.sample}`
      : `/sample-groups/${data.analysisResult.sample_group}`;

  const { analysisResult, fields } = data;
  const baseRootUrl = 
    props.kind === 'sample'
      ? `/sample_ar_fields/`
      : `/sample_group_ar_fields/`;

  return (
    <>
      <Row>
        <h1>{analysisResult.module_name}</h1>
        <h2>Analysis Result</h2>
        <p>{'Replicate: "'}{analysisResult.replicate}{'"'}</p>
        <p>{'Created At: '}{new Date(analysisResult.created_at).toLocaleString()}</p>
        <Link to={parentPath}>Parent</Link>
      </Row>
      <Row>
        <h2>Description</h2>
        <p>{analysisResult.description}</p>
        {analysisResult.pipeline_module_obj && (
            <Link to={`/pipeline-modules/${analysisResult.pipeline_module_obj.uuid}`}>Pipeline Module</Link>
        )}
      </Row>
      <Row>
        <Col lg={6}>
          <h2>Fields</h2>
          {fields.results.map(field => (
            <>
              <li key={field.uuid}>{formatField(field)}</li>
            </>
          ))}       
        </Col>
        <Col lg={6}>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(analysisResult.metadata).map(key => (
                <tr key={key}>
                  <th scope="row">{key}</th>
                  <td>{JSON.stringify(analysisResult.metadata[key])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Col>
      </Row>
      <br/>
      <hr/>
      <CreateFieldFormPage
        isAuthenticated={true}
        analysisResult={analysisResult}
        kind={props.kind}
      />
    </>
  );
};

export default AnalysisResultScreen;
