import * as React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col} from 'react-bootstrap';
import { SearchBar } from '../../components/SearchBar'

class HomeScreen extends React.Component {
  render() {
    return (
      <div>

        <h1>Pangea</h1>
        <h3>A content management system for the Life Sciences</h3>

        <hr/>

        <SearchBar/>

        <hr/>

        <Row>
          <Col lg={3} md={6}>
            <h4>Organizations</h4>
            <p>Browse data from Pangea Organizations.</p>
            <p><Link to="/organizations" className="btn btn-primary">Organizations</Link></p>
          </Col>
          <Col lg={3} md={6}>
            <h4>For Developers</h4>
            <p>Documentation and API.</p>
            <p><Link to="/docs" className="btn btn-primary">API</Link></p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default HomeScreen;
