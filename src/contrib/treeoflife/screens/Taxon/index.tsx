import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { usePangeaAxios } from '../../../../services/api/index';
import { LoadingErrorMessage } from '../../../../components/LoadingErrorMessage'

import {MicrobeAnnotation} from '../../services/api/models/microbeAnnotation';

interface TaxonScreenProps {
  taxon: string;

}

function titleCase(str: string) {
  return str.replace('_', ' ').toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}


export const TaxonScreen = (props: TaxonScreenProps) => {
  const annotateURL = `/contrib/treeoflife/annotate?format=json&query=${props.taxon}`
  const [{ data, loading, error }] = usePangeaAxios<{[key: string]: MicrobeAnnotation}>(annotateURL);
  const ancestorURL = `/contrib/treeoflife/ancestors?format=json&query=${props.taxon}`
  const [{ data: ancestorData, loading: ancestorLoad, error: ancestorErr }] = usePangeaAxios<{[key: string]: string[]}>(ancestorURL);
  if (error || loading) return <LoadingErrorMessage loading={loading} error={error} name={'Taxon Annotation'} message={error?.message} />;
  if (ancestorErr || ancestorLoad) return <LoadingErrorMessage loading={ancestorLoad} error={ancestorErr} name={'Taxon Ancestor'} message={ancestorErr?.message} />;
  return (
      <>
        <Row>
          <Col lg={8}>
            <h1>{props.taxon}</h1>
            <p>
            {
              ancestorData[props.taxon].slice(1).reverse().slice(1).map(taxon => (
                <>
                  <a
                    href={`/contrib/treeoflife/${taxon}`}
                  >
                    {titleCase(taxon)}
                  </a>
                  {' > '}
                </>
              ))
            }
            {titleCase(props.taxon)}
            </p>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data[props.taxon]).map(pair => (
                  <tr key={pair[0]}>
                    <th scope="row">{titleCase(pair[0])}</th>
                    <td>{pair[1] == "nan" ? "Unknown" : pair[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              Annotation from the{' '}
              <a href={'https://github.com/dcdanko/MD2'} >
                The Microbe Directory
              </a>
            </p>
          </Col>
        </Row>
      </>
  );
};


export default TaxonScreen;
