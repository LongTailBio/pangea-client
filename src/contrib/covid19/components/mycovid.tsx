import React, { useState } from "react";

import { usePangeaAxios } from "../../../services/api";

import Covid19Uploader from "./uploader";

interface CurrentUserResult {
  id: number;
  email: string;
}

const MyCovid19Result = () => {
  const [didUpload, setDidUpload] = useState(false);
  const [{ data: me, loading, error }] = usePangeaAxios<CurrentUserResult>(
    "/auth/users/me/"
  );

  const handleOnCompleteUpload = (userId: number) => {
    setDidUpload(true);
    console.log(`TODO: kick off pangea job for user ${userId}`);
  };

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p>Log in to mange your COVID-19 sample.</p>}
      {didUpload && <p>You will receive an email with your results shortly.</p>}
      {!didUpload && me && (
        <>
          <h2>Your Covid Test</h2>
          <Covid19Uploader
            userId={me.id}
            onCompleteUpload={handleOnCompleteUpload}
          />
        </>
      )}
    </>
  );
};

export default MyCovid19Result;
