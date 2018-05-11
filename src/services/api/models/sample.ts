export interface SampleType {
  uuid: string;
  name: string;
  analysisResultUuid: string;
  metadata: any;  // tslint:disable-line no-any
  theme?: string;
}
