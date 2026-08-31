import { TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { ScreeningService } from './screening.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError, Observable } from 'rxjs';
import { StateService } from '@uirouter/angular';
import { environment } from '../../../../../environments/environment';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';

class SilStoresServiceStub {
    getClinical() {
        return of({
            data: {
                id: 1,
            },
        });
    }

    update() {
        return of({
            data: {
                id: 1,
            },
        });
    }

    remove() {
        return of({});
    }
}

class SilStoresServiceStubError {
    getClinical() {
        return throwError(() => new Error('Boom'));
    }

    update() {
        return throwError(() => new Error('Boom'));
    }
}

class SilStoresServiceStubError2 {
    getClinical() {
        return throwError(() => new Error('Some error'));
    }

    update() {
        return throwError(() => new Error('Some error'));
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

const deniedConsent = [
    {
        id: '10d695a6-0e7a-4b6f-abc6-c76030ff5a5a',
        status: 'active',
        decision: {
            type: 'deny',
            __typename: 'ConsentProvision',
        },
        usageContext: 'breast_screening',
    },
];

const allowedConsent = [
    {
        id: '10d695a6-0e7a-4b6f-abc6-c76030ff5a5a',
        status: 'active',
        decision: {
            type: 'permit',
            __typename: 'ConsentProvision',
        },
        usageContext: 'breast_screening',
    },
];
const tasks = [
    {
        id: '608de9b4-9ef5-44e0-b2c2-805ee0c45eae',
        encounterID: 'd346355a-f7e9-4d20-ac54-b198253a70f2',
        task: 'Appointment',
        description: '',
        status: 'requested',
        workflow: 'Patient referred for medical consultation',
        __typename: 'TaskOutput',
        usageContext: 'breast_screening',
    },
    {
        id: '9876b4d7-b8db-43f6-89fe-5787f4608084',
        encounterID: 'd346355a-f7e9-4d20-ac54-b198253a70f2',
        task: 'Appointment',
        description: '',
        status: 'requested',
        workflow: 'Patient referred for medical consultation',
        __typename: 'TaskOutput',
        usageContext: 'breast_screening',
    },
];
const observation = [
    {
        id: '254eb286-c0ad-48d7-858e-3dd791fcde5b',
        value: 'positive',
        usageContext: 'breast_screening',
        __typename: 'Observation',
    },
];

const riskAssessment = [
    {
        id: '2ddf9307-e6c3-413d-9b3a-55c2427d5526',
        usageContext: 'breast_screening',
    },
];
const screeningData = {
    riskAssessment,
    observation,
    encounter: {
        id: 'd346355a-f7e9-4d20-ac54-b198253a70f2',
        status: 'in progress',
        __typename: 'Encounter',
    },
    tasks,
    __typename: 'EncounterAssociatedResourceOutput',
    encounterID: 'd346355a-f7e9-4d20-ac54-b198253a70f2',
    servicePointStatus: 'WAITING',
};

describe('Screening Service', () => {
    let service: ScreeningService;

    beforeEach(waitForAsync(() => {
        environment.variant = 'default';

        TestBed.configureTestingModule({
            imports: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                ScreeningService,
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
        });

        service = TestBed.inject(ScreeningService);
        service.sectionIds = [
            'education',
            'assessment',
            'examinations',
            'tests',
            'referrals',
        ];
        service.pageText = {
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
            prostate: {
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
        };
        service.CONSENT_DENIED = 'deny';
        service.CONSENT_PERMITTED = 'permit';

        jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
    }));

    it('should test fetching the getScreeningData function', () => {
        spyOn(service, 'getScreeningData').and.callThrough();
        service.getScreeningData('4eb448f1-7a63-41f4-9f29-4f46319e4ca6');
        expect(service.getScreeningData).toHaveBeenCalled();
    });

    it('should test fetching the checkUnauthorizedAccess function', () => {
        spyOn(service, 'checkUnauthorizedAccess').and.callThrough();
        service.checkUnauthorizedAccess();
        expect(service.checkUnauthorizedAccess).toHaveBeenCalled();
    });

    it('should test setScreeningStates function', () => {
        const data = { ...screeningData, consent: allowedConsent };
        spyOn(service, 'setScreeningStates').and.callThrough();
        service.setScreeningStates(data, 'WAITING', 'in progress', 'breast');
        expect(service.setScreeningStates).toHaveBeenCalled();
    });

    it('should test setScreeningStates function if visit is finished', () => {
        const data = { ...screeningData, consent: allowedConsent };

        spyOn(service, 'setScreeningStates').and.callThrough();
        service.setScreeningStates(data, 'completed', 'finished', 'breast');
        expect(service.setScreeningStates).toHaveBeenCalled();
    });

    it('should test setScreeningStates function if screening is completed', () => {
        const data = { ...screeningData, consent: allowedConsent };

        spyOn(service, 'setScreeningStates').and.callThrough();
        service.setScreeningStates(data, 'completed', 'completed', 'breast');
        expect(service.setScreeningStates).toHaveBeenCalled();
    });

    it('should test setScreeningStates function if consent is denied', () => {
        const data = { consent: deniedConsent };

        spyOn(service, 'setScreeningStates').and.callThrough();
        service.setScreeningStates(
            data,
            'in-progress',
            'in-progress',
            'breast'
        );
        expect(service.setScreeningStates).toHaveBeenCalled();
    });

    it('should test setScreeningStates function if observation is not provided and riskAssessment is', () => {
        const data = { consent: allowedConsent, riskAssessment };

        spyOn(service, 'setScreeningStates').and.callThrough();
        service.setScreeningStates(data, 'WAITING', 'in progress', 'breast');
        expect(service.setScreeningStates).toHaveBeenCalled();
    });

    it('should test setScreeningStates function if observation is not provided but riskAssessment and tasks are', () => {
        const data = { consent: allowedConsent, riskAssessment, tasks };

        spyOn(service, 'setScreeningStates').and.callThrough();
        service.setScreeningStates(data, 'WAITING', 'in progress', 'breast');
        expect(service.setScreeningStates).toHaveBeenCalled();
    });

    it('should test setScreeningStates function if only consent is provided', () => {
        const data = { consent: allowedConsent };

        spyOn(service, 'setScreeningStates').and.callThrough();
        service.setScreeningStates(data, 'WAITING', 'in progress', 'breast');
        expect(service.setScreeningStates).toHaveBeenCalled();
    });

    it('should test convertString function', () => {
        spyOn(service, 'convertString').and.callThrough();

        const formattedString = service.convertString('fail_safe', 'breast');
        expect(formattedString).toBe('abnormal');
        expect(service.convertString).toHaveBeenCalled();
    });

    it('should test the toggleSection function when section Id exists', () => {
        const cmpt = {
            templateSettings: [
                {
                    id: 'education',
                    name: 'Education',
                    display: 'Education',
                    isHidden: false,
                    selected: true,
                },
            ],
        };
        service.sectionIds = ['education'];
        service.toggleSection('education', cmpt);
        expect(cmpt.templateSettings[0].isHidden).toBe(true);

        service.toggleSection('education', cmpt);
        expect(cmpt.templateSettings[0].isHidden).toBe(false);
    });

    it('should test toggleSection with finalExamTemplateSettings', () => {
        const cmpt = {
            finalExamTemplateSettings: [
                {
                    id: 'education',
                    name: 'Education',
                    display: 'Education',
                    isHidden: false,
                    selected: true,
                },
            ],
        };

        service.sectionIds = ['education'];
        service.toggleSection('education', cmpt);
        expect(cmpt.finalExamTemplateSettings[0].isHidden).toBe(true);

        service.toggleSection('education', cmpt);
        expect(cmpt.finalExamTemplateSettings[0].isHidden).toBe(false);
    });

    it('should test the toggleSection function sectionId does not exist', () => {
        const cmpt = {
            templateSettings: [
                {
                    id: 'general_systems',
                    name: 'General systems',
                    display: 'General systems',
                    isHidden: false,
                    selected: true,
                },
            ],
        };
        spyOn(service, 'toggleSection').and.callThrough();
        service.toggleSection('education', cmpt);
        expect(service.toggleSection).toHaveBeenCalled();
    });

    it('should test setRiskColor function', () => {
        spyOn(service, 'setRiskColor').and.callThrough();

        const result = service.setRiskColor('low risk');
        service.setRiskColor('low risk');
        expect(service.setRiskColor).toHaveBeenCalled();
        expect(result).toBe('#A5550B');
    });

    it('should test setRiskColor function if status is undefined', () => {
        spyOn(service, 'setRiskColor').and.callThrough();

        const result = service.setRiskColor('');
        expect(service.setRiskColor).toHaveBeenCalled();
        expect(result).toBe('#e3dded');
    });

    it('should test setRiskColor function if status provided is incorrect', () => {
        spyOn(service, 'setRiskColor').and.callThrough();

        const result = service.setRiskColor('fail risk');
        expect(service.setRiskColor).toHaveBeenCalled();
        expect(result).toBe('#e3dded');
    });

    it('should test the getBadgeStyle function', () => {
        spyOn(service, 'getBadgeStyle').and.callThrough();
        service.getBadgeStyle('normal', 'breast');
        expect(service.getBadgeStyle).toHaveBeenCalled();
    });

    it('should handle all scenarios in filterScreening', () => {
        const items = [
            { usageContext: 'breast_screening' },
            { usageContext: 'cervical_screening' },
            { usageContext: 'BREAST_test' },
            { someOtherProperty: 'value' },
            { usageContext: null },
            { usageContext: undefined },
            { usageContext: 'breast other words' },
        ];

        expect(service.filterScreening(undefined, 'breast')).toEqual([]);

        const result = service.filterScreening(items, 'breast');

        expect(result.length).toBe(3);
        expect(result).toContain(items[0]);
        expect(result).toContain(items[2]);
        expect(result).toContain(items[6]);
        expect(result).not.toContain(items[1]);
    });

    it('should test the setReportData function', () => {
        spyOn(service, 'setReportData').and.callThrough();
        const data = {
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
        };

        service.setReportData(data, 'breast');
        expect(service.setReportData).toHaveBeenCalled();
    });

    it('should test the setReportData function if data is undefined', () => {
        spyOn(service, 'setReportData').and.callThrough();

        service.setReportData(undefined, 'breast');
        expect(service.setReportData).toHaveBeenCalled();
    });

    it('should test the setReportData function if consent exists', () => {
        spyOn(service, 'setReportData').and.callThrough();

        const data = service.setReportData(
            {
                riskAssessment: [{ usageContext: 'breast_cancer' }],
            },
            'breast'
        );
        expect(service.setReportData).toHaveBeenCalled();
        expect(data.consentPermitted).toBe(false);
    });

    it('should test the updateScreeningTestResult if the edit test form is invalid', () => {
        const cmpt = {
            editTestForm: { valid: false },
            selectedTest: { id: '123' },
            dataLayer: jasmine.createSpyObj('SilStoresService', ['update']),
        };

        spyOn(service, 'updateScreeningTestResult').and.callThrough();
        service.updateScreeningTestResult(cmpt);
        expect(service.updateScreeningTestResult).toHaveBeenCalled();
        expect(cmpt.dataLayer.update).not.toHaveBeenCalled();
    });

    it('should test the updateScreeningTestResult if selectedTest is missing', () => {
        const cmpt = {
            editTestForm: {
                valid: true,
                value: { selectedResult: 'TestResult' },
            },
            selectedTest: null,
            dataLayer: jasmine.createSpyObj('SilStoresService', ['update']),
        };

        spyOn(service, 'updateScreeningTestResult').and.callThrough();
        service.updateScreeningTestResult(cmpt);
        expect(service.updateScreeningTestResult).toHaveBeenCalled();
        expect(cmpt.dataLayer.update).not.toHaveBeenCalled();
    });

    it('should test the updateScreeningTestResult if selectedResult is missing', () => {
        const cmpt = {
            editTestForm: { valid: true, value: { selectedResult: null } },
            selectedTest: { id: '123' },
            dataLayer: jasmine.createSpyObj('SilStoresService', ['update']),
        };

        spyOn(service, 'updateScreeningTestResult').and.callThrough();
        service.updateScreeningTestResult(cmpt);
        expect(service.updateScreeningTestResult).toHaveBeenCalled();
        expect(cmpt.dataLayer.update).not.toHaveBeenCalled();
    });

    it('should test updateScreeningTestResult function and handle errors from dataLayer.update', () => {
        const cmpt = {
            editTestForm: {
                valid: true,
                value: { selectedResult: 'TestResult' },
            },
            selectedTest: { id: '123' },
            dataLayer: service.dataLayer,
            errorHandler: jasmine.createSpyObj('ErrorHandlerService', [
                'handleError',
            ]),
            loadingReportDataFetch: true,
        };

        const errorObj = new Error('Test error');

        spyOn(service.dataLayer, 'update').and.returnValue(
            throwError(() => errorObj)
        );

        service.updateScreeningTestResult(cmpt);

        expect(cmpt.errorHandler.handleError).toHaveBeenCalledWith(
            errorObj,
            cmpt,
            'clinical'
        );
        expect(cmpt.loadingReportDataFetch).toBe(false);
    });
    it('should update test result with correct payload', () => {
        const cmpt = {
            editTestForm: {
                valid: true,
                value: { selectedResult: 'New Result' },
            },
            selectedTest: { id: '123' },
            dataLayer: service.dataLayer,
            fetchReport: jasmine.createSpy(),
            toggleModal: jasmine.createSpy(),
            loadingReportDataFetch: false,
        };

        spyOn(service.dataLayer, 'update').and.returnValue(of({}));

        service.updateScreeningTestResult(cmpt);

        expect(service.dataLayer.update).toHaveBeenCalledWith(
            'observations',
            '/123',
            { value: 'New Result' },
            undefined,
            true
        );
    });

    it('should test the updateScreeningTestResult and call dataLayer.update with correct parameters on success', () => {
        const cmpt = {
            editTestForm: {
                valid: true,
                value: { selectedResult: 'TestResult' },
            },
            selectedTest: { id: '123' },
            dataLayer: service.dataLayer,
            fetchReport: jasmine.createSpy('fetchReport'),
            toggleModal: jasmine.createSpy('toggleModal'),
            loadingReportDataFetch: false,
        };

        spyOn(service.dataLayer, 'update').and.returnValue(of({}));

        service.updateScreeningTestResult(cmpt);

        expect(service.dataLayer.update).toHaveBeenCalledWith(
            'observations',
            '/123',
            { value: 'TestResult' },
            undefined,
            true
        );
        expect(cmpt.fetchReport).toHaveBeenCalled();
        expect(cmpt.toggleModal).toHaveBeenCalledWith('editTest');
    });

    it('should test the setSelectedScreeningTest method, sets selected test and updates the component state correctly', () => {
        const test = {
            name: 'Mammogram',
            code: 'LA16046-7',
            value: 'Test Value',
        };
        const cmpt = {
            selectedTest: null,
            resultOptions: null,
            editTestForm: jasmine.createSpyObj('editTestForm', ['patchValue']),
            previewResult: null,
            toggleModal: jasmine.createSpy('toggleModal'),
        };

        service.setSelectedScreeningTest(test, cmpt);

        expect(cmpt.selectedTest).toBe(test);
        expect(cmpt.resultOptions.length).toBeGreaterThan(0);
        expect(cmpt.editTestForm.patchValue).toHaveBeenCalledWith({
            selectedResult: 'Test Value',
        });
        expect(cmpt.previewResult).toBe('Test Value');
        expect(cmpt.toggleModal).toHaveBeenCalledWith('editTest');
    });

    it('should test the setSelectedScreeningTest method, handles null test value and updates the component state correctly', () => {
        const test = null;
        const cmpt = {
            selectedTest: null,
            resultOptions: null,
            editTestForm: jasmine.createSpyObj('editTestForm', ['patchValue']),
            previewResult: null,
            toggleModal: jasmine.createSpy('toggleModal'),
        };

        service.setSelectedScreeningTest(test, cmpt);

        expect(cmpt.selectedTest).toBe(test);
        expect(cmpt.resultOptions).toEqual([]);
        expect(cmpt.editTestForm.patchValue).toHaveBeenCalledWith({
            selectedResult: null,
        });
        expect(cmpt.previewResult).toBe(null);
        expect(cmpt.toggleModal).toHaveBeenCalledWith('editTest');
    });

    it('should test the setSelectedScreeningTest method, handles test with undefined value and updates the component state correctly', () => {
        const test = { name: 'Mammogram', code: 'LA16046-7', value: undefined };
        const cmpt = {
            selectedTest: null,
            resultOptions: null,
            editTestForm: jasmine.createSpyObj('editTestForm', ['patchValue']),
            previewResult: null,
            toggleModal: jasmine.createSpy('toggleModal'),
        };

        service.setSelectedScreeningTest(test, cmpt);

        expect(cmpt.selectedTest).toBe(test);
        expect(cmpt.resultOptions.length).toBeGreaterThan(0);
        expect(cmpt.editTestForm.patchValue).toHaveBeenCalledWith({
            selectedResult: null,
        });
        expect(cmpt.previewResult).toBe(null);
        expect(cmpt.toggleModal).toHaveBeenCalledWith('editTest');
    });

    it('should test getResultOptionsForScreeningTest function', () => {
        spyOn(service, 'getResultOptionsForScreeningTest').and.callThrough();

        const result = service.getResultOptionsForScreeningTest(null);
        expect(result).toEqual([]);
        expect(service.getResultOptionsForScreeningTest).toHaveBeenCalled();
    });

    it('should test getResultOptionsForScreeningTest method and return an empty array if testName is not provided', () => {
        const result = service.getResultOptionsForScreeningTest('');
        expect(result).toEqual([]);
    });

    it('should test fetchReport function with successful response', () => {
        const cmpt = {
            loadingDataFetch: false,
            encounterID: '12345',
            dataLayer: jasmine.createSpyObj('dataLayer', ['getClinical']),
            responseFunction: jasmine.createSpy('responseFunction'),
            errorHandlerFxn: jasmine.createSpy('errorHandlerFxn'),
        };

        cmpt.dataLayer.getClinical.and.returnValue(of({ data: 'report data' }));

        service.fetchReport(cmpt);

        expect(cmpt.loadingDataFetch).toBe(true);
        expect(cmpt.dataLayer.getClinical).toHaveBeenCalledWith(
            'screening-report',
            { encounterID: '12345' }
        );
        expect(cmpt.responseFunction).toHaveBeenCalledWith({
            data: 'report data',
        });
        expect(cmpt.errorHandlerFxn).not.toHaveBeenCalled();
    });

    it('should test fetchReport function with error response', () => {
        const cmpt = {
            loadingDataFetch: false,
            encounterID: '12345',
            dataLayer: jasmine.createSpyObj('dataLayer', ['getClinical']),
            responseFunction: jasmine.createSpy('responseFunction'),
            errorHandlerFxn: jasmine.createSpy('errorHandlerFxn'),
        };

        cmpt.dataLayer.getClinical.and.returnValue(
            throwError(() => new Error('Error fetching report'))
        );

        service.fetchReport(cmpt);

        expect(cmpt.loadingDataFetch).toBe(true);
        expect(cmpt.dataLayer.getClinical).toHaveBeenCalledWith(
            'screening-report',
            { encounterID: '12345' }
        );
        expect(cmpt.responseFunction).not.toHaveBeenCalled();
        expect(cmpt.errorHandlerFxn).toHaveBeenCalledWith(
            new Error('Error fetching report')
        );
    });

    it('should test deleteTest function with successful response', () => {
        const cmpt = {
            selectedTest: { id: '123' },
            deletingTest: false,
            loadingReportDataFetch: false,
            dataLayer: jasmine.createSpyObj('SilStoresService', ['remove']),
            toggleModal: jasmine.createSpy('toggleModal'),
        };

        cmpt.dataLayer.remove.and.returnValue(of({}));
        spyOn(service, 'fetchReport');

        service.deleteTest(cmpt);

        expect(cmpt.dataLayer.remove).toHaveBeenCalledWith(
            'diagnostic-report',
            '',
            { 'observation-id': '123' }
        );
        expect(service.fetchReport).toHaveBeenCalledWith(cmpt);
        expect(cmpt.toggleModal).toHaveBeenCalledWith('deleteTest');
        expect(cmpt.deletingTest).toBe(false);
        expect(cmpt.loadingReportDataFetch).toBe(false);
    });

    it('should test deleteTest function with error response', () => {
        const cmpt = {
            selectedTest: { id: '123' },
            deletingTest: false,
            loadingReportDataFetch: false,
            dataLayer: jasmine.createSpyObj('SilStoresService', ['remove']),
            errorHandler: jasmine.createSpyObj('ErrorHandlerService', [
                'handleError',
            ]),
            toggleModal: jasmine.createSpy('toggleModal'),
        };

        const error = new Error('Test error');
        cmpt.dataLayer.remove.and.returnValue(throwError(() => error));

        service.deleteTest(cmpt);

        expect(cmpt.errorHandler.handleError).toHaveBeenCalledWith(
            error,
            cmpt,
            'clinical'
        );
        expect(cmpt.deletingTest).toBe(false);
        expect(cmpt.loadingReportDataFetch).toBe(false);
    });

    it('should not proceed with deleteTest if test is missing', () => {
        const cmpt = {
            selectedTest: null,
            deletingTest: false,
            dataLayer: jasmine.createSpyObj('SilStoresService', ['remove']),
        };

        service.deleteTest(cmpt);
        expect(cmpt.dataLayer.remove).not.toHaveBeenCalled();
    });

    it('should not proceed with deleteTest if already deleting', () => {
        const cmpt = {
            selectedTest: { id: '123' },
            deletingTest: true,
            dataLayer: jasmine.createSpyObj('SilStoresService', ['remove']),
        };

        service.deleteTest(cmpt);
        expect(cmpt.dataLayer.remove).not.toHaveBeenCalled();
    });

    it('should test getMatchingConsent with matching consent data', () => {
        const matchingConsent = { usageContext: 'breast_screening', id: 1 };
        const reportData = {
            consent: [
                matchingConsent,
                { usageContext: 'cervical_screening', id: 2 },
            ],
        };

        const result = service.getMatchingConsent(reportData, 'breast');
        expect(result).toEqual(matchingConsent);
    });

    it('should test getMatchingConsent with no matching consent data', () => {
        const reportData = {
            riskAssessment: [{ usageContext: 'breast_cancer' }],
        };

        const result = service.getMatchingConsent(reportData, 'breast');
        expect(result).toEqual(null);
    });

    it('should test getMatchingConsent with null or undefined reportData', () => {
        expect(service.getMatchingConsent(null, 'breast')).toBeNull();
        expect(service.getMatchingConsent(undefined, 'breast')).toBeNull();
        expect(service.getMatchingConsent({}, 'breast')).toBeNull();
    });

    it('should get result options by code', () => {
        const result = service.getResultOptionsForScreeningTest(
            '',
            'LA16046-7'
        );
        expect(result.length).toBeGreaterThan(0);
    });

    it('should get result options by name', () => {
        const result = service.getResultOptionsForScreeningTest(
            'Mammogram',
            ''
        );
        expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty array for unknown test', () => {
        const result = service.getResultOptionsForScreeningTest('', '');
        expect(result).toEqual([]);
    });

    it('should set selected test and populate options', () => {
        const test = {
            name: 'Mammogram',
            code: 'LA16046-7',
            value: 'Benign (BIRADS 2)',
        };
        const cmpt = {
            editTestForm: jasmine.createSpyObj('form', ['patchValue']),
            toggleModal: jasmine.createSpy(),
            selectedTest: null,
            resultOptions: null,
            previewResult: null,
        };

        service.setSelectedScreeningTest(test, cmpt);

        expect(cmpt.selectedTest).toBe(test);
        expect(cmpt.resultOptions.length).toBeGreaterThan(0);
        expect(cmpt.toggleModal).toHaveBeenCalled();
    });

    it('should match test names case-insensitively', () => {
        const variations = ['mammogram', 'MAMMOGRAM', 'MaMmOgRaM', 'Mammogram'];
        const results = variations.map(name =>
            service.getResultOptionsForScreeningTest(name)
        );

        results.forEach(result => {
            expect(result.length).toBeGreaterThan(0);
            expect(result).toEqual(results[0]);
        });
    });

    it('should match complex test names case-insensitively', () => {
        const testPairs = [
            ['Physical findings of Breast', 'physical findings of breast'],
            ['Pap smear/cytology', 'PAP SMEAR/CYTOLOGY'],
            [
                'Prostate specific Ag/Prostate volume calculated',
                'PROSTATE SPECIFIC AG/PROSTATE VOLUME CALCULATED',
            ],
            ['VIA/VILI', 'via/vili'],
            ['US Chest', 'us chest'],
        ];

        testPairs.forEach(([original, variation]) => {
            const result1 = service.getResultOptionsForScreeningTest(original);
            const result2 = service.getResultOptionsForScreeningTest(variation);

            expect(result1.length).toBeGreaterThan(0);
            expect(result2).toEqual(result1);
        });
    });

    it('should prioritize code over name and exact match over case-insensitive', () => {
        const byCode = service.getResultOptionsForScreeningTest(
            'WrongName',
            'LA16046-7'
        );
        expect(byCode.length).toBeGreaterThan(0);

        const exactMatch =
            service.getResultOptionsForScreeningTest('Mammogram');
        const caseInsensitive =
            service.getResultOptionsForScreeningTest('mammogram');
        expect(exactMatch).toEqual(caseInsensitive);
    });

    it('should handle edge cases in case-insensitive matching', () => {
        const edgeCases = [
            null,
            undefined,
            '',
            'NonExistentTest',
            'nonexistenttest',
        ];

        edgeCases.forEach(testCase => {
            const result = service.getResultOptionsForScreeningTest(testCase);
            expect(result).toEqual([]);
        });
    });

    it('should match all cancer screening test types case-insensitively', () => {
        const allTests = {
            breast: ['mammogram', 'biopsy', 'ultrasound', 'cbe', 'mr breast'],
            cervical: ['via', 'hpv', 'pap smear'],
            prostate: ['psa', 'prostate specific antigen - serum'],
        };

        Object.values(allTests)
            .flat()
            .forEach(testName => {
                const lowercase = service.getResultOptionsForScreeningTest(
                    testName.toLowerCase()
                );
                const uppercase = service.getResultOptionsForScreeningTest(
                    testName.toUpperCase()
                );

                expect(lowercase.length).toBeGreaterThan(0);
                expect(uppercase).toEqual(lowercase);
            });
    });

    it('should return consistent results across multiple calls', () => {
        const testName = 'mammogram';
        const results = [1, 2, 3].map(() =>
            service.getResultOptionsForScreeningTest(testName)
        );

        expect(results[0]).toEqual(results[1]);
        expect(results[1]).toEqual(results[2]);
    });
});

describe('Screening Service empower variant', () => {
    let service: ScreeningService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                ScreeningService,
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: StateService, useClass: StateServiceStub },
            ],
        });
        environment.variant = 'empower';

        service = TestBed.inject(ScreeningService);
        service.sectionIds = [
            'education',
            'assessment',
            'examinations',
            'tests',
            'referrals',
        ];
        service.pageText = {
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
            prostate: {
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
        };
        service.CONSENT_DENIED = 'deny';
        service.CONSENT_PERMITTED = 'permit';
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 17000;
    });

    it('should test fetching the checkUnauthorizedAccess function', () => {
        spyOn(service, 'checkUnauthorizedAccess').and.callThrough();
        service.checkUnauthorizedAccess();
        expect(service.checkUnauthorizedAccess).toHaveBeenCalled();
    });

    it('should test convertString function for cervical cancer', () => {
        spyOn(service, 'convertString').and.callThrough();

        const formattedString = service.convertString('positive', 'cervical');
        expect(formattedString).toBe('positive');
        expect(service.convertString).toHaveBeenCalled();
    });

    it('should test convertString function for prostate cancer', () => {
        spyOn(service, 'convertString').and.callThrough();

        const formattedString = service.convertString(
            'normal_psa_levels',
            'prostate'
        );
        expect(formattedString).toBe('normal');
        expect(service.convertString).toHaveBeenCalled();
    });

    it('should handle errors in getScreeningData', done => {
        service.getScreeningData('test-id').subscribe({
            next: () => {
                fail('Should have failed with error');
                done();
            },
            error: error => {
                expect(error).toBeTruthy();
                done();
            },
        });
    });
});

