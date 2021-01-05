import axios, { CancelTokenSource, AxiosRequestConfig } from 'axios';

import { SampleType } from './models/sample';
import { API_BASE_URL, cancelableAxios } from './utils';

import { usePangeaAxios, PaginatedResult } from '../../services/api';
import { AnalysisResultType } from './models/analysisResult';


// export const getSample = (uuid: string) => {
//   const [sampleResult] = usePangeaAxios<SampleType>(`/samples/${uuid}`);
//   return sampleResult
// }


// export const getAnalysisResultsForSample = (uuid: string) => {
//   const [analysisResultsResult] = usePangeaAxios<
//     PaginatedResult<AnalysisResultType>
//   >(`/sample_ars?sample_id=${uuid}`);
//   return analysisResultsResult
// }


// export const createSample = (sampleName: string, libraryUUID: string) => {
//     const [sampleResult] = usePangeaAxios<SampleType>({
//         url: '/samples',
//         method: 'POST',
//         data: {name: sampleName, library: libraryUUID},
//     });
//     return sampleResult
// }


export const modifySampleMetadata = (sample: SampleType, metadata: any, source: CancelTokenSource) => {
  const url = `${API_BASE_URL}/samples/${sample.uuid}`
  const options: AxiosRequestConfig = {
    url: url,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${window.localStorage.authToken}`,
    },
    data: { 
        metadata: metadata,
    },
  };
  return cancelableAxios(options, source).then(res => {
    const sample: SampleType = res.data.results;
    return sample;
  });
}

export const modifySampleDescription = (sample: SampleType, description: string, source: CancelTokenSource) => {
  const url = `${API_BASE_URL}/samples/${sample.uuid}`
  const data = { description: description };
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
    const sample: SampleType = res.data.results;
    return sample;
  });
}