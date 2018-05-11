import * as React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Jumbotron } from 'react-bootstrap';

const heroBackground = require('./images/red-banner.png');
const expert = require('./images/expert.png');
const lightBulb = require('./images/light-bulb.png');

const heroStyle: React.CSSProperties = {
  height: '400px',
  backgroundSize: 'cover',
  backgroundImage: `url( ${heroBackground} )`,
  backgroundPosition: '190px 0px',
  backgroundRepeat: 'no-repeat',
  backgroundColor: 'rgb(200,36,43)',
};

const imageStyle = {
  height: '200px',
};

class HomeScreen extends React.Component {
  render() {
    return (
      <div>
        <Jumbotron style={heroStyle}>
          <p>All Kingdoms Measured,<br />All Kingdoms Quantified</p>
        </Jumbotron>

        <h1>Metagenomes, Visualized</h1>

        <hr />

        <Row>
          <Col lg={4}>
            <img src={expert} style={imageStyle} />
          </Col>
          <Col lg={6} lgOffset={2}>
            <Row>
              <Col md={4}>
                <h3>For Scientists<br/>By Scientists</h3>
              </Col>
              <Col md={8}>
                <blockquote>MetaGenScope acts as a computational microscope that gives researchers direct access to
                  their results. It visualizes many different anlyses of metagenomic data allowing researchers to
                  quickly explore and understand their data. Data can be explored both as individual samples or as
                  complete projects.</blockquote>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col lg={6}>
            <Row>
              <Col md={4}>
                <h3>Complex Analyses Made Easy</h3>
              </Col>
              <Col md={8}>
                <blockquote>MetaGenScope is a visualizer for many common metagenomic tools like MetaPhlAn2, Kraken,
                  MicrobeCensus, and ShortBred. Beyond taxonomic profiles MetaGenScope aims to give a multifaceted view
                  of samples communicating the incredible complexity of bacterial samples.</blockquote>
              </Col>
            </Row>
          </Col>
          <Col lg={4} lgOffset={2}>
            <img src={lightBulb} style={imageStyle} />
          </Col>
        </Row>

        <hr />

        <Row>
          <Col lg={3} md={6}>
            <h4>Browse Data</h4>
            <p>MetaGenScope contains  samples from  different projects.</p>
            <p><Link to="/browse" className="btn btn-primary">Browse Data</Link></p>
          </Col>
          <Col lg={3} md={6}>
            <h4>Learn More</h4>
            <p>The concepts behind MetaGenScope, the core projects, and the team that has made it all possible.</p>
            <p><Link to="/about" className="btn btn-primary">About</Link></p>
          </Col>
          <Col lg={3} md={6}>
            <h4>For Developers</h4>
            <p>Documentation for the API, including Python and R packages.</p>
            <p><Link to="/docs" className="btn btn-primary">API</Link></p>
          </Col>
          <Col lg={3} md={6}>
            <h4>MetaSUB</h4>
            <p>MetaGenScope is a MetaSUB project!</p>
            <p><a href="http://metasub.org/" className="btn btn-primary">MetaSUB</a></p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default HomeScreen;
