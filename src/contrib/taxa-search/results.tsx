import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Table } from 'react-bootstrap';

interface TaxonResult {
  relative_abundance: number;
  sample_uuid: string;
  sample_name: string;
  sample_library_uuid: string;
}

interface TaxaResults {
  [taxonName: string]: TaxonResult[];
}

interface SearchResultProps {
  query: string;
  results: TaxaResults;
  loading: boolean;
  error: string;
}

export const TaxaSearchResults: React.FC<SearchResultProps> = props => {
  const { query, results, loading, error } = props;

  const hasQuery = query.length > 0;
  const hasResults = Object.keys(results).length > 0;

  if (loading) return <p>Loading...</p>;
  if (error.length > 0) return <p style={{ color: 'red' }}>{error}</p>;
  if (!hasResults && hasQuery) return <p>No results :(</p>;
  if (!hasResults && !hasQuery) return <p>Enter a query above</p>;

  return (
    <>
      {Object.entries(results).map(([taxon, matches]) => (
        <Row key={taxon}>
          <Col>
            <h3>{taxon}</h3>
            <Table>
              <thead>
                <tr>
                  <th>Sample</th>
                  <th>Relative Abundance</th>
                </tr>
              </thead>
              <tbody>
                {matches.map(match => (
                  <tr key={match.sample_uuid}>
                    <td>
                      <Link to={`/samples/${match.sample_uuid}`}>
                        {match.sample_name}
                      </Link>
                    </td>
                    <td>{match.relative_abundance}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      ))}
    </>
  );
};

export default TaxaSearchResults;
