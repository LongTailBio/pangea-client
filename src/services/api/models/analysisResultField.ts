import { AnalysisResultType } from './analysisResult';

export interface AnalysisResultFieldType {
  uuid: string;
  name: string;
  stored_data: any;
  analysis_result: string;
  analysis_result_obj: AnalysisResultType;
}
