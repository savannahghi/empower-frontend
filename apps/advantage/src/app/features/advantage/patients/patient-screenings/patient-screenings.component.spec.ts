import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { PatientService } from '../patient.service';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { PatientScreeningsComponent } from './patient-screenings.component';

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
    transitionTo() {
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

describe('PatientScreeningsComponent: ', () => {
    let component: PatientScreeningsComponent;
    let fixture: ComponentFixture<PatientScreeningsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [PatientScreeningsComponent],
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
        fixture = TestBed.createComponent(PatientScreeningsComponent);
        component = fixture.componentInstance;
        component.patientObservable = of({
            person: {
                id: '12342313',
            },
        });
        fixture.detectChanges();
    });

    it('should test ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('PatientScreeningsComponent fails', () => {
    let component: PatientScreeningsComponent;
    let fixture: ComponentFixture<PatientScreeningsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [PatientScreeningsComponent],
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
        fixture = TestBed.createComponent(PatientScreeningsComponent);
        component = fixture.componentInstance;
        component.patientObservable = of({
            person: {
                id: '12342313',
            },
        });
        fixture.detectChanges();
    });

    it('should test ngOnInit and throw error when getPatientInfo is called', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        component.getPatientInfo();
        expect(component.ngOnInit).toHaveBeenCalled();
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
});

describe('PatientScreeningsComponent fails', () => {
    let component: PatientScreeningsComponent;
    let fixture: ComponentFixture<PatientScreeningsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [PatientScreeningsComponent],
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
        fixture = TestBed.createComponent(PatientScreeningsComponent);
        component = fixture.componentInstance;
        component.patientObservable = throwError(
            () => new Error('Error thrown')
        );
        fixture.detectChanges();
    });

    it('should test ngOnInit and throw error when getScreenings is called', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        component.getPatientInfo();
        expect(component.ngOnInit).toHaveBeenCalled();
    });
});
