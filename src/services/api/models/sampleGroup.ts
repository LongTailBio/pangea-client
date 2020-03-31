import { OrganizationType } from './organization';

export interface SampleGroupType {
  uuid: string;
  organization: string;
  name: string;
  description: string;
  is_public: boolean;
  theme: string;
  created_at: string;
  updated_at: string;
  organization_obj: OrganizationType;
}
