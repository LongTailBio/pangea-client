import { SunburstDataType } from '../../../display_modules/plots/SunburstPlot/util/sunburst';

export enum QueryResultStatus {
  Error = 'E',
  Pending = 'P',
  Working = 'W',
  Success = 'S',
}

export interface TaxonAbundanceResultType {
  by_tool: {
    [key: string]: {
      nodes: {
        id: string;
        name: string;
        value: number;
      }[];
      edges: {
        source: string;
        target: string;
        value: number;
      }[];
    };
  };
}

export interface SampleSimilarityResultType {
  categories: {
    [key: string]: string[];
  };
  tools: {
    [key: string]: {
      x_label: string;
      y_label: string;
    };
  };
  data_records: {
    // tslint:disable-next-line no-any
    [index: string]: any;
  }[];
}

export interface HMPResultType {
  categories: {
    [key: string]: string[];
  };
  sites: string[];
  data: {
    [key: string]: {
      name: string;
      data: number[][];
    }[];
  };
}

export interface AGSResultType {
  categories: {
    [key: string]: string[];
  };
  distributions: {
    [key: string]: {
      [key: string]: {
        min_val: number;
        q1_val: number;
        mean_val: number;
        q3_val: number;
        max_val: number;
      };
    }[];
  };
}

export interface AlphaDivResultType {
  tool_names: string[];
  categories: {
    [key: string]: string[];
  };
  by_tool: {
    [key: string]: {
      taxa_ranks: string[];
      by_taxa_rank: {
        [key: string]: {
          by_category_name: {
            [key: string]: {
              metrics: string[];
              category_value: string;
              by_metric: {
                [key: string]: number[];
              };
            }[];
          };
        };
      };
    };
  };
}

export interface ReadsClassifiedType {
  samples: {
    [key: string]: {
      viral: number;
      archaeal: number;
      bacterial: number;
      host: number;
      unknown: number;
      nonhost_macrobial: number;
      nonfungal_eukaryotic: number;
      fungal: number;
    };
  };
}

export interface BetaDiversityEntryType {
  // SampleID
  [key: string]: {
    // SampleID
    [key: string]: number;
  };
}

export interface BetaDiversityType {
  data: {
    // Rank name
    [key: string]: {
      // Metric name
      [key: string]: {
        // Tool name
        [key: string]: BetaDiversityEntryType;
      };
    };
  };
}

export interface SampleTaxonomyType {
  [key: string]: SunburstDataType;
}

export interface ReadStatsResultType {
  samples: {
    [key: string]: {
      gc_content: number,
      num_reads: number,
      codons: {[key: string]: number},
      tetramers: {[key: string]: number},
    };
  };
}

export interface GenericGeneType {
  samples: {
    // Sample name
    [key: string]: {
      // Metric
      [key: string]: {
        // Gene
        [key: string]: number;
      };
    };
  };
}

export interface PathwaysType {
  samples: {
    [key: string]: {
      pathway_abundances: {[key: string]: number};
      pathway_coverages: {[key: string]: number};
    };
  };
}

export interface MacrobesType {
  samples: {
    [key: string]: {
      [key: string]: number;
    };
  };
}

export interface XYZPoint {
  xval: number;
  yval: number;
  zval: number;
  name: string;
}

export interface VolcanoType {
  categories: {
    [key: string]: string[];
  };
  tools: {
    // tool name
    [key: string]: {
      tool_categories: {
        // category
        [key: string]: {
          // category value
          [key: string]: {
            pval_histogram: XYZPoint[],
            scatter_plot: XYZPoint[],
          }
        }
      }
    }
  };
}

export interface AncestryType {
  samples: {
    [key: string]: {
      populations: {
        [key: string]: number
      };
    };
  };
}

export interface MicrobeDirectoryType {
  samples: {
    // Sample name
    [key: string]: {
      // Property name
      [key: string]: {
        // Proerty Value
        [key: string]: number;
      };
    };
  };
}

export interface MultiAxisType {
  categories: {
    // Category name: category values
    [key: string]: string[];
  };
  axes: {
    // Axis name
    [key: string]: {
      vals: {
        // Sample name: axis value
        [key: string]: number;
      };
    };
  };
  metadata: {
    // Sample name
    [key: string]: {
      // Category: category value
      [key: string]: string;
    };
  };
}

export interface QueryResultWrapper<T> {
  status: QueryResultStatus;
  data?: T;
}

export interface AnalysisResultType {
  uuid: string;
  result_types: string[];
}
