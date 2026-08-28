/**
 * List of imports used in the injectable
 */
import { Injectable } from '@angular/core';
import moment from 'moment';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import _ from 'underscore';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})
export class AddSupplierPaymentRunLineFormService {
    /**
     * Observable that loads the payment methods
     */
    paymentMethod$: Observable<any>;

    /**
     * Subject that checks the the payment methods search
     */
    paymentMethodInput$ = new Subject<string>();

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
     * Stores the form model data
     */
    model: Object;

    /**
     *  Constructor for the class
     * @param dataLayer injects the data layer service
     */
    constructor(public dataLayer: SilStoresService) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'payment_date',
                className: `col-12 col-md-12 col-sm-12 pe-sm-1`,
                type: 'datepicker',
                props: {
                    type: 'text',
                    placeholder: 'Payment date',
                    label: 'Payment date',
                    dateFormat: 'YYYY-MM-DD',
                    required: true,
                    max: moment(),
                },
                expressions: {
                    'model.payment_date': field => {
                        if (field.formControl.pristine === false) {
                            this.model = field.model;
                            if (
                                !_.isUndefined(field.model.payment_date) &&
                                field.formControl.touched === true &&
                                field.defaultValue !== field.model.payment_date
                            ) {
                                field.formControl.markAsPristine();
                                return moment(field.model.payment_date);
                            } else {
                                return this.model['payment_date'];
                            }
                        } else if (field.model.payment_date !== null) {
                            return moment(field.model.payment_date);
                        }
                    },
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },
            {
                key: 'currency',
                type: 'combobox',
                className: 'col-4 pe-1',
                props: {
                    placeholder: 'Select currency...',
                    label: 'Currency',
                    store: 'currencys',
                    responseKey: 'results',

                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
                expressions: {
                    'model.currency': field => {
                        if (field?.model?.currency) {
                            return field?.model?.currency;
                        }
                    },
                },
            },
            {
                key: 'amount',
                type: 'input',
                className: 'col-8',
                props: {
                    label: 'Amount',
                    placeholder: 'Enter amount...',
                    required: true,
                },
                expressions: {
                    'model.amount': field => {
                        if (field?.model?.amount) {
                            return field?.model?.amount;
                        }
                    },
                },
            },
            {
                key: 'payment_method',
                type: 'combobox',
                className: 'col-12',
                style: 'overflow:hidden',
                props: {
                    placeholder: 'Select payment method...',
                    label: 'Payment method',
                    store: 'payment-methods',
                    responseKey: 'results',

                    bindLabel: [
                        {
                            key: 'name',
                            newline: true,
                        },
                    ],
                    bindValue: 'id',
                    required: true,
                },
                expressions: {
                    'model.payment_method': field => {
                        if (field?.model?.payment_method) {
                            return field?.model?.payment_method;
                        }
                    },
                },
            },
            {
                type: 'template',
                className: 'col-12 mb-4',
                template: `<a 
                    style="margin-bottom: 1.5rem" 
                    target='_blank' 
                    href='/advantage/settings/payment_methods/new_payment_method'>
                    Add new payment method</a>`,
            },
        ];
    }

    /**
     *  setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
        this.loading = true;

        const params = {
            _identifiers: 'mobile+money,bank,cash',
            active: 'true',
            fields: 'id,name,number',
            is_control_account: 'false',
        };

        // Make the API call directly here
        this.paymentMethod$ = this.dataLayer
            .list('account-payment-methods', params)
            .pipe(
                map(this.responseFunction),
                catchError(this.catchErrorFunction)
            );
        this.loading = false;
    }

    /**
     *  responseFunction
     * Returns the results from payment methods api
     */
    responseFunction = resp => resp['results'];

    /**
     *  catchErrorFunction
     * Catches the error from the typeahead
     */
    catchErrorFunction = () => of([]);
}
