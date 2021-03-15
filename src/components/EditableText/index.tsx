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


interface EditableTextProps {
  onSubmit: (text: string) => Promise<any>;
  initialText: string;
  inputType: "inline"|"area";
  title: string;
}

interface EditableTextState {
  editMode: boolean;
  editText: string;
}

export class EditableTextPanel extends React.Component<EditableTextProps, EditableTextState> {
  protected sourceToken: CancelTokenSource;

  constructor(props: EditableTextProps) {
    super(props);
    this.sourceToken = axios.CancelToken.source();
    this.state = {
      editMode: false,
      editText: props.initialText,
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

  handleChange = (event: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    this.setState({editText: value})
  }

  handleSubmit = () => {
    this.props.onSubmit(this.state.editText)
      .then(val => {
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

  renderInline(){
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

  renderArea(){
    if(this.state.editMode){
      return (
        <form >
          <div className="form-group">
            <Row>
              <Col lg={6}>
                {this.props.title}
              </Col>
              <Col lg={2}>
                <input
                  type="button"
                  className="btn btn-success btn-lg btn-block"
                  value="Save"
                  onClick={this.handleSubmit}
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
            Long Description
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

  render(){
    if(this.props.inputType === "area"){
      return this.renderArea()
    }
    return this.renderInline()
  }

};
export default EditableTextPanel;