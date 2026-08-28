import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { UIRouterGlobals } from '@uirouter/angular';
import { AsyncValidatorService } from '../../../component-services/async-validator.service';
import { NewInventoryTransferModel } from '../../../../features/advantage/models/Inventory';

@Injectable({
    providedIn: 'root',
})
export class RecordTransferFormService {
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
    model: NewInventoryTransferModel;

    /**
     * Imports datalayer for service calls
     * and the error handler for http calls
     */
    constructor(
        public dataLayer: SilStoresService,
        public auth: AuthenticationService,
        public uiglobals: UIRouterGlobals,
        public authServ: Authorization,
        public asyncValidatorService: AsyncValidatorService
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
                className: 'col-sm-12 col-12 pe-sm-1',
                props: {
                    placeholder: 'Enter the Operation Name',
                    label: 'Name',

                    required: true,
                    prefillFields: { name: 'name' },
                },

                modelOptions: {
                    updateOn: 'change',
                    debounce: {
                        default: 2000,
                    },
                },
            },

            {
                key: 'description',
                type: 'textarea',
                className: 'col-12',
                props: {
                    placeholder: 'Enter the description of the operation',
                    label: 'Description',
                    rows: '2',
                    prefillFields: { name: 'description' },
                },
                modelOptions: {
                    updateOn: 'change',
                    debounce: {
                        default: 2000,
                    },
                },
            },

            /**
             * Select source location
             */
            {
                key: 'source_location',
                type: 'combobox',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2',
                props: {
                    label: 'Source location',
                    placeholder: 'Select or type to search',
                    store: 'inventory-locations',
                    responseKey: 'results',
                    extendParams: {
                        active: true,
                        location_type: 'internal',
                    },
                    bindLabel: [
                        {
                            key: 'branch_name',
                            newline: true,
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
            },
            /**
             * Select destination location
             */
            {
                key: 'destination_location',
                type: 'combobox',
                className: 'col-sm-6 col-12 pe-sm-2 mt-2',
                props: {
                    label: 'Destination location',
                    placeholder: 'Select or type to search',
                    store: 'inventory-locations',
                    responseKey: 'results',
                    extendParams: {
                        active: true,
                        location_type: 'internal',
                    },
                    bindLabel: [
                        {
                            key: 'branch_name',
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
     *  setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}
