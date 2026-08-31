import { of } from 'rxjs';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Authorization } from '../../services/authorization.service';
import { WorkstationComponent } from './workstation.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StateService, Transition } from '@uirouter/core';
import { NbIconModule, NbToastrService } from '@nebular/theme';
import { cleanStylesFromDOM } from '../../../../../test';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { SilKeycloakService } from 'app/shared/sil-keycloak/keycloak.service';

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
class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: 1,
                },
            ],
            user_workstations: [
                {
                    workstation: '4f061952-8e24-4bea-a9ae-5006af883247',
                    workstation__name: 'Laboratory',
                    workstation__org_unit__name: 'Main Department',
                    workstation__org_unit:
                        '4f2ede94-cb03-4532-9c38-a455470cfe0e',
                    workstation__org_unit__parent__name: 'Meru',
                    workstation__org_unit__parent:
                        'c685d3f7-08f6-40ec-b343-c31323a6fcd2',
                },
                {
                    workstation: 'a205494d-28f2-413a-875c-5b4008153b2e',
                    workstation__name: "Cashier's Desk",
                    workstation__org_unit__name: 'Main Department',
                    workstation__org_unit:
                        '4f2ede94-cb03-4532-9c38-a455470cfe0e',
                    workstation__org_unit__parent__name: 'Meru',
                    workstation__org_unit__parent:
                        'c685d3f7-08f6-40ec-b343-c31323a6fcd2',
                },
            ],
        });
    }
}

