

export interface SampleGroupType {
    uuid: string,
    name: string,
    organization_uuid: string,
    description: string,
    is_library: boolean,
    is_public: boolean,
    created_at: string,
    sample_uuids: Array<string>,
    sample_names: Array<string>,
    analysis_result_uuids: Array<string>,
    analysis_result_names: Array<string>,
}