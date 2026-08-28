import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { map } from 'rxjs/operators';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { FeedbackFormComponent } from '../../feedback/feedback-form/feedback-form.component';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ErrorHandlerService } from '../../../shared/sil-http-services/error-handler';

@Component({
    selector: 'ngx-advantage-survey-form',
    templateUrl: './advantage-survey-form.component.html',
    styleUrls: ['./advantage-survey-form.component.scss'],
    standalone: false,
})
export class AdvantageSurveyFormComponent
    extends FeedbackFormComponent
    implements OnInit
{
    /** httpClient */
    private httpClient: HttpClient;
    /** form template questions */
    formTemplate: any;
    /** serverUrl */
    serverUrl = environment.onBoardingURL;
    /** visit data */
    visit: any;
    /** error message */
    error: any;
    /** Checks if survey is already submitted */
    submitted: boolean = false;

    /**
     * Constructor for the service
     * @param toastrService
     * @param uiglobals
     * @param $state
     * @param analytics
     * @param dataLayer
     * @param http
     * @param handler
     */
    constructor(
        protected toastrService: NbToastrService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public analytics: AnalyticsService,
        public dataLayer: SilStoresService,
        public http: HttpClient,
        private handler: HttpBackend,
        public errorHandler: ErrorHandlerService
    ) {
        super(toastrService, uiglobals, $state, analytics, dataLayer);
        this.httpClient = new HttpClient(handler);
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        if (this.uiglobals.params.t) {
            this.t = this.uiglobals.params.t;
            this.fetchSurvey();
        }
    }

    /** fetch survey form */
    fetchSurvey() {
        this.loading = true;
        const url = `${this.serverUrl}/api/visits/survey_responses/form`;
        const opts = { t: this.t };
        const params = { params: opts };
        this.httpClient
            .get(url, params)
            .pipe(map(result => result))
            .subscribe({
                next: this.surveyFetched,
                error: this.errorHandlerFxn,
            });
    }

    /** fetch survey form */
    submitSurvey(event) {
        this.logEvent('advantage_customer_submit_survey', {
            hash: this.t,
        });
        const url = `${this.serverUrl}/api/visits/survey_responses/`;
        const obj = {
            response: event,
            visit: this.visit.id,
            organisation: this.visit.organisation_id,
        };
        this.httpClient
            .post(url, obj)
            .pipe(map(result => result))
            .subscribe({
                next: this.surveySubmitted,
                error: this.errorHandlerFxn,
            });
    }

    /** survey is fetched and data is defined */
    surveyFetched = data => {
        if (data.already_filled) {
            this.submitted = data.already_filled;
        } else {
            this.loading = false;
            this.formTemplate = data.template;
            this.visit = data.visit;
        }
    };

    /** survey is submitted */
    surveySubmitted = () => {
        this.showToast('bottom-right', 'success', 'Survey', 'Survey submitted');
        this.$state.go('app.survey.submitted', { t: this.t });
    };

    /** Deals with error */
    errorHandlerFxn = err => {
        this.submitted = false;
        this.error = err.error;
        this.redirectToSubmitted(this.error);
        this.errorHandler.handleError(err, this);
    };

    redirectToSubmitted(err) {
        if (
            err?.visit?.[0] ===
            'survey response with this visit already exists.'
        ) {
            this.$state.go('app.survey.submitted', { t: this.t });
        }
    }
}
