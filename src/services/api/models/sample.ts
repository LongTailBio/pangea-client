export interface SampleType<M> {
  uuid: string;
  library: string;
  name: string;
  metadata: M;
  created_at: string;
  updated_at: string;
}
