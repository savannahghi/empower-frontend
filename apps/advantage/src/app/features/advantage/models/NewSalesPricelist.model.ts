import type { PricelistStatusTypeModel } from './PricelistStatusType.model';

export interface NewSalesPricelistModel {
    pricelist_type: 'sales' | 'purchases';
    name: string;
    effective_from: string;
    effective_to: string;
    pricelist_status: PricelistStatusTypeModel;
    description?: string;
    business_partner?: string;
    is_internal_pricelist?: boolean;
    locations?: string[];
}
