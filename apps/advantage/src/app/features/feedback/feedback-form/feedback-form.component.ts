/** Imports used in the component */
import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { AnalyticsService } from '../../../@core/utils';
import { PageComponent } from '../../../shared/page/page.component';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - styleUrls: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 * - provider: contains the services required by the component
 */
@Component({
    selector: 'feedback-form',
    styleUrls: ['./feedback-form.component.scss'],
    templateUrl: './feedback-form.component.html',
    providers: [],
    standalone: false,
})

/**
 * FeedbackFormComponent component class
 * Implements OnInit when intializing the class
 */
export class FeedbackFormComponent extends PageComponent implements OnInit {
    /**
     * stores encounter guid information
     * */
    hash: any;
    /** Set the payer for edi surveys */
    payer: any;
    /**
     * stores encounter guid information
     * */
    t: any;
    /**
     * Used to store survey form data
     */
    surveyData: any;
    /**
     * Used to store survey form data
     */
    boundedQuestions: any = [
        'duration_medical_services',
        'rate_medical_services',
        'rate_medical_staff',
        'rate_wellness_card',
        'recommend_wellness_card',
    ];
    /**
     * Used to store survey form data
     */
    boundlessQuestions: any = ['recommendation'];

    /** Map each of the questions */
    questionMap = {
        duration_medical_services:
            'How would you rate the duration it took you to get served during the visit?',
        rate_medical_services:
            'Based on your experience, how would you rate the access to medical services at this facility?',
        rate_medical_staff:
            'How would you rate the staff that handled you during the visit?',
        rate_wellness_card:
            'How would you rate the quality of service using your insurance card?',
        recommend_wellness_card:
            'How likely would you recommend insurance cards to family and friends on a scale?',
        recommendation:
            'From your experience please suggest any area of improvement that we need to work on?',
    };

    /**
     * Constructor for the class component
     * @param dataLayer - Connects to the StoreService
     */
    constructor(
        protected toastrService: NbToastrService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public analytics: AnalyticsService,
        public dataLayer: SilStoresService
    ) {
        super(toastrService, uiglobals, $state, analytics);
    }

    submitSurvey(formData) {
        this.surveyData = formData;

        this.formatQuestions(this.boundedQuestions, 'bounded');
        this.formatQuestions(this.boundlessQuestions, 'boundless');
        const obj = {
            data: this.surveyData,
            hash: this.hash,
            intention: 'PROVIDER',
        };

        this.logEvent('member_survey_submit', {
            hash: this.hash,
            survey_data: JSON.stringify(this.surveyData),
        });

        this.dataLayer
            .create('edi-surveys', obj)
            .subscribe({ next: this.submittedSurvey });
        this.submittedSurvey();
    }

    formatQuestions(questions, format) {
        for (let index = 0; index < questions.length; index++) {
            if (this.surveyData[questions[index]] && format === 'bounded') {
                this.surveyData[questions[index]]['lower_bound'] = '1';
                this.surveyData[questions[index]]['upper_bound'] = '5';
            } else {
                // boundless questions are not always defined
                this.surveyData[questions[index]] = this.surveyData[
                    questions[index]
                ]
                    ? this.surveyData[questions[index]]
                    : {};
                this.surveyData[questions[index]]['lower_bound'] = '0';
                this.surveyData[questions[index]]['upper_bound'] = '0';
            }
            this.surveyData[questions[index]]['question'] =
                this.questionMap[index];
        }
    }

    submittedSurvey = () => {
        const msg = 'Survey submitted';
        this.showToast(
            'bottom-right',
            'success',
            msg,
            'Survey has been submitted'
        );
        this.loading = false;
        this.stateGo('app.feedback.submitted', {
            hash: this.hash,
        });
    };

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.checkifHashIsDefined();
        if (this.hash) {
            this.logEvent('member_survey_form_page', {
                hash: this.hash,
            });
        } else {
            this.logEvent('member_survey_form_page', {
                hash: 'null',
            });
        }
        this.changeThemeBasedOnPayer();
    }

    /** checks for encounter guid */
    checkifHashIsDefined() {
        this.hash = this.uiglobals.params.hash;
        this.t = this.uiglobals.params.t;
    }

    /**
     * Change theme of survey based on insurance
     * When using edi survey
     */
    changeThemeBasedOnPayer() {
        if (this.$state.includes('app.feedback')) {
            this.payer = this.uiglobals.params.payer;
        }
    }
}
