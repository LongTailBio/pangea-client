import * as React from 'react';
// import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Well, Button } from 'react-bootstrap';

import AnalysisGroupList from '../../../../components/AnalysisGroupList';

// import { SampleGroupType } from '../../../../services/api/models/analysisGroup';
// import { UserType } from '../../../../services/api/models/user';

interface OrganizationProjectsProps {
  uuid: string;
  userUUIDs: string[];
  sampleGroupUUIDs: string[];
}

const OrganizationProjects: React.SFC<OrganizationProjectsProps> = (props) => {
  return (
    <Row>
      <Col lg={8}>
        {props.sampleGroupUUIDs &&
          <AnalysisGroupList groupUUIDs={props.sampleGroupUUIDs} organizationUUID={props.uuid} />
        }
        {!props.sampleGroupUUIDs &&
          <Well className="text-center">
            <h4>This organization has no sample groups.</h4>
            <LinkContainer to="#">
              <Button bsStyle="success">New Analysis Group</Button>
            </LinkContainer>
          </Well>
        }
      </Col>
    </Row>
  );
};

export default OrganizationProjects;
