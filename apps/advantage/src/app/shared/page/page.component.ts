import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/core';
import { AnalyticsService } from '../../@core/utils';

@Component({
    selector: 'ngx-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class PageComponent implements OnInit {
    /**
     * Component constructor
     * @param toastrService - Connects to the toast service
     */
    constructor(
        protected toastrService: NbToastrService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public analytics: AnalyticsService
    ) {}

    /**
     * Used to tell when form is loading
     */
    loading: boolean = false;

    /**
     * Used to tell when form has been submitted
     */
    submitted: any;

    /**
     * Used to display different toggle modals
     * information in the table
     */
    toggle: Object = {};

    /**
     * Method used to display a toast
     */
    showToast(position, status, msg, context) {
        const duration = 7000;
        this.toastrService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }

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

    stateGo(state, params?) {
        this.$state.go(state, params);
    }

    /** Log analytics event */
    logEvent(eventName, params?) {
        this.analytics.logEvent(eventName, params);
    }

    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
    }

    ngOnInit() {}
}
