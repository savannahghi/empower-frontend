export interface Bill {
    id?: string;
    bill_date: string;
    due_date: string;
    source_organisation_unit: string;
    supplier: string;
    amount?: number;
}
