export interface NewDirectPurchaseOrderModel {
    id: string;
    source_organisation_unit: string;
    required_by: string;
    supplier: string;
    description: string;
    pricelist: string;
}
