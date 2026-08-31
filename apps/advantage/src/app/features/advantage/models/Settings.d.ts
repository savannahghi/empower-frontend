export interface ClusterModel<T extends object> {
    id: string;
    children: T[];
    phone_number: string;
    default_store: any;
    organisation_tax_pin: string;
    is_etims_verified: boolean;
    org_id: string;
    active: boolean;
    created: string;
    created_by: string;
    updated: string;
    updated_by: string;
    description: any;
    name: string;
    email_address: string;
    physical_address: string;
    postal_address: string;
    web_address: any;
    orgunit_type: string;
    default_country: string;
    etims_branch_id: any;
    branch_status: boolean;
    county_name: any;
    sub_county_name: any;
    tax_locality_name: any;
    location_description: any;
    manager_name: any;
    is_headquater: boolean;
    etims_web_address: any;
    etims_device_serial_no: any;
    username: any;
    password: any;
    organisation: string;
    parent: any;
    orgunit_logo: LogoInterface;
    cluster_kra_pin?: string;
    data?: string;
}

export interface BranchModel {
    id: string;
    parent_name: string;
    children: any[];
    parent_phone_number: string;
    phone_number: string;
    default_store: any;
    organisation_tax_pin: string;
    is_etims_verified: boolean;
    org_id: string;
    active: boolean;
    description: any;
    name: string;
    email_address: string;
    physical_address: string;
    postal_address: string;
    web_address: any;
    orgunit_type: string;
    default_country: string;
    etims_branch_id: any;
    branch_status: boolean;
    county_name: any;
    sub_county_name: any;
    tax_locality_name: any;
    location_description: any;
    manager_name: any;
    is_headquater: boolean;
    etims_web_address: any;
    etims_device_serial_no: any;
    username: any;
    password: any;
    parent: string;
}

export interface LogoInterface {
    id: string;
    active: boolean;
    content_type: string;
    data: string;
    title: string;
    creation_date: string;
    size: number;
    description: any;
    aspect_ratio: string;
    organisation_unit: string;
}
