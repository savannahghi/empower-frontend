import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewAppointmentComponent } from './view-appointment.component';
import { BehaviorSubject, of } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/core';
import { PatientService } from '../../patients/patient.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

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

class AuthenticationStub {
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
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    reload() {
        return true;
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

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
    }
}

class TransitionStub {
    params() {
        return { appointment_id: 1 };
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params: { appointment_id: 1 },
    $current: {
        is: () => true,
        params() {
            return { appointment_id: 1 };
        },
    },
};

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    setUser() {
        return {
            client_types: ['PROVIDER'],
        };
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
                value: 'true',
            },
        ];
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: '143224',
                    appointment_status: 'BOOKED',
                },
            ],
        });
    }

    get() {
        return of({
            id: '143224',
            appointment_status: 'BOOKED',
            patient_details: {
                id: '1',
                person: {
                    gender: 'FEMALE',
                },
            },
        });
    }

    create() {
        return of({
            id: '143224',
            appointment_status: 'BOOKED',
            service_requests: [{ id: '2' }],
        });
    }

    update() {
        return of({
            id: '4ed62h7281262h1',
            cancellation_reason: 'no show',
        });
    }
}

class NbToastrServiceStub {
    show() {
        return {};
    }
}

class NbDialogServiceStub {
    open() {
        return {};
    }
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

describe('ViewAppointmentComponent', () => {
    let component: ViewAppointmentComponent;
    let fixture: ComponentFixture<ViewAppointmentComponent>;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ViewAppointmentComponent],
            imports: [
                mockPipe('titleCase'),
                mockPipe('age'),
                mockPipe('gender'),
                mockPipe('translate'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Router, useValue: routerSpy },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: NbDialogService, useClass: NbDialogServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewAppointmentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.formOptions = {
            resetModel: () => {},
        };
        component.navigateToReschedule(1);
        component.toggleCancelAppointmentModal();
        component.patient = { id: '123' };
        component.patientService.patientVisitDataEmitter.next({ id: 1 });
    });

    it('should create the component', () => {
        component.changeQueue({ id: 1 });
        component.changeBillingClass('cash');
        expect(component).toBeTruthy();
    });

    it('should test cancel appointment method', () => {
        spyOn(component, 'cancelAppointment').and.callThrough();
        component.cancelAppointment('cancel reason');
        expect(component.cancelAppointment).toHaveBeenCalled();
    });

    it('should test startVisit method', () => {
        spyOn(component, 'startVisit').and.callThrough();
        component.appointment = {
            id: 1,
            patient_details: {
                id: 1,
                person: {
                    gender: 'FEMALE',
                },
            },
        };
        component.startVisit();
        expect(component.startVisit).toHaveBeenCalled();
    });
});

class SilStoresServiceStub2 {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}
describe('ViewAppointmentComponent error', () => {
    let component: ViewAppointmentComponent;
    let fixture: ComponentFixture<ViewAppointmentComponent>;

    const routerSpy = { navigate: jasmine.createSpy('navigate') };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ViewAppointmentComponent],
            imports: [
                mockPipe('titleCase'),
                mockPipe('age'),
                mockPipe('gender'),
                mockPipe('translate'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                        snapshot: { url: ['add-appointment'] },
                    },
                },
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Router, useValue: routerSpy },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: NbDialogService, useClass: NbDialogServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub2 },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewAppointmentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.ngOnInit();
    });

    it('should test cancel appointment method', () => {
        component.appointmentId = '1372728';
        spyOn(component, 'cancelAppointment').and.callThrough();
        component.cancelAppointment('cancel reason');
        expect(component.cancelAppointment).toHaveBeenCalled();
    });
});