class AuthorizationConfigStub {
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getUser() {
        return true;
    }
    setUser() {
        return true;
    }
    setOrganisationSettings() {
        return true;
    }
    setBranchSettings() {
        return true;
    }
    setOrganisation() {
        return true;
    }
    getErpOrganisation() {
        return {
            user_workstations: [
                {
                    workstation: '4f061952-8e24-4bea-a9ae-5006af883247',
                    workstation__name: 'Laboratory',
                    workstation__org_unit__name: 'Main Department',
                    workstation__org_unit:
                        '4f2ede94-cb03-4532-9c38-a455470cfe0e',
                    workstation__org_unit__parent__name: 'Meru',
                    workstation__org_unit__parent:
                        'c685d3f7-08f6-40ec-b343-c31323a6fcd2',
                },
                {
                    workstation: 'a205494d-28f2-413a-875c-5b4008153b2e',
                    workstation__name: "Cashier's Desk",
                    workstation__org_unit__name: 'Main Department',
                    workstation__org_unit:
                        '4f2ede94-cb03-4532-9c38-a455470cfe0e',
                    workstation__org_unit__parent__name: 'Meru',
                    workstation__org_unit__parent:
                        'c685d3f7-08f6-40ec-b343-c31323a6fcd2',
                },
            ],
        };
    }
    logout() {
        return true;
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

class TransitionServiceStub {
    from() {
        return { name: 'auth.complete' };
    }
    params() {
        return { id: '' };
    }
}

class TransitionServiceStub1 {
    from() {
        return { name: 'app.advantage.home' };
    }
    params() {
        return { id: 'someid' };
    }
}

class TransitionServiceStub2 {
    from() {
        return { name: 'app.advantage.visits' };
    }
    params() {
        return {};
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class SilKeycloakServiceStub {
    getToken() {
        return true;
    }
    isLoggedIn(): Promise<boolean> {
        return Promise.resolve(true);
    }
}

describe('WorkstationComponent', () => {
    let component: WorkstationComponent;
    let fixture: ComponentFixture<WorkstationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [WorkstationComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            imports: [mockPipe('translate'), mockPipe('variant')],
            providers: [
                NbIconModule,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(WorkstationComponent);
        component = fixture.componentInstance;
        component.window = {
            location: {
                assign: () => {},
            },
        };
        fixture.detectChanges();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should test ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        component.redirectToLogin('no-workstation');
        component.handleErr({});
        component.handleOrganisationSettingsErr({});
        expect(component.ngOnInit).toHaveBeenCalled();
    });
    it('should test selectServicePoint method', () => {
        component.selectServicePoint({ workstation: 'workstation 1' });
        expect(component.selectedWs).toEqual({ workstation: 'workstation 1' });
    });
    it('should test selectBranch method', () => {
        component.selectBranch({ branch: 'main branch' });
        expect(component.selectedBr).toEqual({ branch: 'main branch' });
    });
    it('should test selectCluster method', () => {
        component.selectCluster({ cluster: 'main cluster' });
        expect(component.selectedCl).toEqual({ cluster: 'main cluster' });
    });
});

describe('tests select service points if user already selected', () => {
    let component: WorkstationComponent;
    let fixture: ComponentFixture<WorkstationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [WorkstationComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            imports: [mockPipe('translate'), mockPipe('variant')],
            providers: [
                NbIconModule,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionServiceStub1 },
                { provide: Transition, useClass: TransitionServiceStub2 },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(WorkstationComponent);
        component = fixture.componentInstance;
        component.window = {
            location: {
                assign: () => {},
            },
        };
        fixture.detectChanges();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should test selectServicePoint method', () => {
        component.redirectToLogin();
        component.selectServicePoint({ workstation: 'workstation 1' });
        expect(component.selectedWs).toEqual({ workstation: 'workstation 1' });
    });
});

describe('should use dumpedState', () => {
    let component: WorkstationComponent;
    let fixture: ComponentFixture<WorkstationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [WorkstationComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            imports: [mockPipe('translate'), mockPipe('variant')],
            providers: [
                NbIconModule,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionServiceStub1 },
                { provide: Transition, useClass: TransitionServiceStub2 },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();
        localStorage.setItem(
            'dumpedState',
            JSON.stringify({ stateName: 'login', params: { id: 1 } })
        );
        fixture = TestBed.createComponent(WorkstationComponent);
        component = fixture.componentInstance;
        component.window = {
            location: {
                assign: () => {},
            },
        };
        fixture.detectChanges();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should test dumpedState', () => {
        component.previousState = {
            name: '',
        };
        component.selectServicePoint({ workstation: 'workstation 1' });
        expect(component.selectedWs).toEqual({ workstation: 'workstation 1' });
    });
});

describe('should use dumpedState auth.workstations', () => {
    let component: WorkstationComponent;
    let fixture: ComponentFixture<WorkstationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [WorkstationComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            imports: [mockPipe('translate'), mockPipe('variant')],
            providers: [
                NbIconModule,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionServiceStub1 },
                { provide: Transition, useClass: TransitionServiceStub2 },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();
        localStorage.setItem(
            'dumpedState',
            JSON.stringify({
                stateName: 'auth.workstations',
                params: { id: 1 },
            })
        );
        fixture = TestBed.createComponent(WorkstationComponent);
        component = fixture.componentInstance;
        component.window = {
            location: {
                assign: () => {},
            },
        };
        fixture.detectChanges();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should test dumpedState', () => {
        component.previousState = {
            name: '',
        };
        component.selectServicePoint({ workstation: 'workstation 1' });
        expect(component.selectedWs).toEqual({ workstation: 'workstation 1' });
    });

    it('should test workstation redirection', () => {
        spyOn(component, 'selectServicePoint');
        const user = {
            user_workstations: [
                {
                    workstation: '4f061952-8e24-4bea-a9ae-5006af883247',
                    workstation__name: 'Laboratory',
                    workstation__org_unit__name: 'Main Department',
                    workstation__org_unit:
                        '4f2ede94-cb03-4532-9c38-a455470cfe0e',
                    workstation__org_unit__parent__name: 'Meru',
                    workstation__org_unit__parent:
                        'c685d3f7-08f6-40ec-b343-c31323a6fcd2',
                },
            ],
        };
        component.workstationsRetrieved(user);
        expect(component.selectServicePoint).toHaveBeenCalled();
    });
});

class CookieServiceStubUrlDump {
    get() {
        return '/advantage/patients';
    }
    set() {
        return true;
    }
    delete() {
        return true;
    }
}

describe('should use urlDump', () => {
    let component: WorkstationComponent;
    let fixture: ComponentFixture<WorkstationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [WorkstationComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            imports: [mockPipe('translate'), mockPipe('variant')],
            providers: [
                NbIconModule,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionServiceStub1 },
                { provide: Transition, useClass: TransitionServiceStub2 },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Cookies, useClass: CookieServiceStubUrlDump },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();
        localStorage.setItem('url.dump', 'h');
        fixture = TestBed.createComponent(WorkstationComponent);
        component = fixture.componentInstance;
        component.window = {
            location: {
                assign: () => {},
            },
        };
        fixture.detectChanges();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should test dumpedState', () => {
        component.previousState = {
            name: '',
        };
        component.selectServicePoint({ workstation: 'workstation 1' });
        expect(component.selectedWs).toEqual({ workstation: 'workstation 1' });
    });
});

