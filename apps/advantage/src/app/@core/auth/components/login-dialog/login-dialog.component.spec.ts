import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
import {
    NbDialogRef,
    NbFocusMonitor,
    NbFormFieldControl,
    NbIconLibraries,
    NbIconModule,
    NbInputModule,
    NbStatusService,
    NbToastrService,
} from '@nebular/theme';
import { LoginDialogComponent } from './login-dialog.component';
import { of } from 'rxjs';
import { HomePageService } from '../../services/home-page.service';
import { AppConfigService } from '../../../../app-config.service';
import { Setup } from '../../services/setup.service';
import { DataLayerUtils } from '../../services/datalayer.utils.service';
import { Authorization } from '../../services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { StateService } from '@uirouter/angular';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
    PLATFORM_ID,
    DOCUMENT,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    HttpClient,
    HttpHandler,
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import {
    AuthUrls,
    Oauth2Service,
    OauthCredz,
} from '../../services/oauth2.service';
import { RedirectService } from '../../services/redirect.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

const servDepArray = [
    DataLayerUtils,
    Authorization,
    AppConfigService,
    HttpClient,
    HttpHandler,
    HomePageService,
];

class MockDocument {
    querySelectorAll() {
        return {
            forEach() {
                return {
                    remove: () => {},
                };
            },
        };
    }
}

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: '143224',
                    clinical_facility_id: 'sdsewerwjampisu9',
                    clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
                    appointment_status: 'BOOKED',
                    organisation_name: 'EMR/ERP Test Organisation',
                },
            ],
        });
    }

    getUser() {
        return of({
            id: '123',
        });
    }

    get() {
        return of({
            id: '123',
        });
    }
}
class NbStatusServiceStub {
    isCustomStatus() {}
    monitor() {
        return of(() => {});
    }
    getIcon() {}
    getPack() {}
    registerSvgPack() {}
    setDefaultPack() {}
    connectedTo() {}
    build() {}
    close() {}
    getDirection() {}
    subscribeOnTriggers() {}
    trigger() {}
    host() {}
    container() {}
}

class AuthorizationConfigStub {
    setAuthDetails() {
        return of(() => {});
    }
    loginUrl() {
        return of(() => {});
    }
    logout() {
        return of(() => {});
    }
    storeToken() {
        return true;
    }
    isLoggedIn() {
        return true;
    }

    setOrganisationSettings() {
        return of(() => {});
    }

    setOrganisation() {
        return of(() => {});
    }
    setOrganisationDetails() {
        return of({
            client_types: ['PRACTITIONER'],
        });
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

    setUser() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: 'advantage.visit_list',
        };
    }

    getUser() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: 'advantage.visit_list',
        };
    }
    getToken() {
        return {
            client_types: ['PRACTITIONER'],
            permissions: 'advantage.visit_list',
        };
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    setAdvantageOrganisation() {
        return {};
    }
    setAdvantageOrganisationDetails() {
        return of(() => {});
    }
    getErpOrganisation() {
        return {
            client_types: ['PROVIDER'],
            user_workstations: [{ workstation: '1' }],
        };
    }
    removeTokenData() {
        return {};
    }
}

