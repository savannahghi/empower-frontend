import { TestBed, fakeAsync } from '@angular/core/testing';
import { FilterReconPaymentsService } from './filter-recon-payments';
import moment from 'moment';

describe('FilterReconPaymentsService', () => {
    let service: FilterReconPaymentsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
        });
        service = TestBed.inject(FilterReconPaymentsService);
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

        const fieldWithStartDate = {
            model: {
                payment_date_gte: '2024-06-01',
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
            payment_date_gte: '2024-06-01',
            payment_date_lte: '2024-05-01',
        };

        const model2 = {
            payment_date_gte: '2024-05-01',
            payment_date_lte: '2024-06-01',
        };

        const template1 =
            templateField.expressionProperties['props.template'](model1);
        const template2 =
            templateField.expressionProperties['props.template'](model2);

        expect(template1).toContain('End date must be after start date');
        expect(template2).toBe('');

        expect(service.fields).toBeDefined();
    }));
});
