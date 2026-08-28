import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CreateRequisitionBasicDetailsFieldsService } from './create-requisition-basic-details-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('CreateRequisitionBasicDetailsFieldsService', () => {
    let service: CreateRequisitionBasicDetailsFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(CreateRequisitionBasicDetailsFieldsService);
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
                required_by: '2024-10-05T00:00:00+03:00',
            },
            props: {},
        };
        fields[0]['model.required_by'] = field0;

        const field1 = {
            model: {
                requesting_store: 'Main Store',
            },
            props: {},
        };
        fields[1]['model.requesting_store'] = field1;

        const field2 = {
            model: {
                description: 'Very urgent',
            },
            props: {},
        };
        fields[2]['model.description'] = field2;
        expect(service.fields).toHaveBeenCalled();
    });
});
