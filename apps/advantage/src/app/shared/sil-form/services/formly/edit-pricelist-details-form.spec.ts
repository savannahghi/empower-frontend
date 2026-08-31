import { TestBed } from '@angular/core/testing';
import { EditPricelistDetailsFormService } from './edit-pricelist-details-form';

describe('EditPricelistDetailsFormService', () => {
    let service: EditPricelistDetailsFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditPricelistDetailsFormService],
        });
        service = TestBed.inject(EditPricelistDetailsFormService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set component', () => {
        const comp = { fields: [], cd: { detectChanges: () => {} } };
        service.setComponent(comp);
        expect(service.component).toBe(comp);
    });

    it('should return correct fields config', () => {
        const fields = service.fields();
        expect(Array.isArray(fields)).toBeTrue();
        expect(fields.length).toBeGreaterThan(0);
        expect(fields.some(f => f.key === 'name')).toBeTrue();
        expect(fields.some(f => f.key === 'effective_from')).toBeTrue();
        expect(fields.some(f => f.key === 'effective_to')).toBeTrue();
    });
});
