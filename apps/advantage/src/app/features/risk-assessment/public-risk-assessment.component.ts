import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';
import { timeout } from 'rxjs';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'skika-public-risk-assessment',
    templateUrl: './public-risk-assessment.component.html',
    styleUrls: ['./public-risk-assessment.component.scss'],
    standalone: false,
})
export class PublicRiskAssessmentComponent implements OnInit {
    /**
     * Injects the global values from ui router
     * @param uiglobals injects the global values from ui router
     */
    constructor(
        public uiglobals: UIRouterGlobals,
        public dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService
    ) {}

    /**
     * Cancer type
     */
    cancerType: string = '';

    /**
     * Questionnaire response
     */
    questionnaireResponse: any = null;

    /**
     * add next step requested event emitter
     */
    @Output() nextStepRequested = new EventEmitter();

    /**
     * Form definition
     */
    formloading: boolean = false;

    /**
     * Questionnaire object that defines the form structure
     */
    formDef: any = null;

    /**
     * Used to show loading indicator
     */
    loading: boolean = false;

    /**
     * Used to show submitted indicator
     */
    submitted: boolean = false;

    /**
     * Risk level for the current cancer type
     */
    riskLevel: string = '';

    /**
     * Badge style for the risk level
     */
    badgeStyle: any = {};

    /**
     * Risk display data structure with text and recommendations for each cancer type and risk level
     */
    riskDisplayData = {
        breast: {
            high_risk: {
                label: 'High Risk',
                text: 'The patient has been determined to be at high risk for breast cancer.',
                recommendations: [
                    'Schedule a clinical breast exam (CBE)',
                    'Refer for mammogram (if over 40)',
                    'Consider genetic counseling',
                    'Schedule follow-up in 6 months',
                ],
                badgeStyle: {
                    color: '#DA0A15',
                    backgroundColor: '#FFF1F0',
                },
            },
            average_risk: {
                label: 'Average Risk',
                text: 'The patient has been determined to be at average risk for breast cancer.',
                recommendations: [
                    'Schedule annual clinical breast exam',
                    'Recommend monthly self-exams',
                    'Schedule mammogram if over 40',
                    'Schedule follow-up in 12 months',
                ],
                badgeStyle: {
                    color: '#A35206',
                    backgroundColor: '#FFF7E6',
                },
            },
            low_risk: {
                label: 'Low Risk',
                text: 'The patient has been determined to be at low risk for breast cancer.',
                recommendations: [
                    'Educate on breast self-examination',
                    'Schedule follow-up in 24 months',
                    'Monitor for any changes in risk factors',
                ],
                badgeStyle: {
                    color: '#276F09',
                    backgroundColor: '#F6FFED',
                },
            },
        },
        cervical: {
            at_risk: {
                label: 'At Risk',
                text: 'The patient has been determined to be at risk for HPV infection, which causes cervical cancer.',
                recommendations: [
                    'Recommend HPV test (if over 30)',
                    'Consider VIA or VIA/VILI test',
                    'Schedule Pap smear/cytology',
                    'Consider colposcopy if symptoms present',
                ],
                badgeStyle: {
                    color: '#DA0A15',
                    backgroundColor: '#FFF1F0',
                },
            },
            high_risk: {
                label: 'High Risk',
                text: 'The patient has been determined to be at High risk for cervical cancer.',
                recommendations: [
                    'Recommend HPV test (if over 30)',
                    'Consider VIA or VIA/VILI test',
                    'Schedule Pap smear/cytology',
                    'Consider colposcopy if symptoms present',
                ],
                badgeStyle: {
                    color: '#DA0A15',
                    backgroundColor: '#FFF1F0',
                },
            },
            low_risk: {
                label: 'Low Risk',
                text: 'The patient has been determined to be at low risk for cervical cancer.',
                recommendations: [
                    'Schedule follow-up screening in 5 years',
                    'Schedule follow-up in 2 years if HIV positive',
                    'Educate on warning signs',
                ],
                badgeStyle: {
                    color: '#A35206',
                    backgroundColor: '#FFF7E6',
                },
            },
            not_at_risk: {
                label: 'Not At Risk',
                text: 'The patient is not at risk of Cervical Cancer.',
                recommendations: [
                    'Schedule follow-up screening in 1 year',
                    'Educate on prevention measures',
                ],
                badgeStyle: {
                    color: '#276F09',
                    backgroundColor: '#F6FFED',
                },
            },
        },
        prostate: {
            high_risk: {
                label: 'High Risk',
                text: 'The patient has been determined to be at high risk for prostate cancer.',
                recommendations: [
                    'Recommend PSA test',
                    'Schedule digital rectal examination',
                    'Consider referral to urologist',
                    'Schedule follow-up in 6 months',
                ],
                badgeStyle: {
                    color: '#DA0A15',
                    backgroundColor: '#FFF1F0',
                },
            },
            average_risk: {
                label: 'Average Risk',
                text: 'The patient has been determined to be at average risk for prostate cancer.',
                recommendations: [
                    'Discuss PSA testing options',
                    'Schedule annual check-up',
                    'Educate on prostate health',
                    'Schedule follow-up in 12 months',
                ],
                badgeStyle: {
                    color: '#A35206',
                    backgroundColor: '#FFF7E6',
                },
            },
            low_risk: {
                label: 'Low Risk',
                text: 'The patient has been determined to be at low risk for prostate cancer.',
                recommendations: [
                    'Educate on prostate health',
                    'Schedule follow-up in 24 months',
                    'Monitor for any changes in risk factors',
                ],
                badgeStyle: {
                    color: '#276F09',
                    backgroundColor: '#F6FFED',
                },
            },
        },
    };

