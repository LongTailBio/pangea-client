import * as React from 'react';
import {
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
} from 'react-bootstrap';

import { pangeaFetch } from '../../../../../../../services/api/coreApi';
import { SampleGroupType } from '../../../../../../../services/api/models/sampleGroup';



interface SampleGroupPublicProps {
  grp: SampleGroupType;
}

export class SampleGroupPublicPanel extends React.Component<SampleGroupPublicProps, {}> {

  constructor(props: SampleGroupPublicProps) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = () => {
    const postData = {
      is_public: !this.props.grp.is_public,
    }
    pangeaFetch(`/sample_groups/${this.props.grp.uuid}`, 'PATCH', JSON.stringify(postData))
        .then(response => response.json())
        .then(data => window.location.reload(false))    
  }

  render(){
    const text = this.props.grp.is_public ? 'Make Private' : 'Make Public'
    const cssClassName = this.props.grp.is_public ? "btn btn-success btn-lg btn-block" : "btn btn-danger btn-lg btn-block"
    const title = this.props.grp.is_public ? 'Private' : 'Public'
    return (
      <>
        <h3>Make this Sample Group {title} </h3>
        <input
          type="button"
          className={cssClassName}
          value={text}
          onClick={this.handleSubmit}
        />
      </>
    )
  }

};
export default SampleGroupPublicPanel;
