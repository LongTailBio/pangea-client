declare module 'react-highcharts' {
  import * as React from 'react';
  import * as Highcharts from 'highcharts';

  export interface ReactHighchartsProps {
    config: Highcharts.Options;
    isPureConfig?: boolean;
    neverReflow?: boolean;
    callback?: (chart: Highcharts.Chart) => void;
    domProps?: object;
  }

  class ReactHighcharts extends React.Component<ReactHighchartsProps, any> {}

  export default ReactHighcharts;

  export class RedrawOnPrint extends React.Component {}
}
