import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Row, Col, Well, Button } from "react-bootstrap";

import { SampleGroupType } from "../../../../services/api/models/analysisGroup";
import AnalysisGroupList from "../../../../components/AnalysisGroupList";

interface OrganizationProjectsProps {
  sampleGroups: SampleGroupType[];
}

const OrganizationProjects = (props: OrganizationProjectsProps) => {
  const sampleGroups = props.sampleGroups;

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
