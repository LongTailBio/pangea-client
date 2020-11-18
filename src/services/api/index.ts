import axios, { CancelTokenSource, AxiosRequestConfig } from 'axios';
import { Options, makeUseAxios } from 'axios-hooks';

import { history } from '../../history';
import { API_BASE_URL, cancelableAxios } from './utils';
import { UserType } from './models/user';
import { OmniSearchResultType } from './models/omniSearchResult';

import { createAxios, usePangeaAxios } from './coreApi'

export { createAxios, usePangeaAxios };

export interface PaginatedResult<T> {
  count: number;
  results: T[];
}




type LoginType = {
  email: string;
  password: string;
};

export const authenticate = (
  formType: string,
  data: LoginType,
  source: CancelTokenSource,
) => {
  const options: AxiosRequestConfig =
    formType === 'login'
      ? {
          url: `${API_BASE_URL}/auth/token/login/`,
          method: 'post',
          data,
        }
      : {
          url: `${API_BASE_URL}/auth/${formType}`,
          method: 'post',
          data,
        };

  return cancelableAxios(options, source);
};

interface ObjectLink {
  name: string;
  uuid: string;
}



export interface SearchResultType {
  search_term: string;
  sample_groups: Array<ObjectLink>;
  samples: Array<ObjectLink>;
  organizations: Array<ObjectLink>;
}

export const search = (query: string, source: CancelTokenSource) => {
  const options: AxiosRequestConfig = {
    url: `${API_BASE_URL}/search.json?query=${query}`,
    method: 'get',
  };

  return cancelableAxios(options, source).then(res => {
    const search_result: SearchResultType = {
      search_term: res.data.search_term,
      sample_groups: res.data.sample_groups,
      samples: res.data.samples,
      organizations: res.data.organizations,
    };

    return search_result;
  });
};

export interface ModuleCountsType {
  n_samples: number;
  [key: string]: number;
}

export const getModuleCounts = (grpUUID: string, source: CancelTokenSource) => {
  const options: AxiosRequestConfig = {
    url: `${API_BASE_URL}/sample_groups/${grpUUID}/module_counts?format=json`,
    method: 'get',
  };

  return cancelableAxios(options, source).then(res => {
    const module_counts: ModuleCountsType = res.data.results;
    console.log(module_counts)
    return module_counts;
  });
};

export const omnisearch = (query: string, source: CancelTokenSource) => {
  const options: AxiosRequestConfig = {
    url: `${API_BASE_URL}/contrib/omnisearch/search?query=${query}&format=json`,
    method: 'get',
  };
  return cancelableAxios(options, source).then(res => {
    const search_result: OmniSearchResultType = res.data.results;
    return search_result;
  });
};

export const getUser = (uuid: string, source: CancelTokenSource) => {
  const options: AxiosRequestConfig = {
    url: `${API_BASE_URL}/users/${uuid}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${window.localStorage.authToken}`,
    },
  };

  return cancelableAxios(options, source).then(res => {
    const sample: UserType = {
      id: res.data.user.id,
      email: res.data.user.email,
    };
    return sample;
  });
};

export const getUserStatus = (source: CancelTokenSource) => {
  const options: AxiosRequestConfig = {
    url: `${API_BASE_URL}/auth/status`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${window.localStorage.authToken}`,
    },
  };

  return cancelableAxios(options, source).then(res => res.data.data);
};


