import { Injectable } from '@angular/core';
/**
 * Injectable for the form service
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class for the form registration service
 */
export class CreateRequisitionBasicDetailsFieldsService {
    /**
     * Component reference to SilFormComponent
     * @returns fields information
     */
    component: any;

    /**
     * Stores form data from api
     */
    model: any = {};

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'required_by',
                type: 'datepicker',
                className: 'col-12',
                props: {
                    label: 'Required By',
                    type: 'text',
                    dateFormat: 'YYYY-MM-DD',
                    placeholder: 'YYYY-MM-DD',
                    required: true,
                },
            },
            {
                key: 'requesting_store',
                type: 'combobox',
                className: 'col-12',
                props: {
                    label: 'Store',
                    store: 'branches-stores',
                    responseKey: 'results',
                    bindLabel: [
                        {
                            key: 'name',
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
            },
            {
                key: 'description',
                type: 'textarea',
                className: 'col-12',
                props: {
                    label: 'Description',
                },
            },
        ];
    }

    /**
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}
