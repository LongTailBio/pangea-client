import { UserType } from './user';
import { SampleGroupType } from './analysisGroup';

export interface OrganizationType {
  uuid: string;
  name: string;
  adminEmail: string;
  users: Array<UserType>;
  sampleGroups: Array<SampleGroupType>;
}
export interface JsonOrganizationType {
  uuid: string;
  name: string;
  admin_email: string;
  users: {
    users: Array<UserType>;
  };
  sample_groups: {
    sample_groups: Array<SampleGroupType>;
  };
}
