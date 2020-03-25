import * as React from 'react';
import { Grid } from 'react-bootstrap';

import Header from './components/Header';
import Footer from './components/Footer';

// Themes
import {
  WorldQuantHeader,
  WorldQuantSampleHeader,
  WorldQuantFooter,
} from './themes/WorldQuant';

interface LayoutProps {
  title: string;
  isAuthenticated: boolean;
  theme?: string;
}

const DefaultLayout: React.SFC<LayoutProps> = props => {
  let header = (
    <Header title={props.title} isAuthenticated={props.isAuthenticated} />
  );
  let footer = <Footer />;
  const theme = props.theme !== undefined ? props.theme : '';
  const bodyClass = theme !== '' ? `${theme}-body` : '';
  if (theme === 'world-quant') {
    header = <WorldQuantHeader />;
    footer = <WorldQuantFooter />;
  }
  if (theme === 'world-quant-sample') {
    header = <WorldQuantSampleHeader />;
    footer = <WorldQuantFooter />;
  }
  return (
    <div className={bodyClass}>
      {header}
      <Grid>{props.children}</Grid>
      {footer}
    </div>
  );
};

export default DefaultLayout;
