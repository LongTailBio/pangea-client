import { PipelineType } from './pipeline';

export interface PipelineModuleType {
    uuid: string;
    created_at: string;
    updated_at: string;
    name: string;
    version: string;
    metadata: any;
    description: string;
    long_description: string;
    pipeline: string;
    pipeline_obj: PipelineType;
    dependencies: Array<string>;
    dependency_modules: Array<[string, string, string]>;
    downstream_modules: Array<[string, string, string]>;
}