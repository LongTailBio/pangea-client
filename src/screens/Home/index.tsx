import React from 'react';
import CSS from 'csstype';

import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

import { OmniSearchBar } from '../../components/OmniSearchBar';

const headerTextStyle: CSS.Properties = {
  paddingTop: '20px',
  fontWeight: 'lighter',
  textAlign: 'center',
  fontFamily: 'lora',
  paddingBottom: '20px',
};
const searchBarStyle: CSS.Properties = {
  paddingTop: '10px',
};
const leaderTextStyle: CSS.Properties = {
  paddingTop: '20px',
  fontWeight: 'lighter',
  textAlign: 'center',
  fontFamily: 'lora',
};
const followTextStyle: CSS.Properties = {
  paddingTop: '10px',
  textAlign: 'center',
  paddingBottom: '200px',
  fontFamily: 'Lora',
};


export const HomeScreen = () => (
  <>
    <Row style={searchBarStyle}>
      <Col lg={10} lgOffset={1}>

        <h1 style={headerTextStyle}>Pangea</h1>

        <OmniSearchBar />

        <h2 style={leaderTextStyle}>A content management system for the Life Sciences</h2>
        <h4 style={followTextStyle}>For Scientists, By Scientists</h4>

      </Col>
    </Row>
  </>
);

export default HomeScreen;
