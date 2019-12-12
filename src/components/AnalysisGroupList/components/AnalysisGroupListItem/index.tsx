import * as React from 'react';

import { default as axios, CancelTokenSource } from 'axios';
import { getSampleGroup } from '../../../../services/api';
import { SampleGroupType } from '../../../../services/api/models/sampleGroup';
import { Link } from 'react-router-dom';

interface Prop {
  groupUUID: string;
  organizationUUID: string;
}

class AnalysisGroupListItem extends React.Component<Prop, SampleGroupType> {

  protected sourceToken: CancelTokenSource;

  constructor(props: Prop) {
      super(props);
      this.sourceToken = axios.CancelToken.source();

      this.state = {
          uuid: '',
          name: '',
          organization_uuid: '',
          description: '',
          is_library: false,
          is_public: false,
          created_at: '',
          sample_uuids: [],
          sample_names: [],
          analysis_result_uuids: [],
          analysis_result_names: [],
      };
  }

  componentDidMount() {
      // TODO: not an efficient way to do this
      // Assume that we are authenticated because Dashboard catches that
      getSampleGroup(this.props.groupUUID, this.sourceToken)
          .then((sampleGroup) => {
              this.setState(sampleGroup);
          })
          .catch((error) => {
              if (!axios.isCancel(error)) {
                  console.log(error);
              }
          });
  }

  render() {
    return (
      <li className="analysis-group-list-item">
        <Link to={`/sample-groups/${this.props.groupUUID}`}>
          <h4>{this.state.name}</h4>
        </Link>
        <p>{this.state.description}</p>
      </li>
    );
  }
}

export default AnalysisGroupListItem;
