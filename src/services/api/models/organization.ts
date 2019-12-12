import { UserType } from './user';
import { SampleGroupType } from './analysisGroup';

export interface OrganizationType {
  uuid: string;
  name: string;
  is_public: boolean,
  is_deleted: boolean,
  created_at: string,
  primary_admin_uuid: string,
  sample_group_uuids: Array<string>,
  user_uuids: Array<string>,
  user_usernames: Array<string>,
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
