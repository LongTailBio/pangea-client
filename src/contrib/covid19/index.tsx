import React from "react";

import MyCovid19Result from "./components/mycovid";
import Covid19Results from "./components/results";

const Covid19 = () => {
  return (
    <>
      <h1>COVID-19</h1>
      <MyCovid19Result />
      <Covid19Results />
    </>
  );
};

export default Covid19;
