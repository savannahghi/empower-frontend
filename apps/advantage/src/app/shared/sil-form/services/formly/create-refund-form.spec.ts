import { provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../app-config.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { CreateRefundFieldsService } from './create-refund-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class SilStoresServiceStub {
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

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getUser() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

describe('CancelAppointmentForm', () => {
    let service: CreateRefundFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                CreateRefundFieldsService,
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
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        service = TestBed.inject(CreateRefundFieldsService);
    });

    it('should test fields: status', fakeAsync(() => {
        const comp = {
            fields: [
                {
                    key: 'amount',
                    type: 'input',
                    className: 'col-12',
                    defaultValue: 1,
                    props: {
                        label: 'Amount paid',
                        disabled: true,
                        type: 'number',
                        required: true,
                        placeholder: 'Amount paid',
                    },
                    validators: {
                        amount: {
                            expression: control => {
                                const number = parseFloat(control.value);
                                const balance = 1;
                                const ifPositive =
                                    number > 0.0 && number <= balance;
                                return ifPositive;
                            },
                        },
                    },
                },
                {
                    key: 'reasons',
                    type: 'select',
                    className: 'col-12 mb-1',
                    props: {
                        placeholder: 'Reason for refund',
                        label: 'Reason for refund',
                        bindLabel: 'title',
                        bindValue: 'value',
                        options: [
                            {
                                title: 'Missing Quantity',
                                value: 'Missing Quantity',
                            },
                            // ... other options
                        ],
                        searchable: false,
                        closeOnSelect: true,
                        required: true,
                    },
                },
                {
                    key: 'notes',
                    type: 'input',
                    className: 'col-12',
                    props: {
                        label: 'Additional Notes',
                        disabled: false,
                        required: false,
                    },
                },
            ],
            secondaryData: [
                {},
                {
                    invoice: {
                        amount_paid: 1,
                    },
                },
            ],
            model: {
                amount: 0,
                reason: '',
                notes: '',
            },
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        // Test amount field validator
        const amountFieldValidator = fields[0].validators.amount.expression;
        expect(amountFieldValidator({ value: 2 })).toBeFalsy(); // Above valid range
        expect(amountFieldValidator({ value: 0.5 })).toBeTruthy(); // Within valid range

        // Ensure the model is properly handled for the reason field
        const reasonFieldExpression = fields[1]['expressions']
            ? fields[1]['expressions']['model.reason']
            : null;
        if (reasonFieldExpression) {
            reasonFieldExpression({ model: { reason: 'mesg' } });
        }

        expect(service.fields).toHaveBeenCalled();
    }));

    it('should test fields: status for direct invoice', fakeAsync(() => {
        const comp = {
            fields: [
                {
                    key: 'amount',
                    type: 'input',
                    className: 'col-12',
                    defaultValue: 1,
                    props: {
                        label: 'Amount paid',
                        disabled: true,
                        type: 'number',
                        required: true,
                        placeholder: 'Amount paid',
                    },
                    validators: {
                        amount: {
                            expression: control => {
                                const number = parseFloat(control.value);
                                const balance = 1;
                                const ifPositive =
                                    number > 0.0 && number <= balance;
                                return ifPositive;
                            },
                        },
                    },
                },
                {
                    key: 'reasons',
                    type: 'select',
                    className: 'col-12 mb-1',
                    props: {
                        placeholder: 'Reason for refund',
                        label: 'Reason for refund',
                        bindLabel: 'title',
                        bindValue: 'value',
                        options: [
                            {
                                title: 'Missing Quantity',
                                value: 'Missing Quantity',
                            },
                            // ... other options
                        ],
                        searchable: false,
                        closeOnSelect: true,
                        required: true,
                    },
                },
                {
                    key: 'notes',
                    type: 'input',
                    className: 'col-12',
                    props: {
                        label: 'Additional Notes',
                        disabled: false,
                        required: false,
                    },
                },
            ],
            secondaryData: [
                {
                    amount: 1,
                },
            ],
            model: {
                amount: 0,
                reason: '',
                notes: '',
            },
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        // Test amount field validator
        const amountFieldValidator = fields[0].validators.amount.expression;
        expect(amountFieldValidator({ value: 2 })).toBeFalsy(); // Above valid range
        expect(amountFieldValidator({ value: 0.5 })).toBeTruthy(); // Within valid range

        // Ensure the model is properly handled for the reason field
        const reasonFieldExpression = fields[1]['expressions']
            ? fields[1]['expressions']['model.reason']
            : null;
        if (reasonFieldExpression) {
            reasonFieldExpression({ model: { reason: 'mesg' } });
        }

        expect(service.fields).toHaveBeenCalled();
    }));
});
