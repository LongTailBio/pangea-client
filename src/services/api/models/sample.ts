
export interface SampleType {
  uuid: string,
  name: string,
  library_uuid: string,
  created_at: string,
  analysis_result_uuids: Array<string>,
  analysis_result_names: Array<string>,
  metadata: object,
}
