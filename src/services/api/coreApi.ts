
import { history } from '../../history';
import axios, { CancelTokenSource, AxiosRequestConfig } from 'axios';
import { Options, makeUseAxios } from 'axios-hooks';
import { API_BASE_URL, cancelableAxios } from './utils';


export const createAxios = () => {
  const { authToken } = window.localStorage;
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: authToken ? `Token ${authToken}` : undefined,
    },
  });

  client.interceptors.response.use(undefined, error => {
    const { status } = error.response;
    if (status === 401) {
      // Allow component state update to complete before navigating away
      setTimeout(() => {
        window.localStorage.removeItem('authToken');
        history.push('/login');
      }, 0);
    }
    return Promise.reject(error);
  });

  return client;
};


export const pangeaFetch = (
  url: string,
  method: string,
  body?: any,
) => {
  const { authToken } = window.localStorage;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': authToken ? `Token ${authToken}` : '',
  }
  const fullUrl = API_BASE_URL + url
  const requestOptions = {
      method: method,
      headers: headers,
      body: body ? body : {}
  };
  return fetch(fullUrl, requestOptions)
};





export const usePangeaAxios = <T>(
  config: AxiosRequestConfig | string,
  options?: Options,
) => {
  const client = createAxios();
  const useAxios = makeUseAxios({ axios: client });
  return useAxios<T>(config, options);
};
