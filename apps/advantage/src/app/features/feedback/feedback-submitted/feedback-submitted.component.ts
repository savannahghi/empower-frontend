import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/core';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { PageComponent } from '../../../shared/page/page.component';

@Component({
    selector: 'sil-feedback-submitted',
    templateUrl: './feedback-submitted.component.html',
    styleUrls: ['./feedback-submitted.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class FeedbackSubmittedComponent
    extends PageComponent
    implements OnInit
{
    /**
     * Constructor for the class component
     * @param dataLayer - Connects to the StoreService
     */

    /**
     * stores encounter guid information
     * */
    hash: any;

    /**
     * stores token
     * */
    t: any;

    /**
     * stores token
     * */
    designatedParam: any;

    constructor(
        protected toastrService: NbToastrService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public analytics: AnalyticsService
    ) {
        super(toastrService, uiglobals, $state, analytics);
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.checkIfHashExists();
        if (this.hash) {
            this.logEvent('member_survey_submitted_page', {
                encounter_guid: this.hash,
            });
        } else if (this.t) {
            this.logEvent('advantage_survey_submitted_page', {
                token: this.t,
            });
        }
    }

    /** checks for hash */
    checkIfHashExists() {
        this.hash = this.uiglobals.params.hash;
        this.t = this.uiglobals.params.t;

        this.designatedParam = this.hash ? this.hash : this.t;
    }
}
