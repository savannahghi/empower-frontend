export interface CreatePatientCoverModel {
    scheme_name: string;
    scheme_id: string;
    member_number: string;
    patient: string;
    payer_id: string;
    valid_from: null | string;
    valid_to: null | string;
}
