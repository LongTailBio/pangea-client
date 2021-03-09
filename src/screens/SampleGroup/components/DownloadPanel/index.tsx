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
import { default as axios, CancelTokenSource } from 'axios';
import { SampleGroupType } from '../../../../services/api/models/sampleGroup';
import { SampleType } from '../../../../services/api/models/sample';
import { AnalysisResultType } from '../../../../services/api/models/analysisResult';
import { getModuleCounts, ModuleCountsType, usePangeaAxios } from '../../../../services/api'
import { downloadSampleARsFromGroupCmds } from '../../../../components/Docs'
import { useUserContext } from '../../../../components/UserContext' 



interface DownloadPanelProps {
  group: SampleGroupType;
  samples: Array<SampleType>;
  analysisResults: Array<AnalysisResultType>;
}

export const DownloadPanel = (props: DownloadPanelProps) => {
  const { authToken } = window.localStorage;
  const {user} = useUserContext(); 
  const group = props.group;
  const samples = props.samples;
  const analysisResults = props.analysisResults;
  let metadata_count = 0;
  samples.map(
    sample => (metadata_count += Object.keys(sample.metadata).length),
  );
  const sourceToken = axios.CancelToken.source();
  const [moduleCountsResult] = usePangeaAxios<ModuleCountsType>(`/sample_groups/${group.uuid}/module_counts?format=json`)
  const loading = moduleCountsResult.loading

  if(loading){
    return (<p>Loading...</p>)
  }
  const data: ModuleCountsType = moduleCountsResult.data

  return downloadSampleARsFromGroupCmds(user, group);
};


/*    <Row>
      <ul key="get-manifest" className="analysis-group-list">
      {
        Object.keys(data).filter(key => (key != 'n_samples')).map(key => (
          <li className="analysis-group-list-item">
            <a
              href={`/api/sample_groups/${group.uuid}/downloads/${key}?token=${authToken}`}
            >
              {key}
            </a>
          </li>
        ))
      }
      </ul>
    </Row>
*/
export default DownloadPanel;