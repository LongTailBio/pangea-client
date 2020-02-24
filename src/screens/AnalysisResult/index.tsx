import React from "react";
import { Link } from "react-router-dom";
import { Row } from "react-bootstrap";

import { usePangeaAxios, PaginatedResult } from "../../services/api";
import { AnalysisResultType } from "../../services/api/models/analysisResult";
import { AnalysisResultFieldType } from "../../services/api/models/analysisResultField";

interface AnalysisResultScreenProps {
  uuid: string;
  kind: "sample" | "sample-group";
}

const useGroup = (apiPath: string, uuid: string) => {
  const [analysisResultResult] = usePangeaAxios<AnalysisResultType>(`/${apiPath}s/${uuid}`);
  const [analysisResultFieldsResult] = usePangeaAxios<
    PaginatedResult<AnalysisResultFieldType>
  >(`/${apiPath}_fields?analysis_result_id=${uuid}`);

  const data = {
    analysisResult: analysisResultResult.data,
    analysisResultFields: analysisResultFieldsResult.data
  };
  const loading = analysisResultResult.loading || analysisResultFieldsResult.loading;
  const error = analysisResultResult.error || analysisResultFieldsResult.error || undefined;
  return [{ data, loading, error }];
};

export const AnalysisResultScreen = (props: AnalysisResultScreenProps) => {
  const apiPath = props.kind === "sample" ? "sample_ar" : `sample_group_ar`;
  const [{ data, loading, error }] = useGroup(apiPath, props.uuid);

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
    const title = status === 404 ? "Not Found" : "Error";
    return (
      <Row>
        <h1>{title}</h1>
        <h2>Analysis Result</h2>
        <p>{error.message}</p>
      </Row>
    );
  }

  console.log(data);

  const parentPath =
    props.kind === "sample"
      ? `/samples/${data.analysisResult.sample}`
      : `/sample-groups/${data.analysisResult.sample_group}`;
  return (
    <>
      <Row>
        <h1>{data.analysisResult.module_name}</h1>
        <h2>Analysis Result</h2>
        <p>{new Date(data.analysisResult.created_at).toLocaleString()}</p>
      </Row>
      <Row>
        <Link to={parentPath}>Parent</Link>
      </Row>
      <Row>
        <h2>Fields</h2>
      </Row>
    </>
  );
};

export default AnalysisResultScreen;
