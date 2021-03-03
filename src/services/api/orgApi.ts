import axios, { CancelTokenSource, AxiosRequestConfig } from 'axios';

import { OrganizationType } from './models/organization';
import { UserType } from './models/user';
import { API_BASE_URL, cancelableAxios } from './utils';

import { usePangeaAxios, PaginatedResult } from '../../services/api';
import { AnalysisResultType } from './models/analysisResult';


export const getUsersInOrg = (org: OrganizationType) => {

}

export const addUserToOrg = (org: OrganizationType, user: UserType, source: CancelTokenSource) => {
  const url = `${API_BASE_URL}/organizations/${org.uuid}/users`
  const data = { user: user.id };
  const options: AxiosRequestConfig = {
    url: url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${window.localStorage.authToken}`,
    },
    data: data,
  };
  return cancelableAxios(options, source).then(res => {
    const user: UserType = res.data.results;
    return user;
  });
}
