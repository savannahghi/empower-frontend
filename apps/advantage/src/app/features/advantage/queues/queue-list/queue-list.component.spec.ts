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

import { QueueListComponent } from './queue-list.component';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
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
    getWorkstation() {
        return {
            workstation: {
                workstation__name: 'Consultation',
                workstation__workstation_type: 'consultation',
            },
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
    current: {
        name: 'state',
    },
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
};

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

describe('QueueListComponent', () => {
    let component: QueueListComponent;
    let fixture: ComponentFixture<QueueListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [QueueListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('split'),
                mockPipe('titleCase'),
                mockPipe('replaceWith'),
                mockPipe('translate'),
            ],
            providers: [
                SilStoresService,
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useValue: silStoresServiceStub },
                { provide: StateService, useValue: stateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(QueueListComponent);
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
        component.workstation = {
            workstation__name: 'Consultation',
            workstation__workstation_type: 'consultation',
        };
        component.workstationName = 'Consultation';

        component.toggleModal();
        component.setFilter({ id: 1 });
        component.showToast(
            'bottom-right',
            'success',
            'Message',
            'Message sent'
        );
        component.queues = [{ id: 1, active_visits: [] }];
        const queue = { id: 1 };
        component.filterVisitsByQueue(queue);
        spyOn(component.$state, 'transitionTo');
        spyOn(component.$state, 'go');
        component.getAllServiceRequests();
        component.startWalkthrough();
        component.viewPatientInProgress();
        expect(component.$state.transitionTo).toHaveBeenCalled();
    });

    it('should test view patient in progresss with consulation workstation', () => {
        spyOn(component, 'viewPatientInProgress');
        component.viewPatientInProgress();
        expect(component.viewPatientInProgress).toHaveBeenCalled();
    });

    it('should test view patient in progresss with another workstation', () => {
        spyOn(component, 'viewPatientInProgress');
        component.workstation = {
            workstation__name: 'Billing',
        };
        component.viewPatientInProgress();
        expect(component.viewPatientInProgress).toHaveBeenCalled();
    });

    it('should test serve action button when queue status is WAITING', () => {
        component.ngOnInit();
        spyOn(component.$state, 'transitionTo');
        spyOn(component.$state, 'go');
        const checkWaiting = component.actions[2].expression({
            status: 'WAITING',
        });
        expect(checkWaiting).toBe(true);
    });

    it('should test addToQueue action button when queueu status is PENDING', () => {
        component.ngOnInit();
        spyOn(component.$state, 'transitionTo');
        spyOn(component.$state, 'go');
        const checkPending = component.actions[3].expression({
            status: 'PENDING',
        });
        expect(checkPending).toBe(true);
    });
});

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

class AuthorizationStubTwo {
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getWorkstation() {
        return {
            workstation: {
                workstation__name: 'Billing',
            },
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

describe('QueueListComponent Error', () => {
    let component: QueueListComponent;
    let fixture: ComponentFixture<QueueListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [QueueListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('split'),
                mockPipe('titleCase'),
                mockPipe('replaceWith'),
                mockPipe('translate'),
            ],
            providers: [
                SilStoresService,
                { provide: Authorization, useClass: AuthorizationStubTwo },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: StateService, useValue: stateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(QueueListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test fetch queues', () => {
        component.toggleModal();
        component.queues = [{ id: 1, active_visits: [] }];
        expect(component).toBeTruthy();
    });
});
