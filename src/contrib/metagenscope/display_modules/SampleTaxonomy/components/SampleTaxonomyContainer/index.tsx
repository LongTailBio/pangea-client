import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

import { SampleTaxonomyType } from '../../../../services/api/models/queryResult';

import SunburstPlot, { SunburstProps } from '../../../plots/SunburstPlot';
import { SunburstDataType } from '../../../plots/SunburstPlot/util/sunburst';
import { SvgRefProps } from '../../../components/DisplayContainer/d3';

import SampleTaxonomyControls from './components/SampleTaxonomyControls';

const transformNode = function(node: SunburstDataType): SunburstDataType {
  node.name = node.name.displayFormat();
  node.children = node.children.map(child => transformNode(child));
  return node;
};

export interface SampleTaxonomyProps extends SvgRefProps {
  data: SampleTaxonomyType;
}

export interface SampleSimilarityState {
  activeTool: string;
}

export class SampleTaxonomyContainer extends React.Component<SampleTaxonomyProps, SampleSimilarityState> {
  constructor(props: SampleTaxonomyProps) {
    super(props);

    this.handleSourceChange = this.handleSourceChange.bind(this);

    this.state = {
      activeTool: Object.keys(this.props.data)[0],
    };
    console.log(Object.keys(this.props.data).filter(el => el[0] !== '_'))
    console.log(this.props.data)
  }

  handleSourceChange(newSource: string) {
    this.setState({
      activeTool: newSource,
    });
  }

  render() {
    const activeTool = this.state.activeTool;
    const data: SunburstProps = {
      data: transformNode(this.props.data[activeTool]),
      svgRef: this.props.svgRef,
    };

    return (
      <Row>
        <Col lg={9}>
          <SunburstPlot {...data} />
        </Col>
        <Col lg={3}>
          <SampleTaxonomyControls
            sources={Object.keys(this.props.data).filter(el => el[0] !== '_')}
            activeSource={activeTool}
            handleSourceChange={this.handleSourceChange}
          />
        </Col>
      </Row>
    );
  }
}
