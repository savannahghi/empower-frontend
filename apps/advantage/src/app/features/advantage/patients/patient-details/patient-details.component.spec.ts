import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { ThemeModule } from '../../../../@theme/theme.module';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { PatientService } from '../patient.service';
import { PatientDetailsComponent } from './patient-details.component';
import { Apollo } from 'apollo-angular';
import {
    ApolloTestingController,
    ApolloTestingModule,
} from 'apollo-angular/testing';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { AnalyticsService } from 'app/@core/utils';

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

const apolloServiceStub = {
    query: () => {
        return of({
            response: {
                data: {
                    listPatientAllergies: {
                        __typename: 'TerminologyConnection',
                        totalCount: 7,
                        edges: [
                            {
                                __typename: 'TerminologyEdge',
                                node: {
                                    __typename: 'Terminology',
                                    code: '145413',
                                    system: 'CIEL',
                                    name: 'Chronic Endocervicitis with Ectropion',
                                },
                            },
                        ],
                    },
                },
            },
        });
    },
};

const apolloServiceStubError = {
    query: () => ({
        error: of([
            {
                error: new Error('Boom'),
            },
        ]),
    }),
};

const uIRouterGlobalsStub = {
    current: {
        name: 'app.advantage.patients.detail.',
    },
    params() {
        return { appointment_id: 1 };
    },
};

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

class SilStoresServiceStub {
    get() {
        return of({
            document_number: '1231',
            made_by: 'John',
            invoice_date: '2022-11-12T12:53:07.850000+03:00',
            amount: 20,
            customer: '5190ffca-9bd0-4d98-b9c9-9b0f62368f46',
            person: {
                age: { years: 55, months: 0, weeks: 0, days: 0 },
                phone_number: '0723856342',
            },

            results: [
                {
                    id: '75b61eaa-84de-4283-85bf-ccd792612648',
                    active_visits: [
                        {
                            id: 'b2536c99-fe87-4f28-8485-0dcdb68274ea',
                            patient_name: 'Jonathan Muuo Matolo',
                            phone_number: '+254715825862',
                            customer_id: '7bbb9423-0a6c-4ddf-8d57-253687aafda4',
                            clinical_notes: [],
                            state_transition_logs: [],
                            queue_transition_logs: [
                                {
                                    id: '3ee8752a-82b7-4c28-9207-2b346a6b74ee',
                                    source_queue_name: 'Laboratory',
                                    destination_queue_name:
                                        'Dr. Singh | OBSTETRICS AND GYNAECOLOGY',
                                    active: true,
                                    visit: 'b2536c99-fe87-4f28-8485-0dcdb68274ea',
                                    source: '69163069-35c0-4059-8839-9face7f5e551',
                                    destination:
                                        '75b61eaa-84de-4283-85bf-ccd792612648',
                                },
                                {
                                    id: 'ea7eab8c-4d3f-43e7-9a7f-02b19baacb05',
                                    source_queue_name:
                                        'Dr. Amadi Edgar Hezekiah | GENERAL PRACTITIONER',
                                    destination_queue_name: 'Laboratory',
                                    active: true,
                                    visit: 'b2536c99-fe87-4f28-8485-0dcdb68274ea',
                                    source: '27911366-059f-4141-a79e-a4840e068ec5',
                                    destination:
                                        '69163069-35c0-4059-8839-9face7f5e551',
                                },
                                {
                                    id: 'bbbb9dff-e031-431a-a1e3-12ad73b4020d',
                                    source_queue_name: 'Triage',
                                    destination_queue_name:
                                        'Dr. Amadi Edgar Hezekiah | GENERAL PRACTITIONER',
                                    active: true,
                                    visit: 'b2536c99-fe87-4f28-8485-0dcdb68274ea',
                                    source: '11a1c333-b347-4158-b4e1-0665a59c0607',
                                    destination:
                                        '27911366-059f-4141-a79e-a4840e068ec5',
                                },
                            ],
                            queue_tat: 1803.8224606,
                            active: true,
                            visit_number: '0016/23',
                            visit_type: 'AMB',
                            status: 'ARRIVED',
                            start: '2023-04-27T12:43:05.393027+03:00',
                            end: null,
                            priority: 'NORMAL',
                            billing_class: 'CASH',
                            patient: 'cc8ffdbf-a4c0-4a8f-a5c3-4678027068a4',
                            appointment: null,
                            current_queue:
                                '75b61eaa-84de-4283-85bf-ccd792612648',
                        },
                    ],
                },
            ],
        });
    }

    downloadDocument() {
        return of({ response: {} });
    }

    create() {
        return of({
            id: '4ed62h7281262h1',
            service_requests: [{ id: '2' }],
        });
    }

