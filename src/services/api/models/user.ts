export interface UserType {
  id: string;
  email: string;
}


export interface OrgLink {
    uuid: string;
    name: string;
}

export interface GrpLink {
    uuid: string;
    name: string;
}


export interface PangeaUserType {
    id: string;
    uuid: string;
    email: string;
    is_staff: boolean;
    is_active: boolean;
    personal_org_uuid: string;
    organization_objs: Array<OrgLink>;
    saved_sample_group_objs: Array<GrpLink>;
    avatar: string;
    name: string;
    biography: string;
    url: string;
    twitter_username: string;
    github_username: string;
    company: string;
    location: string;
}