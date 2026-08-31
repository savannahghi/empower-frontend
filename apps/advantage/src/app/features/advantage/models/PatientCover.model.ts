export interface PatientCoverModel {
    id: string;
    patient_name: string;
    workstation_id: string;
    department_id: string;
    branch_id: string;
    cluster_id: string;
    active: boolean;
    created: string;
    created_by: string;
    updated: string;
    updated_by: string;
    scheme_name: string;
    scheme_id: string;
    payer_id: string;
    member_number: string;
    valid_from: string;
    valid_to: string;
    is_principal: boolean;
    organisation: string;
    patient: string;
}
