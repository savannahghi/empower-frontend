import { CreateAdjustmentProductModel } from './CreateAdjustmentProduct.model';

export interface CreateAdjustmentModel {
    name: string;
    source_organisation_unit: string;
    products?: Array<string>;
    locations?: Array<string>;
    adjustment_lines: Array<CreateAdjustmentProductModel>;
}
