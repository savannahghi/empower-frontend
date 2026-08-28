import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { InvoicePaymentService } from './invoice-payment-form';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { catchError, of, throwError } from 'rxjs';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import moment from 'moment';

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: 1,
                    partner_name: 'Test Partner',
                    name: 'Test Item',
                },
            ],
        });
    }
}

describe('InvoicePaymentService', () => {
    let service: InvoicePaymentService;
    let silStoresService: SilStoresService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                InvoicePaymentService,
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(InvoicePaymentService);
        silStoresService = TestBed.inject(SilStoresService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize with default values', () => {
        expect(service.model).toEqual({});
        expect(service.loading).toBe(false);
        expect(service.isViewing).toBe(false);
        expect(service.partnerTypeOptions).toEqual([
            { title: 'Insurance', value: 'INSURANCE' },
            { title: 'Patient', value: 'PATIENT' },
        ]);
    });

    describe('setComponent', () => {
        it('should set component and initialize payment methods', fakeAsync(() => {
            const comp = {
                secondaryData: null,
                fields: [{}, {}, { props: {} }],
                cd: { detectChanges: () => {} },
            };

            spyOn(silStoresService, 'list').and.returnValue(
                of({
                    results: [
                        { id: 1, name: 'Cash', number: '001' },
                        { id: 2, name: 'Bank', number: '002' },
                    ],
                })
            );

            service.setComponent(comp);
            tick();

            expect(service.component).toBe(comp);
            expect(service.isViewing).toBe(false);
            expect(silStoresService.list).toHaveBeenCalledWith(
                'account-payment-methods',
                {
                    _identifiers: 'mobile+money,bank,cash',
                    active: 'true',
                    fields: 'id,name,number',
                    is_control_account: 'false',
                }
            );

            service.paymentMethod$.subscribe(results => {
                expect(results).toEqual([
                    { id: 1, name: 'Cash', number: '001' },
                    { id: 2, name: 'Bank', number: '002' },
                ]);
            });

            flush();
        }));

        it('should set isViewing to true when secondaryData is "isViewing"', () => {
            const comp = {
                secondaryData: 'isViewing',
                fields: [{}, {}, { props: {} }],
                cd: { detectChanges: () => {} },
            };

            service.setComponent(comp);
            expect(service.isViewing).toBe(true);
        });

        it('should handle payment method loading error', fakeAsync(() => {
            const comp = {
                secondaryData: null,
                fields: [{}, {}, { props: {} }],
                cd: { detectChanges: () => {} },
            };

            spyOn(silStoresService, 'list').and.returnValue(
                throwError(() => new Error('API Error'))
            );

            service.setComponent(comp);
            tick();

            service.paymentMethod$.subscribe(results => {
                expect(results).toEqual([]);
            });

            flush();
        }));
    });

    describe('loadPartners', () => {
        beforeEach(() => {
            const comp = {
                secondaryData: null,
                fields: [{}, {}, { props: {} }],
                cd: { detectChanges: () => {} },
            };
            service.setComponent(comp);
        });

        it('should load partners when partner type is set', fakeAsync(() => {
            spyOn(silStoresService, 'list').and.returnValue(
                of({
                    results: [
                        { id: 1, partner_name: 'Insurance Co', country: 'US' },
                    ],
                })
            );

            let receivedResults: any[] = [];

            service.partner$.subscribe(results => {
                receivedResults = results;
            });

            service.partnerType$.next('INSURANCE');
            tick(100);

            service.partnerInput$.next('test');
            tick(500);

            expect(receivedResults.length).toBeGreaterThan(0);
            expect(receivedResults).toEqual([
                { id: 1, partner_name: 'Insurance Co', country: 'US' },
            ]);

            flush();
        }));

        it('should return empty array when partner type is null', fakeAsync(() => {
            service.partnerType$.next(null);
            tick(500);

            service.partner$.subscribe(results => {
                expect(results).toEqual([]);
            });

            flush();
        }));

        it('should debounce partner input', fakeAsync(() => {
            spyOn(silStoresService, 'list').and.returnValue(
                of({ results: [{ id: 1, partner_name: 'Test' }] })
            );

            service.loadPartners();

            const sub = service.partner$.subscribe();

            service.partnerType$.next('PATIENT');
            tick(400);

            service.partnerInput$.next('a');
            tick(200);
            service.partnerInput$.next('ab');
            tick(200);
            service.partnerInput$.next('abc');
            tick(400);

            expect(silStoresService.list).toHaveBeenCalledTimes(2);

            sub.unsubscribe();
            flush();
        }));
    });

    describe('getPartners', () => {
        it('should get insurance partners with correct params', fakeAsync(() => {
            spyOn(silStoresService, 'list').and.returnValue(
                of({
                    results: [
                        { id: 1, partner_name: 'Insurance Co', country: 'US' },
                    ],
                })
            );

            service.getPartners('test', 'INSURANCE').subscribe(results => {
                expect(results).toEqual([
                    { id: 1, partner_name: 'Insurance Co', country: 'US' },
                ]);
            });

            expect(silStoresService.list).toHaveBeenCalledWith('customers', {
                active: true,
                page_size: 100,
                fields: 'id,partner_name,country',
                search: 'test',
                customer_type: 'INSURANCE',
            });

            flush();
        }));

        it('should get insurance partners with correct params', fakeAsync(() => {
            spyOn(silStoresService, 'list').and.returnValue(
                of({
                    results: [
                        { id: 1, partner_name: 'Insurance Co', country: 'US' },
                    ],
                })
            );

            service.getPartners(undefined, 'INSURANCE').subscribe(results => {
                expect(results).toEqual([
                    { id: 1, partner_name: 'Insurance Co', country: 'US' },
                ]);
            });

            expect(silStoresService.list).toHaveBeenCalledWith('customers', {
                active: true,
                page_size: 100,
                fields: 'id,partner_name,country',
                search: null,
                customer_type: 'INSURANCE',
            });

            flush();
        }));

        it('should get patient partners with correct params', fakeAsync(() => {
            spyOn(silStoresService, 'list').and.returnValue(
                of({
                    results: [
                        { id: 2, partner_name: 'Patient Name', country: 'UK' },
                    ],
                })
            );

            service.getPartners('patient', 'PATIENT').subscribe(results => {
                expect(results).toEqual([
                    { id: 2, partner_name: 'Patient Name', country: 'UK' },
                ]);
            });

            expect(silStoresService.list).toHaveBeenCalledWith('customers', {
                active: true,
                page_size: 100,
                fields: 'id,partner_name,country',
                search: 'patient',
                customer_type: 'PATIENT',
            });

            flush();
        }));

        it('should handle null search term', fakeAsync(() => {
            spyOn(silStoresService, 'list').and.returnValue(
                of({ results: [] })
            );

            service.getPartners(null, 'INSURANCE').subscribe();

            expect(silStoresService.list).toHaveBeenCalledWith(
                'customers',
                jasmine.objectContaining({
                    search: null,
                })
            );

            flush();
        }));

        it('should handle partners loading error', fakeAsync(() => {
            spyOn(silStoresService, 'list').and.returnValue(
                throwError(() => new Error('API Error'))
            );

            let receivedResults: any;
            let errorOccurred = false;

            service
                .getPartners('test', 'INSURANCE')
                .pipe(
                    catchError(() => {
                        errorOccurred = true;
                        return of([]);
                    })
                )
                .subscribe(results => {
                    receivedResults = results;
                });

            tick();

            expect(receivedResults).toEqual([]);
            expect(errorOccurred).toBe(true);

            flush();
        }));
    });

    describe('fields', () => {
        beforeEach(() => {
            const comp = {
                secondaryData: null,
                fields: [{}, {}, { props: {} }],
                cd: { detectChanges: () => {} },
            };
            service.setComponent(comp);
        });

        it('should return correct number of fields', () => {
            const fields = service.fields();
            expect(fields.length).toBe(8);
        });

        it('should have partner_type field with correct configuration', () => {
            const fields = service.fields();
            const partnerTypeField = fields[0];

            expect(partnerTypeField.key).toBe('partner_type');
            expect(partnerTypeField.type).toBe('select');
            expect(partnerTypeField.props.options).toEqual(
                service.partnerTypeOptions
            );
            expect(partnerTypeField.props.required).toBe(true);
        });

        it('should show combobox partner_name field when isViewing is true', () => {
            service.isViewing = true;
            const fields = service.fields();
            const partnerNameField = fields[1];

            expect(partnerNameField.key).toBe('partner_name');
            expect(partnerNameField.type).toBe('combobox');
            expect(partnerNameField.props.store).toBe('customers');
        });

        it('should show select partner_name field when isViewing is false', () => {
            service.isViewing = false;
            const fields = service.fields();
            const partnerNameField = fields[1];

            expect(partnerNameField.key).toBe('partner_name');
            expect(partnerNameField.type).toBe('select');
            expect(partnerNameField.props.observableItem).toBe(true);
        });

        it('should disable partner_name when partner_type is not selected', () => {
            service.isViewing = false;
            const fields = service.fields();
            const partnerNameField = fields[1];

            const isDisabled =
                partnerNameField.expressionProperties['props.disabled'];
            expect(isDisabled({ partner_type: null })).toBe(true);
            expect(isDisabled({ partner_type: 'INSURANCE' })).toBe(false);
        });

        it('should handle partner_name field onInit hook', () => {
            service.isViewing = false;
            const fields = service.fields();
            const partnerNameField = fields[1];

            const mockField = {
                model: { partner_type: 'INSURANCE' },
                formControl: { setValue: jasmine.createSpy('setValue') },
                form: {
                    get: jasmine.createSpy('get').and.returnValue({
                        valueChanges: of('PATIENT'),
                    }),
                },
            };

            spyOn(service.partnerType$, 'next');

            partnerNameField.hooks.onInit(mockField);

            expect(service.partnerType$.next).toHaveBeenCalledWith('INSURANCE');
            expect(mockField.formControl.setValue).toHaveBeenCalledWith(null);
        });

        it('should handle partner_name field onInit hook without initial partner_type', fakeAsync(() => {
            service.isViewing = false;
            const fields = service.fields();
            const partnerNameField = fields[1];

            const mockField = {
                model: { partner_type: null },
                formControl: { setValue: jasmine.createSpy('setValue') },
                form: {
                    get: jasmine.createSpy('get').and.returnValue({
                        valueChanges: of('PATIENT'),
                    }),
                },
            };

            spyOn(service.partnerType$, 'next');

            partnerNameField.hooks.onInit(mockField);
            tick();

            expect(mockField.form.get).toHaveBeenCalledWith('partner_type');
            expect(service.partnerType$.next).toHaveBeenCalledWith('PATIENT');

            flush();
        }));

        it('should handle partner_name field onInit hook with undefined partner_type', fakeAsync(() => {
            service.isViewing = false;
            const fields = service.fields();
            const partnerNameField = fields[1];

            const mockField = {
                model: { partner_type: undefined },
                formControl: { setValue: jasmine.createSpy('setValue') },
                form: {
                    get: jasmine.createSpy('get').and.returnValue({
                        valueChanges: of('INSURANCE'),
                    }),
                },
            };

            spyOn(service.partnerType$, 'next');

            partnerNameField.hooks.onInit(mockField);
            tick();

            expect(service.partnerType$.next).toHaveBeenCalledWith('INSURANCE');

            flush();
        }));

        it('should not initialize if field is falsy in onInit', () => {
            service.isViewing = false;
            const fields = service.fields();
            const partnerNameField = fields[1];

            spyOn(service.partnerType$, 'next');

            partnerNameField.hooks.onInit(null);

            expect(service.partnerType$.next).not.toHaveBeenCalled();
        });

        it('should test payment_date field with pristine false and undefined payment_date', () => {
            const fields = service.fields();
            const paymentDateField = fields[2];

            const field = {
                model: { payment_date: undefined },
                formControl: {
                    pristine: false,
                    touched: true,
                    markAsPristine: jasmine.createSpy('markAsPristine'),
                },
                defaultValue: undefined,
            };

            const result =
                paymentDateField.expressions['model.payment_date'](field);
            expect(result).toBeUndefined();
        });

        it('should test payment_date field with max date', () => {
            const fields = service.fields();
            const paymentDateField = fields[2];

            expect(paymentDateField.props.max).toBeDefined();
            expect(moment.isMoment(paymentDateField.props.max)).toBe(true);
        });

        it('should have currency field with correct configuration', () => {
            const fields = service.fields();
            const currencyField = fields[3];

            expect(currencyField.key).toBe('currency');
            expect(currencyField.type).toBe('combobox');
            expect(currencyField.props.store).toBe('currencys');
            expect(currencyField.props.required).toBe(true);
        });

        it('should have amount field with correct configuration', () => {
            const fields = service.fields();
            const amountField = fields[4];

            expect(amountField.key).toBe('amount');
            expect(amountField.type).toBe('input');
            expect(amountField.props.required).toBe(true);
        });

        it('should have payment_method field with correct configuration', () => {
            const fields = service.fields();
            const paymentMethodField = fields[5];

            expect(paymentMethodField.key).toBe('payment_method');
            expect(paymentMethodField.type).toBe('combobox');
            expect(paymentMethodField.props.store).toBe('payment-methods');
            expect(paymentMethodField.props.required).toBe(true);
        });

        it('should have reference_number field with correct configuration', () => {
            const fields = service.fields();
            const referenceField = fields[6];

            expect(referenceField.key).toBe('reference_number');
            expect(referenceField.type).toBe('input');
            expect(referenceField.props.required).toBe(false);
        });

        it('should have description field with correct configuration', () => {
            const fields = service.fields();
            const descriptionField = fields[7];

            expect(descriptionField.key).toBe('description');
            expect(descriptionField.type).toBe('textarea');
            expect(descriptionField.props.required).toBe(false);
        });

        it('should return undefined for expressions when model value is not set', () => {
            const fields = service.fields();

            const currencyResult = fields[3].expressions['model.currency']({
                model: {},
            });
            expect(currencyResult).toBeUndefined();

            const amountResult = fields[4].expressions['model.amount']({
                model: {},
            });
            expect(amountResult).toBeUndefined();

            const paymentMethodResult = fields[5].expressions[
                'model.payment_method'
            ]({
                model: {},
            });
            expect(paymentMethodResult).toBeUndefined();
        });

        it('should emit null partnerType when partner_type valueChanges emits null', fakeAsync(() => {
            service.isViewing = false;
            const fields = service.fields();
            const partnerNameField = fields[1];

            const valueChanges$ = of(null);

            const mockField = {
                model: { partner_type: null },
                formControl: {
                    setValue: jasmine.createSpy('setValue'),
                },
                form: {
                    get: jasmine.createSpy('get').and.returnValue({
                        valueChanges: valueChanges$,
                    }),
                },
            };

            spyOn(service.partnerType$, 'next');

            partnerNameField.hooks.onInit(mockField);
            tick();

            expect(service.partnerType$.next).toHaveBeenCalledWith(null);
            expect(mockField.formControl.setValue).toHaveBeenCalledWith(null);

            flush();
        }));

        it('should return undefined for partner_name expression when model value is missing (isViewing=true)', () => {
            service.isViewing = true;

            const fields = service.fields();
            const partnerNameField = fields[1];

            const result = partnerNameField.expressions['model.partner_name']({
                model: {},
            });

            expect(result).toBeUndefined();
        });
        it('should return partner_name in expression when model value exists (isViewing=true)', () => {
            service.isViewing = true;

            const fields = service.fields();
            const partnerNameField = fields[1];

            const result = partnerNameField.expressions['model.partner_name']({
                model: { partner_name: 'Test Partner' },
            });

            expect(result).toBe('Test Partner');
        });
    });

    describe('helper functions', () => {
        it('should set loading to true in tapFunction', () => {
            service.loading = false;
            service.tapFunction();
            expect(service.loading).toBe(true);
        });

        it('should set loading to false in tapLoading', () => {
            service.loading = true;
            service.tapLoading();
            expect(service.loading).toBe(false);
        });

        it('should return empty array in catchErrorFunction', fakeAsync(() => {
            service.catchErrorFunction().subscribe(result => {
                expect(result).toEqual([]);
            });
            flush();
        }));

        it('should return results from partnersResponseFunction', () => {
            const response = {
                results: [{ id: 1, partner_name: 'Test' }],
            };
            const result = service.partnersResponseFunction(response);
            expect(result).toEqual([{ id: 1, partner_name: 'Test' }]);
        });

        it('should return results from responseFunction', () => {
            const response = {
                results: [{ id: 1, name: 'Test' }],
            };
            const result = service.responseFunction(response);
            expect(result).toEqual([{ id: 1, name: 'Test' }]);
        });
    });

    describe('switchMapPartnersFunction', () => {
        it('should call getPartners and handle response', fakeAsync(() => {
            spyOn(service, 'getPartners').and.returnValue(
                of([{ id: 1, partner_name: 'Test Partner' }])
            );
            spyOn(service, 'tapLoading');

            service
                .switchMapPartnersFunction('test', 'INSURANCE')
                .subscribe(results => {
                    expect(results).toEqual([
                        { id: 1, partner_name: 'Test Partner' },
                    ]);
                    expect(service.tapLoading).toHaveBeenCalled();
                });

            flush();
        }));

        it('should handle error in switchMapPartnersFunction', fakeAsync(() => {
            spyOn(service, 'getPartners').and.returnValue(
                throwError(() => new Error('API Error'))
            );

            service
                .switchMapPartnersFunction('test', 'INSURANCE')
                .subscribe(results => {
                    expect(results).toEqual([]);
                });

            flush();
        }));
    });

    it('should test fields', fakeAsync(() => {
        const comp = {
            fields: [{}, {}, { props: {} }],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        if (
            fields[1].expressions &&
            fields[1].expressions['model.partner_name']
        ) {
            const partnerField = {
                model: {
                    partner_name: 'Test Customer',
                },
            };
            fields[1].expressions['model.partner_name'](partnerField);
        } else if (
            fields[1].expressionProperties &&
            fields[1].expressionProperties['model.partner_name']
        ) {
            const partnerField = {
                model: {
                    partner_name: 'Test Customer',
                },
            };
            fields[1].expressionProperties['model.partner_name'](partnerField);
        }

        // test first branch payment_date
        const field1 = {
            model: {
                payment_date: '2022-12-12-',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: false,
            },
        };
        fields[2].expressions['model.payment_date'](field1);

        // test second branch payment_date
        const field2 = {
            payment_date: '2022-12-12-',
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            model: {
                payment_date: '2022-12-12-',
            },
            defaultValue: undefined,
        };
        fields[2].expressions['model.payment_date'](field2);

        // test third branch payment_date
        const field3 = {
            payment_date: '2022-12-12',
            formControl: {
                pristine: true,
                markAsPristine: () => {},
                touched: true,
            },
            model: {
                payment_date: '2022-12-12',
                formControl: {
                    pristine: false,
                    touched: false,
                },
            },
            defaultValue: undefined,
        };
        fields[2].expressions['model.payment_date'](field3);

        const currencyField = {
            model: {
                currency: 'Test Currency',
            },
        };
        fields[3].expressions['model.currency'](currencyField);

        const amountField = {
            model: {
                amount: 1000,
            },
        };
        fields[4].expressions['model.amount'](amountField);

        const paymentMethodField = {
            model: {
                payment_method: 'payment method',
            },
        };
        fields[5].expressions['model.payment_method'](paymentMethodField);

        service.fields();
        service.responseFunction({ results: ['results'] });
        service.catchErrorFunction();
        expect(service.fields).toHaveBeenCalled();
    }));
});
