export interface AdjustmentLineModel {
    id: string;
    made_by: string;
    updated_by_name: string;
    inventory_adjustment_reference: string;
    product_name: string;
    active: boolean;
    created: string;
    created_by: string;
    updated: string;
    updated_by: string;
    quantity: number;
    price_inclusive_tax: number;
    price_exclusive_tax: number;
    new_price: number | null;
    counted_quantity: number;
    organisation: string;
    pricelist_product: string;
    product_uom: null;
    inventory_adjustment: string;
    product: string;
    lot: string | null;
}
