import type { PricelistStatusTypeModel } from './PricelistStatusType.model';

export interface CreateSalesPricelistModel {
    id: string;
    is_internal_pricelist: boolean;
    active: boolean;
    name: string;
    description: string;
    pricelist_type: 'sales';
    pricelist_status: PricelistStatusTypeModel;
    effective_from: string;
    effective_to: string;
    business_partner?: string | null;
    location?: string;
}
