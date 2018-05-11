import * as React from 'react';

import { SampleGroupType } from '../../services/api/models/analysisGroup';

import AnalysisGroupListItem from './components/AnalysisGroupListItem';

import './analysisGroupList.css';

interface Prop {
    groups: Array<SampleGroupType>;
    organization: string;
}

class AnalysisGroupList extends React.Component<Prop, {}> {
  render() {
    return (
      <ul className="analysis-group-list">
        {
          this.props.groups.map((group) => {
            return (
              <AnalysisGroupListItem
                key={group.uuid}
                group={group}
                organization={this.props.organization}
              />
            );
          })
        }
      </ul>
    );
  }
}

export default AnalysisGroupList;
