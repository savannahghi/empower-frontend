import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CreateRequisitionItemsRequestedFieldsService } from './create-requisition-items-requested-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('CreateRequisitionItemsRequestedFieldsService', () => {
    let service: CreateRequisitionItemsRequestedFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(CreateRequisitionItemsRequestedFieldsService);
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
                product: 'Clean Gloves',
            },
            props: {},
        };
        fields[0]['model.product'] = field0;

        const field1 = {
            model: {
                product_uom: 'Dozens',
            },
            props: {},
        };
        fields[1]['model.product_uom'] = field1;

        const field2 = {
            model: {
                quantity: '5',
            },
            props: {},
        };
        fields[2]['model.quantity'] = field2;
        expect(service.fields).toBeDefined();
    });
});
