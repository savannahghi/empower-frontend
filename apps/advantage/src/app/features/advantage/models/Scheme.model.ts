export interface SchemeModel {
    id: string;
    identifiers: [];
    active: boolean;
    created: string;
    created_by: string;
    updated: string;
    updated_by: string;
    name: string;
    benefit_access: Array<string>;
    identification_mode: Array<string>;
    scheme_code: string | null;
    valid_from: string | null;
    valid_to: string | null;
    organisation: string;
    payer: string;
    network: string;
}
