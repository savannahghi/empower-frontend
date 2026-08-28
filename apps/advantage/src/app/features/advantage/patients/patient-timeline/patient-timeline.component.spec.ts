import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
import { PatientTimelineComponent } from './patient-timeline.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import {
    NbDialogRef,
    NbFocusMonitor,
    NbIconLibraries,
    NbStatusService,
    NbToastrService,
    NbDialogService,
} from '@nebular/theme';
import { AnalyticsService } from 'app/@core/utils';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { AuthenticationService } from 'app/@core/auth/services/authentication.service';
import { PatientService } from '../patient.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

class NbDialogServiceStub {
    open() {
        return { onClose: of({}) };
    }
}

class SilStoresServiceStub {
    create() {
        return of([]);
    }
    listNested(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        storeName: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        view: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        id: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        opts?: any,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        removeSlash?: boolean
    ) {
        return of({
            totalCount: 50,
            timeline: [
                {
                    date: '2025-03-18',
                    resourceType: 'Observation',
                    timeRecorded: '2025-03-18T12:07:36Z',
                    name: 'Systolic blood pressure',
                    category: 'Vital Signs',
                    value: '10.0',
                },
                {
                    date: '2025-03-18',
                    resourceType: 'Observation',
                    timeRecorded: '2025-03-18T11:00:00Z',
                    name: 'Body weight',
                    category: 'Vital Signs',
                    value: '70',
                },
                {
                    date: '2025-03-18',
                    resourceType: 'Observation',
                    timeRecorded: '2025-03-18T10:00:00Z',
                    name: 'Glucose',
                    category: 'Laboratory',
                    value: '90',
                },
                {
                    date: '2025-03-17',
                    resourceType: 'Encounter',
                    timeRecorded: '2025-03-17T09:00:00Z',
                    name: 'Routine Checkup',
                },
                {
                    date: '2025-03-17',
                    resourceType: 'Observation',
                    timeRecorded: '2025-03-17T08:30:00Z',
                    name: 'Physical Examination',
                    category: 'Exam',
                    value: 'Normal',
                },
                {
                    id: '52cb950a-1023-4b4a-9048-62bfa521e925',
                    resourceType: 'Observation',
                    name: 'History of family member diseases Narrative',
                    value: 'FM',
                    status: 'final',
                    date: '2025-07-18',
                    timeRecorded: '2025-07-18T11:57:43Z',
                    category: 'Social History',
                },
            ],
        });
    }
}

class AuthorizationConfigStub {
    setAuthDetails() {
        return of(() => {});
    }
    loginUrl() {
        return of(() => {});
    }
    logout() {
        return of(() => {});
    }
    storeToken() {
        return true;
    }
    isLoggedIn() {
        return true;
    }

    setOrganisationSettings() {
        return of(() => {});
    }

    getOrgSettings() {
        return [
            {
                name: 'patients:patient_full_name',
                value: false,
            },
        ];
    }

    setOrganisation() {
        return of(() => {});
    }
    setOrganisationDetails() {
        return of({
            client_types: ['PRACTITIONER'],
        });
    }
    setUserDetails() {
        return of(() => {});
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
    getUserClinicalIds() {
        return this.setClinicalIds();
    }

    setUser() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: 'advantage.visit_list',
        };
    }

    getUser() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: 'advantage.visit_list',
        };
    }
    getToken() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: 'advantage.visit_list',
        };
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {
            id: 'mock-workstation-id',
            name: 'Mock Workstation',
        };
    }
    setAdvantageOrganisation() {
        return {};
    }
    setAdvantageOrganisationDetails() {
        return of(() => {});
    }
    getErpOrganisation() {
        return {
            client_types: ['PROVIDER'],
            user_workstations: [{ workstation: '1' }],
        };
    }
    removeTokenData() {
        return {};
    }
}

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params: {
        is_logged_out: 'true',
    },
    $current: {
        is: () => true,
    },
};

