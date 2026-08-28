export interface DirectInvoiceItemsDetailsModel {
    id: string;
    pricelist_name: string;
    product_name: string;
    product_id: string;
    historical_pricelist_product_prices: [];
    active: boolean;
    created: Date;
    created_by: string;
    updated: string;
    updated_by: string;
    price_inclusive_tax: number;
    organisation: string;
    pricelist: string;
    product: string;
    currency: string;
}
