import * as React from 'react';
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import { default as axios, CancelTokenSource } from 'axios';
import { getAnalysisResult } from '../../services/api';
import { AnalysisResultType } from '../../services/api/models/analysisResult';

interface AnalysisResultScreenProps {
  arUUID: string;
  isAuthenticated: boolean;
  updateTheme?(theme?: string): void;
}

class AnalysisResultScreen extends React.Component<AnalysisResultScreenProps, AnalysisResultType> {
    
    protected sourceToken: CancelTokenSource;

    constructor(props: AnalysisResultScreenProps) {
        super(props);
        this.sourceToken = axios.CancelToken.source();
        this.state = {
            uuid: '',
            parent_uuid: '',
            module_name: '',
            kind: '',
            status: '',
            created_at: '',
            fields: {},
            field_data: {},
        };
    }

    componentDidMount() {
        // Assume that we are authenticated because Dashboard catches that
        getAnalysisResult(this.props.arUUID, this.sourceToken)
            .then((ar) => {
                this.setState(ar);
            })
            .catch((error) => {
                if (!axios.isCancel(error)) {
                    console.log(error);
                }
            });
    }

    render() {
        let parent = 'samples';
        if (this.state.kind === "sample_group"){
            parent = 'sample-groups';
        }
        return (
            <div>
                <Row>
                    <h1>{this.state.module_name}</h1>
                    <h2>Analysis Result</h2>
                    <p>{this.state.created_at}</p>
                </Row>
                <Row>
                    <Link to={`/${parent}/${this.state.parent_uuid}`}>Parent</Link>
                </Row>
                <Row>
                    <h2>Fields</h2>
                    {
                        Object.keys(this.state.field_data).map((key) => {
                            // tslint:disable-next-line:no-console
                            console.log(key)
                            let value = this.state.field_data[key];
                            return ( <div><p>{key}</p> <p>{JSON.stringify(value)}</p></div> );
                        })
                    }
                </Row>               
            </div>
        );
    }                    

}

export default AnalysisResultScreen;