describe('Screening Service error handling', () => {
    let service: ScreeningService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                ScreeningService,
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError2,
                },
                { provide: StateService, useClass: StateServiceStub },
            ],
        });
        environment.variant = 'empower';

        service = TestBed.inject(ScreeningService);
        service.sectionIds = [
            'education',
            'assessment',
            'examinations',
            'tests',
            'referrals',
        ];

        service.pageText = {
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
            prostate: {
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
        };

        jasmine.DEFAULT_TIMEOUT_INTERVAL = 17000;
    });

    it('should handle timeout error in getScreeningData', done => {
        spyOn(service.dataLayer, 'getClinical').and.returnValue(
            new Observable(observer => {
                setTimeout(() => {
                    observer.error(new Error('Timeout'));
                }, 15000);
            })
        );

        service.getScreeningData('test-id').subscribe({
            next: () => {
                fail('Should have failed with timeout');
                done();
            },
            error: error => {
                expect(error).toBe(
                    'An unexpected error occurred. Please try again.'
                );
                done();
            },
        });
    });

    it('should handle errors in filterScreening', () => {
        const items = [
            { usageContext: null },
            { usageContext: undefined },
            { usageContext: new Error('test') },
            { usageContext: {} },
            { usageContext: 'breast_screening' },
        ];

        spyOn(service, 'filterScreening').and.callThrough();

        const result = service.filterScreening(items, 'breast');

        expect(result.length).toBe(1);
        expect(result).toContain(items[4]);
    });
});

