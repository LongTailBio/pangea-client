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
  Tab,
  Tabs,
  Table,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import { SampleGroupType } from '../../../../services/api/models/sampleGroup';
import { usePangeaAxios, LinkList } from '../../../../services/api';
import { pangeaFetch } from '../../../../services/api/coreApi';
import { SampleType, SampleLinkType } from '../../../../services/api/models/sample';
import { AnalysisResultType } from '../../../../services/api/models/analysisResult';
import { useUserContext } from '../../../../components/UserContext'
import { HandleErrorLoading } from '../../../../components/ErrorLoadingHandler' 
import { EditableTextPanel } from '../../../../components/EditableText' 
import { downloadMetadataFromGroupCmds } from '../../../../components/Docs'
import MetaDataGrid, {MetadataValidationReport} from './components/MetaDataGrid'
import MetaDataSchema from './components/MetaDataSchema'


interface MetaDataPanelProps {
  group: SampleGroupType;
  samples: LinkList<SampleLinkType>;
  analysisResults: Array<AnalysisResultType>;
}


const useMetadataPanel = (uuid: string) => {

  const [moduleCountsResult] = usePangeaAxios<{[key: string]: number}>(
    `/sample_groups/${uuid}/module_counts`,
  );

  const [validateMetadataResult] = usePangeaAxios<MetadataValidationReport>(
    `/sample_groups/${uuid}/validate_metadata_schema`,
  );

  const data = {
    moduleCounts: moduleCountsResult.data,
    validation: validateMetadataResult.data,
  };
  const loading =
    moduleCountsResult.loading ||
    validateMetadataResult.loading;
  const error =
    moduleCountsResult.error ||
    validateMetadataResult.error ||
    undefined;
  return [{ data, loading, error }];
};

export const MetaDataPanel = (props: MetaDataPanelProps) => {
  const { authToken } = window.localStorage;
  const {user} = useUserContext();
  const group = props.group;
  const analysisResults = props.analysisResults;
  const [{data, loading, error }] = useMetadataPanel(group.uuid)
  if(error || loading){
    return (<HandleErrorLoading error={error} loading={loading}/>)
  }
  const {moduleCounts, validation} = data;

  const editSampleGroupMetadataSchema = (schema: string)=>  {
      const rdata = `{"sample_metadata_schema": ${schema}}` 
      return pangeaFetch(`/sample_groups/${props.group.uuid}`, 'PATCH', rdata)
        .then(response => response.json())
        .then(_ => window.location.reload(false))    
  }


  return (
    <>
      <Tabs id="user_settings_tabs">
        <Tab eventKey={1} title="Grid">
          <MetaDataGrid samples={props.samples} group={props.group} validation={validation} />
        </Tab>
        <Tab eventKey={2} title="Download">
          <Row>
            <ul key="get-manifest" className="analysis-group-list">
              <li className="analysis-group-list-item">
                <a
                  href={`/api/sample_groups/${group.uuid}/metadata?kind=csv&token=${authToken}`}
                >
                  Metadata - Download metadata for this group as a CSV
                </a>
              </li>
            </ul>
            {downloadMetadataFromGroupCmds(user, group)}
          </Row>        
        </Tab>
        <Tab eventKey={3} title="Module Counts">
          <Row>
            <br/>
            <a
              href={`/api/sample_groups/${group.uuid}/module_counts?format=json&token=${authToken}`}
            >
              Module Counts - the number of modules of each type
              attached to this group
            </a>
          </Row>
          <Row>
            <br/>
            <Table className="table-hover">
              <thead>
                <tr>
                  <th>Module Name</th>
                  <th>Sample Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(moduleCounts).map(key => {
                  return (
                    <tr>
                      <td>{key}</td>
                      <td>{moduleCounts[key]}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </Row>
        </Tab>
        <Tab eventKey={4} title="Schema">
          <MetaDataSchema group={group}/>
        </Tab>
      </Tabs>
    </>
  );
};

export default MetaDataPanel;
