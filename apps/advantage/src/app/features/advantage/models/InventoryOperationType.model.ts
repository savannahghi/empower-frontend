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
