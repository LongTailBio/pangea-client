
import { AnalysisResultType } from "./analysisResult";


export interface AnalysisResultFieldType<T> {
  uuid: string;
  name: string;
  stored_data: T;
  analysis_result: string;
  analysis_result_obj: AnalysisResultType;
}
