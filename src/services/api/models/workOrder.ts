

export interface WorkOrderProtoType {
  uuid: string;
  name: string;
  created_at: string;
  updated_at: string;
  description: string;
}

export interface JobOrderType {
  uuid: string;
  name: string;
  status: string;
  work_order: string;
  pipeline_module: string;
  analysis_result: string | null;
  created_at: string;
  updated_at: string;
  description: string;
}


export interface WorkOrderType {
    uuid: string;
    name: string;
    priority: number;
    sample: string;
    created_at: string;
    updated_at: string;
    job_order_objs: JobOrderType[];
    status: string;
    progress_summary: {[key: string]: number}
    description: string;
}