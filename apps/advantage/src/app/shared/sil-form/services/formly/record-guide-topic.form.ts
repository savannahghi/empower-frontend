import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';

@Injectable({
    providedIn: 'root',
})
export class RecordGuideTopicFormFieldsService {
    /**
     * The Formly field configuration object that defines the structure of the guide topic form fields.
     */
    field?: FormlyFieldConfig;

    /**
     * Reference to the component instance that uses this form configuration
     */
    component: any;

    /**
     * The data model object representing the current state of the form.
     */
    model: any;

    /**
     * The unique identifier for the organisation
     */
    organisationID?: string;

    constructor(public authServ: Authorization) {}

    fields(): FormlyFieldConfig[] {
        return [
            {
                key: 'title',
                type: 'input',
                className: 'col-12 col-md-6 mb-3 px-2',
                props: {
                    label: 'Topic Title',
                    placeholder: 'Enter topic title',
                    required: true,
                },
            },
            {
                key: 'url',
                type: 'input',
                className: 'col-12 col-md-6 mb-3 px-2',
                props: {
                    label: 'Resource URL',
                    placeholder: 'Paste a link (optional)',
                    required: false,
                },
            },
        ];
    }

    setComponent(component: any) {
        this.component = component;
        const erpOrg = this.authServ.getErpOrganisation();
        this.organisationID = erpOrg?.organisation_id;
    }
}
