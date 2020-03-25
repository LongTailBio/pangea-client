
import { SampleGroupType } from "./sampleGroup";


export interface SampleType {
  uuid: string;
  library: string;
  name: string;
  metadata: { [key: string]: any };
  created_at: string;
  updated_at: string;
  library_obj: SampleGroupType,
}
