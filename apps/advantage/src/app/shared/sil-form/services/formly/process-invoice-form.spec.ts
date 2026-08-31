import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ProcessInvoiceFormService } from './process-invoice-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('ProcessInvoiceFormService', () => {
    let service: ProcessInvoiceFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(ProcessInvoiceFormService);
    });

    it('should test fields', () => {
        const comp = {
            fields: [{}, {}, { props: {} }],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const field0 = {
            model: {
                approved_amount: '100',
            },
            props: {},
        };
        fields[0]['model.approved_amount'] = field0;

        const model = { unpaid_amount: 200, approved_amount: 100 };
        const field = fields[0];

        const control = { value: 100 };
        const valid = field.validators.approved_amount.expression(control, {
            parent: {
                model: {
                    id: '1234',
                    unpaid_amount: 160,
                },
            },
        });

        expect(valid).toBe(true);

        const valid1 = field.validators.approved_amount.expression(control, {
            parent: { model: {} },
        });

        expect(valid1).toBe(false);

        const valid2 = field.validators.approved_amount.expression(control, {
            parent: {},
        });
        expect(valid2).toBe(false);

        const templateField = fields[1];
        expect(templateField.type).toBe('template');

        model.approved_amount = 300;
        const template =
            templateField.expressionProperties['props.template'](model);

        expect(template).toContain(
            'Approved amount cannot exceed unpaid amount'
        );

        model.approved_amount = 0;
        const template1 =
            templateField.expressionProperties['props.template'](model);

        expect(template1).toContain(
            'Approved amount should be greater than zero'
        );

        model.approved_amount = 100;
        model.unpaid_amount = 200;
        const template2 =
            templateField.expressionProperties['props.template'](model);

        expect(template2).toBe('');

        const field1 = {
            model: {
                adjudication_reason: 'This is the reason one',
            },
            props: {},
        };
        fields[1]['model.adjudication_reason'] = field1;
    });
});
