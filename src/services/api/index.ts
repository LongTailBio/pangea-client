import axios, { CancelTokenSource, AxiosRequestConfig } from 'axios';
import { Options, makeUseAxios } from "axios-hooks";

import { history } from "../../history";
import { API_BASE_URL, cancelableAxios } from './utils';
import { UserType } from './models/user';

export interface PaginatedResult<T> {
  count: number;
  results: T[];
}

export const createAxios = () => {
  const { authToken } = window.localStorage;
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: authToken ? `Token ${authToken}` : undefined
    }
  });

  client.interceptors.response.use(undefined, error => {
    const { status } = error.response;
    if (status === 401) {
      Promise.reject(error);
      // Allow component state update to complete before navigating away
      setTimeout(() => {
        window.localStorage.removeItem("authToken");
        history.push("/login");
      }, 0);
    }
  });

  return client;
};

export const usePangeaAxios = <T = any>(
  config: AxiosRequestConfig | string,
  options?: Options
) => {
  const client = createAxios();
  const useAxios = makeUseAxios({ axios: client });
  return useAxios<T>(config, options);
};

type LoginType = {
  email: string;
  password: string;
};

export const authenticate = (formType: string, data: LoginType, source: CancelTokenSource) => {
  const options: AxiosRequestConfig = formType === 'login'
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
    users: Array<ObjectLink>;
    organizations: Array<ObjectLink>;
}

export const search = (query: string, source: CancelTokenSource) => {
  const options: AxiosRequestConfig = {
    url: `${API_BASE_URL}/search/${query}`,
    method: 'get'
  };

  return cancelableAxios(options, source)
    .then(res => {
      const search_result: SearchResultType = {
        search_term: res.data.search_term,
        sample_groups: res.data.sample_groups,
        samples: res.data.samples,
        users: res.data.users,
        organizations: res.data.organizations,
      }

      return search_result;
    });
};

export const getUser = (uuid: string, source: CancelTokenSource) => {
  const options: AxiosRequestConfig = {
    url: `${API_BASE_URL}/users/${uuid}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${window.localStorage.authToken}`
    },
  };

  return cancelableAxios(options, source)
    .then(res => {
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
      Authorization: `Token ${window.localStorage.authToken}`
    },
  };

  return cancelableAxios(options, source)
    .then(res => res.data.data);
};
