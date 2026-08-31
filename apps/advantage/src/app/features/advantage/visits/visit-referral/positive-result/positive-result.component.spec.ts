import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositiveResultComponent } from './positive-result.component';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
    NbStatusService,
    NbThemeModule,
    NbToastrService,
} from '@nebular/theme';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AuthenticationService } from '../../../../../@core/auth/services/authentication.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class NbToastrServiceStub {
    show() {
        return of(() => {});
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

class AuthenticationServiceStub {
    checkPermission() {
        return false;
    }
}

const uIRouterGlobalsStub = {
    params: {
        id: 'someId',
        cancer_type: 'breast',
        patientId: '2359',
    },
};

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

    getWorkstation() {
        return {
            workstation__name: 'Breast Cancer Screening',
        };
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
    getUserClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
}

class NbStatusServiceStub {
    isCustomStatus() {}
}

class SilStoreServiceStub {
    create() {
        return of({
            data: 1,
        });
    }
}

class SilStoresServiceStubError {
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('PositiveResultComponent', () => {
    let component: PositiveResultComponent;
    let fixture: ComponentFixture<PositiveResultComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                NbThemeModule.forRoot(),
                CommonModule,
                PositiveResultComponent,
                BrowserAnimationsModule,
            ],
            providers: [
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoreServiceStub,
                },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        fixture = TestBed.createComponent(PositiveResultComponent);

        component = fixture.componentInstance;
        component.cancerType = 'cervical';

        component.pageText = {
            cervical: {
                text: 'The test results are ',
                label: 'positive',
                text1: ', indicating the need for further evaluation and treatment. The next steps would be to:',
                action1:
                    'Educate the patient on what it means to have positive test results',
                action2: 'Refer for further diagnosis and treatment.',
            },
            breast: {
                text: 'The test results are ',
                label: 'abnormal',
                text1: ', indicating the need for further evaluation and treatment. The next steps would be to:',
                action1:
                    'Educate the patient on what it means to have an abnormal CBE test result.',
                action2: 'Refer for further diagnosis and treatment.',
            },
        };
        // Suppress console errors
        spyOn(console, 'error').and.callFake(() => {});
        fixture.detectChanges();
    });

    afterEach(() => {
        localStorage.removeItem('auth.config.clinicalIds');
    });

    it('should create', () => {
        component.showToastError(
            'bottom-right',
            'danger',
            'message',
            'message'
        );
        expect(component).toBeTruthy();
    });

    it('should test getModelData function', () => {
        spyOn(component, 'getModelData').and.callThrough();
        component.getModelData({
            referral_type: 'specialist_referral',
        });
        expect(component.getModelData).toHaveBeenCalled();
    });

    it('should test handleDateChange function', () => {
        spyOn(component, 'handleDateChange').and.callThrough();

        component.handleDateChange('2024-11-03');
        expect(component.handleDateChange).toHaveBeenCalled();
    });

    it('should test getModelData function for treatment_referral referral_type', () => {
        spyOn(component, 'getModelData').and.callThrough();
        const model = {
            referral_type: 'treatment_referral',
            referral_note: 'Patient needs a treatment_referral',
            selected_test: 'HPV',
            facility: {
                name: 'Test Facility',
            },
        };

        component.getModelData(model);
        expect(component.getModelData).toHaveBeenCalled();
    });

    it('should test the returnBack function', () => {
        spyOn(component, 'returnBack').and.callThrough();
        component.returnBack();
        expect(component.returnBack).toHaveBeenCalled();
    });

    it('should test recordResults function when a diagnosis referral has been made', () => {
        component.formData = {
            referral_type: 'treatment_referral',
            referral_note: 'Patient needs a treatment_referral',
            selected_test: 'HPV',
            facility: {
                name: 'Test Facility',
                county: 'Mombasa',
                contacts: [{ contact_value: '0700100808' }],
            },
        };
        spyOn(component, 'recordResults').and.callThrough();

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test recordResults function when a specialist referral has been made', () => {
        component.formData = {
            referral_type: 'specialist_referral',
            referral_note: 'Patient needs a specialist referral',
            selected_test: 'HPV',
            facility: {
                name: 'Test Facility',
                county: 'Mombasa',
                contacts: [{ contact_value: '0700100808' }],
            },
        };
        spyOn(component, 'recordResults').and.callThrough();

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test getContactInformation method', () => {
        const contacts = [
            {
                contact_type: 'PHONE_NUMBER',
                role: 'PRIMARY_CONTACT',
                contact_value: '+254897663222',
            },
            {
                contact_type: 'EMAIL',
                role: 'SECONDARY_CONTACT',
                contact_value: 'oncokise@mailinator.com',
            },
        ];
        spyOn(component, 'findContactByType').and.callThrough();

        component.findContactByType(contacts, 'email');
        expect(component.findContactByType).toHaveBeenCalledWith(
            contacts,
            'email'
        );
    });

    it('should test recordResults function', () => {
        component.formData = {
            referral_note: 'Patient needs a diagnosis referral',
            selected_test: 'HPV',
            facility: {
                name: 'Test Facility',
                county: 'Mombasa',
                contacts: [{ contact_value: '0700100808' }],
            },
        };
        spyOn(component, 'recordResults').and.callThrough();

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });

    it('should test recordResults function when additional_notes is undefined', () => {
        spyOn(component, 'recordResults').and.callThrough();
        component.formData = {
            selected_test: 'HPV',
            facility: {
                name: 'Test Facility',
                county: 'Mombasa',
                contacts: [{ contact_value: '0700100808' }],
            },
        };

        component.recordResults();
        expect(component.recordResults).toHaveBeenCalled();
    });
});