class AuthenticationServiceStub {
    isAuthenticated() {
        return true;
    }
    checkPermission() {
        return true;
    }
}

class PatientServiceStub {
    patientVisitDataEmitter() {
        return of({
            id: '143224',
        });
    }
    setPatient(data) {
        return data;
    }
}

class ErrorHandlerServiceStub {
    handleError() {
        return {};
    }
}

describe('PatientTimelineComponent', () => {
    let component: PatientTimelineComponent;
    let fixture: ComponentFixture<PatientTimelineComponent>;
    let errorHandlerService: ErrorHandlerService;

    class NbStatusServiceStub {
        isCustomStatus() {}
        monitor() {
            return of(() => {});
        }
        getIcon() {}
        getPack() {}
        registerSvgPack() {}
        setDefaultPack() {}
        connectedTo() {}
        build() {}
        close() {}
        getDirection() {}
        subscribeOnTriggers() {}
        trigger() {}
        host() {}
        container() {}
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PatientTimelineComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: NbIconLibraries, useClass: NbStatusServiceStub },
                { provide: NbFocusMonitor, useClass: NbStatusServiceStub },
                { provide: NbDialogService, useClass: NbDialogServiceStub },
                { provide: NbDialogRef, useClass: NbStatusServiceStub },
                {
                    provide: ErrorHandlerService,
                    useClass: ErrorHandlerServiceStub,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PatientTimelineComponent);
        component = fixture.componentInstance;
        errorHandlerService = TestBed.inject(ErrorHandlerService);
        component.patientObservable = of({
            id: 1,
            person: { gender: 'MALE' },
            clinical_id: 'some-clinical-id',
            vitals_reference_ranges: {
                BMI: [{ display: 'Display', end: 16, start: 1 }],
                PULSE_RATE: [{ display: 'Display', end: 16, start: 1 }],
                RESPIRATION_RATE: [{ display: 'Display', end: 16, start: 1 }],
                SPO2: [{ display: 'Display', end: 16, start: 1 }],
                DIASTOLIC_BLOOD_PRESSURE: [
                    { display: 'display name', end: 16, start: 1 },
                ],
                SYSTOLIC_BLOOD_PRESSURE: [
                    { display: 'display name', end: 16, start: 1 },
                ],
                TEMPERATURE: [{ display: 'display name', end: 16, start: 1 }],
                MUAC: [{ display: 'display name', end: 16, start: 1 }],
            },
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('onPaginationChange', () => {
        beforeEach(() => {
            spyOn(component, 'getPatientTimeline');
        });

        it('should call getPatientTimeline with offset and count for FHIR-like event', () => {
            const event = { offset: 10, count: 5, _getpages: 'page123' };
            component.onPaginationChange(event);
            expect(component.getPatientTimeline).toHaveBeenCalledWith({
                offset: 10,
                count: 5,
                _getpages: 'page123',
            });
        });

        it('should call getPatientTimeline with calculated offset and default count for page event', () => {
            const event = { page: 3 };
            component.defaultPageSize = 100;
            component.onPaginationChange(event);
            expect(component.getPatientTimeline).toHaveBeenCalledWith({
                offset: 200,
                count: 100,
            });
        });

        it('should not call getPatientTimeline for "after" event (GraphQL, returns early)', () => {
            const event = { after: 'some_cursor' };
            component.onPaginationChange(event);
            expect(component.getPatientTimeline).not.toHaveBeenCalled();
        });

        it('should not call getPatientTimeline for "before" event (GraphQL, returns early)', () => {
            const event = { before: 'some_cursor' };
            component.onPaginationChange(event);
            expect(component.getPatientTimeline).not.toHaveBeenCalled();
        });

        it('should set loadingTimeline to true before calling getPatientTimeline if already loading', done => {
            component.loadingTimeline = true;
            const event = { page: 1 };

            component.onPaginationChange(event);

            expect(component.loadingTimeline).toBe(true);

            setTimeout(() => {
                expect(component.getPatientTimeline).toHaveBeenCalled();
                done();
            }, 0);
        });

        it('should test the showToast method', () => {
            spyOn(component, 'showToast').and.callThrough();
            component.showToast(
                'bottom-right',
                'success',
                'message',
                'context'
            );
            expect(component.showToast).toHaveBeenCalled();
        });

        it('should set loadingTimeline to true in timer finalize when already loading', fakeAsync(() => {
            component.loadingTimeline = true;

            component.onPaginationChange({ page: 1 });
            tick(200);

            expect(component.loadingTimeline).toBe(true);
        }));
    });

    describe('getPatientTimeline', () => {
        beforeEach(() => {
            component.patient = { clinical_id: 'patient123' };
            component.defaultPageSize = 20;
        });

        it('should call listNested with correct parameters', () => {
            spyOn(component, 'getPatientTimeline').and.callThrough();
            const params = { offset: 0, count: 20 };
            component.patientObservable = {
                person: { gender: 'MALE' },
                clinical_id: 'test-id',
            };
            component.getPatientInfo();
            component.getPatientTimeline(params);
            expect(component.getPatientTimeline).toHaveBeenCalled();
        });

        it('should call handleTimelineResponse with the response data', () => {
            const response = { totalCount: 50, timeline: [] };
            spyOn(component, 'handleTimelineResponse').and.callThrough();
            component.handleTimelineResponse(response);
            expect(component.handleTimelineResponse).toHaveBeenCalled();
        });

        it('should handle error when listNested fails', () => {
            const error = new Error('API Error');
            const handleTimelineErrorSpy = spyOn(
                component,
                'handleTimelineError'
            ).and.callThrough();
            component.handleTimelineError(error);
            expect(handleTimelineErrorSpy).toHaveBeenCalled();
        });

        it('should set loadingTimeline to true when called', () => {
            component.loadingTimeline = true;
            component.getPatientTimeline({ offset: 0, count: 20 });
            expect(component.loadingTimeline).toBe(true);
        });
    });

    describe('handleTimelineResponse', () => {
        let groupTimelineByDateSpy: jasmine.Spy;

        beforeEach(() => {
            groupTimelineByDateSpy = spyOn(component, 'groupTimelineByDate');
        });

        it('should set paginationData, totalItems, and call groupTimelineByDate', () => {
            const mockResponse = {
                totalCount: 100,
                timeline: [{ id: 1 }],
                otherData: 'test',
            };
            component.handleTimelineResponse(mockResponse);
            expect(component.paginationData).toEqual(mockResponse);
            expect(component.totalItems).toBe(100);
            expect(groupTimelineByDateSpy).toHaveBeenCalledWith({
                data: {
                    patientHealthTimeline: {
                        timeline: mockResponse.timeline,
                    },
                },
            });
        });

        it('should set totalItems to 0 if totalCount is missing or null', () => {
            const mockResponse = {
                timeline: [{ id: 1 }],
            };
            component.handleTimelineResponse(mockResponse);
            expect(component.totalItems).toBe(0);

            const mockResponse2 = {
                totalCount: null,
                timeline: [{ id: 1 }],
            };
            component.handleTimelineResponse(mockResponse2);
            expect(component.totalItems).toBe(0);
        });

        it('should pass empty timeline array to groupTimelineByDate if missing or null', () => {
            const mockResponse = {
                totalCount: 10,
            };
            component.handleTimelineResponse(mockResponse);
            expect(groupTimelineByDateSpy).toHaveBeenCalledWith({
                data: {
                    patientHealthTimeline: {
                        timeline: [],
                    },
                },
            });
        });

        it('should set totalItems to 0 when totalCount is 0', () => {
            const mockResponse = {
                totalCount: 0,
                timeline: [{ id: 1 }],
            };
            component.handleTimelineResponse(mockResponse);
            expect(component.totalItems).toBe(0);
        });
    });

    describe('handleTimelineError', () => {
        let showToastErrorSpy: jasmine.Spy;
        let errorHandlerSpy: jasmine.Spy;

        beforeEach(() => {
            showToastErrorSpy = spyOn(component, 'showToastError');
            errorHandlerSpy = spyOn(errorHandlerService, 'handleError');
        });

        it('should display a toast error and set loading states to false', () => {
            const error = { message: 'Network error' };
            component.loadingResult = true;
            component.loadingTimeline = true;

            component.handleTimelineError(error);

            expect(showToastErrorSpy).toHaveBeenCalledWith(
                'bottom-right',
                'danger',
                'Error',
                error.message
            );
            expect(component.loadingResult).toBe(false);
            expect(component.loadingTimeline).toBe(false);
            expect(errorHandlerSpy).toHaveBeenCalledWith(error, component);
        });
    });

    describe('Vital Configuration Methods', () => {
        it('getVitalConfig should return correct config for supported vital', () => {
            const config = component.getVitalConfig('Body weight');
            expect(config).toEqual({
                displayName: 'Weight',
                unit: 'kg',
                translationKey: 'patients.timeline_details.weight',
                hasReference: false,
            });
        });

        it('getVitalConfig should return null for unsupported vital', () => {
            const config = component.getVitalConfig('Unsupported Vital');
            expect(config).toBeNull();
        });

        it('isVitalSupported should return true for supported vital', () => {
            expect(component.isVitalSupported('Body height')).toBeTrue();
        });

        it('isVitalSupported should return false for unsupported vital', () => {
            expect(component.isVitalSupported('Unknown Vital')).toBeFalse();
        });
    });

    describe('getPatientVitalReference', () => {
        beforeEach(() => {
            component.patient = {
                vitals_reference_ranges: {
                    BMI: [{ display: 'Normal BMI', start: 1, end: 16 }],
                    PULSE_RATE: [
                        { display: 'Normal Pulse', start: 60, end: 100 },
                    ],
                    SYSTOLIC_BLOOD_PRESSURE: [
                        { display: 'Optimal', start: 1, end: 120 },
                        { display: 'Elevated', start: 120, end: 130 },
                    ],
                },
            };
        });

        it('should return display for a matching vital reference range', () => {
            const observation = { name: 'Body mass index', value: 10 };
            const result = component.getPatientVitalReference(observation);
            expect(result).toBe('Normal BMI');
        });

        it('should return undefined if no matching vital reference range', () => {
            const observation = { name: 'Body mass index', value: 20 };
            const result = component.getPatientVitalReference(observation);
            expect(result).toBeUndefined();
        });

        it('should return undefined if vital name is not in map', () => {
            const observation = { name: 'Some Other Vital', value: 10 };
            const result = component.getPatientVitalReference(observation);
            expect(result).toBeUndefined();
        });

        it('should return undefined if patient vitals_reference_ranges is null', () => {
            component.patient.vitals_reference_ranges = null;
            const observation = { name: 'Body mass index', value: 10 };
            const result = component.getPatientVitalReference(observation);
            expect(result).toBeUndefined();
        });

        it('should handle edge cases for range inclusivity (start <= value < end)', () => {
            const observation1 = {
                name: 'Systolic blood pressure',
                value: 120,
            };
            const result1 = component.getPatientVitalReference(observation1);
            expect(result1).toBe('Elevated');

            const observation2 = {
                name: 'Systolic blood pressure',
                value: 119,
            };
            const result2 = component.getPatientVitalReference(observation2);
            expect(result2).toBe('Optimal');
        });
    });

    describe('groupTimelineByDate', () => {
        it('should correctly filter and sort Vital Signs, Laboratory, and Exam observations', () => {
            const mockResponse = {
                data: {
                    patientHealthTimeline: {
                        timeline: [
                            {
                                date: '2025-03-18',
                                resourceType: 'Observation',
                                timeRecorded: '2025-03-18T12:00:00Z',
                                name: 'Heart rate',
                                category: 'Vital Signs',
                                value: '75',
                            },
                            {
                                date: '2025-03-18',
                                resourceType: 'Observation',
                                timeRecorded: '2025-03-18T10:00:00Z',
                                name: 'Body mass index',
                                category: 'Vital Signs',
                                value: '22',
                            },
                            {
                                date: '2025-03-18',
                                resourceType: 'Observation',
                                timeRecorded: '2025-03-18T09:00:00Z',
                                name: 'Blood Culture',
                                category: 'Laboratory',
                                value: 'Negative',
                            },
                            {
                                date: '2025-03-18',
                                resourceType: 'Observation',
                                timeRecorded: '2025-03-18T11:00:00Z',
                                name: 'Urinalysis',
                                category: 'Laboratory',
                                value: 'Normal',
                            },
                            {
                                date: '2025-03-18',
                                resourceType: 'Observation',
                                timeRecorded: '2025-03-18T08:00:00Z',
                                name: 'Skin Exam',
                                category: 'Exam',
                                value: 'Clear',
                            },
                            {
                                date: '2025-03-18',
                                resourceType: 'Observation',
                                timeRecorded: '2025-03-18T13:00:00Z',
                                name: 'Dental Exam',
                                category: 'Exam',
                                value: 'Cavity',
                            },
                            {
                                date: '2025-03-18',
                                resourceType: 'Condition',
                                timeRecorded: '2025-03-18T07:00:00Z',
                                name: 'Hypertension',
                            },
                            {
                                date: '2025-03-18',
                                resourceType: 'Observation',
                                timeRecorded: '2025-03-18T14:00:00Z',
                                name: 'Unsupported Vital',
                                category: 'Vital Signs',
                                value: '10',
                            },
                            {
                                date: '2025-03-18',
                                resourceType: 'Observation',
                                timeRecorded: '2025-03-18T15:00:00Z',
                                name: '',
                                category: 'Laboratory',
                                value: '10',
                            },
                            {
                                resourceType: 'Observation',
                                name: 'History of family member diseases Narrative',
                                value: 'FM',
                                status: 'final',
                                date: '2025-03-18',
                                timeRecorded: '2025-07-18T11:57:43Z',
                                category: 'Social History',
                            },
                            {
                                resourceType: 'Observation',
                                name: 'History of family member diseases Narrative',
                                value: 'HPI',
                                status: 'final',
                                date: '2025-03-18',
                                timeRecorded: '2025-07-19T11:57:43Z',
                                category: 'Social History',
                            },
                        ],
                    },
                },
            };

            const result = component.groupTimelineByDate(mockResponse);
            const todayTimeline = result[0];

            expect(todayTimeline['Observation'].length).toBe(2);
            expect(todayTimeline['Observation'][0].name).toBe('Heart rate');
            expect(todayTimeline['Observation'][1].name).toBe(
                'Body mass index'
            );

            expect(todayTimeline['Laboratory'].length).toBe(2);
            expect(todayTimeline['Laboratory'][1].name).toBe('Urinalysis');
            expect(todayTimeline['Laboratory'][0].name).toBe('Blood Culture');

            expect(todayTimeline['Exam'].length).toBe(2);
            expect(todayTimeline['Exam'][1].name).toBe('Dental Exam');
            expect(todayTimeline['Exam'][0].name).toBe('Skin Exam');

            expect(todayTimeline['Condition'].length).toBe(1);
            expect(todayTimeline['Condition'][0].name).toBe('Hypertension');
        });

        it('should handle empty timeline gracefully', () => {
            const mockResponse = {
                data: {
                    patientHealthTimeline: {
                        timeline: [],
                    },
                },
            };
            const result = component.groupTimelineByDate(mockResponse);
            expect(result.length).toBe(0);
            expect(component.loadingTimeline).toBe(false);
        });

        it('should handle timeline with no Observations', () => {
            const mockResponse = {
                data: {
                    patientHealthTimeline: {
                        timeline: [
                            {
                                date: '2025-03-18',
                                resourceType: 'Encounter',
                                timeRecorded: '2025-03-18T10:00:00Z',
                            },
                        ],
                    },
                },
            };
            const result = component.groupTimelineByDate(mockResponse);
            expect(result.length).toBe(1);
            expect(result[0]['Encounter'].length).toBe(1);
            expect(result[0]['Observation']).toBeUndefined();
            expect(result[0]['Laboratory']).toBeUndefined();
            expect(result[0]['Exam']).toBeUndefined();
        });

        it('should set loadingTimeline to false after processing', () => {
            component.loadingTimeline = true;
            const mockResponse = {
                data: {
                    patientHealthTimeline: {
                        timeline: [
                            {
                                date: '2025-03-18',
                                resourceType: 'Observation',
                                category: 'Vital Signs',
                                name: 'Body weight',
                                timeRecorded: '2025-03-18T10:00:00Z',
                            },
                        ],
                    },
                },
            };
            component.groupTimelineByDate(mockResponse);
            expect(component.loadingTimeline).toBe(false);
        });
    });

    describe('getPatientInfo', () => {
        let getPatientTimelineSpy: jasmine.Spy;
        let handlePatientObservableSpy: jasmine.Spy;
        let setPatientSpy: jasmine.Spy;

        beforeEach(() => {
            getPatientTimelineSpy = spyOn(
                component,
                'getPatientTimeline'
            ).and.callThrough();
            handlePatientObservableSpy = spyOn(
                component,
                'handlePatientObservable'
            );
            setPatientSpy = spyOn(component.patientService, 'setPatient');
        });

        it('should call getPatientTimeline and exit early when clincial_id is undefined', () => {
            component.patient = { clinical_id: undefined };
            component.getPatientTimeline({ offset: 0, count: 20 });
            expect(getPatientTimelineSpy).toHaveBeenCalled();
        });

        it('should call getPatientTimeline if patientObservable has person property', () => {
            component.patientObservable = {
                person: { gender: 'MALE' },
                clinical_id: 'test-id',
            };
            component.getPatientInfo();
            expect(component.patient).toEqual(component.patientObservable);
            expect(getPatientTimelineSpy).toHaveBeenCalledWith({
                offset: 0,
                count: component.defaultPageSize,
            });
            expect(handlePatientObservableSpy).not.toHaveBeenCalled();
        });

        it('should call handlePatientObservable if patientObservable does not have person property', () => {
            component.patientObservable = of({
                id: 1,
                clinical_id: 'test-id',
                person: { gender: 'FEMALE' },
            });
            component.patientObservable.person = null;
            component.getPatientInfo();
            expect(handlePatientObservableSpy).toHaveBeenCalled();
            expect(getPatientTimelineSpy).not.toHaveBeenCalled();
        });

        it('handlePatientObservableResponse should set patient and call getPatientTimeline', () => {
            const mockPatient = {
                id: 2,
                person: { gender: 'FEMALE' },
                clinical_id: 'mock-id',
            };
            component.handlePatientObservableResponse(mockPatient);
            expect(setPatientSpy).toHaveBeenCalledWith(mockPatient);
            expect(component.patient).toEqual(mockPatient);
            expect(getPatientTimelineSpy).toHaveBeenCalledWith({
                offset: 0,
                count: component.defaultPageSize,
            });
        });

        it('handlePatientObservableError should call errorHandler.handleError', () => {
            const error = { message: 'Observable error' };
            spyOn(errorHandlerService, 'handleError');
            component.handlePatientObservableError(error);
            expect(errorHandlerService.handleError).toHaveBeenCalledWith(
                error,
                component
            );
        });
    });
});
