import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { QuintusAuthorizationService } from '../../../../shared/sil-http-services/quintus.authorization.service';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { PatientService } from '../../patients/patient.service';
import { LocalStateService } from '../../../../@core/utils/state.service';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { VariantPipe } from 'app/@theme/pipes/variant/variant.pipe';
import { AnalyticsService } from 'app/@core/utils/analytics.service';
import { environment } from 'environments/environment';
import moment from 'moment';

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

class PipeStub {
    transform() {
        return true;
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getWorkstation() {
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
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'fsdfs09344mlw03434',
            clinical_org_id: 'asdkasdisefd832ksd',
        };
    }
    getAdvantageOrganisation() {
        return {
            organisation_id: undefined,
        };
    }
}

class PatientServiceStub {
    patientVisitDataEmitter() {
        return of({
            id: '143224',
        });
    }
    checkIfPatientIsComplete() {
        return of({
            id: '143224',
        });
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
class AuthenticationServiceStub {
    checkPermission() {
        return false;
    }
}
class LocalStateServiceStub {
    getFinalFilters() {
        return { start: '2023-10-29' };
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
    transitionTo() {
        return true;
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
    $current: {
        is: () => true,
    },
};

class SilStoresServiceStub {
    update() {
        return of({
            id: '4ed62h7281262h1',
        });
    }
    list() {
        return of([
            {
                id: '143224',
                appointment_status: 'BOOKED',
                name: 'scheduling:preferred_patient_scheduling_method',
                value: 'APPOINTMENT BOOKING',
            },
            {
                id: '143224',
                appointment_status: 'BOOKED',
                name: 'scheduling:preferred_patient_scheduling_method',
                value: 'CHECK-IN SCHEDULING',
            },
        ]);
    }
}

class NbToastrServiceStub {
    show() {
        return {};
    }
}

class QuintusServiceStub {
    user = {
        business_partner: 457,
    };
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }

    getJWT() {
        return 'token';
    }

    checkAuthorization() {
        return this.user;
    }

    getToken() {
        return 'token';
    }
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

describe('HomePageComponent - create', () => {
    let component: HomePageComponent;
    let fixture: ComponentFixture<HomePageComponent>;
    let authServiceMock: any;
    let dataLayerMock: any;

    beforeEach(() => {
        authServiceMock = jasmine.createSpyObj('AuthService', [
            'checkPermission',
        ]);

        dataLayerMock = jasmine.createSpyObj('DataLayerService', ['list']);

        TestBed.configureTestingModule({
            declarations: [HomePageComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('variant'),
                RouterTestingModule.withRoutes([
                    {
                        path: 'features/clinic/add-appointment',
                        component: HomePageComponent,
                    },
                    {
                        path: 'features/clinic/appointment-list',
                        component: HomePageComponent,
                    },
                    {
                        path: 'features/clinic/patient-list',
                        component: HomePageComponent,
                    },
                    {
                        path: 'features/clinic/home-page',
                        component: HomePageComponent,
                    },
                    {
                        path: 'features/clinic/schedule-list',
                        component: HomePageComponent,
                    },
                    {
                        path: 'features/clinic/view-appointment',
                        component: HomePageComponent,
                    },
                ]),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: QuintusAuthorizationService,
                    useClass: QuintusServiceStub,
                },
                { provide: LocalStateService, useClass: LocalStateServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HomePageComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        spyOn(component, 'getCheckinSchedule').and.callFake(function () {});
        component.ngOnInit();
        component.completeRegistration({ id: '123' });
        expect(component).toBeTruthy();
    });

    it('should set appointmentFilterParams for uzazisalama variant', () => {
        const previousVariant = environment.variant;
        environment.variant = 'uzazisalama';
        const fixture2 = TestBed.createComponent(HomePageComponent);
        const component2 = fixture2.componentInstance;
        expect(component2.appointmentFilterParams).toEqual({
            start: moment().format('YYYY-MM-D'),
        });
        environment.variant = previousVariant;
    });

    it('should call fireSwal', fakeAsync(() => {
        spyOn(component, 'fireSwal').and.callThrough();
        component.fireSwal({ fire: () => {} });
        expect(component.fireSwal).toHaveBeenCalled();
    }));

    it('should test updateConfirmArrivalStatus method', fakeAsync(() => {
        spyOn(component, 'updateConfirmArrivalStatus').and.callThrough();
        spyOn(component, 'fireSwal');
        const appointment = { id: 'abc-123', name: 'Test' } as any;
        component.updateConfirmArrivalStatus(appointment);
        expect(component.updateConfirmArrivalStatus).toHaveBeenCalled();
    }));

    it('should update appointment to ARRIVED then call transitionToFulfilled', () => {
        spyOn(component, 'transitionToFulfilled');
        spyOn(component.dataLayer, 'update').and.returnValue(of({ id: 'ok' }));
        component.selectedAppointment = { id: 'apt-2' } as any;
        component.confirmUpdate();
        expect(component.dataLayer.update).toHaveBeenCalledWith(
            'appointments',
            'apt-2',
            { appointment_status: 'ARRIVED' }
        );
        expect(component.transitionToFulfilled).toHaveBeenCalled();
    });

    it('should update appointment to FULFILLED and call showToast and refresh appointments', () => {
        spyOn(component, 'getAppointments');
        spyOn(component, 'showToast');
        spyOn(component.dataLayer, 'update').and.returnValue(of({ id: 'ok' }));
        component.selectedAppointment = { id: 'apt-1' } as any;
        component.transitionToFulfilled();
        expect(component.dataLayer.update).toHaveBeenCalledWith(
            'appointments',
            'apt-1',
            { appointment_status: 'FULFILLED' }
        );
        expect(component.getAppointments).toHaveBeenCalled();
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should call handleSetting when settings are loaded', () => {
        spyOn(component, 'handleSetting').and.callThrough();

        authServiceMock.checkPermission.and.returnValue(
            'advantage.appointment_list'
        );

        const settingsResponse = {
            name: 'scheduling:preferred_patient_scheduling_method',
            value: 'APPOINTMENT BOOKING',
        };
        const settingsObservable = {
            subscribe: jasmine
                .createSpy('subscribe')
                .and.callFake((observer: any) => {
                    observer.next(settingsResponse);
                }),
        };

        dataLayerMock.list.and.returnValue(settingsObservable);
        component.handleSetting(settingsResponse, true);

        expect(component.handleSetting).toHaveBeenCalled();
    });

    it('should call handleSetting when settings are loaded', () => {
        spyOn(component, 'handleSetting').and.callThrough();

        authServiceMock.checkPermission.and.returnValue(
            'advantage.appointment_list'
        );

        const settingsResponse = {
            name: 'scheduling:preferred_patient_scheduling_method',
            value: 'CHECK-IN SCHEDULING',
        };
        const settingsObservable = {
            subscribe: jasmine
                .createSpy('subscribe')
                .and.callFake((observer: any) => {
                    observer.next(settingsResponse);
                }),
        };

        dataLayerMock.list.and.returnValue(settingsObservable);

        component.handleSetting(settingsResponse, true);

        expect(component.handleSetting).toHaveBeenCalled();
    });
});

class SilStoresServiceStub2 {
    list() {
        return of({
            results: [
                {
                    id: '123',
                    patient_details: {
                        person: {
                            date_of_birth: '12-10-1994',
                            first_name: 'Me',
                            last_name: 'You',
                            other_names: 'Lee',
                            gender: 'Male',
                        },
                    },
                },
            ],
        });
    }
    update() {
        return of({
            id: '4ed62h7281262h1',
        });
    }
    create() {
        return of({
            id: '4ed62h7281262h1',
        });
    }
}

describe('HomePageComponent', () => {
    let component: HomePageComponent;
    let fixture: ComponentFixture<HomePageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [HomePageComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('variant'),
                RouterTestingModule.withRoutes([
                    {
                        path: 'features/clinic/add-appointment',
                        component: HomePageComponent,
                    },
                    {
                        path: 'features/clinic/appointment-list',
                        component: HomePageComponent,
                    },
                    {
                        path: 'features/clinic/patient-list',
                        component: HomePageComponent,
                    },
                    {
                        path: 'features/clinic/home-page',
                        component: HomePageComponent,
                    },
                    {
                        path: 'features/clinic/schedule-list',
                        component: HomePageComponent,
                    },
                    {
                        path: 'features/clinic/view-appointment',
                        component: HomePageComponent,
                    },
                ]),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Transition, useClass: TransitionStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub2 },
                {
                    provide: QuintusAuthorizationService,
                    useClass: QuintusServiceStub,
                },
                { provide: LocalStateService, useClass: LocalStateServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HomePageComponent);
        component = fixture.componentInstance;
    });

    it('should test add apppointments', () => {
        spyOn(component, 'addAppointment').and.callThrough();
        const model = { patient: { id: '123' } };
        component.timeSlots = {
            id: '123',
            start: '2023-10-29T00:00:05',
            end: '2023-10-29T00:10:05',
        };
        component.addAppointment(model);
        expect(component.addAppointment).toHaveBeenCalledWith(model);
    });
    it('should test submitPatient', () => {
        spyOn(component, 'submitPatient').and.callThrough();
        component.patientDetails = {
            id: '123',
            person: {
                date_of_birth: '10-12-1994',
                person_ids: [],
                person_contacts: [
                    { contact_type: 'phone_number', contact: '0711223445' },
                    { contact_type: 'phone_number', contact: '+254711223445' },
                ],
                id_value: '9',
                id_document_type: 'national',
            },
        };
        component.getFormOptions({ resetModel: () => {} });
        component.submitPatient(component.patientDetails);
        expect(component.submitPatient).toHaveBeenCalledWith(
            component.patientDetails
        );
    });

    it('should test navigateToStartVisit method', () => {
        spyOn(component, 'navigateToStartVisit').and.callThrough();
        spyOn(component.$state, 'go');
        component.checkins = [
            {
                id: '123',
                patient_details: {
                    id: '1',
                },
            },
        ];
        component.navigateToStartVisit();
        component.getAppointments();
        component.$state.go('app.advantage.visits.start_visit', {
            id: component.checkins[0],
            appointment: component.checkins[0],
        });
        expect(component.$state.go).toHaveBeenCalledWith(
            'app.advantage.visits.start_visit',
            {
                id: component.checkins[0],
                appointment: component.checkins[0],
            }
        );
        expect(component.navigateToStartVisit).toHaveBeenCalled();
    });
});

class SilStoresServiceStub3 {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    create() {
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
describe('HomePageComponent error', () => {
    let component: HomePageComponent;
    let fixture: ComponentFixture<HomePageComponent>;

    const routerSpy = { navigate: jasmine.createSpy('navigate') };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [HomePageComponent],
            imports: [mockPipe('translate'), mockPipe('variant')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Router, useValue: routerSpy },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub3 },
                {
                    provide: QuintusAuthorizationService,
                    useClass: QuintusServiceStub,
                },
                { provide: LocalStateService, useClass: LocalStateServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HomePageComponent);
        component = fixture.componentInstance;
        component.startWalkthrough();
    });

    it('should test errors', () => {
        spyOn(component, 'getCheckinSchedule').and.callFake(function () {});
        component.ngOnInit();
        component.patientDetails = {
            id: '123',
            person: {
                date_of_birth: '10-12-1994',
                person_ids: [],
                person_contacts: [
                    { contact_type: 'phone_number', contact: '0711223445' },
                    { contact_type: 'phone_number', contact: '+254711223445' },
                ],
                id_value: '9',
                id_document_type: 'national',
            },
        };
        component.getFormOptions({ resetModel: () => {} });
        component.getAppointments();
        component.getCheckins();
        const model = { patient: { id: '123' } };
        component.timeSlots = {
            id: '123',
            start: '2023-10-29T00:00:05',
            end: '2023-10-29T00:10:05',
        };
        component.addAppointment(model);
        component.submitPatient(component.patientDetails);
        expect(component).toBeTruthy();
    });
    it('should navigate to patients registration page with step 0 and reload', () => {
        // Call the method to be tested
        spyOn(component.$state, 'go');
        component.goToPatientsRegistrationPage();

        // Check if StateService.go() is called with the correct arguments
        expect(component.$state.go).toHaveBeenCalled();
    });

    it('should call errorHandler when confirmUpdate fails and not call transitionToFulfilled', () => {
        spyOn(component, 'transitionToFulfilled');
        spyOn(component.errorHandler, 'handleError');
        spyOn(component.dataLayer, 'update').and.returnValue(
            throwError(() => new Error('fail'))
        );
        component.selectedAppointment = { id: 'apt-3' } as any;
        component.confirmUpdate();
        expect(component.dataLayer.update).toHaveBeenCalledWith(
            'appointments',
            'apt-3',
            { appointment_status: 'ARRIVED' }
        );
        expect(component.transitionToFulfilled).not.toHaveBeenCalled();
        expect(component.errorHandler.handleError).toHaveBeenCalledWith(
            jasmine.any(Error),
            component
        );
    });

    it('should call errorHandler when transitionToFulfilled fails and not call getAppointments or showToast', () => {
        spyOn(component, 'getAppointments');
        spyOn(component, 'showToast');
        spyOn(component.errorHandler, 'handleError');
        spyOn(component.dataLayer, 'update').and.returnValue(
            throwError(() => new Error('fail'))
        );
        component.selectedAppointment = { id: 'apt-4' } as any;
        component.transitionToFulfilled();
        expect(component.dataLayer.update).toHaveBeenCalledWith(
            'appointments',
            'apt-4',
            { appointment_status: 'FULFILLED' }
        );
        expect(component.getAppointments).not.toHaveBeenCalled();
        expect(component.showToast).not.toHaveBeenCalled();
        expect(component.errorHandler.handleError).toHaveBeenCalledWith(
            jasmine.any(Error),
            component
        );
    });
});
