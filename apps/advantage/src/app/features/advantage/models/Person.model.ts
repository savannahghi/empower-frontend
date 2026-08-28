import { ContactModel } from './Contact.model';
import { PersonIDModel } from './PersonID.model';

export interface PersonModel {
    first_name: string;
    last_name: string;
    other_names?: string;
    gender: 'MALE' | 'FEMALE';
    person_display?: string;
    age?: number;
    person_contacts: Array<ContactModel>;
    person_ids: Array<PersonIDModel>;
    person_photos: any[];
    sil_global_identifier?: string;
    name?: string;
    email?: string;
    phone_number?: string;
    date_of_birth?: string;
    id_value?: string;
    id_document_type?: string;
    id?: string;
    relationship?: string;
    associated_region?: string;
    channel?: string;
    segment?: {
        id: string;
        name: string;
        label: string;
        description: string;
        attributes?: any;
        messages?: any[];
    };
}
