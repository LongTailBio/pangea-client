import React from 'react';
import { Row } from 'react-bootstrap';


import { AxiosError } from 'axios';


interface LoadingErrorMessageProps {
  loading: boolean;
  error: AxiosError<any> | undefined;
  name?: string; 
  message?: string;
}


export const LoadingErrorMessage = (props: LoadingErrorMessageProps) => {
  
  if (props.loading) {
    return (
      <>
        <Row>
          <h1>Loading...</h1>
          <h2>{ props?.name }</h2>
          <p style={{ color: 'blue' }}>{props?.message}</p>
        </Row>
      </>
    );
  }
  if (props.error) {
    return (
      <>
        <Row>
          <h1>Error</h1>
          <h2>{ props?.name }</h2>
          <p style={{ color: 'red' }}>{props?.message}</p>
        </Row>
      </>
    );
  }

  return (<></>);
};
