import React from "react";
import { Link } from "react-router-dom";
import { Row } from "react-bootstrap";

import { usePangeaAxios } from "../../services/api";
import { AnalysisResultType } from "../../services/api/models/analysisResult";

interface AnalysisResultScreenProps {
  uuid: string;
  kind: "sample" | "sample-group";
}

export const NewAnalysisResultScreen = (props: AnalysisResultScreenProps) => {
  const apiPath = props.kind === "sample" ? "sample_ars" : `sample_group_ars`;
  const [{ data, loading, error }] = usePangeaAxios<AnalysisResultType>(
    `/${apiPath}/${props.uuid}`
  );

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
      ? `/samples/${data.sample}`
      : `/sample-groups/${data.sample_group}`;
  return (
    <>
      <Row>
        <h1>{data.module_name}</h1>
        <h2>Analysis Result</h2>
        <p>{new Date(data.created_at).toLocaleString()}</p>
      </Row>
      <Row>
        <Link to={parentPath}>Parent</Link>
      </Row>
      <Row>
        <h2>Fields</h2>
        {/* {Object.keys(data.field_data).map(key => {
          const value = data.field_data[key];
          return (
            <div>
              <p>{key}</p> <p>{JSON.stringify(value)}</p>
            </div>
          );
        })} */}
      </Row>
    </>
  );
};

export default NewAnalysisResultScreen;
