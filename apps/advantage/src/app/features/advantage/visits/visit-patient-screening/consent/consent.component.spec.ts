import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsentComponent } from './consent.component';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition } from '@uirouter/angular';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import _ from 'underscore';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { VisitService } from '../../visit.service';
import { environment } from '../../../../../../environments/environment';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

class NbToastrServiceStub {
    show() {
        return of(() => {});
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
        return { id: 'fj8942-5255-14284-25249', choice: 'deny' };
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getWorkstation() {
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

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    create() {
        return throwError(() => new Error('Server error'));
    }
}

export const visitServiceStub = {
    visitPatientDataEmitter: of({
        new_price: 18,
        amount: '18',
        product_name: 'Lipid',
        quantity: 1,
        id: 1,
    }),
    updateVisit: () => {
        return true;
    },
    visitPatientScreeningDataEmitter: of({
        age: 40,
        gender: 'MALE',
        servicePoints: [
            {
                encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                queue_name: 'Breast Cancer Screening',
                status: 'COMPLETED',
                previous_point: 'Triage',
            },
            {
                encounterID: 'e36fbc2f-a03e-4e9c-9080-af8a9817539e',
                queue_name: 'Cervical Cancer Screening',
                status: 'IN_PROGRESS',
                previous_point: 'Billing',
            },
        ],
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
    setVisitData: () => {},
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

class SilStoresServiceStub {
    list() {
        return of({
            totalCount: 2,
            edges: [
                {
                    node: {
                        id: 'c00c53c3-1241-4add-b94d-9d92fd59bcfb',
                        encounterID: 'b45cef00-3779-409c-8c96-85f092256366',
                        task: 'VIA test',
                        description: 'A VIA test',
                        status: 'requested',
                        workflow: 'Cervical Cancer Screening',
                        authoredOn: '2024-05-12T10:39:23+03:00',
                    },
                    cursor: 'c00c53c3-1241-4add-b94d-9d92fd59bcfb',
                },
                {
                    node: {
                        id: '5462db5f-b7a9-4c8e-a18b-0b4c609a242b',
                        encounterID: 'b45cef00-3779-409c-8c96-85f092256366',
                        task: 'VIA test',
                        description: 'A VIA test',
                        status: 'requested',
                        workflow: 'Cervical Cancer Screening',
                        authoredOn: '2024-05-12T10:18:01+03:00',
                    },
                    cursor: '5462db5f-b7a9-4c8e-a18b-0b4c609a242b',
                },
            ],
            pageInfo: {
                HasNextPage: true,
                EndCursor:
                    'AfOl5oX74j2DI0ts-6NcxKSF2jvQ1RaVWj782Ok3miRrzgOx-2oS3G_0XbEnp8MoI5Fk9uJHgTwfA7-O_gz6U7Y9mDJjb5vUFZgGa4tM4kCaotS2m9Z4ciGeUkEEu_fLdiHtcfLsOSS4LQhGBigtaxGQ2yCZXzRinUGW6AKJ4QsNzOQdBHPdpO7VXALqAb0dFr-YmN9sA13dmh_m98XHxl7-pvMy9B0yBkY=',
                HasPreviousPage: false,
                StartCursor: '',
            },
        });
    }
    update() {
        return of({
            id: '12',
        });
    }
    create() {
        return of({});
    }
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

describe('ConsentComponent', () => {
    let component: ConsentComponent;
    let fixture: ComponentFixture<ConsentComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ConsentComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        });
        fixture = TestBed.createComponent(ConsentComponent);

        component = fixture.componentInstance;
        component.cancerType = 'cervical';

        component.consentData = {
            decision: {
                type: 'permit',
                __typename: 'ConsentProvision',
            },
        };

        component.encounterData = {
            age: 25,
            gender: 'FEMALE',
            visit_status: 'IN PROGRESS',
            visit_id: 2,
            personID: '8583-2851-8184',
            servicePoints: [
                {
                    encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                    queue_name: 'Breast Cancer Screening',
                    status: 'COMPLETED',
                    previous_point: 'Triage',
                },
                {
                    encounterID: 'e36fbc2f-a03e-4e9c-9080-af8a9817539e',
                    queue_name: 'Cervical Cancer Screening',
                    status: 'IN_PROGRESS',
                    previous_point: 'Billing',
                },
            ],
        };
        fixture.detectChanges();
    });

    it('should test ngOnInit and call segments Function', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        spyOn(component, 'checkStatus').and.callThrough();
        spyOn(component, 'getSegments').and.callThrough();

        component.encounterStatus = 'FINISHED';
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
        expect(component.checkStatus).toHaveBeenCalled();

        expect(component.getSegments).toHaveBeenCalled();
    });

    it('should test consent and data availability', () => {
        component.consentData = {
            provision: {
                type: '',
            },
        };
        expect(component.savedConsentChoice).toBe('');
        component.consentData.provision.type = 'permit';
        component.ngOnInit();
        expect(component.savedConsentChoice).toBe('permit');
    });

    it('should test enrollToHealthEducation function', () => {
        spyOn(component, 'enrollToHealthEducation').and.callThrough();

        component.enrollToHealthEducation(true);
        expect(component.enrollToHealthEducation).toHaveBeenCalled();
        expect(component.isEnrolling).toBe(true);
    });

    it('should test submitConsent function', () => {
        component.provisionChoice = 'deny';
        component.denyReason = 'Fear or Anxiety';
        component.otherReason = '';

        spyOn(component, 'submitConsent').and.callThrough();

        component.submitConsent();
        expect(component.submitConsent).toHaveBeenCalled();
    });

    it('should test submitConsent function if other reason is given', () => {
        component.provisionChoice = 'deny';
        component.denyReason = 'Other';
        component.otherReason = 'I fear Radiation';
        spyOn(component, 'submitConsent').and.callThrough();

        component.submitConsent();
        expect(component.submitConsent).toHaveBeenCalled();
    });

    it('should test checkStatus function', () => {
        spyOn(component, 'checkStatus').and.callThrough();

        component.checkStatus();
        expect(component.checkStatus).toHaveBeenCalled();
    });

    it('should test submitConsent function if encounterID is undefined', () => {
        component.encounterID = undefined;
        component.provisionChoice = 'deny';
        component.denyReason = 'Other';
        component.otherReason = 'I fear Radiation';
        spyOn(component, 'submitConsent').and.callThrough();

        component.submitConsent();
        expect(component.submitConsent).toHaveBeenCalled();
    });

    it('should test savePatientConsent function', () => {
        const payload = {
            decision: 'deny',
            denyReason: 'Fear or Anxiety',
            encounterID: '753fb778-5ed4-406a-8a08-3e69952a4356',
        };
        spyOn(component, 'savePatientConsent').and.callThrough();
        component.savePatientConsent(payload);
        expect(component.savePatientConsent).toHaveBeenCalled();
    });

    it('should test updateVisit function', () => {
        spyOn(component, 'updateVisit').and.callThrough();
        component.updateVisit('2');
        expect(component.updateVisit).toHaveBeenCalled();
    });

    it('should test savePatientConsent function and handle missing encounterID', () => {
        environment.sentryEnvironment = 'testing';

        const payload = {
            decision: 'deny',
            denyReason: 'Fear or Anxiety',
            encounterID: null,
        };
        spyOn(component, 'savePatientConsent').and.callThrough();
        component.savePatientConsent(payload);
        expect(component.savePatientConsent).toHaveBeenCalled();
    });

    it('should test savePatientConsent function and handle missing encounterID if sentryEnvironement is not testing', () => {
        environment.sentryEnvironment = 'production';

        const payload = {
            decision: 'deny',
            denyReason: 'Fear or Anxiety',
            encounterID: null,
        };
        spyOn(component, 'savePatientConsent').and.callThrough();
        component.savePatientConsent(payload);
        expect(component.savePatientConsent).toHaveBeenCalled();
    });

    it('should toggleModal', () => {
        component.showToastError(
            'bottom-right',
            'danger',
            'message',
            'message'
        );
        expect(component).toBeTruthy();
    });

    it('should test getSegments functions', () => {
        spyOn(component, 'getSegments').and.callThrough();
        component.getSegments('8583-2851-8184');
        expect(component.getSegments).toHaveBeenCalled();
    });

    it('should test goBack function', () => {
        spyOn(component, 'goBack').and.callThrough();
        component.goBack();
        expect(component.goBack).toHaveBeenCalled();
    });
    it('should test getEncounterId function', () => {
        const servicePoints = [
            {
                encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                queue_name: 'Breast Cancer Screening',
                status: 'COMPLETED',
                previous_point: 'Triage',
            },
            {
                encounterID: 'e36fbc2f-a03e-4e9c-9080-af8a9817539e',
                queue_name: 'Cervical Cancer Screening',
                status: 'IN_PROGRESS',
                previous_point: 'Billing',
            },
        ];
        const encounterID = 'e36fbc2f-a03e-4e9c-9080-af8a9817539e';
        spyOn(component, 'getEncounterId').and.callThrough();

        const resultID = component.getEncounterId(servicePoints);
        expect(component.getEncounterId).toHaveBeenCalled();

        expect(resultID).toBe(encounterID);
    });

    it('should test the chooseProvision function', () => {
        spyOn(component, 'chooseProvision').and.callThrough();
        component.chooseProvision('permit');
        expect(component.chooseProvision).toHaveBeenCalled();
        expect(component.provisionChoice).toBeDefined();
    });

    it('should test the clearFormValues function', () => {
        spyOn(component, 'clearFormValues').and.callThrough();
        component.clearFormValues();
        expect(component.clearFormValues).toHaveBeenCalled();
        expect(component.provisionChoice).toBe('');
        expect(component.denyReason).toBe('');
        expect(component.otherReason).toBe('');
    });

    it('should test requestNextStep function if hasRiskAssessment is true', () => {
        spyOn(component, 'requestNextStep').and.callThrough();
        component.hasRiskAssessment = true;
        component.requestNextStep();
        expect(component.requestNextStep).toHaveBeenCalled();
    });

    it('should test responseFunction function', () => {
        const errorResponse = {
            errors: [{ message: 'Invalid encounterID' }],
        };
        spyOn(component, 'responseFunction').and.callThrough();

        component.responseFunction(errorResponse);
        expect(component.responseFunction).toHaveBeenCalled();
    });

    it('should resolve successful api response', () => {
        spyOn(component, 'savePatientConsent').and.callThrough();

        const payload = {
            decision: 'deny',
            denyReason: 'Fear or Anxiety',
            encounterID: '753fb778-5ed4-406a-8a08-3e69952a4356',
        };

        component.savePatientConsent(payload);

        expect(component.savePatientConsent).toHaveBeenCalled();
    });

    it('should test the setReason function', () => {
        spyOn(component, 'setReason').and.callThrough();
        component.setReason('denyReason', 'Lack of Awareness');
        expect(component.setReason).toHaveBeenCalledWith(
            'denyReason',
            'Lack of Awareness'
        );
    });
});

describe('ConsentComponent savePatientConsent throws error', () => {
    let component: ConsentComponent;
    let fixture: ComponentFixture<ConsentComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ConsentComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },

                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
            ],
        });
        fixture = TestBed.createComponent(ConsentComponent);

        component = fixture.componentInstance;
        component.cancerType = 'breast';

        fixture.detectChanges();
    });

    it('should test missing consent Data', () => {
        component.consentData = {};
        expect(component.savedConsentChoice).toBe('');
    });

    it('should test errorFunction function', () => {
        const payload = {
            decision: 'deny',
            denyReason: 'Fear or Anxiety',
            encounterID: '753fb778-5ed4-406a-8a08-3e69952a4356',
        };

        spyOn(component, 'savePatientConsent').and.callThrough();
        component.encounterStatus = 'FINISHED';

        component.encounterData = {
            age: 25,
            gender: 'FEMALE',
            personID: '8583-2851-8184',
            visit_id: 2,

            servicePoints: [
                {
                    encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                    queue_name: 'Breast Cancer Screening',
                    status: 'COMPLETED',
                    previous_point: 'Triage',
                },
                {
                    encounterID: 'e36fbc2f-a03e-4e9c-9080-af8a9817539e',
                    queue_name: 'Cervical Cancer Screening',
                    status: 'IN_PROGRESS',
                    previous_point: 'Billing',
                },
            ],
        };
        component.savePatientConsent(payload);

        expect(component.savePatientConsent).toHaveBeenCalled();
    });

    it('should test the chooseProvision function if encounter does not exist', () => {
        spyOn(component, 'chooseProvision').and.callThrough();
        spyOn(_, 'isNull').and.returnValue(true);
        component.encounterData = {
            age: 25,
            gender: 'FEMALE',
            visit_status: 'IN PROGRESS',
            personID: '8583-2851-8184',
            visit_id: 2,

            servicePoints: [
                {
                    encounterID: 'e9b81873-00bf-469e-8f8a-1f74388903b1',
                    queue_name: 'Fake Queue',
                    status: 'COMPLETED',
                    previous_point: 'Triage',
                },
                {
                    encounterID: 'e36fbc2f-a03e-4e9c-9080-af8a9817539e',
                    queue_name: 'Fake Queue2',
                    status: 'IN_PROGRESS',
                    previous_point: 'Billing',
                },
            ],
        };

        component.chooseProvision('permit');

        expect(component.chooseProvision).toHaveBeenCalled();
        expect(component.provisionChoice).toBeDefined();
    });

    it('should test updateVisit function', () => {
        spyOn(component, 'updateVisit').and.callThrough();
        component.updateVisit('2');
        expect(component.updateVisit).toHaveBeenCalled();
    });

    it('should test getSegments functions', () => {
        spyOn(component, 'getSegments').and.callThrough();
        component.getSegments('8583-2851-8184');
        expect(component.getSegments).toHaveBeenCalled();
    });
});
