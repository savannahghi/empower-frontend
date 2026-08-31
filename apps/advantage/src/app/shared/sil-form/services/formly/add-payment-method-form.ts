/**
 * List of imports used in the injectable
 */
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})
export class AddPaymentMethodService {
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
                className: 'col-12',
                fieldGroup: [
                    {
                        type: 'input',
                        key: 'name',
                        className: 'col-sm-6 pe-sm-2 col-12',
                        props: {
                            label: 'Name of payment',
                            required: true,
                        },
                    },
                    {
                        type: 'select',
                        key: 'account_details',
                        className: 'col-sm-6 pe-sm-2 col-12',
                        props: {
                            observableItem: true,
                            observable: this.paymentMethod$,
                            observableInput: this.paymentMethodInput$,
                            placeholder: 'Select payment method',
                            label: 'Account',
                            bindLabel: [
                                {
                                    key: 'name',
                                    class: 'fw-semibold',
                                    newline: true,
                                },
                                {
                                    key: 'account_details',
                                    class: 'fs-13px',
                                    newline: true,
                                },
                                {
                                    key: 'description',
                                    class: 'fs-13px',
                                },
                            ],
                            options: [],
                            dropdownPosition: 'bottom',
                            closeOnSelect: true,
                            multiple: false,
                            minTermLength: 0,
                            clearSearchOnAdd: false,
                            loading: this.loading,
                            loadingText: 'Searching..',
                            typeToSearchText:
                                'Please enter 3 or more characters',
                            searchable: true,
                            searchWhileComposing: false,
                            hideSelected: true,
                            required: true,
                            virtualScroll: true,
                        },
                    },
                ],
            },
            {
                type: 'input',
                key: 'description',
                className: 'col-12',
                props: {
                    label: 'Description',
                    required: false,
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
        this.loading = true; // Set loading to true before making the API call

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
