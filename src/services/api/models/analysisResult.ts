
import { SampleType } from "./sample";
import { SampleGroupType } from "./sampleGroup";


export interface AnalysisResultType {
  uuid: string;
  module_name: string;
  replicate: string;
  created_at: string;
  updated_at: string;
  sample?: string;
  sample_group?: string;
  sample_obj?: SampleType;
  sample_group_obj?: SampleGroupType;

}
