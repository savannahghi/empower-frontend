import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { VisitDetailsComponent } from './visit-details.component';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { AnalyticsService } from 'app/@core/utils/analytics.service';
import { FeatureFlagService } from 'app/@core/utils/feature.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

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

const uIRouterGlobalsStub = {
    params: {
        page_size: '2',
    },
    $current: {
        params: {
            page_size: '2',
            cancer_type: 'breast',
            patient_id: '1145',
            encounter_id: '32409',
        },
        parent: {
            name: 'app.advantage.visits',
        },
    },
    current: {
        name: 'app.advantage.visits.detail',
    },
};

class AuthenticationStub {
    checkPermission() {
        return true;
    }
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
    getOrganisation() {
        return {};
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
    getWorkstation() {
        return {
            workstation__name: 'Screening',
            workstation__workstation_type: 'screening',
        };
    }
    getOrgSettings() {
        return [
            {
                id: '260bb4db-59b7-4f93-b2fd-fe88d3af21a3',
                default: 'APPOINTMENT BOOKING',
                description:
                    'Select the preferred patient scheduling method to use',
                setting_type: 'str',
                name: 'scheduling:preferred_patient_scheduling_method',
                value: 'CHECK-IN SCHEDULING',
            },
        ];
    }
}

class TransitionStub {
    params() {
        return { id: 1 };
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
    includes() {
        return true;
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

    updateNested() {
        return of({
            id: '4ed62h7281262h1',
        });
    }

    createNested() {
        return of({
            id: '4ed62h7281262h1',
        });
    }

    list() {
        return of({
            results: {
                new_price: 18,
                amount: '18',
                product_name: 'Lipid',
                quantity: 1,
                id: 1,
            },
        });
    }
}
class NbToastrServiceStub {
    show() {
        return {};
    }
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

class FeatureFlagServiceStub {
    isFeatureOn() {
        return true;
    }
}

describe('VisitDetailsComponent: parent state', () => {
    let component: VisitDetailsComponent;
    let fixture: ComponentFixture<VisitDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                mockPipe('titleCase'),
                mockPipe('age'),
                mockPipe('orderBy'),
                mockPipe('visitAmountDue'),
                mockPipe('statusColor'),
                mockPipe('statusDescription'),
                mockPipe('replaceWith'),
                mockPipe('featureFlag'),
                mockPipe('translate'),
                mockPipe('variantDisplay'),
                mockPipe('healthIdFormatter'),
                mockPipe('variant'),
                mockPipe('silCurrency'),
            ],
            declarations: [VisitDetailsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: TranslateService, useValue: TranslateServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VisitDetailsComponent);
        component = fixture.componentInstance;
        component.visitObservable = of({
            id: 1,
            person: { gender: 'MALE' },
            invoices: [{ id: 1 }],
            clinical_orders: [{ id: 1 }],
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 50,
                        invoice_lines: [{}],
                    },
                },
            ],
        });
        fixture.detectChanges();
    });

    it('should test state.go to child state', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('position', 'status', 'msg', 'mesage');
        component.cancelVisit();
        component.transitionToInProgress();
        component.isClinicalServicePoint();
        component.completeVisit();
        component.goToBilling();
        component.defaultCurrency = [{ id: 1 }];
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test the showScreeningTestTabs function', () => {
        spyOn(component, 'showScreeningTestTabs').and.callThrough();
        component.showScreeningTestTabs(
            {
                cancer_type: 'breast',
                patient_id: '8913',
                encounter_id: '123',
            },
            'referral'
        );
        expect(component.showScreeningTestTabs).toHaveBeenCalled();
    });
    it('should test the checkState function', () => {
        spyOn(component, 'checkState').and.callThrough();
        component.checkState();
        expect(component.checkState).toHaveBeenCalled();
    });

    it('should test the checkExamsState function', () => {
        spyOn(component, 'checkExamsState').and.callThrough();
        component.checkExamsState();
        expect(component.checkExamsState).toHaveBeenCalled();
    });

    it('should test the transitionExam function when current state is exam', () => {
        component.uiglobals.current.name = 'app.advantage.visits.detail.exam';
        spyOn(component, 'transitionExam').and.callThrough();
        spyOn(component, 'goToBilling').and.callThrough();

        component.transitionExam();
        expect(component.transitionExam).toHaveBeenCalled();
        expect(component.goToBilling).toHaveBeenCalled();
    });

    it('should test the transitionExam function when current state is not exam', () => {
        component.uiglobals.current.name =
            'app.advantage.visits.detail.billing';
        spyOn(component, 'transitionExam').and.callThrough();
        component.transitionExam();
        expect(component.transitionExam).toHaveBeenCalled();
    });
});

