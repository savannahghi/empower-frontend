import type { PricelistStatusTypeModel } from './PricelistStatusType.model';

export interface SalesPricelistModel {
    id: string;
    is_internal_pricelist: boolean;
    active: boolean;
    created: string;
    created_by: string;
    updated: string;
    updated_by: string;
    name: string;
    description: string;
    pricelist_type: string;
    pricelist_status: PricelistStatusTypeModel;
    effective_from: string;
    effective_to: string;
    organisation: string;
    business_partner: string | null;
    location: string | null;
    locations: string[];
}
