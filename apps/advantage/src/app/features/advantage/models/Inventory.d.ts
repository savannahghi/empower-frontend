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

export interface NewTransferOperationModel {
    org_id: string;
    active: true;
    name: string;
    operation_type: string; // ID of pre-existing operation type
    document_type: string;
    source_organisation_unit: string;
    product: string;
}

export interface InventoryOpsDetailsModel {
    id: string;
    inventory_operation: {
        id: string;
        made_by: string | null;
        updated_by_name: string | null;
        parent_document_number: string | null;
        document_latest_comment: string | null;
        active_pricelist: string | null;
        department: string;
        operation_type_name: string;
        operation_type_description: string;
        inventory_delivery_status: boolean;
        source_location_name: string;
        destination_location_name: string;
        active: boolean;
        document_number: string;
        workflow_state: string;
        source_document: string | null;
        reference_number: string | null;
        document_count: number;
        name: string;
        description: string | null;
        document_type: string;
        sent_to_etims: boolean;
        is_import: boolean;
        source_organisation_unit: string;
        financial_year: string;
        parent_document: string | null;
        operation_type: string;
        supplier: string | null;
    };
}

export interface InventoryOpsType {
    id: string;
    product: string;
    source_location_name: string;
    destination_location_name: string;
    org_id: string;
    active: boolean;
    name: string;
    operation_type: string;
    is_system_operation: boolean;
    source_location: string;
    destination_location: string;
}

export interface InventoryTransferInterface {
    inventory_operation: InvOperationInterface;
    source_location_name: string;
    destination_location_name: string;
    created: Date;
    document_number: string;
    workflow_state: string;
    inventory_delivery_status: string;
    transfer_type: string;
}

export interface InvOperationInterface {
    document_number: string;
    workflow_state: string;
}

export interface InventoryProduct {
    id: string;
    product_name: string;
    location_name: string;
    location_type: 'internal' | 'transit';
    threshold_reached: boolean;
    active: boolean;
    created: string;
    created_by: string | null;
    updated: string;
    updated_by: string | null;
    quantity: number;
    threshold: number;
    incoming_date: string;
    sent_to_etims: boolean;
    organisation: string;
    product: string;
    location: string;
    lot: string | null;
    max_stock_limit: number;
}
