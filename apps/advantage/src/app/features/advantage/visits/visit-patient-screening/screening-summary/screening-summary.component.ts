import { Component, OnInit, Input } from '@angular/core';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { UIRouterGlobals } from '@uirouter/angular';
import {
    NbButtonModule,
    NbCardModule,
    NbToastrModule,
    NbToastrService,
} from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../../../@theme/theme.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-screening-summary',
    imports: [
        CommonModule,
        ThemeModule,
        NbButtonModule,
        NbCardModule,
        NbToastrModule,
        NgxSkeletonLoaderModule,
    ],
    templateUrl: './screening-summary.component.html',
    styleUrls: ['./screening-summary.component.scss'],
    providers: [SilStoresService],
})
/**
 * This is the class definition of the component
 */
export class ScreeningSummaryComponent implements OnInit {
    /**
     * The component constructor
     * @param dataLayer Connects to the data layer service
     * @param uiglobals instance of UIRouterGlobals
     * @param errorHandler injects instance of errorhandler service
     * @param toastrService Connects to the toast service
     * @param errorHandler injects instance of errorhandler service
     */
    constructor(
        public dataLayer: SilStoresService,
        public uiglobals: UIRouterGlobals,
        public toastrService: NbToastrService,
        public errorHandler: ErrorHandlerService
    ) {}
    /**
     * The Type of Cancer Screening being done
     */
    @Input() cancerType: string;
    /**
     * Used to specify if the image should be visible
     */
    @Input() showImage?: boolean = true;

    /**
     * The questionnaire ID
     */
    @Input() questionnaireID: string;

    /**
     * The questionnaire responses
     */
    questionnaireResponses: any;

    /**
     * The loading state
     */
    loading: boolean = false;

    /**
     * Method used to display a toast error message
     */
    showToastError(position, status, msg, context) {
        const duration = 7000;
        this.toastrService.show(`${context}`, msg, {
            position,
            status,
            duration,
        });
    }

    /**
     * Function used to get the referral details
     */

    /**
     * Function used to get the questionnaire responses
     */
    fetchQuestionnaireResponses() {
        if (this.questionnaireID) {
            this.loading = true;

            this.dataLayer
                .get('questionnaire-response', this.questionnaireID)
                .subscribe({
                    next: response => {
                        this.questionnaireResponses = response;
                        this.loading = false;
                    },
                    error: error => {
                        this.errorHandler.handleError(error, this);
                        this.loading = false;
                    },
                });
        }
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.fetchQuestionnaireResponses();
    }
}
