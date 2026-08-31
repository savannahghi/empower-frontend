export interface NewInventoryTransferModel {
    org_id: string;
    active: boolean;
    name: string;
    operation_type: 'internal'; // Transfers are done within an organisation
    is_system_operation: boolean;
    organisation: string;
    source_location: string;
    destination_location: string;
}
