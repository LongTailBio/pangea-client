export interface UserType {
    uuid: string,
    username: string,
    email: string,
    is_deleted: boolean,
    created_at: string,
    organization_uuids: string[],
    organization_names: string[],
}
