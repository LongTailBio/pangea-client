import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { Row, Col, Well, Button } from 'react-bootstrap';

import { SampleGroupType } from '../../../../services/api/models/analysisGroup';
import AnalysisGroupList from '../../../../components/AnalysisGroupList';

import { OrganizationType } from '../../../../services/api/models/organization';


interface OrganizationProjectsProps {
  sampleGroups: SampleGroupType[];
  organization: OrganizationType;
}
interface OrganizationProjectsState {
  filter: string;
}


export class OrganizationProjects extends React.Component<OrganizationProjectsProps, OrganizationProjectsState> {

  constructor(props: OrganizationProjectsProps) {
    super(props);
    this.state = {
      filter: '',
    }
    this.handleFilterChange = this.handleFilterChange.bind(this)
  }

  handleFilterChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      filter: event.currentTarget.value,
    });
  };

  render() {
    const sampleGroups = this.props.sampleGroups.filter(
        sampleGroup =>
          sampleGroup.name.toLowerCase().indexOf(this.state.filter.toLowerCase()) > -1
      );
    const linkTo = {
      pathname: "/sample-groups/create",
      state: {
        org: this.props.organization,
      }
    }
    return (
      <Row>
        <Col lg={8}>
            <Row>
              <form>
                <input
                  name="filter"
                  className="form-control input-lg"
                  type="text"
                  placeholder="Filter sample groups by name"
                  required={true}
                  value={this.state.filter}
                  onChange={this.handleFilterChange}
                />
              </form>
            </Row>
          {sampleGroups.length > 0 && (
            <AnalysisGroupList groupUUIDs={sampleGroups.map(g => g.uuid)} />
          )}
          {(sampleGroups.length === 0 && this.state.filter === '') && (
            <Well className="text-center">
              <h4>This organization has no sample groups.</h4>
            </Well>
          )}
          {(sampleGroups.length === 0 && this.state.filter !== '') && (
            <Well className="text-center">
              <h4>This organization has no sample groups that match the specified filter.</h4>
            </Well>
          )}
          <LinkContainer to="/sample-groups/create">
            <Button bsStyle="success">New Sample Group</Button>
          </LinkContainer>
        </Col>
        <Col lg={2} lgOffset={2}>
          <Link to={linkTo} className="btn btn-primary">
            New Sample Group
          </Link>
        </Col>
      </Row>
    );
  }

}

export default OrganizationProjects;
