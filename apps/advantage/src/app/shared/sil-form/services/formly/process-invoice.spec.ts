import { TestBed } from '@angular/core/testing';
import { ProcessInvoiceService } from './process-invoice';

describe('ProcessInvoiceService', () => {
    let service: ProcessInvoiceService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProcessInvoiceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should test fields', () => {
        const comp = {
            fields: [
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        expect(service).toBeTruthy();
        service.setComponent(comp);

        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const field = {
            model: {},
            props: { template: '' },
        };
        fields[0]['model.template'] = field;
    });
});
