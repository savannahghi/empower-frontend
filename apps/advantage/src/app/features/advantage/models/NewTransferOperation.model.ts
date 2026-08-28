export interface NewTransferOperationModel {
    org_id: string;
    active: true;
    name: string;
    operation_type: string; // ID of pre-existing operation type
    document_type: string;
    source_organisation_unit: string;
    product: string;
}
