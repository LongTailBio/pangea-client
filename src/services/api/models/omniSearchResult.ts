import { SampleType } from './sample';
import { OrganizationType } from './organization';
import { SampleGroupType } from './sampleGroup';


export interface TaxaResultType {
    canon_name: string;
    annotation: {[key: string]: any};
}

export interface OmniSearchResultType {
  search_term: string;
  sample_groups: Array<SampleGroupType>;
  samples: Array<SampleType>;
  organizations: Array<OrganizationType>;
  taxa: Array<TaxaResultType>;
}