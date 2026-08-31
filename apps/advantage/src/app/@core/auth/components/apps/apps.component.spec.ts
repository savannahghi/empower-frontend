import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition } from '@uirouter/angular';
import { of } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { Authorization } from '../../services/authorization.service';
import { DataLayerUtils } from '../../services/datalayer.utils.service';
import { HomePageService } from '../../services/home-page.service';
import { CompleteService } from '../../services/login.service';
import { Oauth2Service } from '../../services/oauth2.service';
import { Setup } from '../../services/setup.service';

import { AppsComponent } from './apps.component';
import { RedirectService } from '../../services/redirect.service';
import { RedirectServiceStub } from '../../services/tests/login.service.spec';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('AppsComponent', () => {
    class NbToastrServiceStub {
        show() {
            return of(() => {});
        }
    }

    class CompleteServiceStub {
        determineApplication() {
            return true;
        }
        goToApp() {
            return true;
        }
    }

    class AuthorizationStub {
        getOrganisation() {
            return {};
        }
        getToken() {
            return {};
        }
        setUser() {
            return {
                client_types: ['PROVIDER'],
            };
        }
        setClinicalIds() {
            return {
                clinical_facility_id: 'sdsewerwjampisu9',
                clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
            };
        }
        setOrganisationSettings() {
            return of(() => {});
        }
        getUser() {
            return {
                client_types: ['PROVIDER'],
                roles: ['Quintus'],
                permissions: ['advantage.visit_list', 'erp.dashboard_list'],
            };
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

    class AuthUrlConfigStub {
        setAuthDetails() {
            return of(() => {});
        }
        getUser() {
            return {
                client_types: ['PROVIDER'],
                roles: ['Quintus'],
                permissions: ['advantage.visit_list', 'erp.dashboard_list'],
            };
        }
        getToken() {
            return {};
        }
        setClinicalIds() {
            return {
                clinical_facility_id: 'sdsewerwjampisu9',
                clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
            };
        }
    }

    const servDepArray = [HomePageService];

    let component: AppsComponent;
    let fixture: ComponentFixture<AppsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AppsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [],
            providers: [
                DataLayerUtils,
                Setup,
                servDepArray,
                { provide: Oauth2Service, useClass: AuthUrlConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: RedirectService, useClass: RedirectServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        fixture = TestBed.createComponent(AppsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        component.goToApp('advantage');
        expect(component).toBeTruthy();
    });
});
