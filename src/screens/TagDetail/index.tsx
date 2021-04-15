import React from 'react';
import { Switch, Route } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

import { Row, Col, Nav, NavItem, Glyphicon, Badge } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import OrganizationProjects from '../OrganizationDetail/scenes/OrganizationProjects';
import SampleListPanel from '../SampleGroup/components/SampleListPanel'

import { usePangeaAxios, PaginatedResult } from '../../services/api';
import { TagType } from '../../services/api/models/tag';
import { SampleType } from '../../services/api/models/sample';
import { SampleGroupType } from '../../services/api/models/analysisGroup';


const useTag = (uuid: string) => {
  const [tag] = usePangeaAxios<TagType>(
    `/contrib/tags/${uuid}`,
  );
  const [samples] = usePangeaAxios<PaginatedResult<SampleType>>(
    `/contrib/tags/${uuid}/samples`,
  );
  const [sampleGroups] = usePangeaAxios<SampleGroupType[]>(
    `/contrib/tags/${uuid}/sample_groups`,
  );

  const data = {
    tag: tag.data,
    samples: samples.data,
    sampleGroups: sampleGroups.data,
  };
  const loading = tag.loading || samples.loading || sampleGroups.loading;
  const error = tag.error || samples.error || sampleGroups.error || undefined;

  return [{ data, loading, error }];
};

interface TagDetailProps {
  uuid: string;
}

export const TagDetail = (props: TagDetailProps) => {
  const [{ data, loading, error }] = useTag(props.uuid);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Pangea :: Tag</title>
        </Helmet>
        <Row>
          <h1>Loading...</h1>
          <h2>Tag</h2>
        </Row>
      </>
    );
  }

  if (error) {
    const { status } = error.response || {};
    const title = status === 404 ? 'Not Found' : 'Error';
    return (
      <>
        <Helmet>
          <title>{`Pangea :: ${title}`}</title>
        </Helmet>
        <Row>
          <h1>{title}</h1>
          <h2>Tag</h2>
          <p>{error.message}</p>
        </Row>
      </>
    );
  }

  const { tag, samples, sampleGroups } = data;

  return (
    <>
      <Helmet>
        <title>{`Pangea :: ${tag.name}`}</title>
      </Helmet>
      <Row>
        <Row>
          <Col lg={12}>
            <h2>Tag</h2>
            <h2>{tag.name}</h2>
            <Link to={`/tags`}>
              All Tags
            </Link>
          </Col>
        </Row>
        <Row>
          <Nav bsStyle="tabs" activeKey="1">
            <LinkContainer to={`/tags/${props.uuid}`} exact={true}>
              <NavItem eventKey="1">
                <Glyphicon glyph="star" /> Samples{' '}
                <Badge>{samples.count}</Badge>
              </NavItem>
            </LinkContainer>
          </Nav>
        </Row>
        <br />
        <Switch>
          <Route
            exact={true}
            path="/tags/:uuid"
            render={_props => <></> } // <SampleListPanel samples={samples} />
          />
          <Route
            exact={true}
            path="/tags/:uuid/sample-groups"
            render={() => (
              <h1>fooooo</h1> 
            )}
          />
        </Switch>
      </Row>
    </>
  );
};

export default TagDetail;
