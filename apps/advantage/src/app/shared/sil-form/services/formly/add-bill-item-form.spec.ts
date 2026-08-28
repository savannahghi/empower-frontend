import { BillItemFieldsService } from './add-bill-item-form';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { RouterTestingModule } from '@angular/router/testing';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { AppConfigService } from '../../../../app-config.service';
import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { StateService } from '@uirouter/angular';

import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

function mockPipe(name: string): Pipe {
    const metadata: Pipe = {
        name,
    };

    return Pipe(metadata)(
        class MockPipe implements PipeTransform {
            transform() {}
        }
    );
}

class SilStoresServiceStub {
    customUpdate() {
        return of({
            results: [
                {
                    id: 1,
                    product_id: '3b836623-2477-405a-9623-c4d7f9ef7ca7',
                    name: 'Nebulization',
                    description: null,
                    type: 'service',
                    variant: null,
                    code: 'SRV-NE-000000031',
                    slade_code: 'CM-48470',
                    preferred_name: 'Nebulization',
                    pricelist_products: [
                        {
                            pricelist_product_id:
                                '39ca363e-6f3f-4dcf-83c4-0b004e346075',
                            pricelist_name: 'Sales default pricelist.',
                            pricelist_type: 'GLOBAL',
                            unit_price: 1200,
                            location_id: null,
                            location_name: null,
                            bp_id: null,
                            bp_name: null,
                            active: true,
                        },
                    ],
                },
            ],
        });
    }
    list() {
        return of({
            results: [
                {
                    id: 1,
                },
            ],
        });
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class AuthenticationServiceStub {
    checkPermission() {
        return false;
    }
    checkSetting() {
        return true;
    }
}

class AuthorizationConfigStub {
    getUser() {
        const stringified = JSON.stringify({
            business_partner: 1,
            client_types: ['PROVIDER'],
        });
        return stringified;
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

class FormGetterStub {
    get() {
        return {
            markAsPristine: () => {},
            setValue: () => {},
        };
    }
}

class StateServiceStub {
    href() {
        return '/advantage/settings/pricelists/new_sales_pricelist?step=0';
    }
    go() {}
}

describe('BillItemFieldsService', () => {
    let service: BillItemFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                BillItemFieldsService,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                    },
                },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: StateService, useClass: StateServiceStub },

                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(BillItemFieldsService);
        spyOn(localStorage, 'getItem').and.returnValue(
            JSON.stringify({ iso_code: 'KES' })
        );
    });

