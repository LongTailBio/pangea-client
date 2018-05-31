import * as React from 'react';

import { SampleGroupType } from '../../../../services/api/models/analysisGroup';
import { Link } from 'react-router-dom';

interface Prop {
  group: SampleGroupType;
  organization: string;
}

class AnalysisGroupListItem extends React.Component<Prop, {}> {
  render() {
    return (
      <li className="analysis-group-list-item">
        <Link to={`/sample-groups/${this.props.group.uuid}`}>
          <h4>{this.props.group.name}</h4>
        </Link>
      </li>
    );
  }
}

export default AnalysisGroupListItem;
