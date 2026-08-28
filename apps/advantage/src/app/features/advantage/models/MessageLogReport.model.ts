export interface MessageLogReportModel {
    id: string;
    created_by_name: string | null;
    updated_by_name: string | null;
    file_name: string;
    report_file_url: string;
    workstation_id: string;
    department_id: string;
    branch_id: string;
    cluster_id: string;
    active: boolean;
    created: string;
    created_by: string;
    updated: string;
    updated_by: string;
    process_state: 'PENDING' | 'COMPLETE' | 'FAILED';
    failure_reason: string | null;
    organisation: string;
    report_file: string;
}
