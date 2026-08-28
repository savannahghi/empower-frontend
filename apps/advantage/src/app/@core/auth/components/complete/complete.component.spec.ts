import { AppConfigService } from '../../../../app-config.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CompleteService } from '../../services/login.service';
import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
    flush,
    discardPeriodicTasks,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    Pipe,
    PipeTransform,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CompleteAuthComponent } from './complete.component';
import { Oauth2Service } from '../../services/oauth2.service';
import { Authorization } from '../../services/authorization.service';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition } from '@uirouter/core';
import { DataLayerUtils } from '../../services/datalayer.utils.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { BehaviorSubject, of } from 'rxjs';
import { cleanStylesFromDOM } from '../../../../../test';
import { RedirectService } from '../../services/redirect.service';
import { RedirectServiceStub } from '../../services/tests/login.service.spec';
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

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: '143224',
                    clinical_facility_id: 'sdsewerwjampisu9',
                    clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
                },
            ],
        });
    }
}

class CompleteServiceStub {
    completeAuth() {
        return of(() => {});
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class AuthUrlConfigStub {
    setAuthDetails() {
        return of(() => {});
    }
}

class AuthorizationConfigStub {
    setAuthDetails() {
        return of(() => {});
    }
    isLoggedIn() {
        return true;
    }
    getUser() {
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
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
    setOrganisationDetails() {
        return of(() => {});
    }
    getErpOrganisation() {
        return {
            client_types: ['PROVIDER'],
            user_workstations: null,
        };
    }
    setAdvantageOrganisationDetails() {
        return {
            client_types: ['PROVIDER'],
            user_workstations: null,
        };
    }
    removeTokenData() {
        return {};
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

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

describe('CompleteAuthComponent | PROVIDER', () => {
    let component: CompleteAuthComponent;
    let fixture: ComponentFixture<CompleteAuthComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CompleteAuthComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('translate'),
                mockPipe('variantDisplay'),
                RouterTestingModule.withRoutes([
                    { path: 'complete', component: CompleteAuthComponent },
                    { path: 'features', component: CompleteAuthComponent },
                    {
                        path: 'features/clinic/home-page',
                        component: CompleteAuthComponent,
                    },
                    {
                        path: 'features/clinic/providers',
                        component: CompleteAuthComponent,
                    },
                ]),
            ],
            providers: [
                Oauth2Service,
                AppConfigService,
                DataLayerUtils,
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CompleteAuthComponent);
        component = fixture.componentInstance;
        component.window = {
            location: {
                assign: () => {},
            },
        };
        fixture.detectChanges();
    });

    it('should create when logged in and navigate to provider types', () => {
        component.clearSession();
        expect(component).toBeTruthy();
    });

    it('should test displayLoginLink method', fakeAsync(() => {
        component.ngOnInit();
        component.ngOnDestroy();
        tick(20000);
        expect(component.showLoginLink).toBeTruthy();
    }));

    it('should test completeAuthentication', () => {
        component.completeAuthentication();
        expect(component).toBeTruthy();
    });
});

class AuthorizationConfigStub2 {
    setAuthDetails() {
        return of(() => {});
    }
    isLoggedIn() {
        return true;
    }
    getUser() {
        return {
            client_types: [],
        };
    }
    setOrganisationDetails() {
        return of(() => {});
    }

    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
    setAdvantageOrganisationDetails() {
        return {
            client_types: ['PROVIDER'],
            user_workstations: null,
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
            client_types: ['PROVIDER'],
            user_workstations: [{ workstation: '1' }],
        };
    }
}
describe('CompleteAuthComponent | user has no bp', () => {
    let component: CompleteAuthComponent;
    let fixture: ComponentFixture<CompleteAuthComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CompleteAuthComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('translate'),
                mockPipe('variantDisplay'),
                RouterTestingModule.withRoutes([
                    { path: 'complete', component: CompleteAuthComponent },
                    { path: 'features', component: CompleteAuthComponent },
                    {
                        path: 'features/clinic/home-page',
                        component: CompleteAuthComponent,
                    },
                    {
                        path: 'features/clinic/providers',
                        component: CompleteAuthComponent,
                    },
                ]),
            ],
            providers: [
                AppConfigService,
                DataLayerUtils,
                { provide: Oauth2Service, useClass: AuthUrlConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub2 },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CompleteAuthComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create when logged in and complete authorization', () => {
        expect(component).toBeTruthy();
    });
});

class AuthorizationConfigStub3 {
    setAuthDetails() {
        return of(() => {});
    }
    isLoggedIn() {
        return false;
    }
    getUser() {
        return {
            client_types: ['PRACTITIONER'],
        };
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    setAdvantageOrganisation() {
        return {
            client_types: ['PRACTITIONER'],
            user_workstations: null,
        };
    }
    setOrganisationDetails() {
        return of(() => {});
    }
    setAdvantageOrganisationDetails() {
        return of(() => {});
    }
    setUserDetails() {
        return of(() => {});
    }
    getErpOrganisation() {
        return {
            client_types: ['PRACTITIONER'],
            user_workstations: null,
        };
    }
}

describe('CompleteAuthComponent | user not logged in', () => {
    let component: CompleteAuthComponent;
    let fixture: ComponentFixture<CompleteAuthComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CompleteAuthComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('translate'),
                mockPipe('variantDisplay'),
                RouterTestingModule.withRoutes([
                    {
                        path: 'provider_types',
                        component: CompleteAuthComponent,
                    },
                ]),
            ],
            providers: [
                AppConfigService,
                DataLayerUtils,
                { provide: Oauth2Service, useClass: AuthUrlConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub3 },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CompleteAuthComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create when not logged in and take else path', fakeAsync(() => {
        spyOn(component.authConfig, 'isLoggedIn').and.returnValue(false);
        component.ngOnInit();
        component.ngOnDestroy();
        tick(20000);
        expect(component).toBeTruthy();
        flush();
    }));
});

