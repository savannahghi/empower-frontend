import { Injectable } from '@angular/core';
import moment from 'moment';
import { BehaviorSubject, Observable, of, Subject, concat } from 'rxjs';
import {
    catchError,
    map,
    tap,
    filter,
    distinctUntilChanged,
    switchMap,
    debounceTime,
    startWith,
} from 'rxjs/operators';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import _ from 'underscore';

@Injectable({
    providedIn: 'root',
})
export class InvoicePaymentService {
    component: any;
    model: any = {};
    paymentMethod$: Observable<any>;
    paymentMethodInput$ = new Subject<string>();
    loading: boolean = false;
    term: string;
    isViewing: boolean = false;

    // Partner observables
    partner$: Observable<any>;
    partnerInput$ = new Subject<string>();
    partnerType$ = new BehaviorSubject<string | null>(null);

    constructor(public dataLayer: SilStoresService) {}

    partnerTypeOptions = [
        {
            title: 'Insurance',
            value: 'INSURANCE',
        },
        {
            title: 'Patient',
            value: 'PATIENT',
        },
    ];

    tapFunction = () => {
        this.loading = true;
    };

    tapLoading = () => {
        this.loading = false;
    };

    catchErrorFunction = () => of([]);

    fields() {
        return [
            {
                key: 'partner_type',
                type: 'select',
                className: 'col-sm-12 col-12 pe-sm-1',
                hideExpression: this.isViewing,
                props: {
                    placeholder: 'Select or type to search',
                    label: 'Select partner type',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: this.partnerTypeOptions,
                    searchable: false,
                    closeOnSelect: true,
                    required: true,
                    helpText:
                        'Select the type of partner you want to create the run for.',
                    hideItalics: true,
                },
                modelOptions: {
                    updateOn: 'change',
                    debounce: {
                        default: 500,
                    },
                },
            },
            ...(this.isViewing
                ? [
                      {
                          key: 'partner_name',
                          type: 'combobox',
                          className: 'col-sm-12 col-12 pe-sm-1',
                          props: {
                              placeholder: 'Enter customer...',
                              label: 'Search for customer',
                              store: 'customers',
                              responseKey: 'results',
                              extendParams: {
                                  active: true,
                                  page_size: '10',
                              },
                              bindLabel: [
                                  {
                                      key: 'partner_name',
                                      newline: true,
                                      objectBinding: true,
                                  },
                              ],
                              required: true,
                          },
                          expressions: {
                              'model.partner_name': field => {
                                  if (field?.model?.partner_name) {
                                      return field?.model?.partner_name;
                                  }
                              },
                          },
                      },
                  ]
                : [
                      {
                          key: 'partner_name',
                          type: 'select',
                          className: 'col-sm-12 col-12 pe-sm-1',
                          props: {
                              placeholder: 'Enter customer...',
                              label: 'Search for customer',
                              hideItalics: true,
                              observableItem: true,
                              observable: this.partner$,
                              observableInput: this.partnerInput$,
                              bindLabel: [
                                  {
                                      key: 'partner_name',
                                      newline: true,
                                      objectBinding: true,
                                  },
                              ],
                              required: true,
                              options: [],
                              dropdownPosition: 'bottom',
                              closeOnSelect: true,
                              multiple: false,
                              minTermLength: 0,
                              clearSearchOnAdd: false,
                              loading: this.loading,
                              loadingText: 'Searching...',
                              typeToSearchText:
                                  'Please enter 3 or more characters',
                              searchable: true,
                              searchWhileComposing: false,
                              hideSelected: false,
                              virtualScroll: true,
                          },
                          expressionProperties: {
                              'props.disabled': (model: any) =>
                                  !model?.partner_type,
                              'model.partner_name': (field: {
                                  model: { partner_name: any };
                              }) => {
                                  if (field?.model?.partner_name) {
                                      return field?.model?.partner_name;
                                  }
                              },
                          },
                          hooks: {
                              onInit: (field: any) => {
                                  if (!field) return;

                                  const emitPartnerType = (value: any) => {
                                      if (
                                          value !== null &&
                                          value !== undefined
                                      ) {
                                          this.partnerType$.next(value);
                                      } else {
                                          this.partnerType$.next(null);
                                      }
                                      field.formControl.setValue(null);
                                  };

                                  const partnerType = field.model?.partner_type;

                                  if (partnerType) {
                                      emitPartnerType(partnerType);
                                      field.formControl.setValue(null);
                                  } else {
                                      field.form
                                          .get('partner_type')
                                          ?.valueChanges.subscribe(
                                              (value: any) => {
                                                  emitPartnerType(value);
                                              }
                                          );
                                  }
                              },
                          },
                          modelOptions: {
                              updateOn: 'change',
                              debounce: { default: 400 },
                          },
                      },
                  ]),
            {
                key: 'payment_date',
                className: `col-12 col-md-12 col-sm-12 pe-sm-1`,
                type: 'datepicker',
                hideExpression: this.isViewing,
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
                hideExpression: this.isViewing,
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
                hideExpression: this.isViewing,
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
                hideExpression: this.isViewing,
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
                key: 'reference_number',
                type: 'input',
                className: 'col-sm-12 col-12 pe-sm-1',
                props: {
                    placeholder: 'Enter Reference Number',
                    label: 'Reference Number',
                    required: false,
                },
            },
            {
                key: 'description',
                type: 'textarea',
                className: 'col-sm-12 col-12 pe-sm-1',
                props: {
                    placeholder: 'Enter Description',
                    label: 'Description',
                    required: false,
                },
            },
        ];
    }

    setComponent(component) {
        this.component = component;
        this.loading = true;
        this.isViewing = this.component.secondaryData === 'isViewing';

        const params = {
            _identifiers: 'mobile+money,bank,cash',
            active: 'true',
            fields: 'id,name,number',
            is_control_account: 'false',
        };

        this.paymentMethod$ = this.dataLayer
            .list('account-payment-methods', params)
            .pipe(
                map(this.responseFunction),
                catchError(this.catchErrorFunction)
            );

        this.loading = false;
        this.loadPartners();
    }

    loadPartners() {
        this.partner$ = this.partnerType$.pipe(
            tap(partnerType => {
                if (!partnerType) {
                    this.partner$ = of([]);
                }
            }),
            filter(partnerType => !!partnerType),
            distinctUntilChanged(),
            switchMap(partnerType =>
                concat(
                    of([]),
                    this.partnerInput$.pipe(
                        startWith(''),
                        distinctUntilChanged(),
                        debounceTime(400),
                        tap(this.tapFunction),
                        switchMap(term =>
                            this.switchMapPartnersFunction(term, partnerType)
                        ),
                        catchError(this.catchErrorFunction),
                        tap(this.tapLoading)
                    )
                )
            )
        );
    }

    switchMapPartnersFunction = (term: any, partnerType: any) =>
        this.getPartners(term, partnerType).pipe(
            catchError(this.catchErrorFunction),
            tap(this.tapLoading)
        );

    getPartners(term: any = null, partnerType: any): Observable<any> {
        const params: any = {
            active: true,
            page_size: 100,
            fields: 'id,partner_name,country',
            search: term,
        };

        if (partnerType === 'INSURANCE') {
            params.customer_type = 'INSURANCE';
        } else if (partnerType === 'PATIENT') {
            params.customer_type = 'PATIENT';
        }

        return this.dataLayer
            .list('customers', params)
            .pipe(map(this.partnersResponseFunction));
    }

    partnersResponseFunction = (resp: any) => {
        return resp['results'];
    };

    responseFunction = resp => resp['results'];
}
