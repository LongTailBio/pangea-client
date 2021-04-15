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
  Pagination,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { cancelableAxios } from '../../../../services/api/utils';
import { usePangeaAxios, LinkList } from '../../../../services/api';
import { SampleGroupType } from '../../../../services/api/models/sampleGroup';
import { SampleLinkType } from '../../../../services/api/models/sample';
import { AnalysisResultType } from '../../../../services/api/models/analysisResult';


interface SampleListPanelProps {
  samples: LinkList<SampleLinkType>;
  grp?: SampleGroupType;
}

interface SampleListPanelState {
  samplesOnCurrentPage: SampleLinkType[];
  samplesInCurrentFilter: SampleLinkType[];
  allSamples: SampleLinkType[];
  currentPage: number;
  totalPages: number;
  filter: string;
}

export class SampleListPanel extends React.Component<SampleListPanelProps, SampleListPanelState> {
  protected sourceToken: CancelTokenSource;
  protected pageLength: number;

  constructor(props: SampleListPanelProps) {
    super(props);
    this.sourceToken = axios.CancelToken.source();
    this.pageLength = 50;

    this.state = {
      allSamples: props.samples.links,
      samplesInCurrentFilter: props.samples.links,
      samplesOnCurrentPage: props.samples.links.slice(0, this.pageLength),

      currentPage: 0,
      totalPages: Math.ceil(props.samples.count / this.pageLength),
      filter: '',
    }
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.loadSamplePage = this.loadSamplePage.bind(this);
  }

  handleFilterChange = (event: React.FormEvent<HTMLInputElement>) => {
    const filterStr = event.currentTarget.value.toLowerCase();
    const filteredSamples = this.state.allSamples.filter(
      sample =>
        sample.name.toLowerCase().indexOf(filterStr) > -1
    )

    this.setState({
      filter: event.currentTarget.value,
      samplesInCurrentFilter: filteredSamples,
      totalPages: Math.ceil(filteredSamples.length / this.pageLength),
      samplesOnCurrentPage: filteredSamples.slice(0, this.pageLength),
    });
  };

  loadSamplePage(pageNum: number) {
    const myPageNum = Math.max(Math.min(pageNum, this.state.totalPages - 1), 0);
    const start = myPageNum * this.pageLength;
    const end = start + this.pageLength;
    const samples = this.state.samplesInCurrentFilter.slice(start, end);
    this.setState({
      currentPage: myPageNum,
      samplesOnCurrentPage: samples,
    });
  }

  _renderPaginator() {
    if(this.state.totalPages == 1){
      return <></>
    }
    return (
      <Pagination>
        <Pagination.First onClick={() => this.loadSamplePage(0)}/>
        <Pagination.Prev onClick={() => this.loadSamplePage(this.state.currentPage - 1)} />


        {this.state.currentPage == 1 ?
          <Pagination.Item onClick={() => this.loadSamplePage(this.state.currentPage - 1)}>{this.state.currentPage}</Pagination.Item>
          :
          <></>
        }
        {this.state.currentPage > 1 ?
          <>
            <Pagination.Ellipsis />
            <Pagination.Item onClick={() => this.loadSamplePage(this.state.currentPage - 1)}>{this.state.currentPage}</Pagination.Item>
          </>
          :
          <></>
        }
        <Pagination.Item active>{this.state.currentPage + 1}</Pagination.Item>

        {this.state.currentPage + 2 < this.state.totalPages ?
          <>  
            <Pagination.Item onClick={() => this.loadSamplePage(this.state.currentPage + 1)}>{this.state.currentPage + 2}</Pagination.Item>
            <Pagination.Ellipsis />          
          </>
          :
          <></>
        }
        {this.state.currentPage + 2 == this.state.totalPages ?
          <Pagination.Item onClick={() => this.loadSamplePage(this.state.currentPage + 1)}>{this.state.currentPage + 2}</Pagination.Item>
          :
          <></>
        }

        <Pagination.Next onClick={() => this.loadSamplePage(this.state.currentPage + 1)}/>
        <Pagination.Last onClick={() => this.loadSamplePage(this.state.totalPages)}/>
      </Pagination>
    )
  }

  render() {
    const samples = this.state.samplesOnCurrentPage;
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
                <h4>No samples match the specified filter.</h4>
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
          {this._renderPaginator()}
        </Row>

      </>
    );
  }
}

export default SampleListPanel;
