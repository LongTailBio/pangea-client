import React from 'react';
import { Row } from 'react-bootstrap';


import { AxiosError } from 'axios';


interface LoadingErrorMessageProps {
  loading: boolean;
  error: AxiosError<any> | undefined;
  message?: string;
}


export const LoadingErrorMessage = (props: LoadingErrorMessageProps) => {
  
  if (props.loading) {
    return (
      <>
        <Row>
          <h1>Loading...</h1>
          <h2>{props?.message}</h2>
        </Row>
      </>
    );
  }
  if (props.error) {
    return (
      <>
        <Row>
          <h1>Error</h1>
          <h2>New Organization</h2>
          <p>{props?.message}</p>
        </Row>
      </>
    );
  }

  return (<></>);
};
