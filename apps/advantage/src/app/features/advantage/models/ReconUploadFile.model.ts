export interface ReconUploadFileModel {
    id: string;
    created_by_name: string;
    updated_by_name: string;
    active: boolean;
    upload_type: string | null;
    uploaded_file: string;
    description: string | null;
    file_type: string | null;
}