    /**
     * Validation Mappings of the various screenings
     */
    cancerScreenings: Array<any> = [
        {
            name: 'Breast',
            encounterId: '',
            showFor: 'ALL',
        },
        {
            name: 'Cervical',
            encounterId: '',
            showFor: 'FEMALE',
        },
        {
            name: 'Prostate',
            encounterId: '',
            showFor: 'MALE',
        },
    ];

    /**
     * Function used to extract screening type from the current state
     * @param str current state name
     * @returns the screening type
     */
    extractScreeningType = (str: string) => {
        const match = str.match(/risk-assessment\.(\w+)_cancer/);
        return match ? match[1] : null;
    };

    /**
     * Get current risk data based on cancer type and risk level
     * @returns the risk data object containing label, text, recommendations, and badge style
     */
    getCurrentRiskData(): any {
        if (!this.cancerType || !this.riskLevel) {
            return null;
        }

        const cancerData = this.riskDisplayData[this.cancerType.toLowerCase()];
        if (!cancerData) {
            return null;
        }
        const normalizedRiskLevel = this.riskLevel
            .toLowerCase()
            .replace(/\s+/g, '_');
        const riskLevelMappings = {
            moderate: 'average_risk',
            high: 'high_risk',
            low: 'low_risk',
            average: 'average_risk',
            at_risk: 'at_risk',
            not_at_risk: 'not_at_risk',
            negligible: 'not_at_risk',
        };

        const mappedRiskLevel =
            riskLevelMappings[normalizedRiskLevel] || normalizedRiskLevel;

        return cancerData[mappedRiskLevel] || null;
    }

    /**
     * Get badge style based on current risk data
     * @returns badge style object with color and background color
     */
    getBadgeStyle(): any {
        const riskData = this.getCurrentRiskData();
        return (
            riskData?.badgeStyle || {
                color: '#666',
                backgroundColor: '#f5f5f5',
            }
        );
    }

    /**
     * Set risk data based on questionnaire response
     */
    setRiskData(): void {
        if (this.questionnaireResponse?.risk_level) {
            this.riskLevel = this.questionnaireResponse.risk_level;
            this.badgeStyle = this.getBadgeStyle();
        }
    }

    onQuestionnaireResponseReceived(response: any) {
        this.questionnaireResponse = response;
    }

    onSubmitSuccess(response: any) {
        this.submitted = true;
        this.questionnaireResponse = response;
        this.setRiskData();
    }

    onSubmitError(response: any) {
        this.submitted = false;
        this.questionnaireResponse = response;
    }

    /**
     * Fetches questionnaire form definition from the server
     * Builds the search parameter based on the cancer type
     */
    fetchQuestionnaires() {
        this.formloading = true;
        const param = {
            searchParam:
                this.cancerType.charAt(0).toUpperCase() +
                this.cancerType.slice(1) +
                ' Cancer Screening',
        };

        this.dataLayer
            .list('public-questionnaire-response', param)
            .pipe(timeout(20000))
            .subscribe({
                next: (response: any) => {
                    this.formDef = response;
                    this.formloading = false;
                },
                error: err => {
                    this.errorHandler.handleError(err, this, 'clinical');
                },
            });
    }

    /**
     * Submission handler function that will be passed to the questionnaire renderer
     * @param payload The submission payload containing the questionnaire response and additional data
     * @returns A promise that resolves with the submission result or rejects with an error
     */
    submitQuestionnaireResponse(payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = {
                questionnaire_id: this.formDef.id,
            };
            this.loading = true;
            this.dataLayer
                .create('public-questionnaire-response', payload, params)
                .subscribe({
                    next: (response: any) => {
                        resolve(response);
                        this.loading = false;
                        this.submitted = true;
                        this.nextStepRequested.emit();
                    },
                    error: (error: any) => {
                        reject(error);
                        this.loading = false;
                        this.submitted = false;
                    },
                });
        });
    }

    /**
     * Reset the form to allow retaking the assessment
     */
    retakeAssessment() {
        this.submitted = false;
        this.questionnaireResponse = null;
        this.riskLevel = '';
        this.badgeStyle = {};
    }

    /** redirecto to an external url */
    redirectToExternal(url: string): void {
        window.open(url, '_blank');
    }

    ngOnInit() {
        this.cancerType = this.extractScreeningType(
            this.uiglobals.current.name
        );
        this.fetchQuestionnaires();
    }
}
