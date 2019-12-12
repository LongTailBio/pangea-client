import * as React from 'react';

// import { SampleGroupType } from '../../services/api/models/analysisGroup';

import AnalysisGroupListItem from './components/AnalysisGroupListItem';

import './analysisGroupList.css';

interface Prop {
    groupUUIDs: Array<string>;
    organizationUUID: string;
}

class AnalysisGroupList extends React.Component<Prop, {}> {
  render() {
    return (
      <ul className="analysis-group-list">
        {
          this.props.groupUUIDs.map((groupUUID) => {
            return (
              <AnalysisGroupListItem
                groupUUID={groupUUID}
                organizationUUID={this.props.organizationUUID}
              />
            );
          })
        }
      </ul>
    );
  }
}

export default AnalysisGroupList;
