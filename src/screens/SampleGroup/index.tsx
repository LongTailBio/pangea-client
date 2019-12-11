import * as React from 'react';
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import { default as axios, CancelTokenSource } from 'axios';
import { getSampleGroup } from '../../services/api';
import { SampleGroupType } from '../../services/api/models/sampleGroup';

interface SampleGroupScreenProps {
  groupUUID: string;
  isAuthenticated: boolean;
  updateTheme?(theme?: string): void;
}

class SampleGroupScreen extends React.Component<SampleGroupScreenProps, SampleGroupType> {

    protected sourceToken: CancelTokenSource;

    constructor(props: SampleGroupScreenProps) {
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
        let publicity = 'Public';
        if (! this.state.is_public){
            publicity = 'Private';
        }
        return (
            <div>
            <Row>
                <h1>{this.state.name}</h1>
                <h2>Sample Group</h2>
                <p>{publicity}</p>
            </Row>
            <Row>
                <Link to={`/organizations/${this.state.organization_uuid}`}>Owner Organization</Link>
            </Row>
            <Row>
                <h2>Samples</h2>
                {
                    this.state.sample_uuids.map((sample_uuid, i) => {
                        return (
                            <Link to={`/sample/${sample_uuid}`}>{this.state.sample_names[i]}</Link>
                        );
                    })
                }
            </Row>
            <Row>
                <h2>Analysis Results</h2>
                {
                    this.state.analysis_result_uuids.map((ar_uuid, i) => {
                        return (
                            <Link to={`/sample/${ar_uuid}`}>{this.state.analysis_result_names[i]}</Link>
                        );
                    })
                }
            </Row>
            </div>
        );
    }

}

export default SampleGroupScreen;
