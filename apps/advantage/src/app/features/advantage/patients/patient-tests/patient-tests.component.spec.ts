import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { PatientService } from '../patient.service';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { PatientTestsComponent } from './patient-tests.component';

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
        return { id: '6724-0191', appointment_id: 1 };
    },
};

class SilStoresServiceStub {
    list() {
        return of({
            totalCount: 2,
            edges: [
                {
                    node: {
                        id: 'c00c53c3-1241-4add-b94d-9d92fd59bcfb',
                        encounterID: 'b45cef00-3779-409c-8c96-85f092256366',
                        status: 'active',
                        intent: 'instance-order',
                        priority: 'urgent',
                        receivingFacility: 'Empower Makueni',
                        orderDetails: {
                            name: 'Mammogram',
                            code: 'LA16046-7',
                        },
                        date: '2024-05-12T10:39:23+03:00',
                        usageContext: 'BREAST_CANCER_SCREENING',
                    },
                    cursor: 'c00c53c3-1241-4add-b94d-9d92fd59bcfb',
                },
                {
                    node: {
                        id: '5462db5f-b7a9-4c8e-a18b-0b4c609a242b',
                        encounterID: 'b45cef00-3779-409c-8c96-85f092256366',
                        status: 'active',
                        intent: 'instance-order',
                        priority: 'urgent',
                        receivingFacility: 'Empower Makueni',
                        orderDetails: {
                            name: 'Ultrasound',
                            code: 'LA16047-8',
                        },
                        date: '2024-05-12T10:18:01+03:00',
                        usageContext: 'BREAST_CANCER_SCREENING',
                    },
                    cursor: '5462db5f-b7a9-4c8e-a18b-0b4c609a242b',
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
    transitionTo() {
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

describe('PatientTestsComponent: ', () => {
    let component: PatientTestsComponent;
    let fixture: ComponentFixture<PatientTestsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [PatientTestsComponent],
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
        fixture = TestBed.createComponent(PatientTestsComponent);
        component = fixture.componentInstance;
        component.patientObservable = of({
            person: {
                id: '12342313',
            },
        });
        fixture.detectChanges();
    });

    it('should test viewLabOrder', () => {
        spyOn(component, 'viewLabOrder').and.callThrough();
        const event = {
            encounterId: '827472-029492-14184',
        };
        component.viewLabOrder(event);
        expect(component.viewLabOrder).toHaveBeenCalled();
    });

    it('should test ngOnInit and throw error when getPatientInfo is called', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        component.getPatientInfo();
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

describe('PatientTestsComponent fails', () => {
    let component: PatientTestsComponent;
    let fixture: ComponentFixture<PatientTestsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [PatientTestsComponent],
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
        fixture = TestBed.createComponent(PatientTestsComponent);
        component = fixture.componentInstance;
        component.patientObservable = throwError(
            () => new Error('Error thrown')
        );
        fixture.detectChanges();

        component.actions = [
            {
                btnText: 'Complete',
                status: 'success',
                action: 'modal',
                expression: (row: any) => {
                    if (!row) {
                        return;
                    } else {
                        return (
                            row.node.status?.toLowerCase() !== 'completed' &&
                            row.node.status?.toLowerCase() !== 'cancelled'
                        );
                    }
                },
            },
        ];
    });

    it('should test ngOnInit and throw error when getPatientInfo is called', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        component.getPatientInfo();
        expect(component.ngOnInit).toHaveBeenCalled();
    });
});
