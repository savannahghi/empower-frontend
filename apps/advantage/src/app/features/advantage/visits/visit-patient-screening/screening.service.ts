import { Injectable } from '@angular/core';
import { StateService } from '@uirouter/angular';
import { environment } from '../../../../../environments/environment';
import { catchError, Observable, throwError, timeout } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import {
    testResults,
    TEST_NAME_TO_OPTIONS,
    ScreeningOption,
} from './screening-record/screening-options';

/**
 * Cancer Screening Service that is injected into a cervical or breast screening component
 */
@Injectable({
    providedIn: 'root',
})
/**
 * Class that creates the screening service component.
 */
export class ScreeningService {
    /**
     * contains app variant information
     */
    variant: string;

    /**
     * Ids of the template sections
     */
    sectionIds = [
        'education',
        'assessment',
        'examinations',
        'tests',
        'referrals',
    ];

    /**
     * Constant representing permitted consent status
     */
    CONSENT_PERMITTED: string = 'permit';

    /**
     * Constant representing denied consent status
     */
    CONSENT_DENIED: string = 'deny';

    /**
     * Text and colors that are rendered based on the screening results
     */
    pageText: any = {
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

    /**
     * Map of test type to test name
     */
    private readonly testTypeMap = new Map([
        ['ultrasound', 'Ultrasound'],
        ['human', 'HPV'],
        ['smear', 'Pap smear/cytology'],
        ['whole blood', 'Prostate Specific Antigen - Whole Blood'],
        ['prostate', 'Prostate Specific Antigen - Whole Blood'],
    ]);

    /**
     *
     * @param dataLayer SilStoresService for making REST API calls
     * @param $state Access instance of the state service
     */
    constructor(
        public dataLayer: SilStoresService,
        public $state: StateService
    ) {
        this.variant = environment.variant;
    }

    /**
     * Function used to fetch patient's screening data as per encounter
     * @param encounterIdVal encounter identifier
     * @returns observable with the response
     */
    getScreeningData(encounterIdVal: string): Observable<any> {
        return this.dataLayer
            .getClinical('associated-resources', {
                encounterID: encounterIdVal,
            })
            .pipe(
                timeout(14000),
                catchError(() =>
                    throwError(
                        () => 'An unexpected error occurred. Please try again.'
                    )
                )
            );
    }

    /**
     * Function used to redirect unauthorized access
     */
    checkUnauthorizedAccess(): void {
        /**
         * Redirect non-empower users to default advantage view
         */
        if (
            this.variant !== 'empower' &&
            this.$state.includes('app.advantage.visits.detail.screening')
        ) {
            this.$state.go('app.advantage.visits', {}, { reload: true });
        } else return;
    }

    /**
     * Function used to add states and status checks for a specific screening encounter
     * @param screeningData the encounter screening data
     * @param servicePtStatus status of the equivalent service point
     * @returns encounter screening data, states and various statuses
     */
    setScreeningStates(
        screeningData: any,
        servicePtStatus: string,
        visitStatus: string,
        cancerType: string
    ) {
        const filteredConsent = this.getMatchingConsent(
            screeningData,
            cancerType
        );
        const encounterStatus = filteredConsent?.status?.toLowerCase();
        const recordedConsent = filteredConsent?.decision?.type?.toLowerCase();

        let activeStep = 0;
        let hasTasks = false;

        // Exit if encounter or visit is finished/completed
        if (
            ['finished', 'completed'].includes(visitStatus) ||
            ['finished', 'completed'].includes(encounterStatus)
        ) {
            return {
                ...screeningData,
                statuses: { encounterStatus, recordedConsent },
                activeStep,
                hasTasks,
                consentDenied: false,
                encounterFinished: true,
            };
        }

        // Exit if consent is denied
        if (recordedConsent === this.CONSENT_DENIED) {
            return {
                ...screeningData,
                statuses: { encounterStatus, servicePtStatus, recordedConsent },
                activeStep,
                hasTasks,
                consentDenied: true,
                encounterFinished: false,
            };
        }

        const filteredObservations = this.filterScreening(
            screeningData?.observation,
            cancerType
        );
        const riskAssessments = this.filterScreening(
            screeningData?.riskAssessment,
            cancerType
        );
        const tasks = this.filterScreening(screeningData?.tasks, cancerType);
        const hasObservations = filteredObservations.length > 0;
        const hasAssessments = riskAssessments.length > 0;
        const hasTasksList = tasks.length > 0;

        if (hasObservations) {
            activeStep = 2;
        } else if (hasAssessments) {
            activeStep = 1;
            hasTasks = hasTasksList;
        } else if (recordedConsent === this.CONSENT_PERMITTED) {
            activeStep = 0;
        }

        return {
            ...screeningData,
            statuses: { encounterStatus, servicePtStatus, recordedConsent },
            activeStep,
            hasTasks,
            consentDenied: false,
            encounterFinished: false,
        };
    }

    /**
     * Toogle function to display or hide clinical components notes
     * @param sectionId selected dropdown section id
     * @param templateSections array of the visible dropdown sections
     * @returns a modified array
     */
    toggleSection(sectionId, cmpt) {
        if (this.sectionIds.includes(sectionId)) {
            const settingsToUse =
                cmpt.templateSettings || cmpt.finalExamTemplateSettings;
            if (settingsToUse) {
                settingsToUse.forEach(template => {
                    if (template.id === sectionId) {
                        template.isHidden = !template.isHidden;
                    }
                });
            }
            return;
        }
    }
    /**
     * Function used to filter items by screening type
     * @param items items to filter
     * @returns filtered items
     */
    filterScreening(items: any[], cancerType: string): any[] {
        if (!items || !Array.isArray(items)) return [];

        return items.filter(item => {
            if (!item.usageContext || typeof item.usageContext !== 'string') {
                return false;
            }

            const itemContext = item.usageContext
                .split(/[_ ]/)[0]
                ?.toLowerCase();

            return itemContext === cancerType?.toLowerCase();
        });
    }
    /**
     * Function used to fetch report Data
     * @param reportData report data
     * @returns strucutured and state object
     */
    getMatchingConsent(reportData, cancerType): any {
        if (!reportData?.consent?.length) return null;
        return this.filterScreening(reportData.consent, cancerType)[0];
    }

    /**
     * Function used to partition data based on the screening type
     * @param data screening data
     * @param cancerType screening type
     * @returns boolean object
     */
    setReportData(data, cancerType) {
        const { referralDetails, observation, followups, consent } = data || {};

        const filteredConsent = !consent?.length
            ? null
            : this.filterScreening(consent, cancerType)[0];
        const filteredExaminations = this.filterScreening(
            observation?.examinations,
            cancerType
        );
        const filteredTests = this.filterScreening(
            observation?.tests,
            cancerType
        );
        const filteredReferredTests = this.filterScreening(
            observation?.referredTests,
            cancerType
        );
        const filteredReferrals = this.filterScreening(
            referralDetails,
            cancerType
        );
        const filteredRiskAssessments = this.filterScreening(
            data?.riskAssessment,
            cancerType
        );

        return {
            consentPermitted:
                filteredConsent?.decision?.type === this.CONSENT_PERMITTED,
            consentDenied:
                filteredConsent?.decision?.type === this.CONSENT_DENIED,
            hasExaminations: filteredExaminations?.length > 0,
            hasTests: filteredTests?.length > 0,
            hasReferredTests: filteredReferredTests?.length > 0,
            hasReferrals: filteredReferrals?.length > 0,
            hasRiskAssessment: filteredRiskAssessments?.length > 0,
            hasFollowUps: !!followups,
        };
    }
    /**
     * Function used to return a color code based on risk level
     * @param status risk assessment level
     * @returns color
     */
    setRiskColor(status) {
        const riskColorCodes = {
            high_risk: '#c63333',
            not_at_risk: '#276F09',
            low_risk: '#A5550B',
            average_risk: '#F7892F',
            default: '#e3dded',
        };

        // Handle empty or missing status
        if (!status) {
            return riskColorCodes.default;
        }

        // Convert to lowercase and replace spaces with underscores (optional)
        const normalizedStatus = status.toLowerCase().replace(/ /g, '_');

        // Check if status exists in riskColorCodes and return the color, otherwise default
        return riskColorCodes[normalizedStatus] || riskColorCodes.default;
    }

    /**
     * Function used to format a string by replacing underscores with spaces
     * Used to improve display of values that come from database fields
     * @param string to be formatted
     * @param cancerType type of cancer
     * @returns formatted string
     */
    convertString(inputString, cancerType) {
        const result = inputString?.replace(/_/g, ' ');
        let screeningStatus = '';
        const screeningMap = {
            cervical: {
                values: ['negative', 'hr-hpv negative', 'normal'],
                outcomes: { default: 'negative', alternate: 'positive' },
            },
            breast: {
                values: [
                    'normal',
                    'benign findings - not suspicious for ca',
                    'birads 1',
                    'birads 2',
                    'her2 negative',
                ],
                outcomes: { default: 'normal', alternate: 'abnormal' },
            },
            prostate: {
                values: [
                    'normal_psa_levels',
                    'raised_psa_levels',
                    'normal psa levels',
                    'high psa levels',
                ],
                outcomes: { default: 'normal', alternate: 'abnormal' },
            },
        };

        const screeningData = screeningMap[cancerType];

        if (screeningData) {
            screeningStatus = screeningData.values.includes(
                result.toLowerCase()
            )
                ? screeningData.outcomes.default
                : screeningData.outcomes.alternate;
        }
        return screeningStatus;
    }

    /**
     * Function used to determine the style properties of the badge
     * @param testValue  Value of the test
     * @param cancerType type of cancer
     * @returns css properties
     */
    getBadgeStyle(testValue: string, cancerType: string) {
        return {
            background:
                this.pageText[cancerType][
                    this.convertString(testValue, cancerType)
                ].badgeBackgroundColor,
            color: this.pageText[cancerType][
                this.convertString(testValue, cancerType)
            ].badgeColor,
        };
    }

    /**
     * @param cmpt The screening component object to update test results on
     * Updates the test result with the selected value
     */
    updateScreeningTestResult(cmpt: any) {
        if (!cmpt.editTestForm.valid || !cmpt.selectedTest) {
            return;
        }

        const selectedResult = cmpt.editTestForm.value.selectedResult;
        if (!selectedResult) {
            return;
        }

        cmpt.loadingReportDataFetch = true;

        const payload = {
            value: selectedResult,
        };

        const path = `/${cmpt.selectedTest.id}`;

        this.dataLayer
            .update('observations', path, payload, undefined, true)
            .subscribe({
                next: () => {
                    cmpt.fetchReport();
                    cmpt.toggleModal('editTest');
                    cmpt.loadingReportDataFetch = false;
                },
                error: error => {
                    cmpt.errorHandler.handleError(error, cmpt, 'clinical');
                    cmpt.loadingReportDataFetch = false;
                },
            });
    }

    /**
     * Function used to set the selected test or examination
     * @param test the test or examination to set
     * @param cmpt the screening component Object
     */
    setSelectedScreeningTest(test: any, cmpt: any) {
        cmpt.selectedTest = test;

        cmpt.resultOptions = this.getResultOptionsForScreeningTest(
            test?.name,
            test?.code
        );

        cmpt.editTestForm.patchValue({
            selectedResult: test?.value || null,
        });

        cmpt.previewResult = test?.value || null;

        cmpt.toggleModal('editTest');
    }

    /**
     * Function used to get the result options for a test/examination
     * @param testName the name of the test/examination
     * @param code the LOINC code (optional)
     * @returns the result options for the test
     */
    getResultOptionsForScreeningTest(
        testName: string,
        code?: string
    ): ScreeningOption[] {
        if (!testName && !code) {
            return [];
        }

        if (code && testResults[code]) {
            return testResults[code];
        }

        if (testName && TEST_NAME_TO_OPTIONS[testName]) {
            return TEST_NAME_TO_OPTIONS[testName];
        }

        const testNameLower = testName?.toLowerCase();
        const matchingKey = Object.keys(TEST_NAME_TO_OPTIONS).find(
            key => key.toLowerCase() === testNameLower
        );

        if (matchingKey) {
            return TEST_NAME_TO_OPTIONS[matchingKey];
        }

        return [];
    }

    /**
     * @description Function used to fetch the screening report
     * @param cmpt Screening component
     * @returns null
     */
    fetchReport(cmpt: any) {
        cmpt.loadingDataFetch = true;

        const param = {
            encounterID: cmpt.encounterID,
        };
        cmpt.dataLayer.getClinical('screening-report', param).subscribe({
            next: cmpt.responseFunction,
            error: cmpt.errorHandlerFxn,
        });
    }

    /**
     * Function to delete a test or examination
     * @param cmpt The screening component object to update test results on
     * @returns void
     */
    deleteTest(cmpt: any) {
        if (cmpt.deletingTest || !cmpt.selectedTest) {
            return;
        }

        cmpt.deletingTest = true;
        cmpt.loadingReportDataFetch = true;

        const queryParams = { 'observation-id': cmpt.selectedTest.id };
        cmpt.dataLayer.remove('diagnostic-report', '', queryParams).subscribe({
            next: () => {
                this.fetchReport(cmpt);
                cmpt.toggleModal('deleteTest');
                cmpt.deletingTest = false;
                cmpt.loadingReportDataFetch = false;
            },
            error: error => {
                cmpt.errorHandler.handleError(error, cmpt, 'clinical');
                cmpt.loadingReportDataFetch = false;
                cmpt.deletingTest = false;
            },
        });
    }
}