const uIRouterGlobalsStub2 = {
    params: {
        page_size: '2',
        cancer_type: 'breast',
        patient_id: '1145',
    },
    $current: {
        params: {
            page_size: '2',
        },
        parent: 'app.advantage.visits.detail',
    },
    current: {
        name: 'app.advantage.visits.detail.billing',
    },
};

class BaseAuthorizationStub {
    getOrganisation() {
        return {};
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
    getOrgSettings() {
        return [
            {
                id: '260bb4db-59b7-4f93-b2fd-fe88d3af21a3',
                default: 'APPOINTMENT BOOKING',
                description:
                    'Select the preferred patient scheduling method to use',
                setting_type: 'str',
                name: 'scheduling:preferred_patient_scheduling_method',
                value: 'CHECK-IN SCHEDULING',
            },
        ];
    }
}

class AuthorizationStubTwo extends BaseAuthorizationStub {
    getWorkstation() {
        return {
            workstation__name: 'Consultation',
            workstation__workstation_type: 'consultation',
        };
    }
}

class AuthorizationStubThree extends BaseAuthorizationStub {
    getWorkstation() {
        return {
            workstation__name: 'Triage',
            workstation__workstation_type: 'triage',
        };
    }
}

describe('VisitDetailsComponent: child state', () => {
    let component: VisitDetailsComponent;
    let fixture: ComponentFixture<VisitDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                mockPipe('titleCase'),
                mockPipe('age'),
                mockPipe('orderBy'),
                mockPipe('visitAmountDue'),
                mockPipe('statusColor'),
                mockPipe('statusDescription'),
                mockPipe('replaceWith'),
                mockPipe('featureFlag'),
                mockPipe('translate'),
                mockPipe('variantDisplay'),
                mockPipe('healthIdFormatter'),
                mockPipe('variant'),
                mockPipe('silCurrency'),
            ],
            declarations: [VisitDetailsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Authorization, useClass: AuthorizationStubTwo },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: TranslateService, useValue: TranslateServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VisitDetailsComponent);
        component = fixture.componentInstance;
        component.visitObservable = of({
            id: 1,
            person: { gender: 'MALE' },
            invoices: [{ id: 1 }],
            clinical_orders: [{ id: 1 }],
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 50,
                        invoice_lines: [{}],
                    },
                },
            ],
        });
        fixture.detectChanges();
    });

    it('should test that state.go is not called', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('position', 'status', 'msg', 'mesage');
        component.cancelVisit();
        component.completeVisit();
        component.goToCorrectState({});
        spyOn(component.$state, 'transitionTo');
        component.transitionToState('Consultation', { id: 1 });
        component.transitionToState('Triage', { id: 1 });
        component.startWalkthrough();
        component.toggleModal('toggle');
        component.setVisit({});
        component.defaultCurrency = [{ id: 1 }];
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test the goToCorrectState function when workstation is Triage', () => {
        spyOn(component, 'goToCorrectState').and.callThrough();
        component.workstationName = ['Triage'];
        component.goToCorrectState({});
        expect(component.goToCorrectState).toHaveBeenCalled();
    });

    it('should test the showScreeningTestTabs function when encounter_id is missing', () => {
        spyOn(component, 'showScreeningTestTabs').and.callThrough();
        component.showScreeningTestTabs(
            {
                cancer_type: 'breast',
                patient_id: '8913',
            },
            'test'
        );
        expect(component.showScreeningTestTabs).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
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
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    updateNested() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    createNested() {
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

describe('VisitDetailsComponent: all calls fail visit resolves', () => {
    let component: VisitDetailsComponent;
    let fixture: ComponentFixture<VisitDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                mockPipe('titleCase'),
                mockPipe('age'),
                mockPipe('orderBy'),
                mockPipe('visitAmountDue'),
                mockPipe('statusColor'),
                mockPipe('statusDescription'),
                mockPipe('replaceWith'),
                mockPipe('featureFlag'),
                mockPipe('translate'),
                mockPipe('variantDisplay'),
                mockPipe('healthIdFormatter'),
                mockPipe('variant'),
                mockPipe('silCurrency'),
            ],
            declarations: [VisitDetailsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: TranslateService, useValue: TranslateServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VisitDetailsComponent);
        component = fixture.componentInstance;
        component.visitObservable = of({
            id: 1,
            person: { gender: 'MALE' },
            invoices: [{ id: 1 }],
            clinical_orders: [{ id: 1 }],
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 50,
                        invoice_lines: [{}],
                    },
                },
            ],
        });
        fixture.detectChanges();
    });

    it('should test visitObservable method', () => {
        spyOn(component, 'completeVisit').and.callThrough();
        component.completeVisit();
        component.toggleBookAppointment();
        expect(component.completeVisit).toHaveBeenCalled();
    });

    it('should test the showScreeningTestTabs function when encounter_id and patient_id are missing', () => {
        spyOn(component, 'showScreeningTestTabs').and.callThrough();
        component.showScreeningTestTabs(
            {
                cancer_type: 'breast',
            },
            'fakepath'
        );
        expect(component.showScreeningTestTabs).toHaveBeenCalled();
    });
});