    list() {
        return of({
            results: {
                new_price: 18,
                amount: '18',
                product_name: 'Lipid',
                quantity: 1,
            },
        });
    }
}
class NbToastrServiceStub {
    show() {
        return {};
    }
}

class AuthenticationStub {
    checkPermission() {
        return true;
    }
}

class PatientServiceStub {
    patientAppointmentsDataEmitter() {
        return [{}];
    }
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

describe('PatientDetailsComponent: ', () => {
    let component: PatientDetailsComponent;
    let fixture: ComponentFixture<PatientDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ApolloTestingModule,
                mockPipe('age'),
                mockPipe('country'),
                mockPipe('titleCase'),
                mockPipe('featureFlag'),
                mockPipe('variant'),
                mockPipe('translate'),
                mockPipe('healthIdFormatter'),
                mockPipe('phoneNumberPipe'),
            ],
            declarations: [PatientDetailsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { Apollo: Apollo, useValue: apolloServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PatientDetailsComponent);
        TestBed.inject(ApolloTestingController);
        component = fixture.componentInstance;
        component.patientObservable = of({
            id: 1,
            person: { gender: 'MALE' },
            clinical_id: '282828',
        });
        component.variant = 'default';
        fixture.detectChanges();
    });

    it('should test showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('position', 'status', 'msg', []);
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test getPatientUpcomingAppointments method', () => {
        spyOn(component, 'getPatientUpcomingAppointments').and.callThrough();
        component.patientService.patientAppointmentsDataEmitter.next([
            {
                id: 'bfde3c5b-dcdd-422b-aa05-bc3895e832f5',
                start: '2023-09-07T10:50:54+03:00',
                sched_actor: 'FACILITY',
            },
            {
                id: 'bfde3c5b-dcdd-422b-aa05-bc3895e832f5',
                start: '2023-09-07T10:50:54+03:00',
                sched_actor: 'PRACTITIONER',
            },
        ]);
        component.getPatientUpcomingAppointments();
        expect(component.getPatientUpcomingAppointments).toHaveBeenCalled();
    });

    it('should test the checkState function', () => {
        spyOn(component, 'checkState').and.callThrough();
        component.checkState();
        expect(component.checkState).toHaveBeenCalled();
    });

    it('should test getPatientAllergies', () => {
        component.patient = {};
        component.patient.clinical_id = '334345345';
        component.ngOnInit();
        component.loadingAllergies = false;
        expect(component).toBeTruthy();
    });

    it('should test getPatientInfo', () => {
        component.patient = {};
        component.patient.clinical_id = '282828';
        spyOn(component, 'getPatientInfo').and.callThrough();
        component.ngOnInit();
        expect(component).toBeTruthy();
        component.getFilteredResponse({ id: 1, name: 'Dr Ngure' }, 'queue');
        component.getFilteredResponse({ id: 1, name: 'Muthee' }, 'guarantor');
        expect(component.getPatientInfo).toHaveBeenCalled();
    });
});

class SilStoresServiceStub2 {
    get() {
        return of({
            document_number: '1231',
            made_by: 'John',
            invoice_date: '2022-11-12T12:53:07.850000+03:00',
            amount: 20,
            person: {
                age: { years: 55, months: 0, weeks: 0, days: 0 },
                phone_number: '0723856342',
            },
            results: [
                {
                    document_number: '1231',
                    made_by: 'John',
                    invoice_date: '2022-11-12T12:53:07.850000+03:00',
                    amount: 20,
                    customer: '5190ffca-9bd0-4d98-b9c9-9b0f62368f46',
                },
            ],
        });
    }

    downloadDocument() {
        return of({ response: {} });
    }
    create() {
        return of({
            id: '4ed62h7281262h1',
            service_requests: [{ id: '2' }],
        });
    }

    update() {
        return of({
            id: '4ed62h7281262h1',
        });
    }

    list() {
        return of({
            results: {
                new_price: 18,
                amount: '18',
            },
        });
    }
}

const uIRouterGlobalsStubElse = {
    current: {
        name: 'app.advantage.patients',
    },
    params() {
        return { appointment_id: 1 };
    },
};

