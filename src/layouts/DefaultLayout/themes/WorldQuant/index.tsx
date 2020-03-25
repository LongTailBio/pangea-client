import * as React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import './style.css';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const wordMark = require('./images/word_mark.svg');
const paddingStyle: React.CSSProperties = {
  paddingTop: '85px',
  paddingBottom: '85px',
};

// 40px + 20px top margin of h1 element = 60px
const headerBottomMargin = '40px';

export const WorldQuantHeader: React.FC = () => {
  return (
    <Grid fluid={true} style={{ marginBottom: headerBottomMargin }}>
      <Row className="top-header">
        <Col lg={12}>
          <Grid>
            <Row style={paddingStyle}>
              <Col lg={8} md={12} sm={12}>
                <img
                  src={wordMark}
                  alt="WorldQuant"
                  className="worldquant-logo"
                />
                <p style={{ marginTop: '85px', marginBottom: '0px' }}>
                  The WorldQuant Initiative for Quantitative Prediction at Weill
                  Cornell Medicine would like to thank you for your
                  participation in the Global Antibiotic Resistance Mapping
                  Project at the 2018 Milken Global Conference.
                </p>
              </Col>
            </Row>
          </Grid>
        </Col>
      </Row>
      <Row style={{ backgroundColor: '#000000' }}>
        <Col lg={12}>
          <Grid>
            <Row className="bottom-header">
              <Col lg={6} md={12} sm={12}>
                <p>
                  Your participation is accelerating our work on one of
                  humanity’s greatest health risks and the development of new
                  treatments for antibiotic-resistant bacteria.
                </p>
              </Col>
              <Col lg={6} md={12} sm={12}>
                <p>
                  Our scientists analyzed the bacterial and viral DNA present on
                  your cell phone that was gathered on-site.
                </p>
                <p>
                  Anonymized results will be available after the conference.
                </p>
              </Col>
            </Row>
          </Grid>
        </Col>
      </Row>
    </Grid>
  );
};

export const WorldQuantSampleHeader: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const miniBackground = require('./images/inter-hero.jpg');
  const miniStyle: React.CSSProperties = {
    backgroundImage: `url( ${miniBackground} )`,
    backgroundSize: 'cover',
    backgroundPosition: 'auto',
    backgroundRepeat: 'no-repeat',
  };
  return (
    <Grid fluid={true} style={{ marginBottom: headerBottomMargin }}>
      <Row style={miniStyle} className="top-header">
        <Col lg={12}>
          <Grid>
            <Row style={paddingStyle}>
              <Col lg={8} md={12} sm={12}>
                <img
                  src={wordMark}
                  alt="WorldQuant"
                  className="worldquant-logo"
                />
              </Col>
            </Row>
          </Grid>
        </Col>
      </Row>
      <Row style={{ marginTop: '60px' }}>
        <Col lg={12}>
          <Grid>
            <Row>
              <Col lg={12}>
                <a
                  className="back-link"
                  href="#back"
                  onClick={event => {
                    event.preventDefault();
                    window.history.back();
                  }}
                >
                  &lt; Back to home page
                </a>
              </Col>
            </Row>
          </Grid>
        </Col>
      </Row>
    </Grid>
  );
};

export const WorldQuantFooter: React.FC = () => {
  return (
    <Grid fluid={true}>
      <Row className="worldquant-footer">
        <Col lg={12}>
          <Grid>
            <Row>
              <Col lg={12} className="footer-wrapper">
                <div style={{ position: 'relative' }}>
                  <img
                    src={wordMark}
                    alt="WorldQuant"
                    className="worldquant-logo"
                  />
                  <p>&copy; Copyright 2018</p>
                </div>
              </Col>
            </Row>
          </Grid>
        </Col>
      </Row>
    </Grid>
  );
};
