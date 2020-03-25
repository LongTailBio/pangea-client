import * as React from 'react';

import AnalysisGroupListItem from './components/AnalysisGroupListItem';

import './analysisGroupList.css';

interface Prop {
  groupUUIDs: Array<string>;
}

export const AnalysisGroupList = (props: Prop) => {
  return (
    <ul className="analysis-group-list">
      {props.groupUUIDs.map(groupUUID => (
        <AnalysisGroupListItem key={groupUUID} groupUUID={groupUUID} />
      ))}
    </ul>
  );
};

export default AnalysisGroupList;
