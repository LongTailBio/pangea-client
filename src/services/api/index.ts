import { CancelTokenSource, AxiosRequestConfig } from 'axios';
import useAxios, { Options } from "axios-hooks";

import { API_BASE_URL, cancelableAxios } from './utils';
import { OrganizationType } from './models/organization';
import { UserType } from './models/user';
import { SampleGroupType } from './models/sampleGroup';
import { SampleType } from './models/sample';
import { AnalysisResultType } from './models/analysisResult';

export interface PaginatedResult<T> {
  count: number;
  results: T[];
}

export const usePangeaAxios = <T = any>(config: AxiosRequestConfig | string, options?: Options) => {
  const { authToken } = window.localStorage;
  const baseConfig: AxiosRequestConfig = {
    baseURL: API_BASE_URL,
    url: typeof config === 'string' ? config : undefined,
    headers: {
      'Content-Type': 'application/json',
      Authorization: authToken ? `Token ${authToken}` : undefined,
    }
  };
  config = Object.assign(baseConfig, config);

  return useAxios<T>(config, options);
}


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


export const createOrganization = (name: string, adminEmail: string, source: CancelTokenSource) => {
  const options: AxiosRequestConfig = {
    url: `${API_BASE_URL}/organizations`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${window.localStorage.authToken}`
    },
    data: {
      name,
    },
  };

  return cancelableAxios(options, source);
};

export const getOrganization = (uuid: string, source: CancelTokenSource) => {
  const options: AxiosRequestConfig = {
    url: `${API_BASE_URL}/organizations/${uuid}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${window.localStorage.authToken}`
    }
  };

  return cancelableAxios(options, source)
    .then(res => {
      const organization: OrganizationType = {
        uuid: res.data.organization.uuid,
        name: res.data.organization.name,
        created_at: res.data.organization.created_at,
        updated_at: res.data.organization.updated_at,
      }

      return organization;
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

export const getSampleGroup = (uuid: string, source: CancelTokenSource) => {
  const options: AxiosRequestConfig = {
    url: `${API_BASE_URL}/sample_groups/${uuid}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${window.localStorage.authToken}`
    },
  };

  return cancelableAxios(options, source)
    .then(res => {
      const sampleGroup: SampleGroupType = {
        uuid: res.data.sample_group.uuid,
        organization_id: res.data.sample_group.organization_id,
        name: res.data.sample_group.name,
        description: res.data.sample_group.description,
        is_public: res.data.sample_group.is_public,
        theme: res.data.sample_group.theme,
        created_at: res.data.sample_group.created_at,
        updated_at: res.data.organization.updated_at,
      };
      return sampleGroup;
    });
};

export const getSampleGroupSamples = (uuid: string, source: CancelTokenSource) => {
  const options: AxiosRequestConfig = {
    url: `${API_BASE_URL}/sample_groups/${uuid}/samples`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${window.localStorage.authToken}`
    },
  };

  return cancelableAxios(options, source)
    .then(res => {
      const rawSamples = res.data.data.samples;

      const samples: SampleType[] = rawSamples.map((rawSample: any) => {
        return {
          uuid: rawSample.uuid,
          name: rawSample.name,
          analysisResultUuid: rawSample.analysis_result_uuid,
          metadata: rawSample.metadata,
        };
      });
      return samples;
    });
};

export const getSample = (uuid: string, source: CancelTokenSource) => {
  const options: AxiosRequestConfig = {
    url: `${API_BASE_URL}/samples/${uuid}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${window.localStorage.authToken}`
    },
  };

  return cancelableAxios(options, source)
    .then(res => {
      const sample: SampleType = {
          uuid: res.data.sample.uuid,
          library_id: res.data.sample.library_id,
          name: res.data.sample.name,
          metadata: res.data.sample_metadata,
          created_at: res.data.sample.created_at,
          updated_at: res.data.sample.updated_at,
      };
      return sample;
    });
};

export const getAnalysisResult = (uuid: string, source: CancelTokenSource) => {
  const options: AxiosRequestConfig = {
    url: `${API_BASE_URL}/analysis_results/${uuid}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${window.localStorage.authToken}`
    },
  };

  return cancelableAxios(options, source)
    .then(res => {
      const ar: AnalysisResultType = {
          uuid: res.data.analysis_result.uuid,
          parent_uuid: res.data.analysis_result.parent_uuid,
          module_name: res.data.analysis_result.module_name,
          kind: res.data.analysis_result.kind,
          status: res.data.analysis_result.status,
          created_at: res.data.analysis_result.created_at,
          fields: res.data.analysis_result.fields,
          field_data: res.data.data,
      };
      return ar;
    });
};
export const getAnalysisResults = (uuid: string, source: CancelTokenSource) => {
  const options: AxiosRequestConfig = {
    url: `${API_BASE_URL}/analysis_results/${uuid}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${window.localStorage.authToken}`
    },
  };

  return cancelableAxios(options, source)
    .then(res => res.data.data.analysis_result as AnalysisResultType);
};
