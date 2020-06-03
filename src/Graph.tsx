import React, { Component } from 'react';
import { Table } from '@jpmorganchase/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

/**
 * Props declaration for <Graph />
 */
interface IProps {
  data: ServerRespond[],
}

/**
 * Perspective library adds load to HTMLElement prototype.
 * This interface acts as a wrapper for Typescript compiler.
 */
interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

/**
 * React component that renders Perspective based on data
 * parsed from its parent through data property.
 */
class Graph extends Component<IProps, {}> {
  // Perspective table
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get element to attach the table from the DOM.
    // before:
    // const elem: PerspectiveViewerElement = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    // after: 
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.

      // Add more Perspective configurations here.

      ///////////////////////////////////////////////////////
      // loading the table in different aspects 
      elem.load(this.table);
      ///////////////////////////////////////////////////////
      // loads a graph in a continuous line, also view is known as a grid type
      elem.setAttribute('view', 'y_line');
      ///////////////////////////////////////////////////////
      // column-pivots is what allow us to distinguish stock ABC with DEF, the array -
      // - known as stock (["stock"]) is the corresponding value. In addition, the reason -
      // - why this works because the stock here is defined in the schema object
      elem.setAttribute('column-pivots', '["stock"]');
      ///////////////////////////////////////////////////////
      // row-pivots takes care of our x-axis. Thus allow us to map each datapoint based on the - 
      // - timestamp it has. Without this, the x-axis would be blank
      elem.setAttribute('row-pivots', '["timestamp"]');
      ///////////////////////////////////////////////////////
      // columns only focus on a particular part of the stock's data along the y-axis. Without this, the - 
      // - graph will plot different datapoints of the stocks (top_ask_price, top_bid_price, stock, timestamp) 
      // - but for this graph, we only care about top_ask_price
      elem.setAttribute('columns', '["top_ask_price"]');
      ///////////////////////////////////////////////////////
      // aggregates handle the duplicate data that we observed earlier and consolidate them as just one data point. 
      // In this case, we only want to consider a unique data point if it has unique stock name and timestamp.
      // Otherwise, if there are duplicates like what we had before, we will average out the top_bid_prices and the - 
      // - top_ask_prices of these 'similar' datapoints before treating them as one.
      elem.setAttribute('aggregates', 
      `{"stock": "distinct count",
        "top_ask_price": "avg",
        "top_bid_price": "avg",
        "timestamp": "distinct count"}`);
    }
  }

  componentDidUpdate() {
    // Everytime the data props is updated, insert the data into Perspective table
    if (this.table) {
      // As part of the task, you need to fix the way we update the data props to
      // avoid inserting duplicated entries into Perspective table again.
      this.table.update(this.props.data.map((el: any) => {
        // Format the data from ServerRespond to the schema
        return {
          stock: el.stock,
          top_ask_price: el.top_ask && el.top_ask.price || 0,
          top_bid_price: el.top_bid && el.top_bid.price || 0,
          timestamp: el.timestamp,
        };
      }));
    }
  }
}

export default Graph;
