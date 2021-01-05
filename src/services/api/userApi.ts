import axios, { CancelTokenSource, AxiosRequestConfig } from 'axios';

import { UserType } from './models/user';
import { API_BASE_URL, cancelableAxios } from './utils';

import { usePangeaAxios, PaginatedResult } from '../../services/api';
import { AnalysisResultType } from './models/analysisResult';


export const getAllUsers = (source: CancelTokenSource) => {
  const options: AxiosRequestConfig = {
    url: `${API_BASE_URL}/auth/users`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${window.localStorage.authToken}`,
    },
  };

  return cancelableAxios(options, source).then(res => {
    const allUsers: UserType[] = res.data.results;
    return allUsers;
  });
}