export class RedirectServiceStub {
    redirectTo() {
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
    interceptDeferred() {
        return true;
    }
}

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

class AuthUrlConfigStub {
    setAuthDetails() {
        return of(() => {});
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
    scopes = { scopes: ['scope1', 'scope2'] };
    authUrls = new AuthUrls();
    oauthCredz = new OauthCredz();
}

describe('LoginDialogComponent', () => {
    let component: LoginDialogComponent;
    let fixture: ComponentFixture<LoginDialogComponent>;
    let doc: Document;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                mockPipe('translate'),
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                NbInputModule,
                LoginDialogComponent,
            ],
            providers: [
                Setup,
                DataLayerUtils,
                servDepArray,
                NbIconModule,
                { provide: NbFormFieldControl, useValue: {} },
                { provide: Document, useClass: MockDocument },
                { provide: NbFocusMonitor, useClass: NbStatusServiceStub },
                { provide: NbDialogRef, useClass: NbStatusServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Oauth2Service, useClass: AuthUrlConfigStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: NbIconLibraries, useClass: NbStatusServiceStub },
                {
                    provide: ErrorHandlerService,
                    useValue: jasmine.createSpyObj('ErrorHandlerService', [
                        'handleError',
                    ]),
                },
                { provide: PLATFORM_ID, useValue: 'browser' },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();
        doc = TestBed.inject(DOCUMENT);
        fixture = TestBed.createComponent(LoginDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test password method', () => {
        spyOn(component, 'toggleShowPassword').and.callThrough();
        component.toggleShowPassword();
        component.getInputType();
        component.toggleShowPassword();
        component.getInputType();
        expect(component.toggleShowPassword).toHaveBeenCalled();
        expect(component.showPassword).toBe(false);
    });

    it('should test accessMe', () => {
        spyOn(component, 'accessMe').and.callThrough();
        spyOn(component.authorizationService, 'setUser');
        component.accessMe({});
        component.showToast('bottom-right', 'danger', 'Error', 'Errr');
        expect(component.accessMe).toHaveBeenCalled();
    });

    it('should test completeLogin when token is null', () => {
        const spy = spyOn(doc, 'querySelectorAll').and.callThrough();
        const mockLoginData = {
            access_token: 'test-token',
            token_type: 'Bearer',
        };
        spyOn(component, 'completeLogin').and.callThrough();
        component.token = null;
        component.complete.tempLoginData = mockLoginData;
        component.completeLogin();
        component.closeAllLoginModals();
        expect(spy).toHaveBeenCalled();
        expect(component.completeLogin).toHaveBeenCalled();
    });

    it('should test completeLogin when token is null', () => {
        const mockLoginData = {
            access_token: 'test-token',
            token_type: 'Bearer',
        };
        spyOn(component, 'completeLogin').and.callThrough();
        component.token = null;
        component.complete.tempLoginData = mockLoginData;
        component.completeLogin();
        expect(component.completeLogin).toHaveBeenCalled();
    });

    it('should test handleMeError', fakeAsync(() => {
        const response = {
            url: 'profile/password/?roadblock=password_change',
        };
        spyOn(component, 'handleMeError').and.callThrough();
        component.handleMeError(response);
        tick(5010);
        expect(component.handleMeError).toHaveBeenCalled();
    }));

    it('should test serverLogin method client side', () => {
        environment.sentryEnvironment = 'testing';
        spyOn(component, 'serverLogin').and.callThrough();
        component.serverLogin();
        component.errorHandler({});
        expect(component.serverLogin).toHaveBeenCalled();
    });

    it('should test serverLogin', () => {
        component.showToast('bottom-right', 'danger', 'Error', 'Errr');
        spyOn(component, 'serverLogin').and.callThrough();
        component.serverLogin();
        component.handleResponse({ data: 'hallo' });
        expect(component.serverLogin).toHaveBeenCalled();
    });

    it('should test logout', () => {
        spyOn(component, 'logout').and.callThrough();
        component.logout();
        expect(component.logout).toHaveBeenCalled();
    });

    it('should test serverLogin method server side', () => {
        environment.sentryEnvironment = 'production';
        spyOn(component, 'serverLogin').and.callThrough();
        component.serverLogin();
        component.cancel();
        component.errorHandler({});
        expect(component.serverLogin).toHaveBeenCalled();
    });
});

describe('LoginDialogComponent platform server', () => {
    let component: LoginDialogComponent;
    let fixture: ComponentFixture<LoginDialogComponent>;
    let doc: Document;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                mockPipe('translate'),
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                NbInputModule,
                LoginDialogComponent,
            ],
            providers: [
                Setup,
                DataLayerUtils,
                servDepArray,
                NbIconModule,
                { provide: NbFormFieldControl, useValue: {} },
                { provide: Document, useClass: MockDocument },
                { provide: NbFocusMonitor, useClass: NbStatusServiceStub },
                { provide: NbDialogRef, useClass: NbStatusServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Oauth2Service, useClass: AuthUrlConfigStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: NbIconLibraries, useClass: NbStatusServiceStub },
                {
                    provide: ErrorHandlerService,
                    useValue: jasmine.createSpyObj('ErrorHandlerService', [
                        'handleError',
                    ]),
                },
                { provide: PLATFORM_ID, useValue: 'server' },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginDialogComponent);
        component = fixture.componentInstance;
        doc = TestBed.inject(DOCUMENT);
        fixture.detectChanges();
    });
    it('should test serverLogin', () => {
        const spy = spyOn(doc, 'querySelectorAll').and.callThrough();
        spyOn(component, 'serverLogin').and.callThrough();
        component.serverLogin();
        component.closeAllLoginModals();
        const box = {
            remove: () => {},
        };
        component.removeBox(box);
        expect(spy).toHaveBeenCalled();
        component.handleResponse({ data: 'hallo' });
        expect(component.serverLogin).toHaveBeenCalled();
    });
});
