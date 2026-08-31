/**
 * List of imports used in the injectable
 */
import { Injectable } from '@angular/core';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines billing form controls, methods
 */
export class PatientObservationFieldsService {
    /**
     * Used to control loading for search
     */
    loading: boolean = false;
    /**
     * Stores the search term
     */
    term: string;
    /**
     * Stores instance of the form component
     */
    component: any;
    /**
     * stores template name
     */
    templateName: any;
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
        public auth: AuthenticationService
    ) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'value',
                type: 'textarea',
                className: 'col-12 col-sm-12 pe-sm-1 ',
                props: {
                    placeholder: `Add ${this.templateName}`,
                    label: `${this.templateName}`,
                    rows: 4,
                    required: true,
                },
                expressions: {
                    'model.value': field => {
                        return field.model.value;
                    },
                },
            },
            {
                key: 'note',
                type: 'textarea',
                className: 'col-12 col-sm-12 pe-sm-1',
                props: {
                    placeholder: `Add notes`,
                    label: `notes`,
                    rows: 3,
                    required: false,
                },
                expressions: {
                    'model.note': field => {
                        return field.model.note;
                    },
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
        this.templateName = this.component.secondaryData;
    }
}