class CompleteServiceStub2 {
    completeAuth() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('kaboooom!'));
        return sub;
    }
}

describe('CompleteAuthComponent | error', () => {
    let component: CompleteAuthComponent;
    let fixture: ComponentFixture<CompleteAuthComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CompleteAuthComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('translate'),
                mockPipe('variantDisplay'),
                RouterTestingModule.withRoutes([
                    {
                        path: 'provider_types',
                        component: CompleteAuthComponent,
                    },
                ]),
            ],
            providers: [
                AppConfigService,
                DataLayerUtils,
                { provide: Oauth2Service, useClass: AuthUrlConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: CompleteService, useClass: CompleteServiceStub2 },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub3 },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CompleteAuthComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create when not logged in and take else path and return an error', () => {
        expect(component).toBeTruthy();
    });
});

class AuthorizationConfigStub4 {
    setAuthDetails() {
        return of(() => {});
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
    isLoggedIn() {
        return true;
    }
    getUser() {
        return {
            client_types: ['LENDER'],
        };
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    setAdvantageOrganisation() {
        return {
            client_types: ['PRACTITIONER'],
            user_workstations: null,
        };
    }
    setAdvantageOrganisationDetails() {
        return of(() => {});
    }
    getErpOrganisation() {
        return {
            client_types: ['PROVIDER'],
            user_workstations: null,
        };
    }
}

describe('CompleteAuthComponent | LENDER', () => {
    let component: CompleteAuthComponent;
    let fixture: ComponentFixture<CompleteAuthComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CompleteAuthComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('translate'),
                mockPipe('variantDisplay'),
                RouterTestingModule.withRoutes([
                    { path: 'complete', component: CompleteAuthComponent },
                    { path: 'features', component: CompleteAuthComponent },
                    {
                        path: 'features/clinic/home-page',
                        component: CompleteAuthComponent,
                    },
                    {
                        path: 'features/clinic/providers',
                        component: CompleteAuthComponent,
                    },
                ]),
            ],
            providers: [
                AppConfigService,
                DataLayerUtils,
                { provide: Oauth2Service, useClass: AuthUrlConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub4 },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CompleteAuthComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create when logged in and navigate to lender types', fakeAsync(() => {
        tick(20000);
        expect(component).toBeTruthy();
    }));
});

class AuthorizationConfigSil {
    isLoggedIn() {
        return true;
    }
    getUser() {
        return {
            client_types: ['SIL'],
        };
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
    getOrganisation() {
        return {
            bp_type: 'SAVANNAH',
        };
    }
    setAdvantageOrganisation() {
        return {
            client_types: ['PRACTITIONER'],
            user_workstations: null,
        };
    }
    setAdvantageOrganisationDetails() {
        return of(() => {});
    }
    getErpOrganisation() {
        return {
            client_types: ['SIL'],
            user_workstations: null,
        };
    }
}

describe('CompleteAuthComponent | SIL', () => {
    let component: CompleteAuthComponent;
    let fixture: ComponentFixture<CompleteAuthComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CompleteAuthComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('translate'),
                mockPipe('variantDisplay'),
                RouterTestingModule.withRoutes([
                    { path: 'complete', component: CompleteAuthComponent },
                    { path: 'features', component: CompleteAuthComponent },
                    {
                        path: 'features/clinic/home-page',
                        component: CompleteAuthComponent,
                    },
                    {
                        path: 'features/clinic/providers',
                        component: CompleteAuthComponent,
                    },
                ]),
            ],
            providers: [
                AppConfigService,
                DataLayerUtils,
                { provide: Oauth2Service, useClass: AuthUrlConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigSil },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CompleteAuthComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create when logged in and navigate to sil', fakeAsync(() => {
        tick(5100);
        expect(component).toBeTruthy();
    }));
});

class AuthorizationConfigStub6 {
    setAuthDetails() {
        return of(() => {});
    }
    setUserDetails() {
        return of(() => {});
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
    isLoggedIn() {
        return true;
    }
    getUser() {
        return {
            client_types: ['PRACTITIONER'],
        };
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    setAdvantageOrganisation() {
        return {
            client_types: ['PRACTITIONER'],
            user_workstations: null,
        };
    }
    setAdvantageOrganisationDetails() {
        return of(() => {});
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
    removeTokenData() {
        return {};
    }
}

describe('CompleteAuthComponent | PRACTITIONER', () => {
    let component: CompleteAuthComponent;
    let fixture: ComponentFixture<CompleteAuthComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CompleteAuthComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('translate'),
                mockPipe('variantDisplay'),
                RouterTestingModule.withRoutes([
                    { path: 'complete', component: CompleteAuthComponent },
                    { path: 'features', component: CompleteAuthComponent },
                    {
                        path: 'features/clinic/home-page',
                        component: CompleteAuthComponent,
                    },
                    {
                        path: 'features/clinic/providers',
                        component: CompleteAuthComponent,
                    },
                ]),
            ],
            providers: [
                Oauth2Service,
                AppConfigService,
                DataLayerUtils,
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub6 },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CompleteAuthComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create when logged in and navigate to provider types', fakeAsync(() => {
        component.clearSession();
        component.ngOnInit();
        discardPeriodicTasks();
        component.ngOnDestroy();
        tick(20000);
        expect(component).toBeTruthy();
    }));

    it('should test displayLoginLink method', fakeAsync(() => {
        component.ngOnInit();
        discardPeriodicTasks();
        component.ngOnDestroy();
        tick(20000);
        expect(component.showLoginLink).toBeTruthy();
    }));
});
