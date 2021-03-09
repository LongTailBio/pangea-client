import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { Row, Col, Well, Button } from 'react-bootstrap';

import { PipelineModuleType } from '../../../../services/api/models/pipelineModule';
import AnalysisGroupList from '../../../../components/AnalysisGroupList';

interface PipelineModulesProps {
  modules: PipelineModuleType[];
}
interface PipelineModulesState {
  filter: string;
}


export class PipelineModules extends React.Component<PipelineModulesProps, PipelineModulesState> {

  constructor(props: PipelineModulesProps) {
    super(props);
    this.state = {
      filter: '',
    }
    this.handleFilterChange = this.handleFilterChange.bind(this)
  }

  handleFilterChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      filter: event.currentTarget.value,
    });
  };

  render() {
    const modules = this.props.modules.filter(
        module =>
          module.name.toLowerCase().indexOf(this.state.filter.toLowerCase()) > -1 ||
          module.version.toLowerCase().indexOf(this.state.filter.toLowerCase()) > -1
      );

    return (
      <Row>
        <Col lg={8}>
            <Row>
              <form>
                <input
                  name="filter"
                  className="form-control input-lg"
                  type="text"
                  placeholder="Filter modules by name"
                  required={true}
                  value={this.state.filter}
                  onChange={this.handleFilterChange}
                />
              </form>
            </Row>
          {modules.length > 0 && (
            <AnalysisGroupList groupUUIDs={modules.map(g => g.uuid)} />
          )}
          {modules.length > 0 &&
            modules.map(mymodule => (
              <ul key={mymodule.uuid} className="analysis-group-list">
                <li className="analysis-group-list-item">
                  <Link to={`/pipeline-modules/${mymodule.uuid}`}>
                    {mymodule.name} {" "} {mymodule.version}
                  </Link>
                </li>
              </ul>
            ))}          
          {(modules.length === 0 && this.state.filter === '') && (
            <Well className="text-center">
              <h4>This pipeline has no modules.</h4>
            </Well>
          )}
          {(modules.length === 0 && this.state.filter !== '') && (
            <Well className="text-center">
              <h4>This pipeline has no modules that match the specified filter.</h4>
            </Well>
          )}
        </Col>
      </Row>
    );
  }

}

export default PipelineModules;