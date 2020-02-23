import * as React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Row, Col, Well, Button } from "react-bootstrap";

import { usePangeaAxios, PaginatedResult } from "../../../../services/api";
import { SampleGroupType } from "../../../../services/api/models/analysisGroup";

import AnalysisGroupList from "../../../../components/AnalysisGroupList";

interface OrganizationProjectsProps {
  uuid: string;
}

const OrganizationProjects = (props: OrganizationProjectsProps) => {
  const [{ data, loading, error }] = usePangeaAxios<
    PaginatedResult<SampleGroupType>
  >(`/sample_groups?organization_id=${props.uuid}`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  const sampleGroups = data.results;

  return (
    <Row>
      <Col lg={8}>
        {sampleGroups.length > 0 && (
          <AnalysisGroupList groupUUIDs={sampleGroups.map(g => g.uuid)} />
        )}
        {sampleGroups.length === 0 && (
          <Well className="text-center">
            <h4>This organization has no sample groups.</h4>
            <LinkContainer to="#">
              <Button bsStyle="success">New Sample Group</Button>
            </LinkContainer>
          </Well>
        )}
      </Col>
    </Row>
  );
};

export default OrganizationProjects;
