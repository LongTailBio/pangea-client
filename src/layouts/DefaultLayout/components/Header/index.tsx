import * as React from 'react';
import {
  Grid,
  Row,
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

interface HeaderProps {
  title: string;
  isAuthenticated: boolean;
}

class Header extends React.Component<HeaderProps, {}> {
  render() {
    return (
      <Grid>
        <Row>
          <Navbar collapseOnSelect={true}>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/">{this.props.title}</Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav pullRight={true}>
             
                <LinkContainer to="/about">
                  <NavItem>About</NavItem>
                </LinkContainer>
                <LinkContainer to="/docs">
                  <NavItem>Documentation</NavItem>
                </LinkContainer>
                <NavDropdown title="Browse Data" id="basic-nav-dropdown">
                  <LinkContainer to="/organizations">
                    <NavItem>Organizations</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/tags">
                    <NavItem>Tags</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/pipelines">
                    <NavItem>Pipelines</NavItem>
                  </LinkContainer> 
                  <LinkContainer to="/tools">
                    <NavItem>Tools</NavItem>
                  </LinkContainer>                                 
                </NavDropdown>                                     
                {this.props.isAuthenticated && (
                  <NavDropdown title="+" id="basic-nav-dropdown">
                    <LinkContainer to="/organizations/create">
                      <MenuItem>New Organization</MenuItem>
                    </LinkContainer>
                    <LinkContainer to="/sample-groups/create">
                      <MenuItem>New Sample Group</MenuItem>
                    </LinkContainer>
                    <LinkContainer to="/samples/create">
                      <MenuItem>New Sample</MenuItem>
                    </LinkContainer>                    
                  </NavDropdown>
                )}
                {!this.props.isAuthenticated && (
                  <NavDropdown title="Login" id="basic-nav-dropdown">
                    <LinkContainer to="/register">
                      <MenuItem>Register</MenuItem>
                    </LinkContainer>
                    <LinkContainer to="/login">
                      <MenuItem>Log In</MenuItem>
                    </LinkContainer>
                  </NavDropdown>
                )}
                {this.props.isAuthenticated && (
                  <LinkContainer to="/users/me">
                    <NavItem>Your Profile</NavItem>
                  </LinkContainer> 
                )}                
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Row>
      </Grid>
    );
  }
}

export default Header;
