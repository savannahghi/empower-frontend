import { Component, Input, OnChanges, OnInit } from '@angular/core';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-risk-stratification',
    templateUrl: './risk-stratification.component.html',
    styleUrls: ['./risk-stratification.component.scss'],
    standalone: false,
})

/**
 * This is the class definition of the risk stratification component
 * Used to display risk stratification information for different cancer types
 */
export class RiskStratificationComponent implements OnInit, OnChanges {
    /**
     * The Type of Cancer Screening being done
     */
    @Input() cancerType: string = '';

    /**
     * The risk assessment data from the screening
     */
    @Input() riskAssessmentData: any;

    /**
     * Loading state
     */
    @Input() loading: boolean = true;

    /**
     * Risk level for the current cancer type
     */
    riskLevel: string = '';

    /**
     * Risk text to display
     */
    riskText: string = '';

    /**
     * Badge style for the risk level
     */
    badgeStyle: any = {};

    /**
     * Risk recommendations based on risk level
     */
    recommendations: string[] = [];

    /**
     * Risk data for display based on risk level
     */
    riskData: any = null;

    /**
     * Risk display data mapping for different cancer types and risk levels
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
     * Constructor for the component
     */
    constructor() {}

    /**
     * Get risk level from risk assessment data
     * @returns Normalized risk level string
     */
    getRiskLevelFromData(): string {
        if (
            !this.riskAssessmentData ||
            !this.riskAssessmentData.prediction ||
            !this.riskAssessmentData.prediction.length ||
            !this.riskAssessmentData.prediction[0].qualitativeRisk
        ) {
            return '';
        }

        return this.normalizeRiskLevel(
            this.riskAssessmentData.prediction[0].qualitativeRisk.text
        );
    }

    /**
     * Normalize risk level text to internal format
     * @param riskText Risk level text from API
     * @returns Normalized risk level string
     */
    normalizeRiskLevel(riskText: string): string {
        if (!riskText) return '';

        const lowerCaseText = riskText.toLowerCase();

        // Check for 'not at risk' first to avoid matching just 'at risk'
        if (lowerCaseText.includes('negligible')) {
            return 'not_at_risk';
        } else if (lowerCaseText.includes('high')) {
            return 'high_risk';
        } else if (
            lowerCaseText.includes('certain') &&
            this.cancerType?.toLowerCase().includes('cervical')
        ) {
            return 'at_risk';
        } else if (lowerCaseText.includes('moderate')) {
            return 'average_risk';
        } else if (lowerCaseText.includes('low')) {
            return 'low_risk';
        }

        return '';
    }

    /**
     * Set risk data based on cancer type and risk level
     */
    setRiskData(): void {
        const cancerKey = this.getCancerTypeKey();
        if (!cancerKey) {
            this.loading = false;
            return;
        }

        const riskLevel = this.getRiskLevelFromData();
        if (!riskLevel || !this.riskDisplayData[cancerKey][riskLevel]) {
            this.loading = false;
            return;
        }

        // Set risk level and risk data from our display mapping
        this.riskLevel = riskLevel;
        this.riskData = this.riskDisplayData[cancerKey][riskLevel];
        this.riskText = this.riskData.text;
        this.recommendations = this.riskData.recommendations;
        this.badgeStyle = this.riskData.badgeStyle;
        this.loading = false;
    }

    /**

    /**
     * Convert cancer type to key used in risk display data
     * @returns string key for risk display data
     */
    getCancerTypeKey(): string {
        if (!this.cancerType) return '';

        const lowerCaseType = this.cancerType.toLowerCase();
        if (lowerCaseType.includes('breast')) return 'breast';
        if (lowerCaseType.includes('cervical')) return 'cervical';
        if (lowerCaseType.includes('prostate')) return 'prostate';

        return '';
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.setRiskData();
    }

    /**
     * Hook called when inputs change
     */
    ngOnChanges() {
        this.loading = true;
        this.setRiskData();
    }
}
