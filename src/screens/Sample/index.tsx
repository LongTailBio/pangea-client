import * as React from 'react';
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import { default as axios, CancelTokenSource } from 'axios';
import { getSample } from '../../services/api';
import { SampleType } from '../../services/api/models/sample';

interface SampleScreenProps {
  sampleUUID: string;
  isAuthenticated: boolean;
  updateTheme?(theme?: string): void;
}

class SampleScreen extends React.Component<SampleScreenProps, SampleType> {
    
    protected sourceToken: CancelTokenSource;

    constructor(props: SampleScreenProps) {
        super(props);
        this.sourceToken = axios.CancelToken.source();
        this.state = {
            uuid: '',
            name: '',
            library_uuid: '',
            created_at: '',
            analysis_result_uuids: [],
            analysis_result_names: [],
            metadata: {},
        };
    }

    componentDidMount() {
        // Assume that we are authenticated because Dashboard catches that
        getSample(this.props.sampleUUID, this.sourceToken)
            .then((sample) => {
                this.setState(sample);
            })
            .catch((error) => {
                if (!axios.isCancel(error)) {
                    console.log(error);
                }
            });
    }

    render() {
        return (
            <div>
                <Row>
                    <h1>{this.state.name}</h1>
                    <h2>Sample</h2>
                </Row>
                <Row>
                    <Link to={`/sample-groups/${this.state.library_uuid}`}>Library</Link>
                </Row>
                <Row>
                    <h2>Samples</h2>
                    {
                        this.state.analysis_result_uuids.map((ar_uuid, i) => {
                            return (
                                <Link to={`/analysis-results/${ar_uuid}`}>{this.state.analysis_result_names[i]}</Link>
                            );
                        })
                    }
                </Row>
            </div>
        );
    }                    

}

export default SampleScreen;
