export interface AnalysisResultType {
    uuid: string,
    parent_uuid: string,
    module_name: string,
    replicate: string,
    kind: string,
    status: string,
    created_at: string,
    fields: {
        [index: string]: any,
    },
    field_data: {
        [index: string]: any,
    },
}