describe('PositiveResultComponent saveResult throws error', () => {
    let component: PositiveResultComponent;
    let fixture: ComponentFixture<PositiveResultComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                NbThemeModule.forRoot(),
                BrowserAnimationsModule,
                CommonModule,
                PositiveResultComponent,
            ],
            providers: [
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        fixture = TestBed.createComponent(PositiveResultComponent);

        component = fixture.componentInstance;
        component.cancerType = 'cervical';

        component.pageText = {
            cervical: {
                text: 'The test results are ',
                label: 'positive',
                text1: ', indicating the need for further evaluation and treatment. The next steps would be to:',
                action1:
                    'Educate the patient on what it means to have positive test results',
                action2: 'Refer for further diagnosis and treatment.',
            },
            breast: {
                text: 'The test results are ',
                label: 'abnormal',
                text1: ', indicating the need for further evaluation and treatment. The next steps would be to:',
                action1:
                    'Educate the patient on what it means to have an abnormal CBE test result.',
                action2: 'Refer for further diagnosis and treatment.',
            },
        };
        component.formData = {
            referral_type: 'treatment_referral',
            referral_note: 'Patient needs a treatment_referral',
            selected_test: 'HPV',
            facility: {
                name: 'Test Facility',
                county: 'Mombasa',
                contacts: [{ contact_value: '0700100808' }],
            },
        };

        // Suppress console errors
        spyOn(console, 'error').and.callFake(() => {});
        fixture.detectChanges();
    });

    it('should handle errors on handleReferral error', () => {
        component.encounterID = '123';
        component.loading = true;
        component.formData = {
            test_action: 'test_referral',
            selected_test: 'HPV',
            facility: {
                name: 'Test Facility',
                county: 'Mombasa',
                contacts: [{ contact_value: '0700100808' }],
            },
        };

        spyOn(component.dataLayer, 'create').and.returnValue(
            throwError(() => new Error('Boom'))
        );
        spyOn(component, 'showToastError');
        component.recordResults();

        expect(component.loading).toBeFalse();
        expect(component.showToastError).toHaveBeenCalled();
    });

    it('should test the returnBack function if isChild is set to true', () => {
        component.isChild = true;
        spyOn(component, 'returnBack').and.callThrough();

        component.returnBack();
        expect(component.returnBack).toHaveBeenCalled();
    });
});
