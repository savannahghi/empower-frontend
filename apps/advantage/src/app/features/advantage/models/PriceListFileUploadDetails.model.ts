import type { PricelistMappingModel } from './PricelistMappingModel.model';

export interface PriceListFileUploadDetailsModel {
    id: string;
    file_name: string;
    upload_file_url: string;
    failed_upload_file_url: string;
    active: boolean;
    created: string;
    created_by: string | null;
    updated: string;
    updated_by: string | null;
    status: string;
    success_count: number;
    fail_count: number;
    mapping: PricelistMappingModel;
    organisation: string;
    upload_file: string;
    failed_uploads_file: string;
    pricelist: string;
}
