import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitPatientTreatmentComponent } from './visit-patient-treatment.component';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { Cookies } from '../../../../../shared/cookies/cookie.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { StateService } from '@uirouter/angular';
import { VisitService } from '../../visit.service';
import { Authorization } from 'app/@core/auth/services/authorization.service';

const visitServiceStub = {
    visitPatientDataEmitter: of({
        new_price: 18,
        amount: '18',
        product_name: 'Lipid',
        quantity: 1,
        id: 1,
    }),
    visitPatientScreeningDataEmitter: of({
        age: 40,
        gender: 'MALE',
        servicePoints: [
            {
                encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                queue_name: 'Breast Cancer Screening',
                status: 'COMPLETED',
                previous_point: 'Triage',
            },
            {
                encounterID: 'e36fbc2f-a03e-4e9c-9080-af8a9817539e',
                queue_name: 'Cervical Cancer Screening',
                status: 'IN_PROGRESS',
                previous_point: 'Billing',
            },
        ],
    }),
    pricelistDataEmitter: of({
        name: 'Default pricelist',
        id: 1,
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
    setVisitData: () => {},
    addToQueue: () => {},
    visit: {
        id: 1,
        service_requests: [
            {
                invoice: {
                    amount_due: 100,
                    amount_paid: 100,
                    invoice_lines: [{ id: 1 }],
                },
            },
        ],
    },
};

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    transition() {
        return true;
    }
    transitionTo() {
        return true;
    }
    includes() {
        return true;
    }
}

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

class NbToastrServiceStub {
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    show(_message?: any, _title?: any, _config?: any) {}
}

class SilStoresServiceStub {
    create() {
        return of({
            id: '4ed62h7281262h1',
        });
    }
    list() {
        return of({
            results: [
                {
                    id: '8d9462ec-05d8-4eb3-97fb-561381ed922c',
                    template: 'a7a5ea0f-e0f1-4353-bd08-2f2732a3f825',
                },
            ],
        });
    }
    get() {
        return of({
            edges: [
                { node: { id: '1', name: 'Test Regimen 1', action: [] } },
                { node: { id: '2', name: 'Test Regimen 2', action: [] } },
            ],
        });
    }
}

class ErrorHandlerServiceStub {
    handleError() {
        return {};
    }
}

function mockPipe(name: string): Pipe {
    const metadata: Pipe = {
        name,
    };

    return Pipe(metadata)(
        class MockPipe implements PipeTransform {
            transform() {}
        }
    );
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
    getToken() {
        return {
            access_token: 'token',
        };
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
    getUserClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
    getWorkstation() {
        return {
            workstation__name: 'Breast Cancer Screening',
        };
    }
}

describe('VisitPatientTreatmentComponent', () => {
    let component: VisitPatientTreatmentComponent;
    let fixture: ComponentFixture<VisitPatientTreatmentComponent>;
    let httpMock: HttpTestingController;
    let toastrService: NbToastrService;
    let dataLayerService: SilStoresService;
    let errorHandlerService: ErrorHandlerService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VisitPatientTreatmentComponent],
            imports: [mockPipe('translate')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: TranslateService, useClass: TranslateServiceMock },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: StateService, useClass: StateServiceStub },

                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: ErrorHandlerService,
                    useClass: ErrorHandlerServiceStub,
                },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(VisitPatientTreatmentComponent);
        component = fixture.componentInstance;
        component.visitObservable = of({
            id: 1,
            person: { gender: 'MALE' },
            invoices: [{ id: 1 }],
            clinical_orders: [{ id: 1 }],
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 50,
                        invoice_lines: [{}],
                    },
                    encounter_id: '7742',
                    queue: '82742',
                },
            ],
        });

        toastrService = TestBed.inject(NbToastrService);
        dataLayerService = TestBed.inject(SilStoresService);
        errorHandlerService = TestBed.inject(ErrorHandlerService);
        fixture.detectChanges();
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call ngOnInit without errors', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should handle errors in ngOnInit', fakeAsync(() => {
        const testError = new Error('Test error');
        const errorHandler = TestBed.inject(ErrorHandlerService);
        spyOn(errorHandler, 'handleError');

        component.visitObservable = throwError(() => testError);

        expect(() => {
            component.ngOnInit();
            tick();
        }).toThrow();

        expect(errorHandler.handleError).toHaveBeenCalledWith(
            testError,
            component
        );
    }));

    it('should test showToast method and call toastrService.show', () => {
        spyOn(toastrService, 'show');
        component.showToast(
            NbGlobalPhysicalPosition.BOTTOM_RIGHT,
            'success',
            'Test Context',
            'Test Message'
        );
        expect(toastrService.show).toHaveBeenCalledWith(
            'Test Context',
            'Test Message',
            {
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                status: 'success',
                duration: component.toastTime,
            }
        );
    });

    it('should toggle drawer correctly', () => {
        expect(component.toggle['add-diagnostic-drawer']).toBeFalsy();

        component.toggleDrawer('add-diagnostic-drawer');
        expect(component.toggle['add-diagnostic-drawer']).toBeTruthy();

        component.toggleDrawer('add-diagnostic-drawer');
        expect(component.toggle['add-diagnostic-drawer']).toBeFalsy();
    });

    it('should toggle section visibility correctly', () => {
        const testSection = component.templateSettings[0];
        const sectionId = testSection.id;

        expect(testSection.isHidden).toBeFalse();

        component.toggleIsHidden(sectionId);
        expect(testSection.isHidden).toBeTrue();

        component.toggleIsHidden(sectionId);
        expect(testSection.isHidden).toBeFalse();
    });

    it('should handle toggleIsHidden with non-existent section ID', () => {
        expect(() => component.toggleIsHidden('non-existent-id')).not.toThrow();
    });

    it('should call editMedication and toggle the drawer', () => {
        component.medicationRegimen = [
            {
                id: 'med1',
                name: 'Med 1',
                dose: '10mg',
                method: 'Oral',
                route: 'Oral',
            },
            {
                id: 'med2',
                name: 'Med 2',
                dose: '20mg',
                method: 'IV',
                route: 'IV',
            },
        ];
        const medication = component.medicationRegimen[0];
        spyOn(component, 'toggleDrawer').and.callThrough();

        component.editMedication(medication);

        expect(component.selectedMedication.index).toBe(0);
        expect(component.toggleDrawer).toHaveBeenCalledWith(
            'edit-medication-drawer'
        );
        expect(component.toggle['edit-medication-drawer']).toBeTruthy();
    });

    it('should have templateSettings with premedication section', () => {
        const premedicationSection = component.templateSettings.find(
            section => section.id === 'premedication'
        );

        expect(premedicationSection).toBeDefined();
        expect(premedicationSection.name).toBe('Pre-medications');
        expect(premedicationSection.selected).toBeTrue();
        expect(premedicationSection.isHidden).toBeFalse();
    });

    it('should handle deleteMedication with invalid index', () => {
        const initialArray = [...component.medicationRegimen];
        const initialLength = initialArray.length;

        expect(() => component.deleteMedication(999)).not.toThrow();

        expect(component.medicationRegimen.length).toBe(initialLength);
    });

    it('should have templateSettings with additional_notes section', () => {
        const additionalNotesSection = component.templateSettings.find(
            section => section.id === 'additional_notes'
        );

        expect(additionalNotesSection).toBeDefined();
        expect(additionalNotesSection.name).toBe('Additional Notes');
        expect(additionalNotesSection.selected).toBeTrue();
        expect(additionalNotesSection.isHidden).toBeFalse();
    });

    it('should set showRegimenForm to false when onRegimenFormAction is called', () => {
        component.showRegimenForm = true;
        component.onRegimenFormAction();
        expect(component.showRegimenForm).toBeFalse();
    });

    it('should toggle showRegimenForm when toggleDrawer is called with "add-regimen-form" context', () => {
        component.showRegimenForm = false;
        component.toggleDrawer('add-regimen-form');
        expect(component.showRegimenForm).toBeTrue();

        component.toggleDrawer('add-regimen-form');
        expect(component.showRegimenForm).toBeFalse();
    });

    it('should toggle other drawer contexts when toggleDrawer is called with non-"add-regimen-form" context', () => {
        expect(component.toggle['add-diagnostic-drawer']).toBeFalsy();
        component.toggleDrawer('add-diagnostic-drawer');
        expect(component.toggle['add-diagnostic-drawer']).toBeTruthy();
        component.toggleDrawer('add-diagnostic-drawer');
        expect(component.toggle['add-diagnostic-drawer']).toBeFalsy();
    });

    it('should test handleReturnDateChange method', () => {
        component.returnDate = undefined;
        spyOn(component, 'handleReturnDateChange').and.callThrough();
        component.handleReturnDateChange({});
        expect(component.handleReturnDateChange).toHaveBeenCalledWith({});
    });

    describe('saveMedicationChanges', () => {
        it('should update medication when saveMedicationChanges is called', () => {
            component.medicationRegimen = [
                {
                    id: 'med1',
                    name: 'Med 1',
                    dose: '10mg',
                    method: 'Oral',
                    route: 'Oral',
                },
                {
                    id: 'med2',
                    name: 'Med 2',
                    dose: '20mg',
                    method: 'IV',
                    route: 'IV',
                },
            ];
            const originalMedication = component.medicationRegimen[0];
            const index = 0;
            const medicationData = { name: 'New Name', dose: '15mg' };

            component.selectedMedication = {
                ...originalMedication,
                ...medicationData,
                index,
            };

            spyOn(component, 'toggleDrawer').and.callThrough();

            component.saveMedicationChanges();

            expect(component.medicationRegimen[index].name).toBe('New Name');
            expect(component.medicationRegimen[index].dose).toBe('15mg');
            expect(component.toggleDrawer).toHaveBeenCalledWith(
                'edit-medication-drawer'
            );
            expect(component.selectedMedication).toBeNull();
        });

        it('should not update medication when selectedMedication is null', () => {
            component.selectedMedication = null;
            const originalMedications = [...component.medicationRegimen];

            spyOn(component, 'toggleDrawer');

            component.saveMedicationChanges();

            expect(component.toggleDrawer).not.toHaveBeenCalled();
            expect(component.medicationRegimen).toEqual(originalMedications);
        });

        it('should not update medication when index is undefined', () => {
            component.selectedMedication = {
                name: 'Test Med',
                dose: '10mg',
                frequency: 'daily',
                route: 'oral',
            };

            const originalMedications = [...component.medicationRegimen];

            spyOn(component, 'toggleDrawer');

            component.saveMedicationChanges();

            expect(component.toggleDrawer).not.toHaveBeenCalled();
            expect(component.medicationRegimen).toEqual(originalMedications);
        });

        describe('onMedicationDaySelected', () => {
            let dayMock: any;

            beforeEach(() => {
                component.medicationRegimen = [
                    {
                        name: 'Old Med',
                        dose: '10mg',
                        method: 'IV',
                        route: 'Oral',
                    },
                ];
                dayMock = {
                    title: 'Day 1',
                    description: 'Test day',
                    timingTiming: {},
                    action: [
                        { definitionCanonical: '/api/med1' },
                        { definitionCanonical: '/api/med2' },
                    ],
                };
            });

            it('should set premedicationLoading to true and reset medicationRegimen', () => {
                component.medicationRegimen = [
                    {
                        name: 'Old Med',
                        dose: '10mg',
                        method: 'IV',
                        route: 'Oral',
                    },
                ];
                component.premedicationLoading = false;
                component.onMedicationDaySelected(dayMock);
                expect(component.premedicationLoading).toBeTrue();
                expect(component.medicationRegimen).toEqual([]);
            });

            it('should fetch medication data and populate medicationRegimen', () => {
                component.onMedicationDaySelected(dayMock);

                const req1 = httpMock.expectOne('/api/med1');
                req1.flush({
                    productReference: { display: 'Med1', id: 'med1-id' },
                    dosage: [
                        {
                            route: { coding: [{ display: 'Oral' }] },
                            method: { coding: [{ display: 'IV' }] },
                        },
                    ],
                });

                const req2 = httpMock.expectOne('/api/med2');
                req2.flush({
                    productReference: { display: 'Med2', id: 'med2-id' },
                    dosage: [
                        {
                            route: { coding: [{ display: 'IM' }] },
                            method: { coding: [{ display: 'Injection' }] },
                        },
                    ],
                });

                expect(component.medicationRegimen.length).toBe(2);
                expect(component.medicationRegimen[0]).toEqual({
                    name: 'Med1',
                    route: 'Oral',
                    method: 'IV',
                    dose: '-',
                    id: 'med1-id',
                });
                expect(component.medicationRegimen[1]).toEqual({
                    name: 'Med2',
                    route: 'IM',
                    method: 'Injection',
                    dose: '-',
                    id: 'med2-id',
                });
            });

            it('should call cdr.detectChanges and set premedicationLoading to false on complete', () => {
                const detectChangesSpy = spyOn(
                    component['cdr'],
                    'detectChanges'
                ).and.callThrough();
                component.premedicationLoading = true;
                component.onMedicationDaySelected(dayMock);

                // Complete both requests
                const req1 = httpMock.expectOne('/api/med1');
                req1.flush({
                    productReference: { display: 'Med1', id: 'med1-id' },
                    dosage: [
                        {
                            route: { coding: [{ display: 'Oral' }] },
                            method: { coding: [{ display: 'IV' }] },
                        },
                    ],
                });

                const req2 = httpMock.expectOne('/api/med2');
                req2.flush({
                    productReference: { display: 'Med2', id: 'med2-id' },
                    dosage: [
                        {
                            route: { coding: [{ display: 'IM' }] },
                            method: { coding: [{ display: 'Injection' }] },
                        },
                    ],
                });

                expect(detectChangesSpy).toHaveBeenCalled();
                expect(component.premedicationLoading).toBeFalse();
            });

            it('should handle empty action array without errors', () => {
                const emptyDay = { ...dayMock, action: [] };
                expect(() =>
                    component.onMedicationDaySelected(emptyDay)
                ).not.toThrow();
                expect(component.medicationRegimen).toEqual([]);
            });
        });
    });

    describe('submitData', () => {
        beforeEach(() => {
            // Re-inject services for this test suite
            dataLayerService = TestBed.inject(SilStoresService);
            errorHandlerService = TestBed.inject(ErrorHandlerService);
        });

        it('should call dataLayer.create with correct payload and handle success', () => {
            component.encounterId = 'b369f9fe-bf45-471a-b0ea-7df0442e80aa';
            component.medicationRegimen = [
                {
                    name: 'Test Med',
                    dose: '10mg',
                    method: 'IV',
                    route: 'Oral',
                    id: 'aa32ff97-e4fb-47f5-b90a-07a53c4f5846',
                },
            ];

            spyOn(dataLayerService, 'create').and.returnValue(
                of({ success: true })
            );
            spyOn(component, 'showToast');

            component.submitData();

            expect(dataLayerService.create).toHaveBeenCalledWith(
                'medication-request',
                jasmine.objectContaining({
                    encounterID: 'b369f9fe-bf45-471a-b0ea-7df0442e80aa',
                    medications: jasmine.arrayContaining([
                        jasmine.objectContaining({
                            medicationID:
                                'aa32ff97-e4fb-47f5-b90a-07a53c4f5846',
                            priority: 'asap',
                            dosageInstructions: jasmine.any(Array),
                        }),
                    ]),
                })
            );

            expect(component.showToast).toHaveBeenCalledWith(
                'bottom-right',
                'success',
                'Treatment data submitted successfully!',
                'Submission'
            );
        });

        it('should handle errors when submitting data', () => {
            const testError = new Error('Test error');
            spyOn(dataLayerService, 'create').and.returnValue(
                throwError(() => testError)
            );
            spyOn(errorHandlerService, 'handleError');

            component.submitData();

            expect(errorHandlerService.handleError).toHaveBeenCalledWith(
                testError,
                component
            );
        });
    });

    describe('onRegimenSelected', () => {
        it('should update selectedRegimen when a regimen is selected', () => {
            const mockRegimen = { id: '123', name: 'Test Regimen', action: [] };
            spyOn(component['cdr'], 'detectChanges');

            component.onRegimenSelected(mockRegimen);

            expect(component.selectedRegimen).toEqual(mockRegimen);
            expect(component['cdr'].detectChanges).toHaveBeenCalled();
        });
    });

    describe('onNotesChange', () => {
        it('should update additionalNotes when notes are changed', () => {
            const mockEvent = { target: { value: 'Test notes content' } };

            component.onNotesChange(mockEvent);

            expect(component.additionalNotes).toEqual('Test notes content');
        });
    });

    describe('submitCareplan', () => {
        beforeEach(() => {
            // Re-inject services for this test suite
            dataLayerService = TestBed.inject(SilStoresService);
            errorHandlerService = TestBed.inject(ErrorHandlerService);
            component.loading = {};
            component.encounterId = 'test-encounter-id';
        });

        it('should show warning toast if no regimen is selected', () => {
            component.selectedRegimen = null;
            spyOn(component, 'showToast');
            spyOn(dataLayerService, 'create');

            component.submitCareplan();

            expect(component.showToast).toHaveBeenCalledWith(
                'bottom-right',
                'warning',
                'No regimen selected',
                'Please select a regimen before submitting'
            );
            expect(dataLayerService.create).not.toHaveBeenCalled();
        });

        it('should submit careplan with correct payload', fakeAsync(() => {
            component.selectedRegimen = {
                id: 'regimen-123',
                name: 'Test Regimen',
            };
            component.additionalNotes = 'Test notes for careplan';

            spyOn(dataLayerService, 'create').and.returnValue(
                of({ id: 'careplan-123' })
            );
            spyOn(component, 'showToast');
            spyOn(component['cdr'], 'detectChanges');

            component.submitCareplan();
            tick();

            expect(component.loading['careplan']).toBeFalse();
            expect(dataLayerService.create).toHaveBeenCalledWith('careplan', {
                encounterID: 'test-encounter-id',
                planDefinitionID: 'regimen-123',
                notes: 'Test notes for careplan',
            });
            tick(1500);
            expect(component.showToast).toHaveBeenCalledWith(
                'bottom-right',
                'success',
                'Care Plan submitted successfully!',
                'Submission'
            );
            expect(component['cdr'].detectChanges).toHaveBeenCalled();
        }));

        it('should handle errors when submitting careplan', fakeAsync(() => {
            component.selectedRegimen = {
                id: 'regimen-123',
                name: 'Test Regimen',
            };
            const testError = new Error('Test error');

            spyOn(dataLayerService, 'create').and.returnValue(
                throwError(() => testError)
            );
            spyOn(errorHandlerService, 'handleError');

            component.submitCareplan();
            tick();

            expect(component.loading['careplan']).toBeFalse();
            expect(errorHandlerService.handleError).toHaveBeenCalledWith(
                testError,
                component
            );
        }));
    });

    describe('getPlanDefinition', () => {
        beforeEach(() => {
            // Re-inject services for this test suite
            dataLayerService = TestBed.inject(SilStoresService);
            errorHandlerService = TestBed.inject(ErrorHandlerService);
            component.loading = {};
        });

        it('should set loading state to true when fetching plan definition data', () => {
            component.getPlanDefinition();
            expect(component.loading['planDefinition']).toBeFalse();
        });

        it('should fetch plan definition data and map edges to nodes', fakeAsync(() => {
            const mockResponse = {
                edges: [
                    { node: { id: '1', name: 'Test Regimen 1', action: [] } },
                    { node: { id: '2', name: 'Test Regimen 2', action: [] } },
                ],
            };
            spyOn(dataLayerService, 'get').and.returnValue(of(mockResponse));
            spyOn(component['cdr'], 'detectChanges');

            component.getPlanDefinition();
            tick();

            expect(dataLayerService.get).toHaveBeenCalledWith(
                'plan-definition'
            );
            expect(component.planDefinitionData.length).toBe(2);
            expect(component.planDefinitionData[0]).toEqual(
                mockResponse.edges[0].node
            );
            expect(component.planDefinitionData[1]).toEqual(
                mockResponse.edges[1].node
            );
            expect(component.loading['planDefinition']).toBeFalse();
            expect(component['cdr'].detectChanges).toHaveBeenCalled();
        }));

        it('should handle empty response from plan definition API', fakeAsync(() => {
            spyOn(dataLayerService, 'get').and.returnValue(of({}));
            spyOn(component['cdr'], 'detectChanges');

            component.getPlanDefinition();
            tick(); // Process the observable

            expect(component.planDefinitionData).toEqual([]);
            expect(component.loading['planDefinition']).toBeFalse();
            expect(component['cdr'].detectChanges).toHaveBeenCalled();
        }));

        it('should handle null response from plan definition API', fakeAsync(() => {
            spyOn(dataLayerService, 'get').and.returnValue(of(null));
            spyOn(component['cdr'], 'detectChanges');

            component.getPlanDefinition();
            tick();

            expect(component.planDefinitionData).toEqual([]);
            expect(component.loading['planDefinition']).toBeFalse();
            expect(component['cdr'].detectChanges).toHaveBeenCalled();
        }));

        it('should handle error when fetching plan definition data', fakeAsync(() => {
            const testError = new Error('Test error');
            spyOn(dataLayerService, 'get').and.returnValue(
                throwError(() => testError)
            );
            spyOn(errorHandlerService, 'handleError');

            component.getPlanDefinition();
            tick();

            expect(component.loading['planDefinition']).toBeFalse();
            expect(errorHandlerService.handleError).toHaveBeenCalledWith(
                testError,
                component
            );
        }));
    });

    describe('getCarePlan', () => {
        beforeEach(() => {
            component.loading = {};
            component.encounterId = 'test-encounter-id';
        });

        it('should set loading state to true when fetching care plan data', () => {
            component.getCarePlan('test-encounter-id');
            expect(component.loading['carePlan']).toBeFalse();
        });

        it('should fetch care plan data and update component state', fakeAsync(() => {
            const mockResponse = {
                results: [
                    {
                        id: 'careplan-1',
                        planDefinition: { display: 'Test Plan 1' },
                    },
                    {
                        id: 'careplan-2',
                        planDefinition: { display: 'Test Plan 2' },
                    },
                ],
            };

            spyOn(dataLayerService, 'list').and.returnValue(of(mockResponse));
            spyOn(component['cdr'], 'detectChanges');

            component.getCarePlan('test-encounter-id');
            tick();

            expect(dataLayerService.list).toHaveBeenCalledWith('careplan', {
                encounterID: 'test-encounter-id',
            });
            expect(component.carePlanData).toEqual({
                ...mockResponse,
                encounterId: 'test-encounter-id',
            });
            expect(component.loading['carePlan']).toBeFalse();
            expect(component['cdr'].detectChanges).toHaveBeenCalled();
        }));

        it('should handle error when fetching care plan data', fakeAsync(() => {
            const testError = new Error('Test error');
            spyOn(dataLayerService, 'list').and.returnValue(
                throwError(() => testError)
            );
            spyOn(errorHandlerService, 'handleError');

            component.getCarePlan('test-encounter-id');
            tick();

            expect(component.loading['carePlan']).toBeFalse();
        }));
    });

    describe('setEncounterId', () => {
        it('should set encounterId from the first service request', () => {
            const serviceRequests = [
                { encounter_id: 'test-encounter-123', queue: 'test-queue' },
                { encounter_id: 'test-encounter-456', queue: 'another-queue' },
            ];

            component.setEncounterId(serviceRequests);
            expect(component.encounterId).toBe('test-encounter-123');
        });

        it('should not set encounterId when service requests array is empty', () => {
            component.encounterId = 'original-id';
            component.setEncounterId([]);
            expect(component.encounterId).toBe('original-id');
        });

        it('should not set encounterId when service requests is null or undefined', () => {
            component.encounterId = 'original-id';
            component.setEncounterId(null);
            expect(component.encounterId).toBe('original-id');

            component.setEncounterId(undefined);
            expect(component.encounterId).toBe('original-id');
        });
    });

    describe('ngOnInit integration', () => {
        it('should call getCarePlan and getPlanDefinition when visit data is received', () => {
            spyOn(component, 'getCarePlan');
            spyOn(component, 'getPlanDefinition');
            spyOn(component, 'setEncounterId').and.callThrough();
            spyOn(component.visitService, 'setVisitData');

            const mockVisitData = {
                id: 1,
                service_requests: [{ encounter_id: 'test-encounter-id' }],
            };

            component.visitObservable = of(mockVisitData);
            component.ngOnInit();

            expect(component.visitService.setVisitData).toHaveBeenCalledWith(
                mockVisitData
            );
            expect(component.setEncounterId).toHaveBeenCalledWith(
                mockVisitData.service_requests
            );
            expect(component.getCarePlan).toHaveBeenCalledWith(
                'test-encounter-id'
            );
            expect(component.getPlanDefinition).toHaveBeenCalled();
        });
    });
    it('should test scheduleNextAppointment function if returnDate is defined', () => {
        spyOn(component, 'scheduleNextAppointment').and.callThrough();
        component.returnDate = '2024-09-15';
        component.workstation = {
            workstation: '9ecc89da-7977-406f-a682-6115a283442a',
            workstation__name: 'Cervical Cancer Screening',
            workstation__org_unit__name: 'Mombasa Empower Main Dept.',
            workstation__org_unit: 'c8b85542-c837-4cd9-9296-5341fec044b6',
            workstation__org_unit__parent__name: 'Mombasa (Main) Branch Clinic',
            workstation__org_unit__parent:
                'f2f03610-0319-4f59-b374-0cdf051cbbd0',
            workstation__org_unit__parent__parent__name: 'Main Cluster',
            workstation__org_unit__parent__parent:
                '9ffae8cc-1b13-4c63-89af-66a1fe2b9e5d',
        };

        component.scheduleNextAppointment();
        expect(component.scheduleNextAppointment).toHaveBeenCalled();
    });

    describe('visitPatientObservable', () => {
        it('should set patient when visitPatientObservable emits', () => {
            component.patient = undefined;
            component.visitPatientObservable();
            expect(component.patient).toBeDefined();
        });
    });

    it('should test scheduleNextfAppointment function on response error', () => {
        const mockErrorResponse = {
            error: {
                message: 'No schedules available',
            },
        };
        spyOn(component.dataLayer, 'create').and.returnValue(
            throwError(() => mockErrorResponse)
        );
        spyOn(component, 'toggleDrawer');

        component.scheduleNextAppointment();
        expect(component.dataLayer.create).toHaveBeenCalled();
        expect(component.loading['scheduleAppointment']).toBeFalse();
        expect(component.toggleDrawer).toHaveBeenCalled();
    });

    it('should test scheduleNextAppointment function on response error with no error message', () => {
        spyOn(component.dataLayer, 'create').and.returnValue(
            throwError(() => new Error())
        );
        spyOn(component, 'toggleDrawer');

        component.scheduleNextAppointment();
        expect(component.dataLayer.create).toHaveBeenCalled();
        expect(component.loading['scheduleAppointment']).toBeFalse();
        expect(component.toggleDrawer).toHaveBeenCalled();
    });

    describe('getValueSets', () => {
        it('should set formSelectOptions method and route on success', () => {
            const mockMethodResponse = {
                compose: {
                    include: [
                        { concept: [{ code: 'IV', display: 'Intravenous' }] },
                    ],
                },
            };
            const mockRouteResponse = {
                compose: {
                    include: [{ concept: [{ code: 'PO', display: 'Oral' }] }],
                },
            };

            component.getValueSets();

            httpMock
                .match(req =>
                    req.url.includes('/fhir/ValueSet/sghi-method-value-set')
                )
                .forEach(req => req.flush(mockMethodResponse));

            httpMock
                .match(req =>
                    req.url.includes('/fhir/ValueSet/route-of-administration')
                )
                .forEach(req => req.flush(mockRouteResponse));

            expect(component.formSelectOptions.method).toEqual(
                mockMethodResponse.compose.include[0].concept
            );
            expect(component.formSelectOptions.route).toEqual(
                mockRouteResponse.compose.include[0].concept
            );
        });

        it('should call errorHandler.handleError on method value set error', () => {
            spyOn(errorHandlerService, 'handleError');
            component.getValueSets();

            httpMock
                .match(req =>
                    req.url.includes('/fhir/ValueSet/sghi-method-value-set')
                )
                .forEach(req => req.error(new ProgressEvent('Error')));

            expect(errorHandlerService.handleError).toHaveBeenCalled();
        });
        it('should call errorHandler.handleError on route value set error', () => {
            spyOn(errorHandlerService, 'handleError');
            component.getValueSets();

            httpMock
                .match(req =>
                    req.url.includes('/fhir/ValueSet/route-of-administration')
                )
                .forEach(req => req.error(new ProgressEvent('Error')));

            expect(errorHandlerService.handleError).toHaveBeenCalled();
        });
    });
});
