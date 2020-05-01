import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { default as axios, CancelTokenSource } from 'axios';

import { QueryResultWrapper, QueryResultStatus } from '../../../services/api/models/queryResult';

import { DisplayModuleState, StatusMonitor } from './components/StatusMonitor';
import { PlotHeader } from './components/PlotHeader';
import { getGroupAnalysisResult, getSampleAnalysisResult } from '../../../services/api';

export interface DisplayContainerProps {
  orgID: string;
  groupID: string;
  sampleID?: string; 
}

interface WrapperState<D> {
  status: DisplayModuleState;
  data?: D;
}

/**
 * Base class for managing state and rendering a front-end display module.
 *
 * Polling strategy based on https://github.com/cameronbourke/react-async-poll
 */
export class DisplayContainer<D, P = {}> extends React.Component<DisplayContainerProps & P, WrapperState<D>> {

  protected title: string | undefined;
  protected description: React.ReactNode;

  // Polling interval (ms)
  protected sourceToken: CancelTokenSource;
  protected intervalDuration: number;
  protected interval?: number;
  protected keepPolling: boolean;
  protected moduleName: string;
  protected fieldName: string;

  /**
   * Create a Result plot.
   * @param props - The component props.
   */
  constructor(props: DisplayContainerProps & P) {
    super(props);

    this.sourceToken = axios.CancelToken.source();
    this.state = {
      status: DisplayModuleState.Loading,
      data: undefined,
    };
    this.moduleName = '';
    this.fieldName = '';
    // Default to 20 seconds
    this.intervalDuration = 20 * 1000;
    this.interval = undefined;
    this.keepPolling = false;

    this.saveSvg = this.saveSvg.bind(this);
    this.startPolling = this.startPolling.bind(this);
    this.stopPolling = this.stopPolling.bind(this);
  }

  /** @inheritdoc */
  componentDidMount() {
    this.startPolling();
  }

  /** @inheritdoc */
  componentWillUnmount() {
    this.sourceToken.cancel();
    this.stopPolling();
  }

  /** Generate a .png file from a display module's SVG element. */
  saveSvg() {
    throw new Error('Subclass should override!');
  }

  /** Fetch the data required to render this display module. */
  fetchData(sourceToken: CancelTokenSource): Promise<QueryResultWrapper<D>> {
    if (this.props?.sampleID){
      const sampleID = this.props.sampleID as unknown as string;
      const out = getSampleAnalysisResult<D>(
        this.props.orgID,
        this.props.groupID,
        sampleID,
        this.moduleName,
        this.fieldName,
        sourceToken
      );
      return out
    }
    const out = getGroupAnalysisResult<D>(
      this.props.orgID,
      this.props.groupID,
      this.moduleName,
      this.fieldName,
      sourceToken
    );
    return out   
  }

  /**
   * Create PlotContainer element based on successfully fetched data.
   * @param data - Successfully fetched data for this display container.
   */
  plotContainer(data: D): JSX.Element {
    throw new Error('Subclass should override!');
  }

  /** Begin polling the server for display module results. */
  startPolling () {
    if (this.interval) {
      return;
    }
    this.keepPolling = true;
    this.asyncInterval(this.intervalDuration, () => {
      return this.fetchData(this.sourceToken)
        .then((result) => {
          this.updateStatusForQueryResultStatus(result.status);
          if (result) {
            try {
              this.setState({data: result as unknown as D});
            } catch (error) {
              this.setState({ status: DisplayModuleState.Error });
            }
            this.stopPolling();
          }
        }).catch((error) => {
          if (!axios.isCancel(error)) {
            this.setState({ status: DisplayModuleState.Error });
          }
          this.stopPolling();
        });
    });
  }

  /** Stop polling the server for display module results. */
  stopPolling () {
    this.keepPolling = false;
    if (this.interval) {
      clearTimeout(this.interval);
    }
  }

  /**
   * Kick off polling of result module data.
   * @param intervalDuration - Interval duration between poll requests.
   */
  asyncInterval(intervalDuration: number, fn: () => Promise<void>) {
    const promise = fn();

    const asyncTimeoutBody = () => {
      this.asyncInterval(intervalDuration, fn);
    };
    // Use window explicitly here to prevent NodeJS's setTimeout being used
    const asyncTimeout = () => window.setTimeout(asyncTimeoutBody, intervalDuration);

    const assignNextInterval = () => {
      if (!this.keepPolling) {
        this.stopPolling();
        return;
      }
      this.interval = asyncTimeout();
    };

    // Continue polling, even on error, until this.stopPolling is called
    Promise.resolve(promise)
      .then(assignNextInterval)
      .catch(assignNextInterval);
  }

  /**
   * Convert the server's result status to local state.
   * @param queryStatus - Result status returned by the server.
   */
  updateStatusForQueryResultStatus(queryStatus: QueryResultStatus) {
    switch (queryStatus) {
      case QueryResultStatus.Pending:
        this.setState({ status: DisplayModuleState.Pending });
        break;
      case QueryResultStatus.Working:
        this.setState({ status: DisplayModuleState.Working });
        break;
      case QueryResultStatus.Success:
        this.setState({ status: DisplayModuleState.Success });
        break;
      case QueryResultStatus.Error:
        this.setState({ status: DisplayModuleState.Error });
        break;

      default:
        // no-op; enumeration is exhaustive
        break;
    }
  }

  render() {
    return (
      <div>
        <Row>
          <Col lg={12}>
            <PlotHeader
              title={this.title}
              description={this.description}
              downloadPng={this.saveSvg}
              downloadCsv={() => {}}    // tslint:disable-line:no-empty
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            {this.state.data &&
              this.plotContainer(this.state.data)
            }
            {!this.state.data &&
              <StatusMonitor state={this.state.status} />
            }
          </Col>
        </Row>
      </div>
    );
  }
}