    it('should test fields and observable functions', fakeAsync(() => {
        const comp = {
            secondaryData: [
                {
                    customer_id: 1,
                },
                {
                    queue_type: 'LAB',
                },
                {},
                { value: false },
            ],
            formData: {
                customer_id: 1,
            },
            fields: [
                {},
                {},
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        const results = {
            results: [
                {
                    id: 1,
                    product_id: '3b836623-2477-405a-9623-c4d7f9ef7ca7',
                    name: 'Nebulization',
                    description: null,
                    type: 'service',
                    variant: null,
                    code: 'SRV-NE-000000031',
                    slade_code: 'CM-48470',
                    preferred_name: 'Nebulization',
                    pricelist_products: [
                        {
                            pricelist_product_id:
                                '39ca363e-6f3f-4dcf-83c4-0b004e346075',
                            pricelist_name: 'Sales default pricelist.',
                            pricelist_type: 'GLOBAL',
                            unit_price: 1200,
                            location_id: null,
                            location_name: null,
                            bp_id: null,
                            bp_name: null,
                        },
                    ],
                },
            ],
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        service.tapFunction();
        service.tapFunctionLoading();
        service.catchErrorFunction();
        service.switchMapProductFunction('prod');
        service.switchMapProductFunction(null);
        service.getProducts();
        service.setComponent(comp);
        service.getProducts('prod');
        service.responseFunction(results);

        const formGet = new FormGetterStub();
        const field = {
            model: {
                pricelist_products: {
                    id: '1',
                    pricelist_product_id: '1',
                    unit_price: 100,
                },
                price: 10,
            },
            formControl: {
                pristine: false,
                markAsDirty: () => {},
                setValue: () => {},
                markAsPristine: () => {},
                value: undefined,
            },
            form: {
                get: formGet.get,
            },
        };

        fields[4].expressions['model.price'](field);
        const fieldprice = {
            model: {
                price: 10,
                pricelist_products: {
                    id: '1',
                    price: '1',
                    pricelist_product_id: '1',
                },
            },
            formControl: {
                pristine: true,
                markAsDirty: () => {},
                setValue: () => {},
                value: undefined,
            },
        };
        fields[4].expressions['model.price'](fieldprice);
        const field2 = {
            model: {
                price: 10,
                pricelist_products: {
                    id: '1',
                    unit_price: '1',
                    pricelist_product_id: '1',
                },
                discount: 10,
            },
            formControl: {
                pristine: true,
                markAsDirty: () => {},
                setValue: () => {},
                value: undefined,
            },
        };
        fields[4].expressions['model.price'](field2);
        const field3 = {
            model: {
                price: 1,
                waive_item: 'true',
                pricelist_products: {
                    pricelist_product_id: 1,
                },
            },
            formControl: {
                pristine: true,
                markAsDirty: () => {},
                setValue: () => {},
                value: undefined,
            },
        };
        const field4 = {
            model: {
                pricelist_products: {
                    unit_price: 1,
                },
            },
            formControl: {
                pristine: true,
                setValue: () => {},
                value: 0,
            },
        };
        fields[0].props.buttonEvent();
        fields[4].expressions['model.price'](field3);
        fields[4].validators['price'].expression({ value: '10' }, field2);
        fields[4].validators['price'].expression(
            { value: '10' },
            { pricelist_products: 1 }
        );
        const field5 = { model: { price: 12312 } };
        fields[4].expressions['model.price']({ model: { price: 0 } });
        fields[5].expressions['model.unadjusted_price'](field5);
        fields[5].expressions['model.unadjusted_price'](field4);
        fields[5].expressions['model.unadjusted_price'](field3);
        fields[5].expressions['model.unadjusted_price'](field4);
        fields[12].expressions['model.pricelist_product'](field);
        fields[12].expressions['model.pricelist_product'](field3);
        fields[13].expressionProperties['template']({});
        fields[13].expressionProperties['template']({
            pricelist_products: { unit_price: 1 },
            price: 1,
        });
        fields[13].expressionProperties['template'](field.model);
        fields[14].expressions['model.original_price'](field);
        fields[14].expressions['model.original_price'](field3);
        fields[15].expressions['model.waive_item'](field3);
        tick(1100);
        fields[15].hideExpression();

        const field6 = {
            model: {
                pricelist_products: {
                    unit_price: 1,
                },
            },
            formControl: {
                pristine: false,
                setValue: () => {},
                value: 0,
            },
        };
        fields[9].expressions['model.discount'](field6);

        const field7 = {
            model: {
                pricelist_products: {
                    unit_price: 1,
                },
            },
            formControl: {
                pristine: true,
                setValue: () => {},
                value: 0,
            },
        };
        fields[9].expressions['model.discount'](field7);

        const field8 = {
            model: {
                price: 1,
                waive_item: 'false',
                pricelist_products: {
                    pricelist_product_id: 1,
                    unit_price: 2,
                },
            },
            formControl: {
                pristine: true,
                markAsDirty: () => {},
                setValue: () => {},
                value: undefined,
            },
        };
        fields[4].expressions['model.price'](field8);

        service.responseFunction({ results: [] });
        const modelDiscount = {
            pricelist_products: {
                unit_price: 100,
            },
            price: 1,
            quantity: 1,
        };
        const modelMarkup = {
            pricelist_products: {
                unit_price: 100,
            },
            price: 120,
            quantity: 1,
        };
        const modelDefault = {
            pricelist_products: {
                unit_price: 100,
            },
            price: 100,
            quantity: 1,
        };
        spyOn(service.currencyPipe, 'transform');
        service.transformMoney(1000);
        service.getMarkupDiscountString(modelDiscount);
        service.getMarkupDiscountCash(modelDiscount);
        service.flagDiscountOrMarkup(modelDiscount);
        service.getMarkupDiscountString(modelMarkup);
        service.getMarkupDiscountCash(modelMarkup);
        service.flagDiscountOrMarkup(modelMarkup);
        service.getMarkupDiscountString(modelDefault);
        service.getMarkupDiscountCash(modelDefault);
        service.flagDiscountOrMarkup(modelDefault);
        expect(service.fields).toHaveBeenCalled();
    }));

    it('should transform remaining_quantity and set display_quantity/disabled/disabledText in responseFunction based on stock_tracking', () => {
        const results = {
            results: [
                {
                    id: 1,
                    name: 'Test Item',
                    pricelist_products: [
                        {
                            remaining_quantity: null,
                            stock_tracking: false,
                        },
                        {
                            remaining_quantity: 5,
                            stock_tracking: true,
                        },
                        {
                            remaining_quantity: 0,
                            stock_tracking: true,
                        },
                        {
                            remaining_quantity: null,
                            stock_tracking: true,
                        },
                        {
                            remaining_quantity: 5,
                            stock_tracking: false,
                        },
                    ],
                },
            ],
        };
        const resultsWithDisabledText = {
            results: [
                {
                    id: 2,
                    name: 'Test Item With DisabledText',
                    pricelist_products: [
                        {
                            remaining_quantity: 0,
                            stock_tracking: true,
                            disabledText: 'Explicit branch test',
                        },
                    ],
                },
            ],
        };
        const transformedResults = service.responseFunction(results);

        expect(transformedResults[0].pricelist_products[0].stock_tracking).toBe(
            false
        );
        expect(
            transformedResults[0].pricelist_products[0].remaining_quantity
        ).toBeNull();
        expect(
            transformedResults[0].pricelist_products[0].display_quantity
        ).toBe('not tracked');
        expect(transformedResults[0].pricelist_products[0].disabled).toBe(
            false
        );
        expect(
            transformedResults[0].pricelist_products[0].disabledText
        ).toBeUndefined();
        expect(
            transformedResults[0].pricelist_products[0].display_quantity_class
        ).toBe('text-muted small d-block');

        expect(transformedResults[0].pricelist_products[1].stock_tracking).toBe(
            true
        );
        expect(
            transformedResults[0].pricelist_products[1].remaining_quantity
        ).toBe(5);

        const transformedResultsWithDisabledText1 = service.responseFunction(
            resultsWithDisabledText
        );
        expect(
            transformedResultsWithDisabledText1[0].pricelist_products[0]
                .disabledText
        ).toBe('Explicit branch test');
        expect(
            transformedResultsWithDisabledText1[0].pricelist_products[0]
                .disabled
        ).toBe(true);
        expect(
            transformedResultsWithDisabledText1[0].pricelist_products[0]
                .display_quantity
        ).toBe('Out of stock');
        expect(
            transformedResultsWithDisabledText1[0].pricelist_products[0]
                .display_quantity_class
        ).toBe('text-danger small d-block');
        expect(
            transformedResults[0].pricelist_products[1].display_quantity
        ).toBe('5 remaining');
        expect(transformedResults[0].pricelist_products[1].disabled).toBe(
            false
        );
        expect(
            transformedResults[0].pricelist_products[1].disabledText
        ).toBeUndefined();
        expect(
            transformedResults[0].pricelist_products[1].display_quantity_class
        ).toBe('text-warning small d-block');

        expect(transformedResults[0].pricelist_products[2].stock_tracking).toBe(
            true
        );
        expect(
            transformedResults[0].pricelist_products[2].remaining_quantity
        ).toBe(0);
        expect(
            transformedResults[0].pricelist_products[2].display_quantity
        ).toBe('Out of stock');
        expect(transformedResults[0].pricelist_products[2].disabled).toBe(true);
        expect(
            transformedResults[0].pricelist_products[2].disabledText
        ).toBeUndefined();
        expect(
            transformedResults[0].pricelist_products[2].display_quantity_class
        ).toBe('text-danger small d-block');

        expect(transformedResults[0].pricelist_products[3].stock_tracking).toBe(
            true
        );
        expect(
            transformedResults[0].pricelist_products[3].remaining_quantity
        ).toBeNull();
        expect(
            transformedResults[0].pricelist_products[3].display_quantity
        ).toBeUndefined();
        expect(transformedResults[0].pricelist_products[3].disabled).toBe(
            false
        );
        expect(
            transformedResults[0].pricelist_products[3].disabledText
        ).toBeUndefined();
        expect(
            transformedResults[0].pricelist_products[3].display_quantity_class
        ).toBe('text-muted small d-block');

        expect(transformedResults[0].pricelist_products[4].stock_tracking).toBe(
            false
        );
        expect(
            transformedResults[0].pricelist_products[4].remaining_quantity
        ).toBe(5);
        expect(
            transformedResults[0].pricelist_products[4].display_quantity
        ).toBe('not tracked');
        expect(transformedResults[0].pricelist_products[4].disabled).toBe(
            false
        );
        expect(
            transformedResults[0].pricelist_products[4].disabledText
        ).toBeUndefined();
        expect(
            transformedResults[0].pricelist_products[4].display_quantity_class
        ).toBe('text-muted small d-block');

        const transformedResultsWithDisabledText = service.responseFunction(
            resultsWithDisabledText
        );
        expect(
            transformedResultsWithDisabledText[0].pricelist_products[0]
                .disabledText
        ).toBe('Explicit branch test');
        expect(
            transformedResultsWithDisabledText[0].pricelist_products[0].disabled
        ).toBe(true);
        expect(
            transformedResultsWithDisabledText[0].pricelist_products[0]
                .display_quantity
        ).toBe('Out of stock');
        expect(
            transformedResultsWithDisabledText[0].pricelist_products[0]
                .display_quantity_class
        ).toBe('text-danger small d-block');
    });

    it('should transform remaining_quantity and set display_quantity/disabled/disabledText in simpleResponseFunction based on stock_tracking', () => {
        const resultsWithDisabledText = {
            results: [
                {
                    id: 7,
                    product_name: 'SimpleResponse DisabledText',
                    remaining_quantity: 0,
                    stock_tracking: true,
                    disabledText: 'Explicit branch test',
                },
            ],
        };

        const results = {
            results: [
                {
                    id: 1,
                    product_name: 'Test Product',
                    remaining_quantity: null,
                    stock_tracking: false,
                },
                {
                    id: 2,
                    product_name: 'Another Product',
                    remaining_quantity: 5,
                    stock_tracking: true,
                },
                {
                    id: 3,
                    product_name: 'Out of Stock Product',
                    remaining_quantity: 0,
                    stock_tracking: true,
                },
                {
                    id: 4,
                    product_name: 'Untracked Product with Quantity',
                    remaining_quantity: 10,
                    stock_tracking: false,
                },
                {
                    id: 5,
                    product_name: 'Tracked Product with Null Quantity',
                    remaining_quantity: null,
                    stock_tracking: true,
                },
                {
                    id: 6,
                    product_name: 'Custom DisabledText Product',
                    remaining_quantity: 0,
                    stock_tracking: true,
                    disabledText: 'Custom disabled reason',
                },
            ],
        };

        const transformedResults = service.simpleResponseFunction(results);

        expect(transformedResults[0].remaining_quantity).toBeNull();
        expect(transformedResults[0].stock_tracking).toBe(false);
        expect(transformedResults[0].display_quantity).toBe('not tracked');
        expect(transformedResults[0].disabled).toBe(false);
        expect(transformedResults[0].disabledText).toBeUndefined();
        expect(transformedResults[0].display_quantity_class).toBe(
            'text-muted small d-block'
        );

        expect(transformedResults[1].remaining_quantity).toBe(5);
        expect(transformedResults[1].stock_tracking).toBe(true);
        expect(transformedResults[1].display_quantity).toBe('5 remaining');
        const transformedResultsWithDisabledText2 =
            service.simpleResponseFunction(resultsWithDisabledText);
        expect(transformedResultsWithDisabledText2[0].disabledText).toBe(
            'Explicit branch test'
        );
        expect(transformedResultsWithDisabledText2[0].disabled).toBe(true);
        expect(transformedResultsWithDisabledText2[0].display_quantity).toBe(
            'Out of stock'
        );
        expect(
            transformedResultsWithDisabledText2[0].display_quantity_class
        ).toBe('text-danger small d-block');
        expect(transformedResults[1].disabledText).toBeUndefined();
        expect(transformedResults[1].display_quantity_class).toBe(
            'text-warning small d-block'
        );

        expect(transformedResults[2].remaining_quantity).toBe(0);
        expect(transformedResults[2].stock_tracking).toBe(true);
        expect(transformedResults[2].display_quantity).toBe('Out of stock');
        expect(transformedResults[2].disabled).toBe(true);
        expect(transformedResults[2].disabledText).toBeUndefined();
        expect(transformedResults[2].display_quantity_class).toBe(
            'text-danger small d-block'
        );

        expect(transformedResults[3].remaining_quantity).toBe(10);
        expect(transformedResults[3].stock_tracking).toBe(false);
        expect(transformedResults[3].display_quantity).toBe('not tracked');
        expect(transformedResults[3].disabled).toBe(false);
        expect(transformedResults[3].disabledText).toBeUndefined();
        expect(transformedResults[3].display_quantity_class).toBe(
            'text-muted small d-block'
        );
        expect(transformedResults[4].remaining_quantity).toBeNull();
        expect(transformedResults[4].stock_tracking).toBe(true);
        expect(transformedResults[4].display_quantity).toBeUndefined();
        expect(transformedResults[4].disabled).toBe(false);
        expect(transformedResults[4].disabledText).toBeUndefined();
        expect(transformedResults[4].display_quantity_class).toBe(
            'text-muted small d-block'
        );
        expect(transformedResults[5].remaining_quantity).toBe(0);
        expect(transformedResults[5].stock_tracking).toBe(true);
        expect(transformedResults[5].display_quantity).toBe('Out of stock');
        expect(transformedResults[5].disabled).toBe(true);
        expect(transformedResults[5].disabledText).toBe(
            'Custom disabled reason'
        );
        expect(transformedResults[5].display_quantity_class).toBe(
            'text-danger small d-block'
        );

        const transformedResultsWithDisabledText =
            service.simpleResponseFunction(resultsWithDisabledText);
        expect(transformedResultsWithDisabledText[0].disabledText).toBe(
            'Explicit branch test'
        );
        expect(transformedResultsWithDisabledText[0].disabled).toBe(true);
        expect(transformedResultsWithDisabledText[0].display_quantity).toBe(
            'Out of stock'
        );
        expect(
            transformedResultsWithDisabledText[0].display_quantity_class
        ).toBe('text-danger small d-block');
    });

    it('should call pricelists onInit hook and set formState.service', () => {
        const fields = service.fields();
        const pricelistsField = fields.find(f => f.key === 'pricelists');
        const field = {
            options: { formState: {} as any },
        };
        pricelistsField.hooks.onInit(field);
        expect(field.options.formState.service).toBe(service);
    });

    it('should call pricelists expression and cover all branches', () => {
        const fields = service.fields();
        const pricelistsField = fields.find(f => f.key === 'pricelists');

        const field1 = {
            formControl: { value: null },
            model: { pricelist_products: 'something' },
            form: {
                get: () => ({
                    setValue: () => {},
                    field: { props: { options: [1, 2] } },
                }),
            },
            options: { formState: {} },
        };
        pricelistsField.expressions['model.pricelists'](field1);

        const mockSetValue = jasmine.createSpy('setValue');
        const mockNext = jasmine.createSpy('next');
        const field2 = {
            formControl: { value: { id: 'abc' } },
            model: { pricelist_products: 'something' },
            form: {
                get: () => ({
                    setValue: mockSetValue,
                    field: { props: { options: [1, 2] } },
                }),
            },
            options: {
                formState: {
                    selectedPricelistId: 'old',
                    service: {
                        selectedPricelist$: { next: mockNext },
                        loadOnlyProducts: jasmine.createSpy('loadOnlyProducts'),
                    },
                },
            },
        };
        pricelistsField.expressions['model.pricelists'](field2);
        expect(mockNext).toHaveBeenCalledWith('abc');
        expect(
            field2.options.formState.service.loadOnlyProducts
        ).toHaveBeenCalled();
    });

    it('should evaluate props.disabled for pricelist_products field', () => {
        const fields = service.fields();
        const pricelistProductsField = fields[1];

        spyOn(service, 'isPricelistSelected').and.returnValue(false);

        const model = {};
        const result =
            pricelistProductsField.props.expressionProperties['props.disabled'](
                model
            );
        expect(service.isPricelistSelected).toHaveBeenCalledWith(model);
        expect(result).toBe(true);

        (service.isPricelistSelected as jasmine.Spy).and.returnValue(true);
        const result2 =
            pricelistProductsField.props.expressionProperties['props.disabled'](
                model
            );
        expect(result2).toBe(false);
    });

    it('should evaluate hideExpression for the second pricelist_products field', () => {
        const fields = service.fields();
        const secondPricelistProductsField = fields[2];

        service.multipleBillingPoints = true;
        service.model = {};
        expect(secondPricelistProductsField.hideExpression()).toBe(true);

        service.multipleBillingPoints = false;
        service.model = { id: 'some-id' };
        expect(secondPricelistProductsField.hideExpression()).toBe('some-id');

        service.multipleBillingPoints = false;
        service.model = {};
        expect(secondPricelistProductsField.hideExpression()).toBe(undefined);
    });

    it('should call onInit hook and set observable, and evaluate props.disabled for second pricelist_products field', () => {
        const fields = service.fields();
        const secondPricelistProductsField = fields[2];

        const field: any = { props: {} };
        secondPricelistProductsField.hooks.onInit(field);
        expect(field.props.observable).toBe(service.products$);

        spyOn(service, 'isPricelistSelected').and.returnValue(false);
        const disabledFn = secondPricelistProductsField.expressionProperties[
            'props.disabled'
        ] as (model: any) => boolean;
        expect(disabledFn({})).toBe(true);

        (service.isPricelistSelected as jasmine.Spy).and.returnValue(true);
        expect(disabledFn({})).toBe(false);
    });

    it('should calculate adjusted price when discount_type is amount and set formControl value if different', () => {
        const fields = service.fields();
        const priceField = fields.find(f => f.key === 'price');

        const field: any = {
            model: {
                pricelist_products: { unit_price: 1000 },
                discount_type: 'amount',
                discount_amount: 200,
                price: 800,
            },
            formControl: {
                value: 900,
                setValue: jasmine.createSpy('setValue'),
            },
            form: {
                get: () => null,
            },
        };

        const result = priceField.expressions['model.price'](field);

        expect(result).toBe(800);
        expect(field.formControl.setValue).toHaveBeenCalledWith(800, {
            emitEvent: false,
        });
    });

    it('should evaluate hideExpression for discount field', () => {
        const fields = service.fields();
        const discountField = fields.find(f => f.key === 'discount');

        service.disallowDiscount = true;
        expect(discountField.hideExpression({ discount_type: 'percent' })).toBe(
            true
        );

        service.disallowDiscount = false;
        expect(discountField.hideExpression({ discount_type: 'amount' })).toBe(
            true
        );

        service.disallowDiscount = false;
        expect(discountField.hideExpression({ discount_type: 'percent' })).toBe(
            false
        );
    });

    it('should evaluate hideExpression for discount_amount field', () => {
        const fields = service.fields();
        const discountAmountField = fields.find(
            f => f.key === 'discount_amount'
        );

        service.disallowDiscount = true;
        expect(
            discountAmountField.hideExpression({ discount_type: 'amount' })
        ).toBe(true);

        service.disallowDiscount = false;
        expect(
            discountAmountField.hideExpression({ discount_type: 'percent' })
        ).toBe(true);

        service.disallowDiscount = false;
        expect(
            discountAmountField.hideExpression({ discount_type: 'amount' })
        ).toBe(false);
    });

    it('should evaluate model.discount_amount expression for discount_amount field', () => {
        const fields = service.fields();
        const discountAmountField = fields.find(
            f => f.key === 'discount_amount'
        );

        const field1 = {
            model: {
                discount_type: 'amount',
                pricelist_products: { unit_price: 100 },
                discount_amount: 20,
                price: 90,
            },
        };
        const result1 =
            discountAmountField.expressions['model.discount_amount'](field1);
        expect(result1).toBe(20);
        expect(field1.model.price).toBe(80);

        const field2 = {
            model: {
                discount_type: 'amount',
                pricelist_products: { unit_price: 100 },
                discount_amount: 20,
                price: 80,
            },
        };
        const result2 =
            discountAmountField.expressions['model.discount_amount'](field2);
        expect(result2).toBe(20);
        expect(field2.model.price).toBe(80);

        const field3 = {
            model: {
                discount_type: 'percent',
                pricelist_products: { unit_price: 100 },
                discount_amount: 15,
                price: 85,
            },
        };
        const result3 =
            discountAmountField.expressions['model.discount_amount'](field3);
        expect(result3).toBe(15);
        expect(field3.model.price).toBe(85);
    });

    it('should cover setComponent products$ observable pipeline for pricelistId and call getOnlyProducts', fakeAsync(() => {
        const getOnlyProductsSpy = spyOn(
            service,
            'getOnlyProducts'
        ).and.returnValue(of([{ id: 'item-1' }]));

        spyOn(service['auth'], 'checkSetting').and.returnValue(false);

        const comp = {
            secondaryData: [
                { customer_id: 1 },
                { queue_type: 'LAB' },
                {},
                { value: false },
            ],
            formData: { customer_id: 1 },
            fields: [{}, {}, { props: {} }],
            cd: { detectChanges: () => {} },
            model: {},
        };

        service.setComponent(comp);

        let result: any;
        service.products$.subscribe(res => {
            result = res;
        });

        service.selectedPricelist$.next('test-pricelist-id');
        tick(0);

        service.productsInput$.next('test-term');
        tick(900);

        expect(getOnlyProductsSpy).toHaveBeenCalledWith(
            'test-term',
            'test-pricelist-id'
        );
        expect(result).toEqual([{ id: 'item-1' }]);
    }));

    it('should trigger products$ observable pipeline when loadOnlyProducts is called', fakeAsync(() => {
        const comp = {
            secondaryData: [
                { customer_id: 1 },
                { queue_type: 'LAB' },
                {},
                { value: false },
            ],
            formData: { customer_id: 1 },
            fields: [{}, {}, { props: {} }],
            cd: { detectChanges: () => {} },
            model: {},
        };
        service.setComponent(comp);

        let called = false;
        service.selectedPricelist$.next('test-pricelist-id');
        service.products$.subscribe(() => {
            called = true;
        });

        service.loadOnlyProducts();
        tick(900);

        expect(called).toBeTrue();
    }));

    it('should cover all branches in setComponent products$ observable pipeline with multiple search terms', fakeAsync(() => {
        const comp = {
            secondaryData: [
                { customer_id: 1 },
                { queue_type: 'LAB' },
                {},
                { value: false },
            ],
            formData: { customer_id: 1 },
            fields: [{}, {}, { props: {} }],
            cd: { detectChanges: () => {} },
            model: {},
        };
        service.setComponent(comp);

        const results: any[] = [];
        service.products$.subscribe(res => {
            results.push(res);
        });

        service.selectedPricelist$.next('test-pricelist-id');
        tick(100);

        service.productsInput$.next('paracetamol');
        tick(900);

        service.productsInput$.next('paracetamol');

        service.productsInput$.next('ibuprofen');
        tick(900);

        expect(results.length).toBeGreaterThan(0);
    }));

    it('should correctly determine if a pricelist is selected using isPricelistSelected', () => {
        expect(service.isPricelistSelected(null)).toBe(false);
        expect(service.isPricelistSelected(undefined)).toBe(false);

        expect(service.isPricelistSelected({})).toBe(false);

        expect(service.isPricelistSelected({ pricelists: { id: 'abc' } })).toBe(
            true
        );

        expect(service.isPricelistSelected({ pricelists: 'some-id' })).toBe(
            true
        );

        expect(service.isPricelistSelected({ pricelists: null })).toBe(false);
        expect(service.isPricelistSelected({ pricelists: '' })).toBe(false);
    });

    it('should call getOnlyProducts with null term', () => {
        const dataLayerSpy = spyOn(service.dataLayer, 'list').and.callThrough();

        service.getOnlyProducts(null, 'pricelist-123').subscribe();

        expect(dataLayerSpy).toHaveBeenCalledWith('price-list-products', {
            search: null,
            pricelist: 'pricelist-123',
            fields: 'id,unit-price,pricelist_name,product_name,product_type,product_id,remaining_quantity,available_quantity,quantity_on_hand,type,price_inclusive_tax,stock_tracking',
            active: 'true',
        });
    });

    it('should call getOnlyProducts with default null term when omitted', () => {
        const dataLayerSpy = spyOn(service.dataLayer, 'list').and.callThrough();

        service.getOnlyProducts(undefined, 'pricelist-123').subscribe();

        expect(dataLayerSpy).toHaveBeenCalledWith('price-list-products', {
            search: null,
            pricelist: 'pricelist-123',
            fields: 'id,unit-price,pricelist_name,product_name,product_type,product_id,remaining_quantity,available_quantity,quantity_on_hand,type,price_inclusive_tax,stock_tracking',
            active: 'true',
        });
    });

    it('should safely handle undefined secondaryData and set disallowDiscount to false', () => {
        const compWithoutSecondaryData = {
            formData: { customer_id: 1 },
            model: {},
        };
        service.setComponent(compWithoutSecondaryData);
        expect(service.disallowDiscount).toBe(false);

        const compWithEmptyArray = {
            secondaryData: [],
            formData: { customer_id: 1 },
            model: {},
        };
        service.setComponent(compWithEmptyArray);
        expect(service.disallowDiscount).toBe(false);

        const compWithShortArray = {
            secondaryData: [{ customer_id: 1 }, { queue_type: 'LAB' }],
            formData: { customer_id: 1 },
            model: {},
        };
        service.setComponent(compWithShortArray);
        expect(service.disallowDiscount).toBe(false);
    });

    it('should evaluate hideExpression for display_quantity fields', () => {
        const fields = service.fields();
        const pricelistField = fields[1];
        const displayQuantityOption = (
            pricelistField.props.bindLabel as any[]
        ).find(option => option.key === 'display_quantity');

        expect(
            displayQuantityOption.hideExpression({
                display_quantity: '5 remaining',
            })
        ).toBe(false);
        expect(
            displayQuantityOption.hideExpression({ display_quantity: null })
        ).toBe(true);
        expect(
            displayQuantityOption.hideExpression({
                display_quantity: undefined,
            })
        ).toBe(true);
        expect(displayQuantityOption.hideExpression({})).toBe(true);

        // Also test the second pricelist_products field
        const secondPricelistField = fields[2];
        const secondDisplayQuantityOption = (
            secondPricelistField.props.bindLabel as any[]
        ).find(option => option.key === 'display_quantity');

        expect(
            secondDisplayQuantityOption.hideExpression({
                display_quantity: '10 remaining',
            })
        ).toBe(false);
        expect(
            secondDisplayQuantityOption.hideExpression({
                display_quantity: null,
            })
        ).toBe(true);
    });
});

class AuthenticationServiceStub2 {
    checkPermission() {
        return false;
    }
    checkSetting() {
        return false;
    }
}

describe('BillItemFieldsService: one billing point', () => {
    let service: BillItemFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                BillItemFieldsService,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub2,
                },
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                    },
                },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(BillItemFieldsService);
        spyOn(localStorage, 'getItem').and.returnValue(
            JSON.stringify({ iso_code: 'KES' })
        );
    });

    it('should test fields only products branch', fakeAsync(() => {
        const comp = {
            secondaryData: [
                {
                    customer_id: 1,
                },
                {
                    queue_type: 'LAB',
                },
                {
                    id: '1',
                },
                {},
                { value: false },
            ],
            formData: {
                customer_id: 1,
            },
            fields: [
                {},
                {},
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        const results = {
            results: [
                {
                    id: 1,
                    product_id: '3b836623-2477-405a-9623-c4d7f9ef7ca7',
                    name: 'Nebulization',
                    description: null,
                    type: 'service',
                    variant: null,
                    code: 'SRV-NE-000000031',
                    slade_code: 'CM-48470',
                    preferred_name: 'Nebulization',
                    product_name: 'Nebulization',
                    price_inclusive_tax: 123,
                    pricelist_products: [
                        {
                            pricelist_product_id:
                                '39ca363e-6f3f-4dcf-83c4-0b004e346075',
                            pricelist_name: 'Sales default pricelist.',
                            pricelist_type: 'GLOBAL',
                            unit_price: 1200,
                            location_id: null,
                            location_name: null,
                            bp_id: null,
                            bp_name: null,
                        },
                    ],
                },
            ],
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        service.tapFunction();
        service.tapFunctionLoading();
        service.catchErrorFunction();
        service.switchMapOnlyProductFunction('prod');
        service.switchMapOnlyProductFunction(null);
        service.getOnlyProducts(null, '1');
        service.setComponent(comp);
        service.getOnlyProducts('prod', '1');
        service.simpleResponseFunction(results);
        fields[1].props.buttonEvent();
        const secondPricelistProductsField = fields[2];
        const mockRefresh = { emit: jasmine.createSpy('emit') };
        service.component = { refresh: mockRefresh };
        secondPricelistProductsField.props.buttonEvent.call(service);
        expect(mockRefresh.emit).toHaveBeenCalled();
        service.simpleResponseFunction({ results: [] });
        expect(service.fields).toHaveBeenCalled();
    }));
});
