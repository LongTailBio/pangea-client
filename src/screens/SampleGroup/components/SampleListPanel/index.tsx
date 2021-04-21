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
import { FilterMetadataForm } from './components/FilterForm'

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
                  placeholder="Filter samples"
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
                    <>
                      <br/>
                      <p>{metadataToStr(sample)}</p>
                    </>
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
          <Col lg={3} lgOffset={1}>
            <Row>
              {this.props.grp && (
                this.props.grp.is_library && (
                <Link to={linkTo} className="btn btn-success btn-lg ">
                  Create New Sample
                </Link>
              ))}
            </Row>
            <br/>
            <hr/>
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
        <Row>
          {this._renderPaginator()}
        </Row>

      </>
    );
  }
}

export default SampleListPanel;
