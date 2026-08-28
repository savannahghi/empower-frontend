import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { BehaviorSubject, of } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { StateService, UIRouterGlobals } from '@uirouter/core';

import { PatientListComponent } from './patient-list.component';
import { ShepherdService } from 'angular-shepherd';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { Transition } from '@uirouter/angular';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { environment } from '../../../../../environments/environment';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

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

class AuthorizationStub {
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getOrganisation() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

const stateServiceStub = {
    reset() {
        return true;
    },
    go() {
        return true;
    },
    reload() {
        return true;
    },
    includes() {
        return true;
    },
    transitionTo() {
        return true;
    },
    param() {
        return true;
    },
};

const uIRouterGlobalsStub = {
    params: {
        id: '112',
        service_request: 'wer',
        page_size: '2',
        queue: 1,
    },
    $current: {
        params: {
            page_size: '2',
        },
    },
    current: {
        name: 'app.advantage.appointments.detail',
    },
};

const silStoresServiceStub = {
    list() {
        return of({
            results: [
                {
                    id: 1,
                    active_visits: [
                        {
                            queue: 1,
                        },
                    ],
                },
            ],
        });
    },
    create() {
        return of({
            id: '4ed62h7281262h1',
        });
    },
    update() {
        return of({
            id: '4ed62h7281262h1',
        });
    },
};

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}
class ShepherdServiceStub {
    addSteps() {}
    start() {}
}

describe('PatientListComponent', () => {
    let component: PatientListComponent;
    let fixture: ComponentFixture<PatientListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PatientListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('split'),
                mockPipe('titleCase'),
                mockPipe('variant'),
                mockPipe('replaceWith'),
                mockPipe('translate'),
            ],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useValue: silStoresServiceStub },
                { provide: StateService, useValue: stateServiceStub },
                { provide: ShepherdService, useClass: ShepherdServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        environment.variant = 'default';

        fixture = TestBed.createComponent(PatientListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.actions = [
            {
                btnText: 'View',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.queues.detail',
                    stateParams: {
                        id: 'visit',
                        service_request: 'id',
                    },
                },
            },
            {
                btnText: 'Serve',
                status: 'primary',
                expression: row => {
                    return row?.status === 'WAITING';
                },
                action: 'modal',
                modalConf: {
                    formConfig: {},
                    btnText: 'Serve',
                    context: 'Start to see the patient',
                    store: 'service-requests',
                    action: 'quickPatch',
                    method: 'addToQueue',
                },
            },
            {
                btnText: 'Add to queue',
                status: 'primary',
                expression: row => {
                    return row?.status === 'PENDING';
                },
                action: 'modal',
                modalConf: {
                    formConfig: {},
                    btnText: 'Add To Queue',
                    context: 'Confirm add patient to queue',
                    store: 'service-requests',
                    action: 'quickPatch',
                    method: 'addToQueue',
                },
            },
        ];
    });

    it('should test component functions', () => {
        spyOn(component, 'toggleModal').and.callThrough();
        component.toggleModal('patientRegistration');
        component.patient = { id: 1 };
        component.getFormOptions({ resetModel: () => {} });
        component.setFilter({});
        component.showErrorToast('bottom-right', 'success', '9', 'Patient');
        component.ngOnInit();
        const patient = {
            person: {
                date_of_birth: '1992-09-09',
                person_contacts: [
                    { contact: '+254700090954', contact_type: 'phone_number' },
                ],
                id_value: '9',
                id_document_type: 'national',
            },
        };
        component.submitPatient(patient);
        component.startWalkthrough();
        expect(component.toggleModal).toHaveBeenCalled();
    });
});

