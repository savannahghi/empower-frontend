import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Injectable({
    providedIn: 'root',
})
export class AddPricelistLocationFormService {
    /**
     * Reference to the form component
     */
    component: any;

    /**
     * Form model
     */
    model: any = {};

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields(): FormlyFieldConfig[] {
        return [
            {
                key: 'location',
                type: 'combobox',
                className: 'col-12 mb-4',
                props: {
                    label: 'Select Location',
                    placeholder: 'Select or type to search',
                    store: 'org-units',
                    responseKey: 'results',
                    extendParams: {
                        active: true,
                        orgunit_type: 'branch',
                    },
                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                        },
                    ],
                    bindValue: 'id',
                    required: true,
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
