
import { PipelineType } from './models/pipeline';
import { PipelineModuleType } from './models/pipelineModule';
import { API_BASE_URL, cancelableAxios } from './utils';

import axios, { CancelTokenSource, AxiosRequestConfig } from 'axios';
import { usePangeaAxios, PaginatedResult } from '../../services/api';

export const getAllPipelines = () => {
    return fetch(`${API_BASE_URL}/pipelines`);
}

export const getModulesInPipeline = (uuid: string) => {
    return fetch(`${API_BASE_URL}/pipeline_modules?pipeline=${uuid}`);
}


export const modifyPipelineModuleDescription = (pipelineModule: PipelineModuleType, description: string, source: CancelTokenSource, long: boolean = false) => {
  const url = `${API_BASE_URL}/pipeline_modules/${pipelineModule.uuid}`
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
    const pipelineModule: PipelineModuleType = res.data.results;
    return pipelineModule;
  });
}


export const modifyPipelineDescription = (pipeline: PipelineType, description: string, source: CancelTokenSource, long: boolean = false) => {
  const url = `${API_BASE_URL}/pipelines/${pipeline.uuid}`
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
    const pipeline: PipelineModuleType = res.data.results;
    return pipeline;
  });
}