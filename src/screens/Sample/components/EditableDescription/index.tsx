import * as React from 'react';
import { default as axios, CancelTokenSource } from 'axios';
import ReactMarkdown from 'react-markdown'
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
import { SampleType } from '../../../../services/api/models/sample';
import { modifySampleDescription } from '../../../../services/api/sampleApi'


interface EditableDescriptionProps {
  sample: SampleType;
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
      editText: props.sample.description,
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

  handleChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    this.setState({editText: value})
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    modifySampleDescription(this.props.sample, this.state.editText, this.sourceToken)
      .then(sample => {
        this.setState({
          editMode: false,
        });
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          console.log(error);
        }
      });
  }

  render(){
    if(this.state.editMode){
      return (
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <Row>
              <Col lg={6}>
                Description
              </Col>
              <Col lg={2}>
                <input
                  type="submit"
                  className="btn btn-success btn-lg btn-block"
                  value="Save"
                />
              </Col>
            </Row>
            <br/>
            <Row>
              <Col lg={8}>
                <textarea
                  className="form-control input-lg input-grp-btn"
                  key="description"
                  id="description"
                  required={true}
                  defaultValue={this.state.editText}
                  onChange={this.handleChange}
                />
              </Col>
            </Row>
          </div>
        </form>
      )
    }
    return (
      <>
        <Row>
          <Col lg={6}>
            Description
          </Col>
          <Col lg={2}>
            <button
              className="btn btn-primary btn-lg btn-block"
              onClick={this.flipEditState}
            >Edit</button>
          </Col>
        </Row>
        <Row>
          <Col lg={8}>
            <ReactMarkdown>{this.state.editText}</ReactMarkdown>
          </Col>
        </Row>
      </>
    )
  }

};
export default EditableDescriptionPanel;