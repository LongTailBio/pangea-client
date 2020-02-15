import { CancelTokenSource, AxiosRequestConfig } from 'axios';

import { API_BASE_URL, cancelableAxios } from './utils';
import { OrganizationType } from './models/organization';
import { UserType } from './models/user';
import { SampleGroupType } from './models/sampleGroup';
import { SampleType } from './models/sample';
import { AnalysisResultType } from './models/analysisResult';

type LoginType = {
  email: string;
  password: string;
  username?: string;
};

export const authenticate = (formType: string, data: LoginType, source: CancelTokenSource) => {
  const options: AxiosRequestConfig = {
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
      Authorization: `Bearer ${window.localStorage.authToken}`
    },
    data: {
      name,
      admin_email: adminEmail,
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
      Authorization: `Bearer ${window.localStorage.authToken}`
    }
  };

  return cancelableAxios(options, source)
    .then(res => {
      const organization: OrganizationType = {
        uuid: res.data.organization.uuid,
        name: res.data.organization.name,
        is_public: res.data.organization.is_public,
        is_deleted: res.data.organization.is_deleted,
        created_at: res.data.organization.created_at,
        primary_admin_uuid: res.data.organization.primary_admin_uuid,
        sample_group_uuids: res.data.organization.sample_group_uuids,
        user_uuids: res.data.organization.user_uuids,
        user_usernames: res.data.organization.user_usernames,
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
      Authorization: `Bearer ${window.localStorage.authToken}`
    },
  };

  return cancelableAxios(options, source)
    .then(res => {
      const sample: UserType = {
          uuid: res.data.user.uuid,
          username: res.data.user.username,
          email: res.data.user.email,
          is_deleted: res.data.user.is_deleted,
          created_at: res.data.user.created_at,
          organization_uuids: res.data.user.organization_uuids,
          organization_names: res.data.user.organization_names,
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
      Authorization: `Bearer ${window.localStorage.authToken}`
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
      Authorization: `Bearer ${window.localStorage.authToken}`
    },
  };

  return cancelableAxios(options, source)
    .then(res => {
      const sampleGroup: SampleGroupType = {
        uuid: res.data.sample_group.uuid,
        name: res.data.sample_group.name,
        organization_uuid: res.data.sample_group.organization_uuid,
        description: res.data.sample_group.description,
        is_library: res.data.sample_group.is_library,
        is_public: res.data.sample_group.is_public,
        created_at: res.data.sample_group.created_at,
        sample_uuids: res.data.sample_group.sample_uuids,
        sample_names: res.data.sample_group.sample_names,
        analysis_result_uuids: res.data.sample_group.analysis_result_uuids,
        analysis_result_names: res.data.sample_group.analysis_result_names,
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
      Authorization: `Bearer ${window.localStorage.authToken}`
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
      Authorization: `Bearer ${window.localStorage.authToken}`
    },
  };

  return cancelableAxios(options, source)
    .then(res => {
      const sample: SampleType = {
          uuid: res.data.sample.uuid,
          name: res.data.sample.name,
          library_uuid: res.data.sample.library_uuid,
          created_at: res.data.sample.created_at,
          analysis_result_uuids: res.data.sample.analysis_result_uuids,
          analysis_result_names: res.data.sample.analysis_result_names,
          metadata: res.data.sample_metadata,
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
      Authorization: `Bearer ${window.localStorage.authToken}`
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
      Authorization: `Bearer ${window.localStorage.authToken}`
    },
  };

  return cancelableAxios(options, source)
    .then(res => res.data.data.analysis_result as AnalysisResultType);
};