describe('VisitDetailsComponent: visit data does not resolve', () => {
    let component: VisitDetailsComponent;
    let fixture: ComponentFixture<VisitDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                mockPipe('titleCase'),
                mockPipe('age'),
                mockPipe('orderBy'),
                mockPipe('visitAmountDue'),
                mockPipe('statusColor'),
                mockPipe('statusDescription'),
                mockPipe('replaceWith'),
                mockPipe('featureFlag'),
                mockPipe('translate'),
                mockPipe('variantDisplay'),
                mockPipe('healthIdFormatter'),
                mockPipe('variant'),
                mockPipe('silCurrency'),
            ],
            declarations: [VisitDetailsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: TranslateService, useValue: TranslateServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VisitDetailsComponent);
        component = fixture.componentInstance;
        component.visitObservable = throwError(() => new Error('error'));
        fixture.detectChanges();
    });

    it('should test error part of observables', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        component.visit = {
            id: 1,
            invoices: [{ id: 1 }],
            clinical_orders: [{ id: 1 }],
            status: 'ARRIVED',
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 50,
                        invoice_lines: [{}],
                    },
                },
            ],
        };
        component.defaultCurrency = [{ id: 1 }];
        component.cancelVisit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });
});

describe('VisitDetailsComponent: ', () => {
    let component: VisitDetailsComponent;
    let fixture: ComponentFixture<VisitDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                mockPipe('titleCase'),
                mockPipe('age'),
                mockPipe('orderBy'),
                mockPipe('visitAmountDue'),
                mockPipe('statusColor'),
                mockPipe('statusDescription'),
                mockPipe('replaceWith'),
                mockPipe('featureFlag'),
                mockPipe('translate'),
                mockPipe('variantDisplay'),
                mockPipe('healthIdFormatter'),
                mockPipe('variant'),
                mockPipe('silCurrency'),
            ],
            declarations: [VisitDetailsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Authorization, useClass: AuthorizationStubThree },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: TranslateService, useValue: TranslateServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VisitDetailsComponent);
        component = fixture.componentInstance;
        component.visitObservable = of({
            id: 1,
            person: { gender: 'MALE' },
            invoices: [{ id: 1 }],
            clinical_orders: [{ id: 1 }],
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 50,
                        invoice_lines: [{}],
                    },
                },
            ],
        });
        fixture.detectChanges();
    });

    it('should test that state.go is not called', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('position', 'status', 'msg', 'mesage');
        component.cancelVisit();
        component.completeVisit();
        component.goToCorrectState({});
        component.startWalkthrough();
        component.toggleModal('toggle');
        component.setVisit({});
        component.defaultCurrency = [{ id: 1 }];
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should transition to the correct state based on visit data', () => {
        spyOn(component.$state, 'transitionTo');
        component.visit = {
            id: 1,
            service_requests: [{ queue_type: 'SCREENING' }],
        };
        component.transitionToState('Consultation', component.visit);
        expect(component.$state.transitionTo).toHaveBeenCalledWith(
            `${component.parentName}.detail.screening`,
            {
                id: component.visit.id,
                service_request: component.uiglobals.params.service_request,
            },
            { reload: true, notify: true }
        );
    });

    it('should transition to treatment tab when visit_type is TREATMENT and visit type is CHEMO', () => {
        spyOn(component.$state, 'transitionTo');
        component.visit = {
            id: 1,
            visit_type: 'CHEMO',
            service_requests: [{ queue_type: 'TREATMENT' }],
        };
        component.transitionToState('Treatment', component.visit);
        expect(component.$state.transitionTo).toHaveBeenCalledWith(
            `${component.parentName}.detail.diagnostics`,
            {
                id: component.visit.id,
                service_request: component.uiglobals.params.service_request,
            },
            { reload: true, notify: true }
        );
    });
});