describe('Screening Service deleteTest method', () => {
    let service: ScreeningService;
    let component: any;

    beforeEach(waitForAsync(() => {
        environment.variant = 'empower';

        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                ScreeningService,
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
        });

        service = TestBed.inject(ScreeningService);

        component = {
            selectedTest: { id: '123' },
            deletingTest: false,
            loadingReportDataFetch: false,
            dataLayer: jasmine.createSpyObj('SilStoresService', [
                'remove',
                'getClinical',
            ]),
            fetchReport: jasmine.createSpy('fetchReport'),
            toggleModal: jasmine.createSpy('toggleModal'),
            errorHandler: jasmine.createSpyObj('ErrorHandlerService', [
                'handleError',
            ]),
        };
        component.dataLayer.getClinical.and.returnValue(of({}));
        component.dataLayer.remove.and.returnValue(of({}));

        spyOn(service, 'fetchReport').and.callFake(() => {});
    }));

    it('should not proceed if test is missing', () => {
        component.selectedTest = null;
        service.deleteTest(component);
        expect(component.dataLayer.remove).not.toHaveBeenCalled();
    });

    it('should not proceed if already deleting', () => {
        component.deletingTest = true;
        service.deleteTest(component);
        expect(component.dataLayer.remove).not.toHaveBeenCalled();
    });

    it('should call dataLayer.remove with correct parameters', () => {
        service.deleteTest(component);

        expect(component.dataLayer.remove).toHaveBeenCalledWith(
            'diagnostic-report',
            '',
            { 'observation-id': '123' }
        );
    });

    it('should refresh data and close modal on successful deletion', fakeAsync(() => {
        let observer: any;
        const removeObservable = new Observable(obs => {
            observer = obs;
        });

        component.dataLayer.remove.and.returnValue(removeObservable);

        service.deleteTest(component);

        expect(component.deletingTest).toBeTrue();
        expect(component.loadingReportDataFetch).toBeTrue();

        observer.next({});
        observer.complete();

        tick();

        expect(service.fetchReport).toHaveBeenCalledWith(component);
        expect(component.toggleModal).toHaveBeenCalledWith('deleteTest');
        expect(component.deletingTest).toBeFalse();
        expect(component.loadingReportDataFetch).toBeFalse();
    }));

    it('should handle errors from dataLayer.remove', () => {
        const error = new Error('Test error');
        component.dataLayer.remove.and.returnValue(throwError(() => error));

        service.deleteTest(component);

        expect(component.errorHandler.handleError).toHaveBeenCalledWith(
            error,
            component,
            'clinical'
        );
        expect(component.deletingTest).toBeFalse();
        expect(component.loadingReportDataFetch).toBeFalse();
    });
});
