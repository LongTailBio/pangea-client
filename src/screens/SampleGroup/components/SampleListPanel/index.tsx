import * as React from 'react';
import axios, { CancelTokenSource, AxiosRequestConfig } from 'axios';
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
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { cancelableAxios } from '../../../../services/api/utils';
import { usePangeaAxios, PaginatedResult } from '../../../../services/api';
import { SampleGroupType } from '../../../../services/api/models/sampleGroup';
import { SampleType } from '../../../../services/api/models/sample';
import { AnalysisResultType } from '../../../../services/api/models/analysisResult';


interface SampleListPanelProps {
  samples: PaginatedResult<SampleType>;
  grp?: SampleGroupType;
}

interface SampleListPanelState {
  samples: SampleType[];
  next: string | undefined;
  previous: string | undefined;
  filter: string;
}

export class SampleListPanel extends React.Component<SampleListPanelProps, SampleListPanelState> {
  protected sourceToken: CancelTokenSource;

  constructor(props: SampleListPanelProps) {
    super(props);
    this.sourceToken = axios.CancelToken.source();
    this.state = {
      samples: props.samples.results,
      next: props.samples.next,
      previous: props.samples.previous,
      filter: '',
    }
    this.getPageNum = this.getPageNum.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.loadNextSamplePage = this.loadNextSamplePage.bind(this);
    this.loadPrevSamplePage = this.loadPrevSamplePage.bind(this);
    this.loadSamplePage = this.loadSamplePage.bind(this);
  }

  getPageNum(){
    if( this.state.next ){
      return parseInt(this.state.next.split('page=')[1]) - 1
    } else if( this.state.previous ){
      return parseInt(this.state.previous.split('page=')[1]) + 1
    }
  }

  handleFilterChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      filter: event.currentTarget.value,
    });
  };

  loadNextSamplePage() {
    this.loadSamplePage(this.state.next);
  }

  loadPrevSamplePage() {
    this.loadSamplePage(this.state.previous);
  }

  loadSamplePage(url: string | undefined) {
    if (!url){
      return
    }
    const options: AxiosRequestConfig = {
      url: url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${window.localStorage.authToken}`,
      },
    };
    cancelableAxios(options, this.sourceToken)
      .then(res => {
        const pageRes: PaginatedResult<SampleType> = res.data;
        this.setState({
          samples: pageRes.results,
          next: pageRes.next,
          previous: pageRes.previous
        })
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          console.log(error);
        }
      });
  }


  render() {
    const samples = this.state.samples.filter(
      sample =>
        sample.name.toLowerCase().indexOf(this.state.filter.toLowerCase()) > -1
    )
    var linkTo = {}
    if(this.props.grp){
      linkTo = {
        pathname: `/sample-groups/${this.props.grp.uuid}/create-sample`,
        state: {
          grp: this.props.grp,
        }
      }
    }
    return (
      <>
        <Row>
          <Col lg={8}>
            <Row>
              <form>
                <input
                  name="filter"
                  className="form-control input-lg"
                  type="text"
                  placeholder="Filter samples on this page"
                  required={true}
                  value={this.state.filter}
                  onChange={this.handleFilterChange}
                />
              </form>
            </Row>
            {samples.length > 0 &&
              samples.map(sample => (
                <ul key={sample.uuid} className="analysis-group-list">
                  <li className="analysis-group-list-item">
                    <Link to={`/samples/${sample.uuid}`}>
                      {sample.name}
                    </Link>
                  </li>
                </ul>
              ))}
            {(samples.length === 0 && this.state.filter === '') && (
              <Well className="text-center">
                <h4>This sample group has no samples.</h4>
              </Well>
            )}
            {(samples.length === 0 && this.state.filter !== '') && (
              <Well className="text-center">
                <h4>No samples on this page match the specified filter.</h4>
              </Well>
            )}
          </Col>
          <Col lg={2} lgOffset={2}>
            {this.props.grp && (
              this.props.grp.is_library && (
              <Link to={linkTo} className="btn btn-primary">
                Create Sample
              </Link>
            ))}
          </Col>
        </Row>
        <Row>
            <Col lg={2} lgOffset={0}>
              <button
                type='button'
                className="btn btn-secondary btn-lg btn-block"
                onClick={this.loadPrevSamplePage}
              >Previous</button>
            </Col>
            <Col lg={1}>
              Page {this.getPageNum()}
            </Col>
            <Col lg={2}>
              <button
                type='button'
                className="btn btn-secondary btn-lg btn-block"
                onClick={this.loadNextSamplePage}
              >Next</button>
            </Col>
        </Row>
      </>
    );
  }
}

export default SampleListPanel;
