import { TestBed } from '@angular/core/testing';
import { ApproveReconInvoiceLinesService } from './approve-recon-invoice-lines';

describe('ApproveReconInvoiceLinesService', () => {
    let service: ApproveReconInvoiceLinesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [],
        });
        service = TestBed.inject(ApproveReconInvoiceLinesService);
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
                adjudication_reason: 'This is the reason',
            },
            props: {},
        };
        fields[0]['model.adjudication_reason'] = field0;

        const templateField = fields[1];
        expect(templateField.type).toBe('template');

        expect(service.fields).toBeDefined();
    });
});
