import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FilterReconRequestInvoicesService } from './filter-recon-request-invoices-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import moment from 'moment';

describe('FilterReconRequestInvoicesService', () => {
    let service: FilterReconRequestInvoicesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(FilterReconRequestInvoicesService);
    });

    it('should test fields', () => {
        const comp = {
            model: { amount_option: '' },
            fields: [{}, {}, { props: {} }],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const field1 = {
            model: {
                end_date: '2024-11-30',
            },
            props: {},
        };
        fields[1]['model.end_date'] = field1;

        const fieldWithStartDate = {
            model: {
                start_date: '2024-06-01',
            },
            props: {},
        };

        const minDate = fields[1].expressions['props.min'](fieldWithStartDate);
        expect(minDate.format('YYYY-MM-DD')).toBe('2024-06-01');

        const fieldWithoutStartDate = { model: {} };
        const minDateFallback = fields[1].expressions['props.min'](
            fieldWithoutStartDate
        );
        expect(minDateFallback.format('YYYY-MM-DD')).toBe(
            moment().add(1, 'days').format('YYYY-MM-DD')
        );

        const templateField = fields[2];
        expect(templateField.type).toBe('template');

        const model1 = {
            start_date: '2024-06-01',
            end_date: '2024-05-01',
        };

        const model2 = {
            start_date: '2024-05-01',
            end_date: '2024-06-01',
        };

        const template1 =
            templateField.expressionProperties['props.template'](model1);
        const template2 =
            templateField.expressionProperties['props.template'](model2);

        expect(template1).toContain('End date must be after start date');
        expect(template2).toBe('');

        const field3 = {
            model: {
                invoice_number__startswith: '11111',
            },
            props: {},
        };
        fields[3]['model.invoice_number__startswith'] = field3;

        comp.model.amount_option = 'exact';
        expect(fields[6].hideExpression(comp.model)).toBeFalse();
        expect(fields[7].hideExpression(comp.model)).toBeTrue();
        expect(fields[8].hideExpression(comp.model)).toBeTrue();

        comp.model.amount_option = 'greater';
        expect(fields[6].hideExpression(comp.model)).toBeTrue();
        expect(fields[7].hideExpression(comp.model)).toBeFalse();
        expect(fields[8].hideExpression(comp.model)).toBeTrue();

        comp.model.amount_option = 'less';
        expect(fields[6].hideExpression(comp.model)).toBeTrue();
        expect(fields[7].hideExpression(comp.model)).toBeTrue();
        expect(fields[8].hideExpression(comp.model)).toBeFalse();
    });
});
