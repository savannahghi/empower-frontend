import type { MappingModel } from './Mapping.model';

export interface PatientUploadDetailsModel {
    id: string;
    file_name: string;
    upload_file_url: string;
    failed_upload_file_url: string;
    uploaded_by: string;
    workstation_id: string;
    department_id: string;
    branch_id: string;
    cluster_id: string;
    active: boolean;
    created: string;
    created_by: string;
    updated: string;
    updated_by: string;
    mapping: MappingModel;
    success_count: number;
    fail_count: number;
    process_state: string;
    upload_type: string;
    organisation: string;
    upload_file: string;
    failed_uploads_file: string;
}
