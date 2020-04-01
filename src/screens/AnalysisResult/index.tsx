import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap';

import { usePangeaAxios, PaginatedResult } from '../../services/api';
import { AnalysisResultType } from '../../services/api/models/analysisResult';
import { AnalysisResultFieldType } from '../../services/api/models/analysisResultField';

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
  if (isStoredS3Field) {
    if (storedData['presigned_url']) {
      return <a href={storedData['presigned_url']}>{field.name}</a>;
    } else {
      const endpoint = storedData['endpoint_url'];
      const path = storedData['uri'].slice(5);
      const s3Path = `${endpoint}/${path}`;
      return <a href={s3Path}>{field.name}</a>;
    }
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
  return (
    <>
      <Row>
        <h1>{analysisResult.module_name}</h1>
        <h2>Analysis Result</h2>
        <p>{new Date(analysisResult.created_at).toLocaleString()}</p>
      </Row>
      <Row>
        <Link to={parentPath}>Parent</Link>
      </Row>
      <Row>
        <h2>Fields</h2>
        {fields.results.map(field => (
          <li key={field.uuid}>{formatField(field)}</li>
        ))}
      </Row>
    </>
  );
};

export default AnalysisResultScreen;
