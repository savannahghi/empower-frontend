import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PatientPostReferralComponent } from './patient-post-referral.component';
import { VisitService } from '../../visits/visit.service';
import { ScreeningService } from '../../visits/visit-patient-screening/screening.service';
import { AnalyticsService } from '../../../../@core/utils';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
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

const visitServiceStub = {
    visitPatientDataEmitter: of({
        new_price: 18,
        amount: '18',
        product_name: 'Lipid',
        quantity: 1,
        id: 1,
    }),
    visitPatientScreeningDataEmitter: of({
        age: 40,
        gender: 'MALE',
    }),
    pricelistDataEmitter: of({
        name: 'Default pricelist',
        id: 1,
    }),
    currenciesDataEmitter: of({
        results: {
            new_price: 18,
            amount: '18',
            product_name: 'Lipid',
            quantity: 1,
            id: 1,
        },
    }),
    sendToQueue: () => {},
    completeVisit: () => {},
    queuesDataEmitter: of([
        {
            id: 1,
        },
    ]),
    fetchVisit: () => {},
    addToQueue: () => {},
    visit: {
        id: 1,
        service_requests: [
            {
                invoice: {
                    amount_due: 100,
                    amount_paid: 100,
                    invoice_lines: [{ id: 1 }],
                },
            },
        ],
    },
};

class ScreeningServiceStub {
    getScreeningData() {
        return of({
            data: {
                getEncounterAssociatedResources: {
                    riskAssessment: {},
                    consent: {},
                    __typename: 'EncounterAssociatedResources',
                },
            },
        });
    }
    checkUnauthorizedAccess() {}
    setScreeningStates() {}
    mutationBuilder() {
        return of({
            data: {
                recordConsent: {
                    status: 'active',
                },
            },
        });
    }
}
class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class StateServiceStub {
    reload() {
        return true;
    }
}
class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

const uIRouterGlobalsStub = {
    params: {
        serviceRequestId: 'someId',
    },
};

class SilStoresServiceStub {
    create() {
        return of([]);
    }
    get() {
        return of({});
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
    getToken() {
        return {
            access_token: 'token',
        };
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
    getWorkstation() {
        return {
            workstation__name: 'Breast Cancer Screening',
        };
    }
}

describe('PatientPostReferralComponent', () => {
    let component: PatientPostReferralComponent;
    let fixture: ComponentFixture<PatientPostReferralComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PatientPostReferralComponent],
            imports: [mockPipe('translate'), mockPipe('phoneNumberPipe')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: ScreeningService, useValue: ScreeningServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        localStorage.setItem(
            'auth.config.clinicalIds',
            JSON.stringify({
                clinical_facility_id: '2348923403',
                clinical_org_id: '2348923403',
            })
        );

        fixture = TestBed.createComponent(PatientPostReferralComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        localStorage.removeItem('auth.config.clinicalIds');
    });

    it('should test ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test fetchReferralDetails', () => {
        spyOn(component, 'fetchReferralDetails').and.callThrough();
        component.fetchReferralDetails();
        expect(component.fetchReferralDetails).toHaveBeenCalled();
    });

    it('should resolve error response on fetchReferralDetails error', () => {
        spyOn(component.dataLayer, 'get').and.returnValue(
            throwError(() => new Error('Server error'))
        );
        spyOn(component, 'showToastError');

        component.fetchReferralDetails();

        expect(component.loading).toBeFalse();
        expect(component.showToastError).toHaveBeenCalled();
    });

    it('should test showToastError function', () => {
        spyOn(component, 'showToastError').and.callThrough();
        component.showToastError('bottom-right', 'danger', 'Error', 'Error');
        expect(component.showToastError).toHaveBeenCalled();
    });
});