class CookieServiceStubInvalidUrl {
    get() {
        return '/auth/apps';
    }
    set() {
        return true;
    }
    delete() {
        return true;
    }
}

describe('should use urlDump', () => {
    let component: WorkstationComponent;
    let fixture: ComponentFixture<WorkstationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [WorkstationComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            imports: [mockPipe('translate'), mockPipe('variant')],
            providers: [
                NbIconModule,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionServiceStub1 },
                { provide: Transition, useClass: TransitionServiceStub2 },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Cookies, useClass: CookieServiceStubInvalidUrl },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();
        localStorage.setItem('url.dump', 'h');
        fixture = TestBed.createComponent(WorkstationComponent);
        component = fixture.componentInstance;
        component.window = {
            location: {
                assign: () => {},
            },
        };
        fixture.detectChanges();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should test dumpedState invalid url', () => {
        component.previousState = {
            name: '',
        };
        component.selectServicePoint({ workstation: 'workstation 1' });
        expect(component.selectedWs).toEqual({ workstation: 'workstation 1' });
    });
});

class CookieServiceStubDumpedState {
    get(string) {
        if (string !== 'dumpedState') {
            return undefined;
        } else {
            return {
                stateName: 'app.advantage.patients',
                params: { id: '12' },
            };
        }
    }
    set() {
        return true;
    }
    delete() {
        return true;
    }
}

describe('should test if dumpState', () => {
    let component: WorkstationComponent;
    let fixture: ComponentFixture<WorkstationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [WorkstationComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            imports: [mockPipe('translate'), mockPipe('variant')],
            providers: [
                NbIconModule,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionServiceStub1 },
                { provide: Transition, useClass: TransitionServiceStub2 },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Cookies, useClass: CookieServiceStubDumpedState },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(WorkstationComponent);
        component = fixture.componentInstance;
        component.window = {
            location: {
                assign: () => {},
            },
        };
        fixture.detectChanges();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should test selectServicePoint with missing dumpState', () => {
        component.previousState = {
            name: '',
        };
        component.selectServicePoint({ workstation: 'workstation 1' });
        expect(component.selectedWs).toEqual({ workstation: 'workstation 1' });
    });
});

class CookieServiceStubInvalidDumpedState {
    get(string) {
        if (string !== 'dumpedState') {
            return undefined;
        } else {
            return {
                stateName: 'auth.login',
                params: { id: '12' },
            };
        }
    }
    set() {
        return true;
    }
    delete() {
        return true;
    }
}

describe('should test if dumpState invalid state', () => {
    let component: WorkstationComponent;
    let fixture: ComponentFixture<WorkstationComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [WorkstationComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            imports: [mockPipe('translate'), mockPipe('variant')],
            providers: [
                NbIconModule,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionServiceStub1 },
                { provide: Transition, useClass: TransitionServiceStub2 },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: SilKeycloakService,
                    useClass: SilKeycloakServiceStub,
                },
                {
                    provide: Cookies,
                    useClass: CookieServiceStubInvalidDumpedState,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(WorkstationComponent);
        component = fixture.componentInstance;
        component.window = {
            location: {
                assign: () => {},
            },
        };
        fixture.detectChanges();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should test selectServicePoint with missing dumpState', () => {
        component.previousState = {
            name: '',
        };
        component.selectServicePoint({ workstation: 'workstation 1' });
        expect(component.selectedWs).toEqual({ workstation: 'workstation 1' });
    });
});
