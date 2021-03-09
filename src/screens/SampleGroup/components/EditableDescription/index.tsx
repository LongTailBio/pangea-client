import * as React from 'react';
import { default as axios, CancelTokenSource } from 'axios';

import { Switch, Route } from 'react-router';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Row,
  Col,
  Well,
  Nav,
  NavItem,
  Glyphicon,
  Badge,
  Button,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import { usePangeaAxios, PaginatedResult } from '../../../../services/api';
import { SampleGroupType } from '../../../../services/api/models/sampleGroup';
import { modifySampleGroupDescription } from '../../../../services/api/sampleGroupApi'


interface EditableDescriptionProps {
  group: SampleGroupType;
}

interface EditableDescriptionState {
  editMode: boolean;
  editText: string;
}

export class EditableDescriptionPanel extends React.Component<EditableDescriptionProps, EditableDescriptionState> {
  protected sourceToken: CancelTokenSource;

  constructor(props: EditableDescriptionProps) {
    super(props);
    this.sourceToken = axios.CancelToken.source();
    this.state = {
      editMode: false,
      editText: props.group.description,
    }
    this.flipEditState = this.flipEditState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  
  flipEditState() {
    this.setState({
      editMode: !this.state.editMode,
    });
  }

  handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    this.setState({editText: value})
  }

  handleSubmit = (event: React.MouseEvent<HTMLInputElement>) => {
    modifySampleGroupDescription(this.props.group, this.state.editText, this.sourceToken)
      .then(sample => {
        this.setState({
          editMode: false,
        });
      });
  }

  render(){
    if(this.state.editMode){
      return (
        <Row>
          <form>
            <div className="form-group">
              <Col lg={6}>
                <input
                  className="form-control input-lg input-grp-btn"
                  type="text"
                  key={"description"}
                  id={"description"}
                  required={true}
                  defaultValue={this.state.editText}
                  onChange={this.handleChange}
                />
              </Col>
              <Col lg={2}>
                <input
                  type="button"
                  className="btn btn-success btn-lg btn-block"
                  value="Save"
                  onClick={this.handleSubmit}
                />
              </Col>
            </div>
          </form>
        </Row>
      )
    }
    return (
      <Row>
        <Col lg={6}>
        <p>{this.state.editText}</p>
        </Col>
        <Col lg={2}>
          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={this.flipEditState}
          >Edit</button>
        </Col>
      </Row>
    )
  }

};
export default EditableDescriptionPanel;