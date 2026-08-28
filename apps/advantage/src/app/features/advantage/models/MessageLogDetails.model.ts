export interface SenderModel {
    id: string;
    created_by_name: string | null;
    updated_by_name: string | null;
    disabled: {
        status: boolean;
        reason: string | null;
    };
    active: boolean;
    name: string;
    sender_type: string;
    start_date: string;
    end_date: string;
    available_from: string | null;
    available_to: string | null;
}

export interface MessageLogDetailsModel {
    id: string;
    created_by_name: string | null;
    updated_by_name: string | null;
    sender: SenderModel;
    workstation_id: string | null;
    department_id: string | null;
    branch_id: string;
    cluster_id: string | null;
    active: boolean;
    created: string;
    created_by: string;
    updated: string;
    updated_by: string;
    message: string;
    recipients: Array<string>;
    intention: string;
    state: string;
    sil_comms_sms_id: string;
    failure_reason: string | null;
    delivery_type: 'INBOUND' | 'OUTBOUND';
    organisation: string;
    from_field: string;
    to_field: string;
}
