import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { BehaviorSubject, of } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { HieReferralsComponent } from './hie-referrals.component';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'app.advantage.patients.detail.',
    },
    params() {
        return { appointment_id: 1 };
    },
};

class AuthenticationStub {
    checkPermission() {
        return true;
    }
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

class SilStoresServiceStub {
    list() {
        return of({
            totalCount: 2,
            results: [{ id: '9067571b-4389-45b8-96da-6430353e' }],
            edges: [
                {
                    node: {
                        referralDate: 'May 12, 2024',
                        referredFor: 'Diagnostics',
                        referredTo: 'Coast General',
                        referralReportLink:
                            'https://example.invalid/fixtures/file',
                        patientName: 'Lions, Taraji ',
                    },
                },
                {
                    node: {
                        referralDate: 'May 12, 2024',
                        referredFor: 'Diagnostics',
                        referredTo: 'Nairobi Hospital',
                        patientName: 'Lions, Taraji ',
                    },
                },
            ],
            pageInfo: {
                HasNextPage: false,
                EndCursor: null,
                HasPreviousPage: false,
                StartCursor: null,
            },
        });
    }
}

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

class NbToastrServiceStub {
    show() {
        return {};
    }
}

describe('HieReferralsComponent: ', () => {
    let component: HieReferralsComponent;
    let fixture: ComponentFixture<HieReferralsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [HieReferralsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HieReferralsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.actions = [
            {
                btnText: 'View',
                status: 'primary',
                action: 'openDocument',
                expression: row => {
                    return row?.report_link;
                },
                modalConf: {
                    url: 'report_link',
                },
            },
        ];
    });

    it('should test ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test getVisitPatient function', () => {
        spyOn(component, 'getVisitPatient').and.callThrough();
        component.getVisitPatient('3068571b-4389-45b8-96da-6430353');
        expect(component.getVisitPatient).toHaveBeenCalled();
    });

    it('should test responseFunction function', () => {
        component.serviceRequestId = 'a87a6f63-d339-4818-8def-03a6c1567d9a';
        const response = {
            results: [{ id: '9067571b-4389-45b8-96da-6430353e' }],
        };
        spyOn(component, 'responseFunction').and.callThrough();

        component.responseFunction(response);
        expect(component.responseFunction).toHaveBeenCalled();
    });

    it('should test viewReferralForm functionality', () => {
        const event = {
            id: 'e9bfbce8-7959-4d40-9c95-5ee54abe0414',
            status: 'active',
            intent: 'instance-order',
            priority: 'urgent',
            patientID: 'e9bfbce8-7959-4d40-9c95-5ee54abe0414',
            receivingFacility: 'Main Branch',
            orderDetails: 'Mammogram',
            date: '2024-06-10T08:09:06Z',
            node: {
                id: 'e9bfbce8-7959-4d40-9c95-5ee54abe0414',
            },
        };
        spyOn(component, 'viewReferralForm').and.callThrough();
        component.viewReferralForm(event);
        expect(component.viewReferralForm).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('HieReferralsComponent fails', () => {
    let component: HieReferralsComponent;
    let fixture: ComponentFixture<HieReferralsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [HieReferralsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HieReferralsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test ngOnInit and throw error when getReferrals is called', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test getVisitPatient function', () => {
        spyOn(component, 'getVisitPatient').and.callThrough();
        component.getVisitPatient('3068571b-4389-45b8-96da-6430353');
        expect(component.getVisitPatient).toHaveBeenCalled();
    });
});
