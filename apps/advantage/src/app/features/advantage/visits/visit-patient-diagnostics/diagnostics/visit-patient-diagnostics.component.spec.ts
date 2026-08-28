import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';

import { VisitPatientDiagnosticsComponent } from './visit-patient-diagnostics.component';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from 'app/shared/cookies/cookie.service';
import { of, throwError } from 'rxjs';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';
import { VisitService } from '../../visit.service';

class TranslateServiceMock {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
    }
}

class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
    }
}

class SilStoreServiceStub {
    create() {
        return of({ id: '234' });
    }
    list() {
        return of({ Edges: [] });
    }
}

class ErrorHandlerServiceStub {
    handleError() {
        return {};
    }
}

function mockPipe(name: string): Pipe {
    const metadata: Pipe = { name };
    return Pipe(metadata)(
        class MockPipe implements PipeTransform {
            transform() {}
        }
    );
}

const visitServiceStub = {
    visitPatientDataEmitter: of({
        new_price: 18,
        amount: '18',
        product_name: 'Lipid',
        quantity: 1,
        clinical_id: '3217',
        id: 1,
    }),
    visitDataEmitter: of({
        id: '123232',
    }),
    currenciesDataEmitter: of({
        results: {
            new_price: 18,
            amount: '18',
            product_name: 'Lipid',
            quantity: 1,
            id: 1,
        },
    }),
    sendToQueue: () => {},
    completeVisit: () => {},
    queuesDataEmitter: of([
        {
            id: 1,
        },
    ]),
    fetchVisit: () => {},
    addToQueue: () => {},
    setVisitData: () => {},
    visit: {
        id: 1,
    },
};

