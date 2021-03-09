import * as React from 'react';
import { Switch, Route } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Nav, NavItem } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import DocsAbout from './Pages/About';
import DocsApi from './Pages/Api';
import DocsDataModel from './Pages/DataModel';
import DocsLanding from './Pages/Landing';
import DocsExtensions from './Pages/Extensions';
import DocsFaq from './Pages/Faq';
import DocsMetagenscope from './Pages/Metagenscope';
import DocsSearch from './Pages/Search';
import DocsDownloads from './Pages/Downloads';
import DocsUploads from './Pages/Uploads';
import DocsPython from './Pages/Python';
import DocsHowToUploadReads from './Pages/HowToUploadReads'
import DocsWritePipelines from './Pages/WritePipelines'

const Docs: React.FC = () => {
  const links: Array<[string, string, React.FC]> = [
    [`/docs`, 'Docs Home', DocsLanding],
    [`/docs/about`, 'About', DocsAbout],
    [`/docs/faq`, 'FAQ', DocsFaq],

    [`/docs/how-to-upload-reads`, 'How To Upload Reads', DocsHowToUploadReads],
    [`/docs/write-pipelines`, 'Writing Pipelines With Pangea', DocsWritePipelines],
    [`/docs/data-model`, 'Data Model', DocsDataModel],
    [`/docs/api`, 'REST API', DocsApi],
    [`/docs/python`, 'Python API', DocsPython],
    [`/docs/downloads`, 'Downloads', DocsDownloads],
    [`/docs/uploads`, 'Uploads', DocsUploads],

    [`/docs/extensions`, 'Extensions', DocsExtensions],
    [`/docs/metagenscope`, 'MetaGenScope', DocsMetagenscope],
    [`/docs/search`, 'Search', DocsSearch],

  ];
  return (
    <>
      <Helmet>
        <title>Pangea :: Documenation</title>
        <meta name="description" content="Pangea provides large scale storage for biological projects. This page documents how to use Pangea."/>
      </Helmet>
      <Row>
        <Col lg={2}>
          <Nav bsStyle="list" activeKey={links[0][1]}>
            {links.map(el => (
              <LinkContainer to={el[0]} exact={true}>
                <NavItem eventKey={el[1]}>
                  {el[1]}
                </NavItem>
              </LinkContainer>
            ))} 
          </Nav>
        </Col>
        <Col lg={10}>      
          <Switch>
            {links.map(el => (
              <Route
                exact={true}
                path={el[0]}
                render={() => el[2]({})}
              />
            ))}   
          </Switch>
        </Col>
      </Row>
    </>
  )
};

export default Docs;
