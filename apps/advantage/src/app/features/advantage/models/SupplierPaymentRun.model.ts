export interface SupplierPaymentRunModel {
    id: string;
    made_by: string;
    updated_by_name: string;
    parent_document_number: string | null;
    document_latest_comment: string | null;
    active_pricelist: string | null;
    lines: [];
    supplier_name: string;
    total_invoice_amount: number;
    active: boolean;
    created: string;
    created_by: string;
    updated: string;
    updated_by: string;
    document_number: string;
    workflow_state: string;
    source_document: string | null;
    description: string;
    reference_number: string;
    document_count: number;
    organisation: string;
    source_organisation_unit: string;
    financial_year: string;
    parent_document: string | null;
    business_partner: string;
    invoice: Array<string>;
}

export interface CreateSupplierPaymentRunModel {
    sale_taxes: string;
    currency: string;
    amount: string | number;
    payment_method: string;
    business_partner: string;
    invoice: Array<string>;
}
