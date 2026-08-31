import { Injectable } from '@angular/core';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines add transfer item form controls, methods
 */
export class AddProductCategoryFormService {
    /**
     * Used to access a formly field
     */
    field: FormlyFieldConfig;

    /**
     * Stores instance of the form component
     */
    component: any;

    /**
     * Stores the form model data
     */
    model: Object;

    /**
     * Imports datalayer for service calls
     * and the error handler for http calls
     */
    constructor(
        public dataLayer: SilStoresService,
        public auth: AuthenticationService,
        public authorization: Authorization
    ) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */

    fields() {
        return [
            {
                key: 'name',
                type: 'input',
                className: 'col-12',
                props: {
                    label: 'Name',
                    placeholder: 'Enter product category name',
                    required: true,
                },
            },
            {
                key: 'costing_method',
                type: 'select',
                defaultValue: 'standard',
                className: 'col-12',
                props: {
                    placeholder: 'Enter costing method',
                    label: 'Product Costing Method',
                    required: true,
                    options: [
                        {
                            name: 'Standard Price',
                            value: 'standard',
                        },
                        {
                            name: 'First In First Out (FIFO)',
                            value: 'fifo',
                        },
                        {
                            name: 'Average Cost (AVCO)',
                            value: 'average',
                        },
                    ],
                    bindValue: 'value',
                    bindLabel: 'name',
                    closeOnSelect: true,
                },
                expressions: {
                    'model.costing_method': field => {
                        this.model = field.model;
                        field.props.model = field.model.costing_method;
                    },
                },
            },
            {
                key: 'description',
                type: 'input',
                className: 'col-12',
                props: {
                    placeholder: 'Enter category description',
                    label: 'Category Description',
                },
            },
        ];
    }

    /**
     *  setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}
