import * as React from 'react';
import {
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
} from 'react-bootstrap';

interface SettingsProps {
  uuid: string;
}

export default class OrganizationSettingsProfile extends React.Component<SettingsProps, {}> {
  render() {
    return (
      <div>
        <h3>Organization profile</h3>
        <hr />
        <Row>
          <Col lg={7}>
            <form>
              <FormGroup controlId="organizationName">
                <ControlLabel>Organization display name</ControlLabel>
                <FormControl
                  type="text"
                  // value={this.state.value}
                  placeholder="Organization name"
                  // onChange={this.handleChange}
                />
                <FormControl.Feedback />
                {/* <HelpBlock>Validation is based on string length.</HelpBlock> */}
              </FormGroup>
              <FormGroup controlId="organizationPublicEmail">
                <ControlLabel>Email (public)</ControlLabel>
                <FormControl
                  type="email"
                  // value={this.state.value}
                  placeholder="info@lab.org"
                  // onChange={this.handleChange}
                />
                <FormControl.Feedback />
                {/* <HelpBlock>Validation is based on string length.</HelpBlock> */}
              </FormGroup>
              <FormGroup controlId="organizationDescription">
                <ControlLabel>Description</ControlLabel>
                <FormControl
                  type="text"
                  // value={this.state.value}
                  // placeholder="admin@lab.org"
                  // onChange={this.handleChange}
                />
                <FormControl.Feedback />
                {/* <HelpBlock>Validation is based on string length.</HelpBlock> */}
              </FormGroup>
              <FormGroup controlId="organizationURL">
                <ControlLabel>URL</ControlLabel>
                <FormControl
                  type="text"
                  // value={this.state.value}
                  // placeholder="admin@lab.org"
                  // onChange={this.handleChange}
                />
                <FormControl.Feedback />
                {/* <HelpBlock>Validation is based on string length.</HelpBlock> */}
              </FormGroup>
              <FormGroup controlId="organizationAdminEmail">
                <ControlLabel>Admin email (private)</ControlLabel>
                <FormControl
                  type="email"
                  // value={this.state.value}
                  placeholder="admin@lab.org"
                  // onChange={this.handleChange}
                />
                <FormControl.Feedback />
                {/* <HelpBlock>Validation is based on string length.</HelpBlock> */}
              </FormGroup>
              <Button bsStyle="success">Update Organization</Button>
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}