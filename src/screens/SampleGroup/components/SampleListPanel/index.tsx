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
  Dropdown,
  MenuItem,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { cancelableAxios } from '../../../../services/api/utils';
import { usePangeaAxios, LinkList } from '../../../../services/api';
import { SampleGroupType } from '../../../../services/api/models/sampleGroup';
import { SampleLinkType } from '../../../../services/api/models/sample';
import { AnalysisResultType } from '../../../../services/api/models/analysisResult';
import { FilterMetadataForm } from './components/FilterForm'
import { SampleListForm } from './components/SampleList'

interface SampleListPanelProps {
  samples: LinkList<SampleLinkType>;
  grp: SampleGroupType;
}

interface SampleListPanelState {
  pageLength: number;
  samplesOnCurrentPage: SampleLinkType[];
  samplesInCurrentFilter: SampleLinkType[];
  allSamples: SampleLinkType[];
  currentPage: number;
  totalPages: number;
  filter: string;
}

const metadataToStr = (sampleLink: SampleLinkType): string => {
  if(! sampleLink?.metadata){
    return "No metadata";
  }
  var out = "";
  Object.keys(sampleLink.metadata).map(key => {
    out += key
    out += ": "
    out += sampleLink.metadata[key]
    out += ", "
  })
  if(out.length > 100){
    out = out.slice(0, 97) + '...'
  } else if(out.length == 0){
    return "No metadata"
  }
  return out
}

export class SampleListPanel extends React.Component<SampleListPanelProps, SampleListPanelState> {
  protected sourceToken: CancelTokenSource;
  protected metadataKeys: string[];

  constructor(props: SampleListPanelProps) {
    super(props);
    this.sourceToken = axios.CancelToken.source();
    const defaultPageLength = 50

    this.state = {
      pageLength: defaultPageLength,
      allSamples: props.samples.links,
      samplesInCurrentFilter: props.samples.links,
      samplesOnCurrentPage: props.samples.links.slice(0, defaultPageLength),
      currentPage: 0,
      totalPages: Math.ceil(props.samples.count / defaultPageLength),
      filter: '',
    }
    this.setSamplesPerPage = this.setSamplesPerPage.bind(this);
    this.setMetadataFilter = this.setMetadataFilter.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.filterSamples = this.filterSamples.bind(this);
    this.loadSamplePage = this.loadSamplePage.bind(this);

    this.metadataKeys = [];
    props.samples.links.map(sample => {
      if(sample?.metadata){
        Object.keys(sample.metadata).map(key => {
          if(this.metadataKeys.indexOf(key) === -1){
            this.metadataKeys.push(key);
          }
        })
      } 
    })
  }

  setSamplesPerPage(value: number){
    const samples = this.state.samplesInCurrentFilter.slice(0, value);
    this.setState({
      pageLength: value,
      totalPages: Math.ceil(this.state.allSamples.length / value),
      currentPage: 0,
      samplesOnCurrentPage: samples,
    });
  }

  setMetadataFilter(key: string, value: string){
    var filterStr = '';
    if(this.state.filter.trim().length === 0){
      filterStr = key + '=' + value;
    } else if(this.state.filter.indexOf(key) === -1){
      filterStr = this.state.filter + '; ' + key + '=' + value;
    } else {
      const tkns = this.state.filter.split(';');
      var newTkns: string[] = [];
      tkns.map(tkn => {
        if(tkn.indexOf(key) === -1){
          newTkns.push(tkn);
        } else {
          newTkns.push(' ' + key + '=' + value)
        }
      })
      filterStr = newTkns.join(';')
    }
    this.filterSamples(filterStr);
  }

  handleFilterChange = (event: React.FormEvent<HTMLInputElement>) => {
    const filterStr = event.currentTarget.value;
    this.filterSamples(filterStr);
  }

  filterSamples = (filterStr: string) => {
    var filteredSamples = this.state.allSamples;
    const tkns = filterStr.split(';');
    tkns.map((tkn) => {
      const subtkns = tkn.trim().split('=');
      if(subtkns.length == 1){
        filteredSamples = filteredSamples.filter(
          sample =>
            sample.name.toLowerCase().indexOf(subtkns[0].toLowerCase()) > -1
        )
      } else if(subtkns.length == 2){
        const key = subtkns[0];
        const val = subtkns[1].toLowerCase();
        filteredSamples = filteredSamples.filter(
          sample => {
            if(!sample?.metadata){
              return false
            } else if(!sample.metadata[key]){
              return false
            }
            return sample.metadata[key].toLowerCase().indexOf(val) > -1
          }
        )
      }
    })

    this.setState({
      filter: filterStr,
      samplesInCurrentFilter: filteredSamples,
      totalPages: Math.ceil(filteredSamples.length / this.state.pageLength),
      samplesOnCurrentPage: filteredSamples.slice(0, this.state.pageLength),
    });
  };

  loadSamplePage(pageNum: number) {
    const myPageNum = Math.max(Math.min(pageNum, this.state.totalPages - 1), 0);
    const start = myPageNum * this.state.pageLength;
    const end = start + this.state.pageLength;
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
            <div className="input-group">
              <input
                name="filter"
                className="form-control"
                type="text"
                placeholder="Filter samples"
                required={true}
                value={this.state.filter}
                onChange={this.handleFilterChange}
              />
              <div className="input-group-btn">
                <Dropdown id="dropdown-sample-group" pullRight={true}>
                  <Dropdown.Toggle>
                    {this.state.pageLength} per page
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <MenuItem eventKey="#/action-1" onClick={() => this.setSamplesPerPage(10)}>10 per page</MenuItem>
                    <MenuItem eventKey="#/action-2" onClick={() => this.setSamplesPerPage(25)}>25 per page</MenuItem>
                    <MenuItem eventKey="#/action-3" onClick={() => this.setSamplesPerPage(50)}>50 per page</MenuItem>
                    <MenuItem eventKey="#/action-4" onClick={() => this.setSamplesPerPage(100)}>100 per page</MenuItem>
                    <MenuItem eventKey="#/action-5" onClick={() => this.setSamplesPerPage(250)}>250 per page</MenuItem>
                    <MenuItem eventKey="#/action-6" onClick={() => this.setSamplesPerPage(1000)}>1,000 per page</MenuItem>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </Col>
          <Col lg={3} lgOffset={1}>
            {this.props.grp && (
              this.props.grp.is_library && (
              <Link to={linkTo} className="btn btn-success">
                New Sample
              </Link>
            ))}
          </Col>
        </Row>
        <hr/>
        <Row>
          <Col lg={8}>
            
            {samples.length > 0 &&
              <SampleListForm samples={samples} grp={this.props.grp} />
            }
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
            <Row>
              {this._renderPaginator()}
            </Row>
          </Col>
          <Col lg={3} lgOffset={1}>
            <Row>
              <h3>Filter by Metadata</h3>
              {this.metadataKeys.map(key =>
                <>
                  <h4>{key}</h4>
                  <FilterMetadataForm metadataKey={key} callback={this.setMetadataFilter} />
                </>
              )}
            </Row>
          </Col>
        </Row>

      </>
    );
  }
}

export default SampleListPanel;
