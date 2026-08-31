export interface AddDirectInvoiceItemModel {
    new_price: number;
    price_inclusive_tax: number;
    pricelist_product: string;
    product: string;
    purchases_invoice: string;
    quantity: number;
    source_organisation_unit: string;
}