describe('PatientDetailsComponent: statement', () => {
    let component: PatientDetailsComponent;
    let fixture: ComponentFixture<PatientDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ApolloTestingModule,
                mockPipe('titleCase'),
                mockPipe('age'),
                mockPipe('country'),
                mockPipe('featureFlag'),
                mockPipe('variant'),
                mockPipe('translate'),
                mockPipe('healthIdFormatter'),
                mockPipe('phoneNumberPipe'),
            ],
            declarations: [PatientDetailsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                ThemeModule,
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStubElse },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub2 },
                { Apollo: Apollo, useValue: apolloServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PatientDetailsComponent);
        TestBed.inject(ApolloTestingController);
        environment.variant = 'empower';
        component = fixture.componentInstance;
        component.patientObservable = of({
            id: 1,
            person: { gender: 'MALE' },
            clinical_id: '282828',
        });
        fixture.detectChanges();
    });

    it('should test getPatientInfo', () => {
        spyOn(component, 'getPatientInfo').and.callThrough();
        component.ngOnInit();
        const app = {
            start: new Date(),
            sched_description: 'Dr Doctor',
            sched_specialty: 'GP',
        };
        component.setAppointment(app);
        expect(component).toBeTruthy();
        expect(component.getPatientInfo).toHaveBeenCalled();
    });

    it('should test startVisit successful', () => {
        const date = '2015-01-01T00:00:00';
        spyOn(component, 'togglePastVisit').and.callThrough();
        component.togglePastVisit();
        expect(component.togglePastVisit).toHaveBeenCalled();
        spyOn(component, 'getStartDate').and.callThrough();
        component.getStartDate(date);
        expect(component.getStartDate).toHaveBeenCalled();
        spyOn(component, 'startVisit').and.callThrough();
        component.startVisit();
        expect(component.startVisit).toHaveBeenCalled();
    });
});

class SilStoresServiceStub3 {
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    downloadDocument() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

class AuthenticationStubError {
    checkPermission() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

class PatientServiceStubError {
    patientAppointmentsDataEmitter() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('PatientDetailsComponent: error', () => {
    let component: PatientDetailsComponent;
    let fixture: ComponentFixture<PatientDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ApolloTestingModule,
                mockPipe('titleCase'),
                mockPipe('age'),
                mockPipe('country'),
                mockPipe('featureFlag'),
                mockPipe('variant'),
                mockPipe('translate'),
                mockPipe('healthIdFormatter'),
                mockPipe('phoneNumberPipe'),
            ],
            declarations: [PatientDetailsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                ThemeModule,
                { provide: PatientService, useClass: PatientServiceStubError },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStubElse },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStubError,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub3 },
                { Apollo: Apollo, useValue: apolloServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PatientDetailsComponent);
        TestBed.inject(ApolloTestingController);
        component = fixture.componentInstance;
        environment.variant = 'default';
        component.patientObservable = of({
            id: 1,
            person: { gender: 'MALE' },
            clinical_id: '282828',
        });
        component.patientService.patientAppointmentsDataEmitter.next([
            {
                appointment_status: 'ARRIVED',
                created: '2023-09-07T10:50:49.985519+03:00',
                id: 'bfde3c5b-dcdd-422b-aa05-bc3895e832f5',
                start: '2023-09-07T10:50:54+03:00',
                sched_actor: 'FACILITY',
            },
        ]);
        fixture.detectChanges();
    });

    it('should test getPatientInfo method', () => {
        spyOn(component, 'getPatientInfo').and.callThrough();
        component.getPatientInfo();
        component.changeQueue({ id: 1 });
        component.changeBillingClass('cash');
        component.toggleModal('patientRegistration');
        expect(component.getPatientInfo).toHaveBeenCalled();
    });

    it('should test startVisit error', () => {
        spyOn(component, 'startVisit').and.callThrough();
        component.startVisit();
        component.startVisit({ id: '1' });
        expect(component.startVisit).toHaveBeenCalled();
    });
});

describe('PatientDetailsComponent: patientObservable throws error', () => {
    let component: PatientDetailsComponent;
    let fixture: ComponentFixture<PatientDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ApolloTestingModule,
                mockPipe('titleCase'),
                mockPipe('age'),
                mockPipe('country'),
                mockPipe('featureFlag'),
                mockPipe('variant'),
                mockPipe('translate'),
                mockPipe('healthIdFormatter'),
                mockPipe('phoneNumberPipe'),
            ],
            declarations: [PatientDetailsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                ThemeModule,
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStubElse },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStubError,
                },
                { provide: SilStoresService, useClass: SilStoresServiceStub3 },
                { Apollo: Apollo, useValue: apolloServiceStubError },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PatientDetailsComponent);
        TestBed.inject(ApolloTestingController);
        component = fixture.componentInstance;
        environment.variant = 'default';
        component.patientObservable = throwError(() => new Error('error'));
        fixture.detectChanges();
    });

    it('should test getPatientInfo method', () => {
        spyOn(component, 'getPatientInfo').and.callThrough();
        component.getPatientInfo();
        expect(component.getPatientInfo).toHaveBeenCalled();
    });

    it('should test when user does not have appropriate permissions', () => {
        spyOn(component.authService, 'checkPermission').and.returnValue(false);
        component.getPatientUpcomingAppointments();
        expect(component.authService.checkPermission).toHaveBeenCalled();
    });
});
