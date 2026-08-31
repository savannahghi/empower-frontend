import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScreeningConsentComponent } from './consent.component';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition } from '@uirouter/angular';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import _ from 'underscore';
import { Authorization } from '../../../../../../@core/auth/services/authorization.service';
import { environment } from '../../../../../../../environments/environment';
import { SilStoresService } from '../../../../../../shared/sil-http-services/sil_datalayer.service';
import { VisitService } from '../../../visit.service';
import { visitServiceStub } from '../../consent/consent.component.spec';
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
    reload() {
        return true;
    }
}

class TransitionStub {
    params() {
        return { id: 'fj8942-5255-14284-25249', choice: 'deny' };
    }
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
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
class SilStoresServiceStub {
    update() {
        return of({
            id: '12',
        });
    }
    create() {
        return of({});
    }
}

describe('ScreeningConsentComponent', () => {
    let component: ScreeningConsentComponent;
    let fixture: ComponentFixture<ScreeningConsentComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ScreeningConsentComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        });
        fixture = TestBed.createComponent(ScreeningConsentComponent);

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

    it('should test consent data availability', () => {
        expect(component.savedConsentChoice).toBe('');
        component.consentData = {
            provision: {
                type: 'permit',
            },
        };
        component.ngOnInit();
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

    it('should test goBack function', () => {
        spyOn(component, 'goBack').and.callThrough();
        component.goBack();
        expect(component.goBack).toHaveBeenCalled();
    });

    it('should test the chooseProvision function', () => {
        spyOn(component, 'chooseProvision').and.callThrough();
        component.consentData = {
            provision: {
                type: 'permit',
            },
        };
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

describe('ScreeningConsentComponent savePatientConsent throws error', () => {
    let component: ScreeningConsentComponent;
    let fixture: ComponentFixture<ScreeningConsentComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ScreeningConsentComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        });
        fixture = TestBed.createComponent(ScreeningConsentComponent);

        component = fixture.componentInstance;
        component.cancerType = 'breast';

        fixture.detectChanges();
    });

    it('should test missing consent Data', () => {
        component.consentData = { decision: { type: null } };
        expect(component.savedConsentChoice).toBe('');
    });

    it('should test errorFunction function', () => {
        const payload = {
            decision: 'deny',
            denyReason: 'Fear or Anxiety',
            encounterID: '753fb778-5ed4-406a-8a08-3e69952a4356',
        };

        spyOn(component, 'savePatientConsent').and.callThrough();

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
});
