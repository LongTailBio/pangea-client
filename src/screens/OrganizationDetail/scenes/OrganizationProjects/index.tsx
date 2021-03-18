import React from 'react';
import axios, { CancelTokenSource, AxiosRequestConfig } from 'axios';

import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { Row, Col, Well, Button } from 'react-bootstrap';

import { SampleGroupType } from '../../../../services/api/models/analysisGroup';
import AnalysisGroupList from '../../../../components/AnalysisGroupList';
import { cancelableAxios } from '../../../../services/api/utils';
import { usePangeaAxios, PaginatedResult } from '../../../../services/api';
import { OrganizationType } from '../../../../services/api/models/organization';


interface OrganizationProjectsProps {
  sampleGroups: PaginatedResult<SampleGroupType>;
  organization: OrganizationType;
}
interface OrganizationProjectsState {
  sampleGroups: SampleGroupType[];
  next: string | undefined;
  previous: string | undefined;
  filter: string;
}


export class OrganizationProjects extends React.Component<OrganizationProjectsProps, OrganizationProjectsState> {
  protected sourceToken: CancelTokenSource;

  constructor(props: OrganizationProjectsProps) {
    super(props);
    this.sourceToken = axios.CancelToken.source();

    this.state = {
      sampleGroups: props.sampleGroups.results,
      next: props.sampleGroups.next,
      previous: props.sampleGroups.previous,
      filter: '',
    }
    this.getPageNum = this.getPageNum.bind(this)    
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.loadSampleGroupPage = this.loadSampleGroupPage.bind(this)
    this.loadNextSampleGroupPage = this.loadNextSampleGroupPage.bind(this)
    this.loadPrevSampleGroupPage = this.loadPrevSampleGroupPage.bind(this)
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


  loadNextSampleGroupPage() {
    this.loadSampleGroupPage(this.state.next);
  }

  loadPrevSampleGroupPage() {
    this.loadSampleGroupPage(this.state.previous);
  }

  loadSampleGroupPage(url: string | undefined) {
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
        const pageRes: PaginatedResult<SampleGroupType> = res.data;
        this.setState({
          sampleGroups: pageRes.results,
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
    const sampleGroups = this.state.sampleGroups.filter(
        sampleGroup =>
          sampleGroup.name.toLowerCase().indexOf(this.state.filter.toLowerCase()) > -1
      );
    const linkTo = {
      pathname: "/sample-groups/create",
      state: {
        org: this.props.organization,
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
                    placeholder="Filter sample groups by name"
                    required={true}
                    value={this.state.filter}
                    onChange={this.handleFilterChange}
                  />
                </form>
              </Row>
            {sampleGroups.length > 0 && (
              <AnalysisGroupList groupUUIDs={sampleGroups.map(g => g.uuid)} />
            )}
            {(sampleGroups.length === 0 && this.state.filter === '') && (
              <Well className="text-center">
                <h4>This organization has no sample groups.</h4>
              </Well>
            )}
            {(sampleGroups.length === 0 && this.state.filter !== '') && (
              <Well className="text-center">
                <h4>This organization has no sample groups that match the specified filter.</h4>
              </Well>
            )}
          </Col>
          <Col lg={2} lgOffset={2}>
            <Link to={linkTo} className="btn btn-primary">
              New Sample Group
            </Link>
          </Col>
        </Row>
        <Row>
            <Col lg={2} lgOffset={0}>
              <button
                type='button'
                className="btn btn-secondary btn-lg btn-block"
                onClick={this.loadPrevSampleGroupPage}
              >Previous</button>
            </Col>
            <Col lg={1}>
              Page {this.getPageNum()}
            </Col>
            <Col lg={2}>
              <button
                type='button'
                className="btn btn-secondary btn-lg btn-block"
                onClick={this.loadNextSampleGroupPage}
              >Next</button>
            </Col>
        </Row>
      </>      
    );
  }

}

export default OrganizationProjects;
