

export interface WorkOrderProtoType {
  uuid: string;
  name: string;
  created_at: string;
  updated_at: string;
  description: string;
}

export interface GroupWorkOrderProtoType {
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

export interface WorkOrderLinkType {
  name: string;
  uuid: string;
  sample_name: string;
  sample_uuid: string;
  status: string;
}

export interface GroupWorkOrderType {
    uuid: string;
    name: string;
    priority: number;
    sample_group: string;
    created_at: string;
    updated_at: string;
    work_order_links: WorkOrderLinkType[];
    status: string;
    progress_summary: {[key: string]: number}
    description: string;
}