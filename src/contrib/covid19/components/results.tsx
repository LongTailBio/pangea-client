import React from "react";

import { usePangeaAxios } from "../../../services/api";

const Covid19Results = () => {
  const [{ data, loading, error }] = usePangeaAxios<{}>("/contrib/covid19");
  return (
    <>
      <h2>Covid Results</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error.message}</p>}
      {!error && <p>No results yet</p>}
    </>
  );
};

export default Covid19Results;
