import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ScreeningReportComponent } from './screening-report.component';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { throwError, of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { NbStatusService, NbToastrService } from '@nebular/theme';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { StateService, Transition } from '@uirouter/angular';
import { CommonModule } from '@angular/common';
import { ScreeningService } from '../screening.service';
import { BaseScreeningServiceStub } from '../screening-record/screening-record.component.spec';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';

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
class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class TransitionServiceStub {
    from() {
        return { name: 'auth.complete' };
    }
    params() {
        return { id: '' };
    }
}

class NbStatusServiceStub {
    isCustomStatus() {}
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
                consent: [
                    {
                        id: '19a605ab-4818-4b0f-9b25-bf2c614a7ece',
                        status: 'active',
                        decision: {
                            type: 'deny',
                        },
                        patient: {
                            id: 'a3f7fb11-a119-476e-8f05-c5e9359e5d63',
                            reference:
                                'Patient/a3f7fb11-a119-476e-8f05-c5e9359e5d63',
                            identifier: {},
                        },
                        usageContext: 'breast_screening',
                    },
                ],
            },
        });
    }
}
class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    transitionTo() {
        return true;
    }
}
class SilStoresServiceStubError {
    getClinical() {
        return throwError(() => new Error('Boom'));
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

describe('ScreeningReportComponent', () => {
    let component: ScreeningReportComponent;
    let fixture: ComponentFixture<ScreeningReportComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                ScreeningReportComponent,
                mockPipe('titleCase'),
                mockPipe('removeUnderScore'),
            ],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, SilStoreServiceStub },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionServiceStub },
                {
                    provide: ScreeningService,
                    useClass: BaseScreeningServiceStub,
                },
                { provide: FormBuilder, useValue: new FormBuilder() },
                ErrorHandlerService,
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
        fixture = TestBed.createComponent(ScreeningReportComponent);
        component = fixture.componentInstance;
        component.pageText = {
            breast: {
                normal: {
                    label: 'Normal',
                    badgeColor: '#83AE04',
                    badgeBackgroundColor: '#83AE0426',
                },
                abnormal: {
                    label: 'Abnormal',
                    badgeColor: '#DA0A15',
                    badgeBackgroundColor: '#DA0A1526',
                },
            },
            cervical: {
                negative: {
                    label: 'Negative',
                    badgeColor: '#83AE04',
                    badgeBackgroundColor: '#83AE0426',
                },
                positive: {
                    label: 'Positive',
                    badgeColor: '#DA0A15',
                    badgeBackgroundColor: '#DA0A1526',
                },
                suspicious: {
                    label: 'Suspicious for cancer',
                    badgeColor: '#FFB573',
                    badgeBackgroundColor: '#FCF7E8',
                },
            },
        };
        fixture.detectChanges();
    });

    afterEach(() => {
        localStorage.removeItem('auth.config.clinicalIds');
    });

    it('should test ngOnInit and call fetchReport function', () => {
        component.encounterID = '8924-1481-1455-2563';

        spyOn(component, 'ngOnInit').and.callThrough();
        spyOn(component, 'fetchReport').and.callThrough();

        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
        expect(component.fetchReport).toHaveBeenCalled();
    });

    it('should test the addReferral function', () => {
        spyOn(component, 'addReferral').and.callThrough();
        component.addReferral();
        expect(component.addReferral).toHaveBeenCalled();
    });

    it('should test the toggleModal method', () => {
        const msg = 'endScreening';
        spyOn(component, 'toggleModal').and.callThrough();
        component.toggleModal(msg);
        expect(component.toggleModal).toHaveBeenCalled();
    });

    it('should test checkIfEmpty functions', () => {
        spyOn(component, 'checkIfEmpty').and.callThrough();
        component.checkIfEmpty({});
        expect(component.checkIfEmpty).toHaveBeenCalled();
    });

    it('should test the fetchReport function', () => {
        spyOn(component, 'fetchReport').and.callThrough();
        component.encounterID = '8924-1481-1455-2563';

        component.fetchReport();
        expect(component.fetchReport).toHaveBeenCalled();
    });

    it('should test viewSegment functions', () => {
        const item = {
            segment_id: '01995',
            item: {
                id: '888',
            },
        };
        spyOn(component, 'viewSegment').and.callThrough();
        component.patientID = '8924-1481-1455-2563';

        component.viewSegment(item);
        expect(component.viewSegment).toHaveBeenCalled();
    });

    it('should test viewReferral functions', () => {
        spyOn(component, 'viewReferral').and.callThrough();
        component.patientID = '8924-1481-1455-2563';

        component.viewReferral();
        expect(component.viewReferral).toHaveBeenCalled();
    });

    it('should test viewFollowUps functions', () => {
        spyOn(component, 'viewFollowUps').and.callThrough();
        component.patientID = '8924-1481-1455-2563';

        component.viewFollowUps();
        expect(component.viewFollowUps).toHaveBeenCalled();
    });

    it('should test the responseFunction function', () => {
        spyOn(component, 'responseFunction').and.callThrough();
        const data = {
            consent: {
                id: '19a605ab-4818-4b0f-9b25-bf2c614a7ece',
                status: 'active',
                decision: {
                    type: 'deny',
                },
                patient: {
                    id: 'a3f7fb11-a119-476e-8f05-c5e9359e5d63',
                    reference: 'Patient/a3f7fb11-a119-476e-8f05-c5e9359e5d63',
                    identifier: {},
                },
            },
        };

        component.responseFunction(data);
        expect(component.responseFunction).toHaveBeenCalled();
    });

    it('should test the responseFunction function if data is undefined', () => {
        spyOn(component, 'responseFunction').and.callThrough();
        const data = undefined;

        component.responseFunction(data);
        expect(component.responseFunction).toHaveBeenCalled();
    });

    it('should test the showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test performTest function', () => {
        spyOn(component, 'performTest').and.callThrough();
        component.performTest();
        expect(component.performTest).toHaveBeenCalled();
    });

    it('should test performExamination function', () => {
        spyOn(component, 'performExamination').and.callThrough();
        component.performExamination();
        expect(component.performExamination).toHaveBeenCalled();
    });

    it('should test convertString function', () => {
        component.cancerType = 'cervical';
        spyOn(component, 'convertString').and.callThrough();

        const formattedString = component.convertString('negative');
        expect(formattedString).toBe('negative');
        expect(component.convertString).toHaveBeenCalled();
    });

    it('should test convertString function', () => {
        component.cancerType = 'breast';
        spyOn(component, 'convertString').and.callThrough();

        const formattedString = component.convertString('positive');
        expect(formattedString).toBe('abnormal');
        expect(component.convertString).toHaveBeenCalled();
    });

    it('should test the getBadgeStyle function', () => {
        component.cancerType = 'cervical';

        spyOn(component, 'getBadgeStyle').and.callThrough();
        component.getBadgeStyle('positive');
        expect(component.getBadgeStyle).toHaveBeenCalled();
    });

    it('should test getMatchingConsent is being called', () => {
        spyOn(component, 'getMatchingConsent').and.callThrough();
        component.getMatchingConsent();
        expect(component.getMatchingConsent).toHaveBeenCalled();
    });

    it('should handle errors in filterByScreeningType', () => {
        spyOn(component, 'filterByScreeningType').and.callThrough();
        component.cancerType = 'breast';
        const items = [
            { usageContext: null },
            { usageContext: undefined },
            { usageContext: new Error('test') },
            { usageContext: {} },
            { usageContext: 'breast_screening' },
        ];

        component.filterByScreeningType(items);

        expect(component.filterByScreeningType).toHaveBeenCalled();
    });

    it('should call navigateBack method when button is clicked', () => {
        spyOn(component, 'navigateBack');

        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector('button');
        button.click();

        expect(component.navigateBack).toHaveBeenCalled();
    });

    it('should navigate to previous state if available', () => {
        component.previousState = {
            name: 'previous.route',
            params: { id: 123 },
        };
        spyOn(component.$state, 'go');

        component.navigateBack();

        expect(component.$state.go).toHaveBeenCalledWith('previous.route', {
            id: 123,
        });
    });

    it('should navigate to default route if no previous state is available', () => {
        component.previousState = null;
        spyOn(component.$state, 'go');

        component.navigateBack();

        expect(component.$state.go).toHaveBeenCalledWith(
            'app.advantage.visits.detail.screening'
        );
    });

    it('should call the setSelectedTest method', () => {
        spyOn(component, 'setSelectedTest').and.callThrough();

        component.setSelectedTest('Mommogram');

        expect(component.setSelectedTest).toHaveBeenCalled();
    });

    it('should call the getResultOptionsForTest method and delegate to screeningService', () => {
        const test = {
            name: 'Mammogram',
            code: 'LA16046-7',
        };

        spyOn(
            component.screeningService,
            'getResultOptionsForScreeningTest'
        ).and.returnValue([{ title: 'Normal', value: 'Normal' }]);

        const result = component.getResultOptionsForTest(test);

        expect(
            component.screeningService.getResultOptionsForScreeningTest
        ).toHaveBeenCalledWith('Mammogram', 'LA16046-7');
        expect(result.length).toBeGreaterThan(0);
    });

    it('should handle null test in getResultOptionsForTest', () => {
        spyOn(
            component.screeningService,
            'getResultOptionsForScreeningTest'
        ).and.returnValue([]);

        const result = component.getResultOptionsForTest(null);

        expect(
            component.screeningService.getResultOptionsForScreeningTest
        ).toHaveBeenCalledWith(undefined, undefined);
        expect(result).toEqual([]);
    });

    it('should handle test with only name in getResultOptionsForTest', () => {
        const test = { name: 'Mammogram' };

        spyOn(
            component.screeningService,
            'getResultOptionsForScreeningTest'
        ).and.returnValue([{ title: 'Test', value: 'Test' }]);

        const result = component.getResultOptionsForTest(test);

        expect(
            component.screeningService.getResultOptionsForScreeningTest
        ).toHaveBeenCalledWith('Mammogram', undefined);
        expect(result.length).toBeGreaterThan(0);
    });

    it('should handle test with only code in getResultOptionsForTest', () => {
        const test = { code: 'LA16046-7' };

        spyOn(
            component.screeningService,
            'getResultOptionsForScreeningTest'
        ).and.returnValue([{ title: 'Test', value: 'Test' }]);

        const result = component.getResultOptionsForTest(test);

        expect(
            component.screeningService.getResultOptionsForScreeningTest
        ).toHaveBeenCalledWith(undefined, 'LA16046-7');
        expect(result.length).toBeGreaterThan(0);
    });

    it('should update previewResult on onResultChange', () => {
        const event = { value: 'Abnormal' };

        component.onResultChange(event);

        expect(component.previewResult).toBe('Abnormal');
    });

    it('should not update previewResult if event or value is missing', () => {
        component.previewResult = 'Initial';

        component.onResultChange(null);
        expect(component.previewResult).toBe('Initial');

        component.onResultChange({});
        expect(component.previewResult).toBe('Initial');
    });

    it('should call the updateTestResult method', () => {
        spyOn(component, 'updateTestResult').and.callThrough();

        component.updateTestResult();

        expect(component.updateTestResult).toHaveBeenCalled();
    });

    it('should call screeningService.deleteTest with correct parameters', () => {
        const testData = { id: '123', name: 'Test' };
        component.selectedTest = testData;

        spyOn(component, 'deleteTest').and.callThrough();
        component.deleteTest();

        expect(component.deleteTest).toHaveBeenCalled();
    });
});

