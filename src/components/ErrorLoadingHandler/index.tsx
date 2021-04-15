import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col } from 'react-bootstrap';

import { useUserContext } from '../../components/UserContext'

interface HandleErrorLoadingProps {
  loading: boolean;
  error: any;
}

export const HandleErrorLoading = (props: HandleErrorLoadingProps) => {
  const {user} = useUserContext();

  if (props.loading) {
    return (
      <>
        <Helmet>
          <title>Pangea :: Loading</title>
        </Helmet>
        <Row>
          <h1>Loading...</h1>
        </Row>
      </>
    );
  }

  if (props.error) {
    const { status } = props.error.response || {};
    if (status === 404){
      return (
        <>
          <Helmet>
            <title>{`Pangea :: Not Found`}</title>
          </Helmet>
          <Row>
            <h1>{'Resource cannot be found'}</h1>
            <p>{props.error.message}</p>
          </Row>
        </>
      )
    }
    if (status === 403){
      const message = user ?
        'You do not have permission to view this resource. Request access from an administrator.' :
        'You need to be logged in to view this resource'
      return (
        <>
          <Helmet>
            <title>{`Pangea :: Access Forbidden`}</title>
          </Helmet>
          <Row>
            <h1>{'Permission denied'}</h1>
            <p>{message}</p>
          </Row>
        </>
      )
    }
    return (
      <>
        <Helmet>
          <title>{`Pangea :: Error`}</title>
        </Helmet>
        <Row>
          <h1>{'Error'}</h1>
          <p>{props.error.message}</p>
        </Row>
      </>
    );
  }
  return (<p>no error</p>)
}