describe('PatientListComponent empower variant', () => {
    let component: PatientListComponent;
    let fixture: ComponentFixture<PatientListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PatientListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('split'),
                mockPipe('titleCase'),
                mockPipe('variant'),
                mockPipe('replaceWith'),
                mockPipe('translate'),
            ],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useValue: silStoresServiceStub },
                { provide: StateService, useValue: stateServiceStub },
                { provide: ShepherdService, useClass: ShepherdServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();
        environment.variant = 'empower';

        fixture = TestBed.createComponent(PatientListComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
        component.actions = [
            {
                btnText: 'View',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.queues.detail',
                    stateParams: {
                        id: 'visit',
                        service_request: 'id',
                    },
                },
            },
            {
                btnText: 'Serve',
                status: 'primary',
                expression: row => {
                    return row?.status === 'WAITING';
                },
                action: 'modal',
                modalConf: {
                    formConfig: {},
                    btnText: 'Serve',
                    context: 'Start to see the patient',
                    store: 'service-requests',
                    action: 'quickPatch',
                    method: 'addToQueue',
                },
            },
            {
                btnText: 'Add to queue',
                status: 'primary',
                expression: row => {
                    return row?.status === 'PENDING';
                },
                action: 'modal',
                modalConf: {
                    formConfig: {},
                    btnText: 'Add To Queue',
                    context: 'Confirm add patient to queue',
                    store: 'service-requests',
                    action: 'quickPatch',
                    method: 'addToQueue',
                },
            },
        ];
    });

    it('should set distinct tables if variant is empower', () => {
        component.ngOnInit();
        expect(component.tableHeader.length).toBe(6);
        expect(component.rows.length).toBe(5);
    });
});
const uIRouterGlobalsStubDetailView = {
    params: {
        id: '112',
        service_request: 'wer',
        page_size: '2',
        queue: 1,
    },
    $current: {
        params: {
            page_size: '2',
        },
    },
    current: {
        name: 'app.advantage.patients',
    },
};

const transitionStub = {
    params: () => {},
};

class SilDatatableStubComponent {
    getData: () => {};
}

describe('PatientListComponent not detailView', () => {
    let component: PatientListComponent;
    let fixture: ComponentFixture<PatientListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PatientListComponent],
            imports: [
                mockPipe('split'),
                mockPipe('variant'),
                mockPipe('translate'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                SilStoresService,
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useValue: silStoresServiceStub,
                },
                { provide: StateService, useValue: stateServiceStub },
                { provide: Transition, useValue: transitionStub },
                {
                    provide: UIRouterGlobals,
                    useValue: uIRouterGlobalsStubDetailView,
                },
                {
                    provide: SilDatatableComponent,
                    useClass: SilDatatableStubComponent,
                },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PatientListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test submitPatient', () => {
        const patient = {
            person: {
                date_of_birth: '1992-09-09',
                person_contacts: [
                    { contact: '0700090954', contact_type: 'phone_number' },
                ],
                id_value: '9',
                id_document_type: 'national',
            },
        };
        component.getFormOptions({ resetModel: () => {} });
        component.submitPatient(patient);
        expect(component).toBeTruthy();
    });
});

const uIRouterGlobalsStubStartVisit = {
    params: {
        id: '1',
    },
    current: {
        name: 'app.advantage.visits.start_visit',
    },
};

describe('PatientListComponent navigate to StartVisit view', () => {
    let component: PatientListComponent;
    let fixture: ComponentFixture<PatientListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PatientListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('split'),
                mockPipe('variant'),
                mockPipe('translate'),
            ],
            providers: [
                SilStoresService,
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useValue: silStoresServiceStub,
                },
                { provide: StateService, useValue: stateServiceStub },
                { provide: Transition, useValue: transitionStub },
                {
                    provide: UIRouterGlobals,
                    useValue: uIRouterGlobalsStubStartVisit,
                },
                {
                    provide: SilDatatableComponent,
                    useClass: SilDatatableStubComponent,
                },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();
        environment.variant = 'uzazisalama';
        fixture = TestBed.createComponent(PatientListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test navigateToStartVisit method', () => {
        spyOn(component, 'navigateToStartVisit').and.callThrough();
        component.navigateToStartVisit();
        expect(component.navigateToStartVisit).toHaveBeenCalled();
    });
});

class silStoresServiceStubError {
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('PatientListComponent error', () => {
    let component: PatientListComponent;
    let fixture: ComponentFixture<PatientListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PatientListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('split'),
                mockPipe('variant'),
                mockPipe('translate'),
            ],
            providers: [
                SilStoresService,
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useClass: silStoresServiceStubError,
                },
                { provide: StateService, useValue: stateServiceStub },
                { provide: Transition, useValue: transitionStub },
                {
                    provide: UIRouterGlobals,
                    useValue: uIRouterGlobalsStubDetailView,
                },
                {
                    provide: SilDatatableComponent,
                    useClass: SilDatatableStubComponent,
                },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();
        environment.variant = 'default';
        fixture = TestBed.createComponent(PatientListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test submitPatient', () => {
        const patient = {
            person: {
                date_of_birth: '1992-09-09',
                person_contacts: [
                    { contact: '0700090954', contact_type: 'phone_number' },
                ],
                id_value: '9',
                id_document_type: 'national',
            },
        };
        component.actions[0].expression();
        component.actions[1].expression();
        component.actions[2].expression();
        component.actions[3].expression();
        component.getFormOptions({ resetModel: () => {} });
        component.submitPatient(patient);
        expect(component).toBeTruthy();
    });
});
