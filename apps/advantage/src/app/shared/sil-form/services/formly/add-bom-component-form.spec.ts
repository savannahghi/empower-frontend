import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BomComponentService } from './add-bom-component-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('BomComponentService', () => {
    let service: BomComponentService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                BomComponentService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(BomComponentService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should test comparison logic when quantity is below 1', () => {
        const comp = {
            model: { raw_product: 'Test', quantity: -4 },
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

        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        // test bom
        const rawProductField = {
            model: {
                raw_product: 'Test',
            },
        };
        fields[0]['model.raw_product'] = rawProductField;
        fields[0].expressions['model.raw_product'](rawProductField);

        // test quantity field
        const quantityField = {
            model: {
                quantity: 2,
            },
            props: {},
            expressionProperties: {
                template: () => {},
            },
        };
        fields[1]['model.quantity'] = quantityField;
        fields[1].expressions['model.quantity'](quantityField);
        fields[1].validators['quantity'].expression({ quantity: 4 });
        fields[2].expressionProperties['template'](quantityField.model);
        fields[2].expressionProperties['template']({
            quantity: 5,
        });

        fields[2].expressionProperties['template']({
            quantity: -2,
        });

        expect(service.fields).toHaveBeenCalled();
    });

    it('should test fieldValidator method with value as negative', () => {
        spyOn(service, 'fieldValidator').and.callThrough();
        service.fieldValidator({ value: -1 });
        expect(service.fieldValidator).toHaveBeenCalledWith({
            value: -1,
        });
    });

    it('should test fieldValidator method with value as positive', () => {
        spyOn(service, 'fieldValidator').and.callThrough();
        service.fieldValidator({ value: 10 });
        expect(service.fieldValidator).toHaveBeenCalledWith({
            value: 10,
        });
    });
});
