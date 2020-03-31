import React, { useState } from 'react';
import { usePangeaAxios } from '../../../services/api';
import Covid19Uploader from './uploader';

interface CurrentUserResult {
  id: number;
  email: string;
}

interface TaskHashHook {
  (): [
    { taskHash: string; loading?: boolean; error?: Error },
    (userId: number, rawReadsPath: string) => void,
  ];
}

const useTaskHash: TaskHashHook = () => {
  const [{ data, loading, error }, execute] = usePangeaAxios<{
    task_hash: string;
  }>({ url: '/contrib/covid19/', method: 'POST' }, { manual: true });

  const taskHash = data ? data.task_hash : '';
  const submitRawReads = (userId: number, rawReadsPath: string) => {
    execute({
      data: {
        user: userId,
        raw_reads_path: rawReadsPath,
      },
    });
  };

  return [{ taskHash, loading, error }, submitRawReads];
};

const MyCovid19Result: React.FC = () => {
  const [uploadError, setUploadError] = useState<string | undefined>(undefined);
  const [{ data: me, loading, error: authError }] = usePangeaAxios<
    CurrentUserResult
  >('/auth/users/me/');

  const [{ taskHash, error: submitError }, submitRawReads] = useTaskHash();

  const handleOnUploadError = (err: Error) => setUploadError(err.message);
  const handleOnCompleteUpload = (userId: number, url: string) =>
    submitRawReads(userId, url);

  return (
    <>
      {loading && <p>Loading...</p>}
      {authError && <p>Log in to mange your COVID-19 sample.</p>}
      {taskHash && (
        <>
          <p>
            Your sample has begun processing and you will receive an email with
            your results shortly.
          </p>
          <p>
            Please keep this unique ID for your records: <code>{taskHash}</code>
          </p>
        </>
      )}
      {!taskHash && me && (
        <>
          <h2>Your Covid Test</h2>
          {submitError && <p>{submitError.message}</p>}
          {uploadError && <p>{uploadError}</p>}
          <Covid19Uploader
            userId={me.id}
            onUploadError={handleOnUploadError}
            onCompleteUpload={handleOnCompleteUpload}
          />
        </>
      )}
    </>
  );
};

export default MyCovid19Result;
