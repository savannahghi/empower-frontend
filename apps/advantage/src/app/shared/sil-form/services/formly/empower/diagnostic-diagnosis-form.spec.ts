import { SilStoresService } from '../../../../sil-http-services/sil_datalayer.service';
import { DiagnosticDiagnosisService } from './diagnostic-diagnosis-form';
import { of, throwError } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

describe('DiagnosticDiagnosisService', () => {
    let service: DiagnosticDiagnosisService;
    let mockDataLayer: jasmine.SpyObj<SilStoresService>;

    beforeEach(() => {
        mockDataLayer = jasmine.createSpyObj('SilStoresService', ['list']);
        service = new DiagnosticDiagnosisService(mockDataLayer);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize properties', () => {
        expect(service.behaviourOptions).toEqual([]);
        expect(service.gradeOptions).toEqual([]);
        expect(service.stageOptions).toEqual([]);
        expect(service.model).toEqual({});
        expect(service.component).toBeUndefined();
        expect(service.loading).toBeFalse();
        expect(service.conditions$).toBeUndefined();
    });

    describe('setComponent', () => {
        it('should set the component and populate behaviourOptions, gradeOptions, and stageOptions', () => {
            const dummyComponent = { foo: 'bar' };
            service.setComponent(dummyComponent);

            expect(service.component).toBe(dummyComponent);

            expect(service.behaviourOptions.length).toBeGreaterThan(0);
            expect(service.gradeOptions.length).toBeGreaterThan(0);
            expect(service.stageOptions.length).toBeGreaterThan(0);
            expect(service.conditions$).toBeDefined();
        });
    });

    describe('fields', () => {
        beforeEach(() => {
            service.behaviourOptions = [
                { title: 'Benign', value: 'benign' },
                { title: 'Malignant', value: 'malignant' },
            ];
            service.gradeOptions = [
                { title: 'Grade 1', value: 'grade_1' },
                { title: 'Grade 2', value: 'grade_2' },
            ];
            service.stageOptions = [
                { title: 'Stage I', value: 'stage_i' },
                { title: 'Stage II', value: 'stage_ii' },
            ];
        });

        it('should return the correct formly field configuration', () => {
            const fields = service.fields();
            expect(Array.isArray(fields)).toBeTrue();
            expect(fields.length).toBe(1);
            expect(fields[0].fieldGroup.length).toBeGreaterThan(0);

            const diagnosisField = fields[0].fieldGroup.find(
                f => f.key === 'diagnosis'
            );
            expect(diagnosisField).toBeDefined();
            expect(diagnosisField?.type).toBe('select');
            expect(diagnosisField?.props?.observableItem).toBeTrue();
            expect(diagnosisField?.props?.observable).toBe(service.conditions$);
            expect(diagnosisField?.props?.observableInput).toBe(
                service.searchInput$
            );
            expect(diagnosisField?.props?.required).toBeTrue();
            expect(diagnosisField?.props?.loading).toBe(service.loading);

            const icdPrimaryField = fields[0].fieldGroup.find(
                f => f.key === 'icd_o_3_code_primary_tumor'
            );
            expect(icdPrimaryField).toBeDefined();
            expect(icdPrimaryField?.props?.required).toBeTrue();

            const icdMorphologyField = fields[0].fieldGroup.find(
                f => f.key === 'icd_o_3_code_morphology'
            );
            expect(icdMorphologyField).toBeDefined();
            expect(icdMorphologyField?.props?.required).toBeTrue();

            const behaviourField = fields[0].fieldGroup.find(
                f => f.key === 'behaviour'
            );
            expect(behaviourField).toBeDefined();
            expect(behaviourField?.props?.options).toEqual(
                service.behaviourOptions
            );
            expect(behaviourField?.props?.required).toBeTrue();

            const gradeField = fields[0].fieldGroup.find(
                f => f.key === 'grade'
            );
            expect(gradeField).toBeDefined();
            expect(gradeField?.props?.options).toEqual(service.gradeOptions);
            expect(gradeField?.props?.required).toBeTrue();

            const stageField = fields[0].fieldGroup.find(
                f => f.key === 'stage_of_disease'
            );
            expect(stageField).toBeDefined();
            expect(stageField?.props?.options).toEqual(service.stageOptions);
            expect(stageField?.props?.required).toBeTrue();

            const notesField = fields[0].fieldGroup.find(
                f => f.key === 'additional_notes'
            );
            expect(notesField).toBeDefined();
            expect(notesField?.type).toBe('textarea');
            expect(notesField?.props?.label).toBe('Additional Notes');
        });
    });

    describe('getCondition', () => {
        it('should call dataLayer.list with correct parameters and map response', done => {
            const mockApiResponse = [
                {
                    id: '1',
                    display_name: 'Condition A',
                    source: 'Source A',
                    uuid: 'uuid1',
                    owner: 'WHO',
                },
                {
                    id: '2',
                    display_name: 'Condition B',
                    source: 'Source B',
                    uuid: 'uuid2',
                    owner: 'WHO',
                },
            ];
            mockDataLayer.list.and.returnValue(of(mockApiResponse));
            service.getCondition('testTerm').subscribe(response => {
                expect(mockDataLayer.list).toHaveBeenCalledWith(
                    'ocl-diagnoses',
                    jasmine.any(Object)
                );
                expect(response).toEqual(mockApiResponse);
                done();
            });
        });

        it('should handle error when calling dataLayer.list', done => {
            mockDataLayer.list.and.returnValue(
                throwError(() => new Error('API error'))
            );
            service.getCondition('testError').subscribe({
                error: err => {
                    expect(err.message).toBe('API error');
                    done();
                },
                complete: () => done(),
            });
        });
    });

    describe('loadCondition', () => {
        it('should handle error during loadCondition', fakeAsync(() => {
            service.loadCondition();
            mockDataLayer.list.and.returnValue(
                throwError(() => new Error('API error'))
            );
            let emittedConditions: any[] = [];
            service.conditions$?.subscribe(data => (emittedConditions = data));
            service.searchInput$.next('errorQuery');
            tick(1000);
            expect(emittedConditions).toEqual([]);
            expect(service.loading).toBeFalse();
        }));

        it('should debounce and distinctUntilChanged', fakeAsync(() => {
            service.loadCondition();
            mockDataLayer.list.and.returnValue(of([]));
            const emittedValues: any[] = [];
            service.conditions$?.subscribe(data => emittedValues.push(data));
            service.searchInput$.next('term');
            tick(1000);
            service.searchInput$.next('term');
            tick(1000);
            service.searchInput$.next('another term');
            tick(1000);
            service.searchInput$.next('another term');
            tick(1000);
            expect(mockDataLayer.list).toHaveBeenCalledTimes(2);
        }));
    });

    describe('responseFunction', () => {
        it('should correctly select fewer fields from the API response', () => {
            const mockFullResponse = [
                {
                    uuid: 'uuid1',
                    id: '123',
                    display_name: 'Condition One',
                    source: 'Source A',
                    owner: 'WHO',
                    unwanted_field: 'data',
                },
                {
                    uuid: 'uuid2',
                    id: '456',
                    display_name: 'Condition Two',
                    source: 'Source B',
                    owner: 'WHO',
                    another_unwanted_field: 'more data',
                },
            ];

            const expectedCleanedResponse = [
                {
                    uuid: 'uuid1',
                    id: '123',
                    display_name: 'Condition One',
                    source: 'Source A',
                    owner: 'WHO',
                },
                {
                    uuid: 'uuid2',
                    id: '456',
                    display_name: 'Condition Two',
                    source: 'Source B',
                    owner: 'WHO',
                },
            ];

            const result = service.responseFunction(mockFullResponse);
            expect(result).toEqual(expectedCleanedResponse);
        });

        it('should return an empty array if the input is empty', () => {
            const result = service.responseFunction([]);
            expect(result).toEqual([]);
        });

        it('should handle null or undefined fields gracefully', () => {
            const mockResponseWithMissingFields = [
                {
                    uuid: 'uuid3',
                    id: '789',
                    display_name: 'Condition Three',
                    source: null,
                    owner: undefined,
                },
            ];

            const expectedCleanedResponse = [
                {
                    uuid: 'uuid3',
                    id: '789',
                    display_name: 'Condition Three',
                    source: null,
                    owner: undefined,
                },
            ];

            const result = service.responseFunction(
                mockResponseWithMissingFields
            );
            expect(result).toEqual(expectedCleanedResponse);
        });
    });
});
