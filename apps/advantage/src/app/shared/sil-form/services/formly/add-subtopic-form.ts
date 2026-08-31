import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';

@Injectable({
    providedIn: 'root',
})
export class AddSubtopicFormFieldsService {
    /**
     * The Formly field configuration object that defines the structure and behavior
     * of the subtopic form fields.
     */
    field: FormlyFieldConfig;

    /**
     * Reference to the component instance that uses this form configuration.
     */
    component: any;

    /**
     * The data model object representing the current state of the form.
     */
    model: Object;

    /**
     * The unique identifier for the organisation
     */
    organisationID: string;

    constructor(public authServ: Authorization) {}

    fields(): FormlyFieldConfig[] {
        return [
            {
                key: 'title',
                type: 'input',
                className: 'col-6 mb-4 pe-4',
                props: {
                    label: 'Subtopic Title',
                    placeholder: 'Enter subtopic title',
                    required: true,
                },
            },
            {
                key: 'url',
                type: 'input',
                className: 'col-6 mb-4 pe-4',
                props: {
                    label: 'Subtopic URL',
                    placeholder: 'Enter subtopic URL',
                    required: true,
                },
            },
            {
                key: 'permission',
                type: 'input',
                className: 'col-6 mb-4 pe-4',
                props: {
                    label: 'Permission',
                    placeholder: 'Add permission',
                    required: false,
                },
            },
        ];
    }

    setComponent(component) {
        this.component = component;
        this.organisationID =
            this.authServ.getErpOrganisation()?.organisation_id;
    }
}
