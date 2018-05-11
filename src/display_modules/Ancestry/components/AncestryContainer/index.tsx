import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

import { AncestryType } from '../../../../services/api/models/queryResult';
import SunburstPlot from '../../../../display_modules/plots/SunburstPlot/';
import { SunburstDataType } from '../../../../display_modules/plots/SunburstPlot/util/sunburst';
import { SvgRefProps } from '../../../components/DisplayContainer/d3';

import AncestryMap from './components/AncestryMap';
import { getAncestry } from './components/AncestryMap/util';

const createAncestry = function(data: AncestryType) {
  type ReducerType = {[key: string]: number};

  const sampleName = Object.keys(data.samples)[0],
        trueData = data.samples[sampleName].populations,
        populationNames = Object.keys(trueData);

  const reducer = function(prev: ReducerType, populationName: string) {
    const value = trueData[populationName],
          regionId = getAncestry(populationName).ID,
          previousValue = prev[regionId] !== undefined ? prev[regionId] : 0;
    prev[regionId] = previousValue + value;
    return prev;
  };

  const regionValues = populationNames.reduce<ReducerType>(reducer, {});

  return regionValues;
};

const createSunburst = function(ancestry: {[key: string]: number}): SunburstDataType {
  type ReducerType = {[key: string]: SunburstDataType[]};

  const reducer = function(prev: ReducerType, regionId: string) {
    const value = ancestry[regionId],
          region = getAncestry(regionId),
          previousValue = prev[region.Category] !== undefined ? prev[region.Category] : [];
    previousValue.push({
      name: region.Name,
      parent: region.Category,
      color: region.Color,
      size: value * 100,
      children: [],
    });

    prev[region.Category] = previousValue;

    return prev;
  };

  const regionIds = Object.keys(ancestry),
        childrenMap = regionIds.reduce<ReducerType>(reducer, {}),
        categories = Object.keys(childrenMap);

  const rootChildren = categories.map(categoryName => {
    const node: SunburstDataType = {
      name: categoryName,
      parent: 'Human',
      size: 0,
      children: childrenMap[categoryName],
    };
    return node;
  });

  const root: SunburstDataType = {
    name: 'Human',
    parent: undefined,
    color: 'transparent',
    size: 0,
    children: rootChildren,
  };

  return root;
};

export interface AncestryProps {
  data: AncestryType;
}

const AlphaDivContainer: React.SFC<AncestryProps & SvgRefProps> = (props) => {
  const ancestry = createAncestry(props.data),
        sunburst = createSunburst(ancestry);

  return (
    <Row>
      <Col lg={4}>
        <SunburstPlot data={sunburst} svgRef={props.svgRef} />
      </Col>
      <Col lg={8}>
        <AncestryMap ancestry={ancestry} />
      </Col>
    </Row>
  );
};

export default AlphaDivContainer;
