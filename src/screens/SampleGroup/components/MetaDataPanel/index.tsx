import * as React from 'react';
import { Switch, Route } from 'react-router';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Row,
  Col,
  Well,
  Nav,
  NavItem,
  Glyphicon,
  Badge,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import { SampleGroupType } from '../../../../services/api/models/sampleGroup';
import { SampleType } from '../../../../services/api/models/sample';
import { AnalysisResultType } from '../../../../services/api/models/analysisResult';
import { useUserContext } from '../../../../components/UserContext' 
import { downloadMetadataFromGroupCmds } from '../../../../components/Docs'

interface MetaDataPanelProps {
  group: SampleGroupType;
  samples: Array<SampleType>;
  analysisResults: Array<AnalysisResultType>;
}

export const MetaDataPanel = (props: MetaDataPanelProps) => {
  const { authToken } = window.localStorage;
  const {user} = useUserContext(); 
  const group = props.group;
  const samples = props.samples;
  const analysisResults = props.analysisResults;
  let metadata_count = 0;
  samples.map(
    sample => (metadata_count += Object.keys(sample.metadata).length),
  );
  return (
    <Row>
      <ul key="get-manifest" className="analysis-group-list">
        <li className="analysis-group-list-item">
        <li className="analysis-group-list-item">
          <a
            href={`/api/sample_groups/${group.uuid}/metadata?kind=csv&token=${authToken}`}
          >
            Metadata - Download metadata for this group as a CSV
          </a>
        </li>
          <a
            href={`/api/sample_groups/${group.uuid}/module_counts?format=json&token=${authToken}`}
          >
            Module Counts - the number of modules of each type
            attached to this group
          </a>
        </li>
      </ul>
      {downloadMetadataFromGroupCmds(user, group)}
    </Row>
  );
};

export default MetaDataPanel;
