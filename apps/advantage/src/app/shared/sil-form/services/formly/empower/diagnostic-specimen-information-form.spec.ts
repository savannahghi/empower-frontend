import { DiagnosticSpecimenInformationService } from './diagnostic-specimen-information-form';
import { SilStoresService } from '../../../../sil-http-services/sil_datalayer.service';

describe('DiagnosticSpecimenInformationService', () => {
    let service: DiagnosticSpecimenInformationService;
    let mockDataLayer: jasmine.SpyObj<SilStoresService>;

    beforeEach(() => {
        mockDataLayer = jasmine.createSpyObj('SilStoresService', ['dummy']);
        service = new DiagnosticSpecimenInformationService(mockDataLayer);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize properties', () => {
        expect(service.lateralityValues).toEqual([]);
        expect(service.specimenType).toEqual([]);
        expect(service.model).toEqual({});
        expect(service.component).toBeUndefined();
    });

    describe('setComponent', () => {
        it('should set the component and populate lateralityValues and specimenType', () => {
            const dummyComponent = { foo: 'bar' };
            service.setComponent(dummyComponent);

            expect(service.component).toBe(dummyComponent);

            expect(Array.isArray(service.lateralityValues)).toBeTrue();

            expect(Array.isArray(service.specimenType)).toBeTrue();
        });
    });

    describe('fields', () => {
        it('should return the correct formly field configuration', () => {
            const fields = service.fields();
            expect(Array.isArray(fields)).toBeTrue();
        });
    });
});
