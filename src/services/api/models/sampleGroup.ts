import { OrganizationType } from './organization';

export interface SampleGroupType {
  uuid: string;
  organization: string;
  name: string;
  description: string;
  long_description: string;
  is_public: boolean;
  is_library: boolean;
  theme: string;
  created_at: string;
  updated_at: string;
  organization_obj: OrganizationType;
  sample_metadata_schema: any;
}
