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
