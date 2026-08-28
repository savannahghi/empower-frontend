import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReferralFormComponent } from './referral-form.component';
import { BehaviorSubject, of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import {
    NbDatepickerModule,
    NbThemeModule,
    NbToastrService,
} from '@nebular/theme';
import { StateService } from '@uirouter/angular';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class SilStoreServiceStub {
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
    create() {
        return of({});
    }
    update() {
        return of({
            id: '12',
        });
    }
    createNested() {
        return of({});
    }
    get() {
        return of({
            id: '123',
        });
    }
    getClinical() {
        return of({
            data: {
                id: 1,
            },
        });
    }
}

class SilStoresServiceStubError {
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    createNested() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    getClinical() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

class StateServiceStub {
    reload() {
        return true;
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

    getUserClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
}

describe('ReferralFormComponent', () => {
    let component: ReferralFormComponent;
    let fixture: ComponentFixture<ReferralFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                NbThemeModule.forRoot(),
                NbDatepickerModule.forRoot(),
                CommonModule,
                ReferralFormComponent,
            ],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: SilStoresService, SilStoreServiceStub },
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
        fixture = TestBed.createComponent(ReferralFormComponent);

        component = fixture.componentInstance;
        component.servicerequestId = '8924-1481-1455-2563';
        component.workstation = {
            workstation: '2490-1994-1949-9011',
        };
        spyOn(console, 'error').and.callFake(() => {});

        fixture.detectChanges();
    });

    afterEach(() => {
        localStorage.removeItem('auth.config.clinicalIds');
    });

    it('should test the fetchReferralForm function', () => {
        spyOn(component, 'fetchReferralForm').and.callThrough();
        component.servicerequestId = '8924-1481-1455-2563';

        component.fetchReferralForm();
        expect(component.fetchReferralForm).toHaveBeenCalled();
    });

    it('should test the pdfDownloaded function', () => {
        const file = new Blob();

        spyOn(component, 'pdfDownloaded').and.callThrough();
        const data = new File([file], 'test.pdf', {
            type: 'application/pdf',
        });
        spyOn(window, 'open').and.returnValue(null);
        component.pdfDownloaded(data);
        expect(component.pdfDownloaded).toHaveBeenCalled();
    });

    it('should test the shareReferralForm function', () => {
        spyOn(component.dataLayer, 'create').and.returnValue(of({}));
        spyOn(component, 'showToast');

        component.shareReferralForm();

        expect(component.showToast).toHaveBeenCalled();
        expect(component.dataLayer.create).toHaveBeenCalled();
        expect(component.loadingFormShare).toBeFalse();
    });

    it('should test showToastError function', () => {
        spyOn(component, 'showToastError').and.callThrough();
        component.showToastError('bottom-right', 'danger', 'Error', 'Error');
        expect(component.showToastError).toHaveBeenCalled();
    });
});

describe('ReferralFormComponent saveResult throws error', () => {
    let dataLayerMock;
    let component: ReferralFormComponent;
    let fixture: ComponentFixture<ReferralFormComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                NbThemeModule.forRoot(),
                NbDatepickerModule.forRoot(),
                CommonModule,
                ReferralFormComponent,
            ],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        fixture = TestBed.createComponent(ReferralFormComponent);

        component = fixture.componentInstance;
        component.servicerequestId = '8924-1481-1455-2563';
        component.workstation = {
            workstation: '2490-1994-1949-9011',
        };
        spyOn(console, 'error').and.callFake(() => {});

        fixture.detectChanges();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
    }));

    it('should test the shareReferralForm functions', () => {
        spyOn(component, 'shareReferralForm').and.callThrough();

        component.shareReferralForm();
        expect(component.shareReferralForm).toHaveBeenCalled();
    });

    it('should test the fetchReferralForm functions', () => {
        spyOn(component, 'fetchReferralForm').and.callThrough();
        component.servicerequestId = '8924-1481-1455-2563';

        component.fetchReferralForm();
        expect(component.fetchReferralForm).toHaveBeenCalled();
    });

    it('should handle mutation error', () => {
        dataLayerMock = jasmine.createSpyObj('dataLayer', ['getClinical']);

        dataLayerMock.getClinical.and.returnValue({
            pipe: jasmine.createSpy().and.returnValue({
                subscribe: (_, errorCallback) => errorCallback(),
            }),
        });
        spyOn(component, 'fetchReferralForm').and.callThrough();

        component.fetchReferralForm();

        expect(component.fetchReferralForm).toHaveBeenCalled();
    });

    it('should test errorHandlerFxn function', () => {
        spyOn(component['errorHandler'], 'handleError').and.callThrough();
        component.errorHandlerFxn(new Error('Boom'));
        expect(component['errorHandler'].handleError).toHaveBeenCalled();
        expect(component.loadingFormShare).toBeFalse();
    });
});
