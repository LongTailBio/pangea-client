import React from 'react';
import { Helmet } from 'react-helmet';

import { usePangeaAxios } from '../../services/api';
import { UserType } from '../../services/api/models/user';

export const UserStatus = () => {
  const [{ data, loading, error }] = usePangeaAxios<UserType>(
    '/auth/users/me/',
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      <Helmet>
        <title>MetaGenScope :: User Status</title>
      </Helmet>
      <ul>
        <li>
          <strong>User ID:</strong> {data.id}
        </li>
        <li>
          <strong>Email:</strong> {data.email}
        </li>
      </ul>
    </>
  );
};

export default UserStatus;
