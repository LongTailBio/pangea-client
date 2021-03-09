import { CancelTokenSource } from 'axios';

import { API_BASE_URL, cancelableAxios } from './utils';
import { AnalysisResultType, QueryResultWrapper } from './models/queryResult';

export const getAnalysisResults = (uuid: string, source: CancelTokenSource) => {
  const options = {
    url: `${API_BASE_URL}/analysis_results/${uuid}`,
    method: 'get' as const,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${window.localStorage.authToken}`,
    },
  };

  return cancelableAxios(options, source).then(
    res => res.data.data.analysis_result as AnalysisResultType,
  );
};

// tslint:disable-next-line no-any
type ResultWrapperType<T> = (res: any) => QueryResultWrapper<T>;

export const getGroupAnalysisResult = <T>(
  orgID: string,
  groupID: string,
  module_name: string,
  field_name: string,
  source: CancelTokenSource,
  wrapResult?: ResultWrapperType<T>,
) => {
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
    method: 'get' as const,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${window.localStorage.authToken}`,
    },
  };

  wrapResult =
    wrapResult !== undefined
      ? wrapResult
      : res => res.data.stored_data as QueryResultWrapper<T>;
  return cancelableAxios(options, source).then(wrapResult);
};

export const getSampleAnalysisResult = <T>(
  orgID: string,
  groupID: string,
  sampleID: string,
  module_name: string,
  field_name: string,
  source: CancelTokenSource,
  wrapResult?: ResultWrapperType<T>,
) => {
  const url =
    `${API_BASE_URL}/nested/` +
    orgID +
    '/sample_groups/' +
    groupID +
    '/samples/' +
    sampleID +
    '/analysis_results/' +
    module_name +
    '/fields/' +
    field_name +
    '?format=json';
  const options = {
    url: url,
    method: 'get' as const,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${window.localStorage.authToken}`,
    },
  };

  wrapResult =
    wrapResult !== undefined
      ? wrapResult
      : res => res.data.stored_data as QueryResultWrapper<T>;
  return cancelableAxios(options, source).then(wrapResult);
};