describe('VisitPatientDiagnosticsComponent', () => {
    let component: VisitPatientDiagnosticsComponent;
    let fixture: ComponentFixture<VisitPatientDiagnosticsComponent>;
    let dataLayer: SilStoresService;
    let errorHandler: ErrorHandlerService;
    let consoleErrorSpy: jasmine.Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VisitPatientDiagnosticsComponent],
            imports: [mockPipe('translate')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: TranslateService, useClass: TranslateServiceMock },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: SilStoresService, useClass: SilStoreServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
                {
                    provide: ErrorHandlerService,
                    useClass: ErrorHandlerServiceStub,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(VisitPatientDiagnosticsComponent);
        component = fixture.componentInstance;
        dataLayer = TestBed.inject(SilStoresService);
        errorHandler = TestBed.inject(ErrorHandlerService);
        consoleErrorSpy = spyOn(console, 'error');

        component.visitObservable = of({
            id: 1,
            person: {
                gender: 'MALE',
                age: {
                    years: 30,
                },
            },
            invoices: [{ id: 1 }],
            clinical_orders: [{ id: 1 }],
            service_requests: [
                {
                    encounter_id: 'test-encounter-123',
                    invoice: {
                        amount_due: 100,
                        amount_paid: 50,
                        invoice_lines: [{}],
                    },
                },
            ],
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call ngOnInit and update diagnostics state', () => {
        spyOn(component, 'updateDiagnosticsState').and.callThrough();
        spyOn(dataLayer, 'list').and.returnValue(of({ Edges: [] }));
        component.ngOnInit();
        expect(component.updateDiagnosticsState).toHaveBeenCalled();
    });

    it('should toggle drawer state correctly', () => {
        expect(component.toggle['add-diagnosis-drawer']).toBeFalsy();

        component.toggleDrawer('add-diagnosis-drawer');
        expect(component.toggle['add-diagnosis-drawer']).toBeTrue();

        component.toggleDrawer('add-diagnosis-drawer');
        expect(component.toggle['add-diagnosis-drawer']).toBeFalse();
    });

    it('should toggle visibility of template sections', () => {
        const sectionId = component.templateSettings[0].id;
        expect(component.templateSettings[0].isHidden).toBeFalse();

        component.toggleIsHidden(sectionId);
        expect(component.templateSettings[0].isHidden).toBeTrue();

        component.toggleIsHidden(sectionId);
        expect(component.templateSettings[0].isHidden).toBeFalse();
    });

    it('should not throw on non-existent sectionId', () => {
        expect(() => component.toggleIsHidden('bad-id')).not.toThrow();
    });

    it('should set specimenInformationForm on event', () => {
        const mock = { id: 'abc' };
        component.handleSpecimenInformationData(mock);
        expect(component.specimenInformationForm).toEqual(mock);
    });

    it('should test component functions', () => {
        spyOn(component, 'setFilter').and.callThrough();
        component.setFilter({ id: 1 });
        expect(component.setFilter).toHaveBeenCalled();
    });

    describe('handleDiagnosisData', () => {
        it('should set diagnosisForm with provided data', () => {
            const formData = {
                diagnosis: 'Breast Cancer',
                stage_of_disease: 'Stage 1',
                icd_o_3_code_primary_tumor: 'C00',
                icd_o_3_code_morphology: 'M8000/3',
                additional_notes: 'Initial diagnosis',
            };

            component.handleDiagnosisData(formData);

            expect(component.diagnosisForm).toEqual(formData);
        });

        it('should handle null data', () => {
            component.handleDiagnosisData(null);
            expect(component.diagnosisForm).toBeNull();
        });

        it('should handle undefined data', () => {
            component.handleDiagnosisData(undefined);
            expect(component.diagnosisForm).toBeUndefined();
        });
    });

    describe('updateDiagnosticsState', () => {
        it('should set hasDiagnoses to true when diagnoses array has items', () => {
            component.diagnoses = [
                {
                    id: '1',
                    condition: 'Test',
                    recordedDate: '2023-01-01',
                },
            ];

            component.updateDiagnosticsState();

            expect(component.diagnosticsState.hasDiagnoses).toBe(true);
        });

        it('should set hasDiagnoses to false when diagnoses array is empty', () => {
            component.diagnoses = [];

            component.updateDiagnosticsState();

            expect(component.diagnosticsState.hasDiagnoses).toBe(false);
        });
    });

    describe('fetchExistingDiagnoses', () => {
        beforeEach(() => {
            component.patient = { clinical_id: 'patient-abc-123' } as any;
        });

        it('should fetch diagnoses and update state', () => {
            const mockNodes = [
                {
                    id: '1',
                    condition: 'Test Diagnosis 1',
                    recordedDate: '2023-01-01',
                },
                {
                    id: '2',
                    condition: 'Test Diagnosis 2',
                    recordedDate: '2023-01-02',
                },
            ];
            const mockResponse = {
                Edges: mockNodes.map(node => ({ Node: node })),
            };

            spyOn(dataLayer, 'list').and.returnValue(of(mockResponse));
            spyOn(component, 'updateDiagnosticsState');

            component.fetchExistingDiagnoses('patient-abc-123');

            expect(dataLayer.list).toHaveBeenCalledWith('condition-list', {
                patient_id: 'patient-abc-123',
            });
            expect(component.diagnoses).toEqual(mockNodes);
            expect(component.updateDiagnosticsState).toHaveBeenCalled();
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });

        it('should set diagnoses to empty array if response is null or not an array, and call error handler', () => {
            spyOn(component, 'updateDiagnosticsState');
            spyOn(errorHandler, 'handleError');

            spyOn(dataLayer, 'list').and.returnValue(of(null));
            component.fetchExistingDiagnoses('patient-abc-123');
            expect(component.diagnoses).toEqual([]);
            expect(component.updateDiagnosticsState).toHaveBeenCalledTimes(1);
            expect(errorHandler.handleError).not.toHaveBeenCalled();

            (dataLayer.list as jasmine.Spy).and.returnValue(
                of({ SomeOtherKey: 'value' })
            );
            component.fetchExistingDiagnoses('patient-abc-123');
            expect(component.diagnoses).toEqual([]);
            expect(component.updateDiagnosticsState).toHaveBeenCalledTimes(2);
            expect(errorHandler.handleError).not.toHaveBeenCalled();
        });

        it('should handle error when fetching diagnoses', () => {
            const error = new Error('Fetch error');
            spyOn(dataLayer, 'list').and.returnValue(throwError(() => error));
            spyOn(errorHandler, 'handleError');
            spyOn(component, 'updateDiagnosticsState');

            component.fetchExistingDiagnoses('patient-abc-123');

            expect(errorHandler.handleError).toHaveBeenCalledWith(
                error,
                component
            );
            expect(component.diagnoses).toEqual([]);
            expect(component.updateDiagnosticsState).toHaveBeenCalled();
        });
    });

    describe('submitDiagnosisInformation', () => {
        beforeEach(() => {
            component.encounterId = 'enc-123';
            component.patient = { clinical_id: 'patient-abc-123' } as any;
        });

        it('should call dataLayer.create with correct payload and fetch existing diagnoses on success', () => {
            const event = {
                icd_o_3_code_primary_tumor: 'C50.9',
                icd_o_3_code_morphology: '8500/3',
                behaviour: 'benign',
                grade: 'II',
                stage_of_disease: 'Stage 1',
                additional_notes: 'Patient stable',
                diagnosis: {
                    id: 'XA12C1',
                    display_name: 'Breast',
                },
            };
            const createSpy = spyOn(dataLayer, 'create').and.returnValue(
                of({})
            );
            const fetchDiagnosesSpy = spyOn(
                component,
                'fetchExistingDiagnoses'
            ).and.callThrough();
            const toggleDrawerSpy = spyOn(
                component,
                'toggleDrawer'
            ).and.callThrough();

            component.submitDiagnosisInformation(event);

            expect(createSpy).toHaveBeenCalledWith('diagnosis-information', {
                encounterId: 'enc-123',
                condition: {
                    code: 'XA12C1',
                    display: 'Breast',
                },
                ICDO3PrimaryTumorCode: 'C50.9',
                ICDO3MorphologyCode: '8500/3',
                behavior: 'benign',
                grade: 'II',
                stage: 'Stage 1',
                notes: 'Patient stable',
            });
            expect(fetchDiagnosesSpy).toHaveBeenCalledWith('patient-abc-123');
            expect(toggleDrawerSpy).toHaveBeenCalledWith(
                'add-diagnosis-drawer'
            );
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });

        it('should handle error from dataLayer.create and call errorHandler.handleError and toggleDrawer', () => {
            const event = {
                diagnosis: { display_name: 'Breast Cancer' },
                icd_o_3_code_primary_tumor: 'C50.9',
                icd_o_3_code_morphology: '8500/3',
                behavior: 'benign',
                grade: 'II',
                stage_of_disease: 'Stage 1',
                additional_notes: 'Patient stable',
            };
            const error = new Error('Test error');
            const createSpy = spyOn(dataLayer, 'create').and.returnValue(
                throwError(() => error)
            );
            const errorHandlerSpy = spyOn(
                errorHandler,
                'handleError'
            ).and.callThrough();
            const toggleDrawerSpy = spyOn(
                component,
                'toggleDrawer'
            ).and.callThrough();
            const fetchDiagnosesSpy = spyOn(
                component,
                'fetchExistingDiagnoses'
            ).and.callThrough();

            component.submitDiagnosisInformation(event);

            expect(createSpy).toHaveBeenCalled();
            expect(errorHandlerSpy).toHaveBeenCalledWith(error, component);
            expect(toggleDrawerSpy).toHaveBeenCalledWith(
                'add-diagnosis-drawer'
            );
            expect(fetchDiagnosesSpy).not.toHaveBeenCalled();
            expect(consoleErrorSpy).not.toHaveBeenCalled();
        });
    });
});
