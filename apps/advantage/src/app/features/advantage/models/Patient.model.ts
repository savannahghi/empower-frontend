import { PersonModel } from './Person.model';

export interface PatientModel {
    display_date_of_birth?: boolean;
    person: PersonModel;
    patient_id?: string;
    clinical_id?: string;
    global_health_id?: string;
    expected_delivery_date?: string;
    id?: string; // available when record retrieved from db. Will play a role in offline storage.
    channel?: string;
    file_number?: number;
    customer_id?: string;
}
