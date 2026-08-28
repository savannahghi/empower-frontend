import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ScreeningsListComponent } from './screenings-list.component';
import { PatientService } from '../../patients/patient.service';

class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'app.advantage.patients.detail.',
    },
    params() {
        return { appointment_id: 1 };
    },
};

class SilStoresServiceStub {
    list() {
        return of({
            totalCount: 2,
            results: [{ id: '9067571b-4389-45b8-96da-6430353e' }],
            edges: [
                {
                    node: {
                        id: '12f3d73f-985a-4b21-920d-0aa07f06ead5',
                        subject: {
                            id: '9067571b-4389-45b8-96da-6430353ecac5',
                            identifier: {},
                            display: 'Lions, Taraji ',
                        },
                        encounter: {
                            id: '79eb75f4-f60a-4b11-997d-f50df8782655',
                            identifier: {},
                        },
                        prediction: [
                            {
                                outcome: {
                                    text: 'Average Risk',
                                },
                            },
                        ],
                        occurrenceDateTime: '2024-05-11T07:31:19Z',
                        screeningType: 'BREAST_CANCER_SCREENING',
                    },
                    cursor: '12f3d73f-985a-4b21-920d-0aa07f06ead5',
                },
                {
                    node: {
                        id: '0fbc8142-eba7-468b-964b-e1b00bb60daa',
                        subject: {
                            id: '9067571b-4389-45b8-96da-6430353ecac5',
                            identifier: {},
                            display: 'Lions, Taraji ',
                        },
                        encounter: {
                            id: '79eb75f4-f60a-4b11-997d-f50df8782655',
                            identifier: {},
                        },
                        prediction: [
                            {
                                outcome: {
                                    text: 'Average Risk',
                                },
                            },
                        ],
                        occurrenceDateTime: '2024-05-11T06:48:31Z',
                        screeningType: 'BREAST_CANCER_SCREENING',
                    },
                    cursor: '0fbc8142-eba7-468b-964b-e1b00bb60daa',
                },
            ],
            pageInfo: {
                HasNextPage: true,
                EndCursor:
                    'AfOl5oX74j2DI0ts-6NcxKSF2jvQ1RaVWj782Ok3miRrzgOx-2oS3G_0XbEnp8MoI5Fk9uJHgTwfA7-O_gz6U7Y9mDJjb5vUFZgGa4tM4kCaotS2m9Z4ciGeUkEEu_fLdiHtcfLsOSS4LQhGBigtaxGQ2yCZXzRinUGW6AKJ4QsNzOQdBHPdpO7VXALqAb0dFr-YmN9sA13dmh_m98XHxl7-pvMy9B0yBkY=',
                HasPreviousPage: false,
                StartCursor: '',
            },
        });
    }
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
    getOrgSettings() {
        return [
            {
                name: 'patients:patient_full_name',
                value: true,
            },
        ];
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

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
}

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

class NbToastrServiceStub {
    show() {
        return {};
    }
}

class PatientServiceStub {
    patientAppointmentsDataEmitter() {
        return [{}];
    }
}

describe('ScreeningsListComponent: ', () => {
    let component: ScreeningsListComponent;
    let fixture: ComponentFixture<ScreeningsListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [ScreeningsListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ScreeningsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test setFilter', () => {
        spyOn(component, 'setFilter').and.callThrough();
        component.setFilter('High Risk');
        expect(component.setFilter).toHaveBeenCalled();
    });

    it('should test toggleReportDrawer functionality', () => {
        spyOn(component, 'toggleReportDrawer').and.callThrough();
        component.toggleReportDrawer();
        expect(component.toggleReportDrawer).toHaveBeenCalled();
        expect(component.encounter).toEqual({});
    });

    it('should test viewReport functionality', () => {
        const event = {
            patient_name: 'Lions, Taraji ',
            screening_date: '2024-05-16T06:50:26Z',
            screening_result: 'High Risk',
            screening_type: 'Cervical Cancer Screening',
            encounterId: 'a87a6f63-d339-4818-8def-03a6c1567d9a',
            screening: 'cervical',
            patientId: '9067571b-4389-45b8-96da-6430353ecac5',
        };
        spyOn(component, 'viewReport').and.callThrough();
        component.viewReport(event);
        expect(component.viewReport).toHaveBeenCalled();
        expect(component.encounter).toBeDefined();
    });

    it('should test getVisitPatient function', () => {
        spyOn(component, 'getVisitPatient').and.callThrough();
        component.getVisitPatient('3068571b-4389-45b8-96da-6430353');
        expect(component.getVisitPatient).toHaveBeenCalled();
    });

    it('should test responseFunction function', () => {
        component.encounter = {
            cancerType: 'breast cancer',
            encounterId: 'a87a6f63-d339-4818-8def-03a6c1567d9a',
        };
        const response = {
            results: [{ id: '9067571b-4389-45b8-96da-6430353e' }],
        };
        spyOn(component, 'responseFunction').and.callThrough();

        component.responseFunction(response);
        expect(component.responseFunction).toHaveBeenCalled();
    });

    it('should handle different response formats in ngOnInit', () => {
        spyOn(component.dataLayer, 'list').and.returnValue(of(null));
        component.ngOnInit();
        expect(component.screenings).toEqual([]);

        (component.dataLayer.list as jasmine.Spy).and.returnValue(
            of({ edges: [] })
        );
        component.ngOnInit();
        expect(component.screenings).toEqual([]);

        const mockData = {
            edges: [{ node: { id: 'test-id' } }],
        };
        (component.dataLayer.list as jasmine.Spy).and.returnValue(of(mockData));
        component.ngOnInit();
        expect(component.screenings).toEqual(mockData.edges);
    });

    it('should handle empty or null response in responseFunction', () => {
        spyOn(component.$state, 'go');

        component.responseFunction({
            results: [{ name: 'Test' }],
        });
        expect(component.$state.go).not.toHaveBeenCalled();

        component.responseFunction({
            results: [],
        });
        expect(component.$state.go).not.toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('ScreeningsListComponent fails', () => {
    let component: ScreeningsListComponent;
    let fixture: ComponentFixture<ScreeningsListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [ScreeningsListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ScreeningsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test getVisitPatient function', () => {
        spyOn(component, 'getVisitPatient').and.callThrough();
        component.getVisitPatient('3068571b-4389-45b8-96da-6430353');
        expect(component.getVisitPatient).toHaveBeenCalled();
    });

    it('should handle API errors when fetching screenings list on init', () => {
        const errorResponse = new Error('API Error');
        spyOn(component.dataLayer, 'list').and.returnValue(
            throwError(() => errorResponse)
        );
        spyOn(component.errorHandler, 'handleError');

        component.ngOnInit();

        expect(component.errorHandler.handleError).toHaveBeenCalledWith(
            errorResponse,
            component
        );
        expect(component.loading).toBeFalse();
    });

    it('should handle API errors when fetching patient details', () => {
        const errorResponse = new Error('API Error');
        spyOn(component.dataLayer, 'list').and.returnValue(
            throwError(() => errorResponse)
        );
        spyOn(component.errorHandler, 'handleError');

        component.getVisitPatient('test-id');

        expect(component.errorHandler.handleError).toHaveBeenCalledWith(
            errorResponse,
            component
        );
    });
});
