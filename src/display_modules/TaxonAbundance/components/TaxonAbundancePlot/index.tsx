import * as React from 'react';

import { createTaxonAbundance } from './util/taxon';
import { SvgRefProps } from '../../../components/DisplayContainer/d3';
import { TaxonAbundanceResultType } from '../../../../services/api/models/queryResult';

import './style.css';

export interface TaxonAbundancePlotProps extends SvgRefProps {
  data: TaxonAbundanceResultType;
}

export default class TaxonAbundancePlot extends React.Component<TaxonAbundancePlotProps, {}> {
  private rootDiv: HTMLDivElement | null;
  private scatterSVG: SVGSVGElement | null;

  componentDidMount() {
    this.renderScatter(this.props);
  }

  shouldComponentUpdate(nextProps: TaxonAbundancePlotProps) {
    // TODO: Animate this change
    this.renderScatter(nextProps);

    return false;
  }

  renderScatter(props: TaxonAbundancePlotProps) {
    if (this.rootDiv !== null && this.scatterSVG !== null) {
      const firstTool = Object.keys(props.data.by_tool)[0];
      const data = props.data.by_tool[firstTool];
      createTaxonAbundance(this.rootDiv, this.scatterSVG, data);
    }
  }

  render() {
    return (
      <div ref={(elem) => { this.rootDiv = elem; }}>
        <svg
          ref={(elem) => {
            this.scatterSVG = elem;
            this.props.svgRef(elem);
          }}
        />
      </div>
    );
  }
}
