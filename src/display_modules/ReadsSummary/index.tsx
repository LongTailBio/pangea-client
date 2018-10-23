import * as React from 'react';
import { Table } from 'react-bootstrap';
import { CancelTokenSource } from 'axios';

import HighchartsDisplayContainer from '../components/DisplayContainer/highcharts';
import { DisplayContainerProps } from '../components/DisplayContainer';
import {
  ReadStatsResultType,
  ReadsClassifiedType,
  QueryResultWrapper,
  QueryResultStatus,
} from '../../services/api/models/queryResult';
import { getAnalysisResult } from '../../services/api';

interface ReadsSummaryType {
  classified: ReadsClassifiedType;
  stats: ReadStatsResultType;
}

export class ReadsSummaryModule extends HighchartsDisplayContainer<ReadsSummaryType> {

  constructor(props: DisplayContainerProps) {
    super(props);

    this.title = 'Reads Summary';
    this.description = (
      <p>This chart shows various statistsics {' '}
        about the reads in each sample.</p>
    );
  }

  /** @inheritdoc */
  fetchData(sourceToken: CancelTokenSource) {
    const stats = getAnalysisResult<ReadStatsResultType>(this.props.uuid, 'read_stats', sourceToken);
    const classified = getAnalysisResult<ReadsClassifiedType>(this.props.uuid, 'reads_classified', sourceToken);
    return Promise.all([stats, classified])
      .then(results => {
        const statsResult = results[0], classifiedResult = results[1];
        if (statsResult.status === QueryResultStatus.Success && statsResult.data
          && classifiedResult.status === QueryResultStatus.Success && classifiedResult.data) {
          const result: QueryResultWrapper<ReadsSummaryType> = {
            status: QueryResultStatus.Success,
            data: {
              classified: classifiedResult.data,
              stats: statsResult.data,
            },
          };
          return result;
        }
        return {status: QueryResultStatus.Error};
      });
  }

  /** @inheritdoc */
  plotContainer(data: ReadsSummaryType): JSX.Element {
    const formatPercentage = (percentage: number) => `${(percentage * 100).toFixed(3)}%`;
    const classified = data.classified.samples[Object.keys(data.classified.samples)[0]];
    const { gc_content, num_reads } = data.stats.samples[Object.keys(data.stats.samples)[0]];
    const table = [
      { name: 'Archaeal', value: formatPercentage(classified.archaeal) },
      { name: 'Bacterial', value: formatPercentage(classified.bacterial) },
      { name: 'Fungal', value: formatPercentage(classified.fungal) },
      { name: 'Host', value: formatPercentage(classified.host) },
      { name: 'Non-fungal Eukaryotic', value: formatPercentage(classified.nonfungal_eukaryotic) },
      { name: 'Non-host Macrobial', value: formatPercentage(classified.nonhost_macrobial) },
      { name: 'Unknown', value: formatPercentage(classified.unknown) },
      { name: 'Viral', value: formatPercentage(classified.viral) },
      { name: 'GC Content', value: gc_content},
      { name: 'Number of Reads', value: num_reads},
    ];
    return (
      <Table striped={true} bordered={true}>
        <tbody>
          {table.map(row => {
            return (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.value}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}
