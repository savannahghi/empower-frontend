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
    selector: 'ngx-advantage-summary',
    templateUrl: './advantage-summary.component.html',
    styleUrls: ['./advantage-summary.component.scss'],
    standalone: false,
})
export class AdvantageSummaryComponent
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
    /** Contains the invoice in pdf format */
    invoicePdf: any;
    /** Lets you know if the pdf has been loaded */
    pdfLoaded: boolean = false;
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
            this.fetchSummary();
        }
    }

    /**
     * Toggles the modal
     */
    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
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

    /** fetch summary */
    fetchSummary() {
        this.loading = true;
        const url = `${this.serverUrl}/api/visits/visits/open_invoice`;
        const opts = { t: this.t };
        this.httpClient
            .get(url, { responseType: 'blob', params: opts })
            .pipe(map(result => result))
            .subscribe({
                next: this.summaryFetched,
                error: this.errorHandlerFxn,
            });
    }

    /** fetch survey form */
    submitSurvey(event) {
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
        this.submitted = data.already_filled;
        this.loading = false;
        this.formTemplate = data.template;
        this.visit = data.visit;
    };

    /** survey is fetched and data is defined */
    summaryFetched = data => {
        this.invoicePdf = data;
        this.pdfLoaded = true;
    };

    /** check to see if the survey has been filled */
    downloadPdf() {
        if (!this.submitted) {
            this.toggle['survey'] = true;
        } else {
            this.directDownload();
        }
    }

    /** Directly download the pdf */
    directDownload() {
        this.toggle['survey'] = false;
        this.logEvent('advantage_customer_download_receipt', {
            hash: this.t,
        });
        const file = new Blob([this.invoicePdf], {
            type: 'application/pdf',
        });
        const fileURL = URL.createObjectURL(file);
        // open PDF in a new tab
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = `visit-${this.visit.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    /** survey is submitted */
    surveySubmitted = () => {
        this.directDownload();
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
