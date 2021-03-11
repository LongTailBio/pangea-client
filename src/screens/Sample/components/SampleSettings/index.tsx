import * as React from 'react';
import { Link } from 'react-router-dom';

import { Switch, Route } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Well, Nav, NavItem, Tab, Tabs,  } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { SampleType } from '../../../../services/api/models/sample';
import SampleSettingWorkOrder from './components/WorkOrders';
import { TagType } from '../../../../services/api/models/tag';
import { PaginatedResult } from '../../../../services/api';


interface SampleSettingsProps {
  sample: SampleType;
  tags: PaginatedResult<TagType>;
}


const SampleSettings = (props: SampleSettingsProps) => {
  const tags = props.tags;
  return (
    <Row>
      <Tabs id="sample_settings_tabs">
        <Tab eventKey={1} title="Work Orders">
          <SampleSettingWorkOrder sample={props.sample}/>
        </Tab>
        <Tab eventKey={2} title="Tags">
          <Row>
            <Col lg={12}>
              {tags.count > 0 &&
                tags.results.map(tag => (
                  <ul
                    key={tag.uuid}
                    className="analysis-group-list"
                  >
                    <li className="analysis-group-list-item">
                      <Link
                        to={`/tags/${tag.uuid}`}
                      >
                        {tag.name}
                      </Link>
                    </li>
                  </ul>
                ))}
              {tags.count === 0 && (
                <Well className="text-center">
                  <h4>This sample has no tags.</h4>
                </Well>
              )}
            </Col>
          </Row>          
        </Tab>
      </Tabs>
    </Row>    
  );
}
export default SampleSettings;