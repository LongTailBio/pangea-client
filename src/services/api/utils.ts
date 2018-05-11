import { default as axios, AxiosRequestConfig, CancelTokenSource } from 'axios';

function getHost(): string {
  // Use environment variable if present
  const envUrl = process.env.REACT_APP_METAGENSCOPE_SERVICE_URL;
  if (typeof(envUrl) !== 'undefined' && envUrl) {
    return envUrl;
  }

  // Otherwise, use web host
  const protocol = window.location.protocol;
  const host = window.location.hostname;
  let port = window.location.port;
  port = port === '' ? '' : `:${port}`;
  return `${protocol}//${host}${port}`;
}

export const API_BASE_URL = `${getHost()}/api/v1`;

/**
 * Similar to `makeCancelable` but uses axios' implementation:
 * https://github.com/axios/axios#cancellation
 * @param options axios request options
 */
export const cancelableAxios = (options: AxiosRequestConfig, source: CancelTokenSource) => {
  options.cancelToken = source.token;
  return axios(options);
};

export type CancelablePromise<T> = {promise: Promise<T>, cancel(): void};

/**
 * Wrap a promise to allow it to be cancelled (as this is not part of Promises by default)
 *
 * The primary use case for this is network calls in componentDidMount that may not complete
 * before the component is unmounted.
 *
 * Source: https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
 *
 * @param promise The promise to wrap
 */
export const makeCancelable = <T>(promise: Promise<T>): CancelablePromise<T> => {
  let _hasCanceled = false;

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise.then(
      val => _hasCanceled ? reject({isCanceled: true}) : resolve(val),
      error => _hasCanceled ? reject({isCanceled: true}) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      _hasCanceled = true;
    },
  };
};
