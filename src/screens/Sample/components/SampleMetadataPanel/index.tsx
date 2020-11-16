import * as React from 'react';
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


interface SampleMetadataPanelProps {
  sample: SampleType;
}

interface SampleMetadataPanelState {
  editMode: boolean;
  editMetadata: {[key: string]: string};
  editKeys: {[key: string]: string};
}

export class SampleMetadataPanel extends React.Component<SampleMetadataPanelProps, SampleMetadataPanelState> {

  constructor(props: SampleMetadataPanelProps) {
    super(props);
    this.state = {
      editMode: false,
      editMetadata: {},
      editKeys: {},
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.flipEditState = this.flipEditState.bind(this);
    this.addEditRow = this.addEditRow.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.handleSubmitMetadata = this.handleSubmitMetadata.bind(this);
    this.handleChangeMetadata = this.handleChangeMetadata.bind(this);
  }

  componentDidMount() {
    // const editMetadata: {[key: string]: string} = {};
    // for (var key in Object.keys(this.state.editMetadata)) {
    //   editMetadata[key] = this.props.sample.metadata[key].copy()
    // }
    this.setState({
      editMode: false,
    });
  }
  
  flipEditState() {
    const editMetadata: {[key: string]: string} = {};
    var i = 0;
    for (var key in this.props.sample.metadata) {
      editMetadata[i + '$$$$$' + key] = this.props.sample.metadata[key];
      i += 1;
    }
    this.setState({
      editMode: !this.state.editMode,
      editMetadata: editMetadata,
    });
  }

  addEditRow() {
    const i: number = Object.keys(this.state.editMetadata).length;
    this.state.editMetadata[i + '$$$$$'] = ''
    this.setState({ editMetadata: this.state.editMetadata })
  }

  deleteRow(key: string) {
    console.log(key);
    delete this.state.editMetadata[key];
    this.setState({ editMetadata: this.state.editMetadata })
  }


  handleChangeMetadata = (event: React.FormEvent<HTMLInputElement>) => {
    const formKey: string = event.currentTarget.id
    const { name, value } = event.currentTarget;
    if(formKey.startsWith('key__')){
      const oldKey = formKey.split('key__')[1]
      const i = oldKey.split('$$$$$')[0]
      this.state.editKeys[oldKey] = i + '$$$$$' + value
    }
    else if(formKey.startsWith('val__')){
      const key = formKey.split('val__')[1]
      this.state.editMetadata[key] = value
    }
  }


  handleSubmitMetadata = (event: React.FormEvent<HTMLFormElement>) => {
    for (var oldKey in this.state.editKeys){
      var newKey = this.state.editKeys[oldKey]
      if(newKey != oldKey){
        var curVal = this.state.editMetadata[oldKey]
        this.state.editMetadata[newKey] = curVal
        delete this.state.editMetadata[oldKey]
      }
    }
    for (var mangledKey in this.state.editMetadata) {
      var key = mangledKey.split('$$$$$')[1]
      this.state.editMetadata[key] = this.state.editMetadata[mangledKey];
      delete this.state.editMetadata[mangledKey]
    }
    console.log(this.state.editMetadata)
    event.preventDefault()
  }

  render(){
    if(this.state.editMode){
      return (
        <form onSubmit={this.handleSubmitMetadata}>
          <div className="form-group">
            {Object.keys(this.state.editMetadata).map(key => (
              <Row>
                <Col lg={4}>
                  <input
                    className="form-control input-lg input-grp-btn"
                    type="text"
                    key={"key__" + key}
                    id={"key__" + key}
                    placeholder={key.split('$$$$$')[1]}
                    required={true}
                    defaultValue={key.split('$$$$$')[1]}
                    onChange={this.handleChangeMetadata}
                  />
                </Col>
                <Col lg={5}>
                  <input
                    className="form-control input-lg input-grp-btn"
                    type="text"
                    key={"val__" + key}
                    id={"val__" + key}
                    placeholder={this.state.editMetadata[key]}
                    required={true}
                    defaultValue={this.state.editMetadata[key]}
                    onChange={this.handleChangeMetadata}
                  />
                </Col>
                <Col lg={3}>
                  <button
                    type='button'
                    className="btn btn-danger btn-lg btn-block"
                    onClick={() => this.deleteRow(key)}
                  >Delete</button>
                </Col>
              </Row>
            ))}
          </div>
          <Row>
            <Col lg={3}>
              <button
                type='button'
                className="btn btn-primary btn-lg btn-block"
                onClick={this.addEditRow}
              >Add Row</button>
            </Col>
            <Col lg={6} lgOffset={3}>
              <input
                type="submit"
                className="btn btn-success btn-lg btn-block"
                value="Save"
              />
            </Col>
          </Row>
        </form>
      )
    }
    return (
      <>
        <Row>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Feature</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(this.props.sample.metadata).map(key => (
              <tr key={key}>
                <th scope="row">{key}</th>
                <td>{this.props.sample.metadata[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </Row>
        <Row>
          <Col lg={6} lgOffset={6}>
            <button
              className="btn btn-primary btn-lg btn-block"
              onClick={this.flipEditState}
            >Edit</button>
          </Col>
        </Row>
      </>
    );
  }

};
export default SampleMetadataPanel;