export interface OrganisationModel {
    id: string;
    pk: string;
    first_name: string;
    last_name: string;
    full_name: string;
    person_id: string;
    organisation_id: string;
    organisation_name: string;
    slade_code: number;
    organisation_email_address: string;
    organisation_onboarding: string | null;
    clinical_org_id: string;
    clinical_facility_id: string;
    matrix_token: {
        user_id: string;
        access_token: string;
        home_server: string;
        device_id: string;
        well_known: {
            'm.homeserver': {
                base_url: string;
            };
        };
        _cache_key: string;
    };
    last_login: string | null;
    email: string;
    guid: string;
    is_network_admin: boolean;
    is_admin: boolean;
    is_staff: boolean;
    active: boolean;
    created: string;
    updated: string;
    permissions: string;
    is_active: boolean;
    business_partner: string | null;
    matrix_user_id: string;
}
