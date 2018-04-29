import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource } from 'axios';

import { getSample, getAnalysisResults } from '../../../../services/api';
import { SampleType } from '../../../../services/api/models/sample';
import { AnalysisResultType } from '../../../../services/api/models/queryResult';
import { ModuleClassType, ModuleEntry } from '../../../SampleGroups/scenes/GroupDetail';

import AncestryModule from '../../../../display_modules/Ancestry';
import CARDModule from '../../../../display_modules/CARD';
import HMPModule from '../../../../display_modules/HMP';
import Humann2NormalizeModule from '../../../../display_modules/Humann2Normalize';
import MacrobesModule from '../../../../display_modules/Macrobes';
import MethylModule from '../../../../display_modules/Methyl';
import PathwaysModule from '../../../../display_modules/Pathways';
import VFDBModule from '../../../../display_modules/VFDB';
import { MicrobeDirectoryModule } from '../../../../display_modules/MicrobeDirectory';
import { ReadsClassifiedModule } from '../../../../display_modules/ReadsClassified';
import { SampleTaxonomyModule } from '../../../../display_modules/SampleTaxonomy';

const mapping: {[key: string]: ModuleClassType} = {
  card_amr_genes: CARDModule,
  functional_genes: Humann2NormalizeModule,
  hmp: HMPModule,
  macrobe_abundance: MacrobesModule,
  methyltransferases: MethylModule,
  microbe_directory: MicrobeDirectoryModule,
  pathways: PathwaysModule,
  putative_ancestry: AncestryModule,
  reads_classified: ReadsClassifiedModule,
  taxa_tree: SampleTaxonomyModule,
  virulence_factors: VFDBModule,
};

interface AnalysisGroupList {
  queryResult: AnalysisResultType;
}

const AnalysisGroupList: React.SFC<AnalysisGroupList> = (props) => {
  const modules: ModuleEntry[] = [];
  props.queryResult.result_types.forEach(moduleName => {
    const displayModule = mapping[moduleName];
    if (displayModule !== undefined) {
      modules.push({
        name: moduleName,
        ModuleClass: displayModule,
      });
    }
  });
  return (
    <div>
      {modules.map(Entry => {
        return (
          <Entry.ModuleClass
            key={Entry.name}
            uuid={props.queryResult.uuid}
            isSingleton={true}
          />
        );
      })}
    </div>
  );
};

interface AnalysisGroupDetailProps {
  sampleUuid: string;
  updateTheme?(theme?: string): void;
}

interface AnalysisGroupDetailState {
  sample?: SampleType;
  analysisResults?: AnalysisResultType;
  error?: string;
}

class AnalysisGroupDetail extends React.Component<AnalysisGroupDetailProps, AnalysisGroupDetailState> {

  protected sourceToken: CancelTokenSource;

  constructor(props: AnalysisGroupDetailProps) {
    super(props);

    this.sourceToken = axios.CancelToken.source();
    this.state = {
      sample: undefined,
      analysisResults: undefined,
      error: undefined,
    };
  }

  componentDidMount() {
    getSample(this.props.sampleUuid, this.sourceToken)
      .then((sample) => {
        this.setState({ sample });
        if (this.props.updateTheme !== undefined) {
          this.props.updateTheme(sample.theme);
        }
        return sample;
      })
      .then((group) => {
        return getAnalysisResults(group.analysisResultUuid, this.sourceToken);
      })
      .then((analysisResults) => {
        this.setState({ analysisResults });
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          this.setState({ error });
        }
      });
  }

  componentWillUnmount() {
    this.sourceToken.cancel();

    if (this.props.updateTheme !== undefined) {
      this.props.updateTheme(undefined);
    }
  }

  render() {
    return (
      <div>
        {this.state.sample &&
          <div>
            <Helmet>
              <title>MetaGenScope :: {this.state.sample.name}</title>
            </Helmet>
            <Row>
              <Col lg={12}>
                <h1>{this.state.sample.name}</h1>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col lg={12}>
                {this.state.analysisResults &&
                  <AnalysisGroupList queryResult={this.state.analysisResults} />
                }
                {!this.state.analysisResults &&
                  <h3>Loading...</h3>
                }
              </Col>
            </Row>
          </div>
        }
        {this.state.error &&
          <h1>Error: {this.state.error}</h1>
        }
        {!this.state.sample && !this.state.error &&
          <h1>Loading...</h1>
        }
      </div>
    );
  }
}

export default AnalysisGroupDetail;
