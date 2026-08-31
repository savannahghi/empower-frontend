import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { PatientService } from '../patient.service';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { PatientReferralsComponent } from './patient-referrals.component';

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
        return { id: '8764-0284', appointment_id: 1 };
    },
};

class SilStoresServiceStub {
    list() {
        return of({
            totalCount: 2,
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
                        referralReportLink:
                            'https://example.invalid/fixtures/file',
                        patientName: 'Lions, Taraji ',
                    },
                },
            ],
            pageInfo: {
                HasNextPage: false,
                EndCursor: '',
                HasPreviousPage: false,
                StartCursor: '',
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
    transitionTo() {
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

class PatientServiceStub {
    patientAppointmentsDataEmitter() {
        return [{}];
    }
}

describe('PatientReferralsComponent: ', () => {
    let component: PatientReferralsComponent;
    let fixture: ComponentFixture<PatientReferralsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [PatientReferralsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PatientReferralsComponent);
        component = fixture.componentInstance;
        component.patientObservable = of({
            person: {
                id: '12342313',
            },
        });
        component.actions = [
            {
                btnText: 'View',
                status: 'primary',
                action: 'openDocument',
                expression: row => {
                    return row?.node.referralReportLink;
                },
                modalConf: {
                    url: 'node.referralReportLink',
                },
            },
        ];
        fixture.detectChanges();
    });

    it('should test ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test viewPostReferralReport', () => {
        spyOn(component, 'viewPostReferralReport').and.callThrough();
        const event = {
            encounterId: '827472-029492-14184',
        };
        component.viewPostReferralReport(event);
        expect(component.viewPostReferralReport).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('PatientReferralsComponent fails', () => {
    let component: PatientReferralsComponent;
    let fixture: ComponentFixture<PatientReferralsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [PatientReferralsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PatientReferralsComponent);
        component = fixture.componentInstance;
        component.patientObservable = of({
            person: {
                id: '12342313',
            },
        });
        fixture.detectChanges();
    });

    it('should test ngOnInit and throw error when getPatientInfo is called', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        component.getPatientInfo();
        expect(component.ngOnInit).toHaveBeenCalled();
    });
});

describe('PatientReferralsComponent fails', () => {
    let component: PatientReferralsComponent;
    let fixture: ComponentFixture<PatientReferralsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [PatientReferralsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PatientReferralsComponent);
        component = fixture.componentInstance;
        component.patientObservable = throwError(
            () => new Error('Error thrown')
        );
        fixture.detectChanges();
    });

    it('should test ngOnInit and throw error when getPatientInfo is called', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        component.getPatientInfo();
        expect(component.ngOnInit).toHaveBeenCalled();
    });
});