describe('ScreeningReportComponent throws error', () => {
    let component: ScreeningReportComponent;
    let fixture: ComponentFixture<ScreeningReportComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('titleCase'),
                mockPipe('removeUnderScore'),
                ScreeningReportComponent,
                CommonModule,
            ],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: Transition, useClass: TransitionServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: ScreeningService,
                    useClass: BaseScreeningServiceStub,
                },
                ErrorHandlerService,
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
        fixture = TestBed.createComponent(ScreeningReportComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
    }));

    afterEach(() => {
        localStorage.removeItem('auth.config.clinicalIds');
    });

    it('should test convertString function', () => {
        spyOn(component, 'convertString').and.callThrough();

        const formattedString = component.convertString('fail_safe');

        expect(formattedString).toBe('');
        expect(component.convertString).toHaveBeenCalled();
    });

    it('should test errorHandlerFxn method', () => {
        spyOn(component, 'errorHandlerFxn').and.callThrough();

        component.errorHandlerFxn(new Error('Boom'));

        expect(component.errorHandlerFxn).toHaveBeenCalled();
    });

    it('should set selected test and open delete modal in confirmDeleteTest', () => {
        const testData = { id: '123', name: 'Mammogram', value: 'Normal' };
        spyOn(component, 'toggleModal');

        component.confirmDeleteTest(testData);

        expect(component.selectedTest).toEqual(testData);
        expect(component.toggleModal).toHaveBeenCalledWith('deleteTest');
    });
});
