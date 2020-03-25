export interface AnalysisResultFieldType<T> {
  uuid: string;
  name: string;
  stored_data: T;
  analysis_result: string;
}
