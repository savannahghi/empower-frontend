import { Injectable } from '@angular/core';

@Injectable()
export class EditPricelistDetailsFormService {
    /**
     * Component reference to SilFormComponent
     * @returns fields information
     */
    component: any;

    fields() {
        return [
            {
                key: 'name',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Pricelist Name',
                    placeholder: 'Enter pricelist name',
                    required: true,
                },
            },
            {
                key: 'effective_from',
                type: 'datepicker',
                className: 'col-12 col-sm-6 pe-3',
                props: {
                    label: 'Valid From',
                    placeholder: 'Select start date',
                    required: true,
                },
            },
            {
                key: 'placeholder_field',
                className: 'd-none',
            },
            {
                key: 'effective_to',
                type: 'datepicker',
                className: 'col-12 col-sm-6',
                props: {
                    label: 'Valid To',
                    placeholder: 'Select end date',
                    required: true,
                },
            },
            {
                key: 'placeholder_field',
                className: 'd-none',
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
