import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { of } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { StateService, UIRouterGlobals } from '@uirouter/core';
import { SmsListComponent } from './sms-list.component';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
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
    setUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
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

class SilDatatableStubComponent {
    getData: () => {};
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

describe('SmsListComponent', () => {
    let component: SmsListComponent;
    let fixture: ComponentFixture<SmsListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SmsListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('split'),
                mockPipe('titleCase'),
                mockPipe('replaceWith'),
                mockPipe('translate'),
            ],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useValue: silStoresServiceStub },
                { provide: StateService, useValue: stateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: SilStoresService,
                    useValue: silStoresServiceStub,
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

        fixture = TestBed.createComponent(SmsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should sms list component functions', () => {
        component.smsList = [
            {
                guid: '4e5e42bf-ac4b-4ce4-b760-20a9c69d50b5',
                body: 'SMS body',
                msisdn: '+254790360360',
                sms_type: 'BULK',
                gateway: null,
                carrier: '639/01',
                subscription: null,
                direction: 'OUTBOUND',
                state: 'QUEUED',
                metadata: {
                    owner: 4602,
                    intention: 'VISIT_START',
                },
                parts: 1,
                created: '2023-11-21T12:03:24.663696+03:00',
                updated: '2023-11-21T12:03:24.663711+03:00',
            },
        ];
        component.setFilter({ id: 1 });
        expect(component).toBeTruthy();
    });
});
