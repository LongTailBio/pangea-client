import axios, { CancelTokenSource, AxiosRequestConfig } from 'axios';

import { SampleGroupType } from './models/sampleGroup';
import { API_BASE_URL, cancelableAxios } from './utils';

import { usePangeaAxios, PaginatedResult } from '../../services/api';
import { AnalysisResultType } from './models/analysisResult';

import { pangeaFetch } from './coreApi'


export const modifySampleGroupDescription = (sampleGroup: SampleGroupType, description: string, source: CancelTokenSource, long: boolean = false) => {
  const url = `${API_BASE_URL}/sample_groups/${sampleGroup.uuid}`
  var data: any;
  if(long){
    data = { long_description: description }
  } else {
    data = { description: description }
  }
  const options: AxiosRequestConfig = {
    url: url,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${window.localStorage.authToken}`,
    },
    data: data,
  };
  return cancelableAxios(options, source).then(res => {
    const sampleGroup: SampleGroupType = res.data.results;
    return sampleGroup;
  })
    .catch(error => {
    if (error.response) {
      // Request made and server responded
      console.log('Request was made, server responded')
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.log('Request was made, no response was received')
      console.log(url);
      console.log(data);
      console.log(options);
      console.log(error.message)
      console.log(error.request);
      console.log(error)
    } else {
      console.log('Error during request setup')
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
  });

}