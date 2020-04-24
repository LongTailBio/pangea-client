import { CancelTokenSource } from 'axios';

import { API_BASE_URL, cancelableAxios } from './utils';
import { JsonOrganizationType, OrganizationType } from './models/organization';
import { SampleGroupType } from './models/analysisGroup';
import { SampleType } from './models/sample';
import { AnalysisResultType, QueryResultWrapper } from './models/queryResult';


export const getAnalysisResults = (uuid: string, source: CancelTokenSource) => {
  const options = {
    url: `${API_BASE_URL}/analysis_results/${uuid}`,
    method: <const> 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${window.localStorage.authToken}`
    },
  };

  return cancelableAxios(options, source)
    .then(res => res.data.data.analysis_result as AnalysisResultType);
};


// tslint:disable-next-line no-any
type ResultWrapperType<T> = (res: any) => QueryResultWrapper<T>;

export const getAnalysisResult = <T>(orgID: string,
                                     groupID: string,
                                     module_name: string,
                                     field_name: string,
                                     source: CancelTokenSource,
                                     wrapResult?: ResultWrapperType<T>) => {
  const url =
    `${API_BASE_URL}/nested/` +
    orgID +
    '/sample_groups/' +
    groupID +
    '/analysis_results/' +
    module_name +
    '/fields/' +
    field_name +
    '?format=json';
  const options = {
    url: url,
    method: <const> 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${window.localStorage.authToken}`
    },
  };

  wrapResult = (wrapResult !== undefined) ? wrapResult : res => res.data.stored_data as QueryResultWrapper<T>;
  return cancelableAxios(options, source)
    .then(wrapResult);
};
