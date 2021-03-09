import * as React from 'react';
import { S3BucketType } from '../../../../../services/api/models/s3Bucket';
import { usePangeaAxios, PaginatedResult } from '../../../../../services/api';

import {
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';

interface SettingsProps {
  uuid: string;
}

type S3BucketResult = {
  count: number;
  results: S3BucketType[];
};


export const OrgSettingsCloudStorage = (props: SettingsProps) => {

  const [{ data, loading, error }] = usePangeaAxios<S3BucketResult>(
    `/s3_buckets?organization_id=${props.uuid}`,
  );
  if (loading) {
    return (
      <>
        <Row>
          <h1>Loading...</h1>
          <h2>Organizations Cloud Storage</h2>
        </Row>
      </>
    );
  }

  if (error) {
    const { status } = error.response || {};
    const title = status === 404 ? 'Not Found' : 'Error';
    return (
      <>
        <Row>
          <h1>{title}</h1>
          <h2>Organization Cloud Storage</h2>
          <p>{error.message}</p>
        </Row>
      </>
    );
  }

  return (
    <div>
    <h3>S3 Buckets</h3>
    <ul>
    {
      data.results.map(bucket => (
        <li key={bucket.uuid}>
            {bucket.name}
        </li>
      ))
    }
    </ul>
    </div>
  );
}

export default OrgSettingsCloudStorage;
