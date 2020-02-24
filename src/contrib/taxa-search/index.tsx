import React, { useRef, useEffect, useState } from "react";
import { useQueryParam, StringParam } from "use-query-params";

import { Row, Col } from "react-bootstrap";
import { Helmet } from "react-helmet";

import { createAxios } from "../../services/api";
import { TaxaSearchResults } from "./results";

interface TaxonResult {
  relative_abundance: number;
  sample_uuid: string;
  sample_name: string;
  sample_library_uuid: string;
}

interface TaxaResults {
  [taxonName: string]: TaxonResult[];
}

export const TaxaSearch = () => {
  const [query, setQuery] = useQueryParam("query", StringParam);
  const timeoutRef = useRef<NodeJS.Timer | null>(null);
  const [results, setResults] = useState<TaxaResults>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const safeQuery = query || "";

  // Clear timeout on unmount
  useEffect(() => {
    updateQuery(safeQuery);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const updateQuery = (value: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setQuery(value);
    setError("");
    setResults({});

    if (value) {
      setIsLoading(true);
      timeoutRef.current = setTimeout(() => {
        createAxios()
          .get<{ results: TaxaResults }>(
            `/contrib/taxasearch/search?query=${value}`
          )
          .then(res => setResults(res.data.results))
          .catch(error => setError(error.message))
          .then(() => setIsLoading(false));
      }, 350);
    }
  };

  const handleOnChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    updateQuery(value);
  };

  return (
    <>
      <Helmet>
        <title>Pangea :: Taxa Search</title>
      </Helmet>
      <Row>
        <Col>
          <h1>Taxa Search</h1>
          <input
            className="form-control input-lg"
            type="text"
            placeholder="Search..."
            value={safeQuery}
            onChange={handleOnChangeQuery}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <TaxaSearchResults
            query={safeQuery}
            results={results}
            loading={isLoading}
            error={error}
          />
        </Col>
      </Row>
    </>
  );
};

export default TaxaSearch;
