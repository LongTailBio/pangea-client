import React from 'react';
import { Link } from 'react-router-dom';

import { usePangeaAxios } from '../../../services/api';
import { AnalysisResultType } from '../../../services/api/models/analysisResult';

const Covid19Results = () => {
  const [{ data, loading, error }] = usePangeaAxios<{
    results: AnalysisResultType[];
  }>('/sample_ars?module_name=covid19');
  return (
    <>
      <h2>Covid Results</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error.message}</p>}
      {data && data.results.length > 0 && (
        <ul>
          {data.results.map(ar => (
            <li key={ar.uuid}>
              <Link to={`/samples/${ar.uuid}`}>Sample {ar.uuid}</Link>
            </li>
          ))}
        </ul>
      )}
      {data && data.results.length === 0 && <p>No results</p>}
    </>
  );
};

export default Covid19Results;
