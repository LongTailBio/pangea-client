# Writing Display Modules

Creating a front-end display module is a three-step process: describe the data, fetch the data, and render the data. The first two steps are very straightforward while the last step is a more complex and requires more of an understanding of how React works.

## Data Type Definitions

The source data typing must be declared using TypeScript. These definitions are found in `src/services/api/models/queryResults.ts` and describe the JSON returned by the server. Use the existing types as a guide and refer to TypeScript's documentation on [Basic Types](https://www.typescriptlang.org/docs/handbook/basic-types.html) and [Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html).

One important detail to note is the use of `QueryResultWrapper<T>`. This takes care of the status wrapper around the actual display result's data. You only need to worry about defining the display data itself.

## Fetching Data

API calls are all defined in `src/services/api/index.ts`. The API call method creates an Axios request and returns a `Promise` that executes that request and deserializing the result using the definition defined in the previous step.

## Rendering the Plot

React's component hierarchy favors a strong separation of concerns between components. The actual display of the data does not need to know about any of the network calls. The plot itself does not need to know about any controls associated with it.

Our component hierarchy will end up looing like this:

```xml
<DisplayModule>
    <StatusMonitor />
    <PlotContainer>
        <PlotControl /><!-- ex. categories -->
        <PlotControl /><!-- ex. tool source -->
        <Plot /><!-- ex. scatter plot -->
    </PlotContainer>
</DisplayModule>
```

or, if no controls are necessary, like this:

```xml
<DisplayModule>
    <StatusMonitor />
    <Plot />
</DisplayModule>
```

- `DisplayModule` - Fetches data and manages loading state
  - `StatusMonitor` - Displays UI for loading states
  - `PlotContainer` - Reduces network data and control state to create final data for plot
    - `PlotControl` - Control element for plot (e.g. category selection, source selection, etc.)
    - `Plot` - Actual rendering of data (HighCharts or D3.js)

### Fetching Data: `DisplayContainer`

This handles fetching the data and displaying loading and error states before finally passing the data off to the plot component.

You will need to override `fetchData(): Promise<QueryResultWrapper<T>>`. The body of this method will be the API call you defined in the previous step.

Because the header (title, description, toolbar) for each plot type should be visible while it loads you will need set the title and description of the module in the constructor:

```ts
constructor(props: { uuid: string }) {
  ...

  this.title = 'My Display Module';
  this.description = (
    <div>
      <p>Paragraph one.</p>
      <p>Paragraph two.</p>
    </div>
  );

  ...
}
```

We also need to handle the menu options (Save PNG, etc.) in this component. To that end `DisplayContainer` has two variants, `HighchartsDisplayContainer` and `D3DisplayContainer`, to handle the different image generation procedures. Each display component subclasses of one of these two and declares the data type expected and API call to use.

**D3**

For D3 plots you will need to pass down a `svgRef` function of the form: `svgRef={el => this.svgCanvas = el}`.

**HighCharts**

For HighCharts plots you will need to pass down a `chartRef` function of the form: `chartRef={el => this.chart = el}`.

### Transforming and Displaying Data: `PlotContainer`

Within the `DisplayContainer` we now handle the rendering of the data itself. Many plot types offer controls to compare different traits. In order to support that, we introduce another state-management container at this level. This container is responsible for collecting the values from the plot controls, using them to reduce the data set and massage it into the format the plot components expects, and finally passing that data to the plot component itself for rendering.

This layer will be either a stateful React component if controls are used, a Stateless Functional Component if data format massaging is necessary, or absent if the data from the API call can be passed directly to the plot component without controls or transformation.

See `src/components/SampleSimilarity/` for an example of a display module with controls for interacting with the graph.

#### HighCharts

HighCharts plot types will create an `Highcharts.Options` object and pass that to a `HighChartsPlot` component:

```tsx
import * as Highcharts from 'highcharts';
import HighChartsPlot from '../../../plots/HighChartsPlot';

...

render() {
  const chartOptions: Highcharts.Options = {
    ...
  };

  return(
    <HighChartsPlot
      chartId="unique-chart-id"
      options={chartOptions}
      chartRef={this.props.chartRef}
    />
  );
}
```

See `src/display_modules/HMP/components/HMPContainer` for an example of implementing a HighChart display module.

#### Custom D3

To use custom D3 code, you will want to define a React component that renders an svg element, passes a reference to that svg element to the custom D3 code, and then handles all its own updates:

```tsx
shouldComponentUpdate(nextProps: ScatterPlotProps) {
  this.renderScatter(nextProps, this.svgCanvas);

  return false;
}

render() {
  return (
    <div ref={(elem) => { this.rootDiv = elem; }}>
      <svg
        ref={(elem) => {
          this.svgCanvas = elem;
          this.props.svgRef(elem);
        }}
      />
    </div>
  );
}
```

See `src/display_modules/SampleSimilarity/` for an example of implementing a **display module** with custom D3 code.

See `src/display_modules/plots/ScatterPlot` for an example of implementing a **plot** with custom D3 code.
