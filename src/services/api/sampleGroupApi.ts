import axios, { CancelTokenSource, AxiosRequestConfig } from 'axios';

import { SampleGroupType } from './models/sampleGroup';
import { API_BASE_URL, cancelableAxios } from './utils';

import { usePangeaAxios, PaginatedResult } from '../../services/api';
import { AnalysisResultType } from './models/analysisResult';



export const modifySampleGroupDescription = (sampleGroup: SampleGroupType, description: string, source: CancelTokenSource, long: boolean = false) => {
  const url = `${API_BASE_URL}/sample_groups/${sampleGroup.uuid}`
  var data;
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
  });
}