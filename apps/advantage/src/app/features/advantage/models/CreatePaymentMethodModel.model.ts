export interface CreatePaymentMethodModel {
    id: string;
    account_details: string;
    mobile_money_type: string | null;
    mobile_money_business_number: string | null;
    bank_name: string | null;
    bank_branch: string | null;
    bank_account_number: string | null;
    active: boolean;
    name: string;
    description: string;
    account: string;
}
