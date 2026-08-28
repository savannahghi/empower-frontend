import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
    NbButtonModule,
    NbCardModule,
    NbSpinnerModule,
    NbThemeModule,
    NbToastrService,
} from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { StateService, UIRouterModule } from '@uirouter/angular';
import { UIRouterGlobals } from '@uirouter/angular';
import { AnyObject } from 'chart.js/dist/types/basic';
import { ThemeModule } from '../../@theme/theme.module';
import { Cookies } from '../cookies/cookie.service';
import { SilDatatableModule } from '../sil-datatable/sil-datatable.module';
import { SkikaFormModule } from '../sil-form/sil-form.module';
import { ErrorHandlerService } from '../sil-http-services/error-handler';
import { SkikaLayoutModule } from '../sil-layout/sil-layout.module';
import { NgxTranslateModule } from '../translate/translate.module';
import { DetailComponentService } from './detail.services';
import _ from 'underscore';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CronDisplayPipe } from '../../@theme/pipes';
import moment from 'moment';
import { EditScheduledMessageComponent } from './../../features/advantage/engagement/segment-details/messages/edit-scheduled-message/edit-scheduled-message.component';
interface GoBackStateInterface {
    buttonStatus?: string;
    name?: string;
    display?: string;
}

@Component({
    selector: 'ngx-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
    imports: [
        CommonModule,
        NgxTranslateModule,
        SilDatatableModule,
        NbCardModule,
        NbButtonModule,
        NbThemeModule,
        NbSpinnerModule,
        SkikaLayoutModule,
        SkikaFormModule,
        UIRouterModule,
        ThemeModule,
        CronDisplayPipe,
        NgxSkeletonLoaderModule,
        EditScheduledMessageComponent,
    ],
    providers: [TranslateService, DetailComponentService],
})
export class DetailComponent implements OnInit {
    /**
     * Defines the record
     */
    record: any;

    /**
     * Used to display different toggle modals
     * information
     */
    toggle: Object = {};

    /**
     * Used to display different loading sections
     */
    loading: boolean = false;

    /**
     * Used to display different loading sections
     */
    values: AnyObject;

    /**
     * Used to hide child state tabs
     */
    hideChildStateTabs: boolean = false;

    /**
     * Used to show or hide edit schedule button
     */
    hasEditScheduleAction: boolean = false;
    /**
     * Used to display tabs on the screen
     */
    childStates: any[];

    /**
     * Navigates the user to the said state after
     * the data from the resolver has been loaded
     */
    stateGoAfterResolve: string;

    /**
     * Used to hide the create button from the detail component
     */
    hideCreateButton: Object = {};

    /**
     * Used to display different submit sections
     */
    submitted: Object = {};

    /**
     * Defines the header columns of the table
     */
    tableHeader: Array<any>;

    /**
     * Contains params to add to state
     */
    stateParams: Object = {};

    /**
     * Sets up component for hpt
     */
    hpt: boolean = false;

    /**
     * store component current state
     */
    currentState: any;

    /**
     * determines if state is RecurrentMessagesDetailDeliveryState
     */
    isMsgDetailDeliveryState: boolean = false;

    /**
     * Checks if user is in the edit recurrentdetail message state
     */
    showEditButton: boolean = false;

    /** Used to filter datatable params */
    filterParams: Object;

    /** Used to go back to a parent state */
    goBackState: GoBackStateInterface;

    /**
     * Contains the resource being fetched
     */
    @Input() store: any;

    /**
     * Contains the formly name used to draw up the form
     */
    @Input() formlyJsonFilename: any;

    /**
     * Contains the label of the store e.g. organisation Unit
     */
    @Input() storeLabel: any;

    /**
     * Contains extra params to filter the backend by
     */
    @Input() extraParams: any;

    /**
     * Contains extra params to post in the backend
     */
    @Input() extraPayload: any;

    /**
     * Used for display the search bar
     */
    @Input() hasSearch: any;

    /**
     * Contains the observable resolved from the state service
     */
    @Input() recordDetailObservable: any;

    /**
     * Toggles modal
     */
    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
        this.cdr.detectChanges();
    }

    /**
     * showToast - Used to display a toast using the nebular toast service
     * @param position - defines the toast's position e.g. bottom-right
     * @param status - defines the status being used e.g. success, danger, info
     * @param title - defines what the title of the toast is
     * @param msg - defines what the message in the toast is
     */
    showToast(position, status, title, msg) {
        const duration = 5000;
        this.toastrService.show(`${msg}`, title, {
            position,
            status,
            duration,
        });
    }

    /**
     * Constructor used for list component class
     */
    constructor(
        protected toastrService: NbToastrService,
        private errorHandler: ErrorHandlerService,
        public translate: TranslateService,
        public uiglobals: UIRouterGlobals,
        public state: StateService,
        public cookieService: Cookies,
        public detailService: DetailComponentService,
        private cdr: ChangeDetectorRef
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
    }

    /**
     * Fetches the record details
     */
    waitForRecord() {
        this.recordDetailObservable.subscribe(
            (response: any) => {
                this.record = response;

                this.detailService.setRecordData(response);
                const parms = {};
                for (let index = 0; index < this.childStates.length; index++) {
                    const params = this.childStates[index].params;
                    for (let i = 0; i < params.length; i++) {
                        parms[params[i].key] = this.record[params[i].value];
                    }
                }
                this.stateParams = parms;
                this.loading = false;

                const isMessageRecurrentState =
                    this.uiglobals.current?.name?.includes(
                        'messages.recurrentDetail'
                    );

                this.hasEditScheduleAction =
                    this.uiglobals.current.data['hasEditScheduleAction'] ||
                    isMessageRecurrentState;

                if (this.hasEditScheduleAction) {
                    this.showEditButton = this.canEditSchedule(response);
                }
                const stateNames = _.pluck(this.childStates, 'name');
                if (
                    this.stateGoAfterResolve &&
                    this.uiglobals.current.name !== this.stateGoAfterResolve &&
                    !stateNames.includes(this.uiglobals.current.name)
                ) {
                    const state = _.findWhere(this.childStates, {
                        name: this.stateGoAfterResolve,
                    });
                    this.state.go(state.name, this.stateParams);
                }
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    }

    /**
     * Fetch the selected language */
    selectedLanguage = this.cookieService.getLanguageCookie();

    /** Setup data coming from data */
    setupDataFromState() {
        this.hasSearch = this.uiglobals.current.data['hasSearch'];
        this.tableHeader = this.uiglobals.current.data['tableHeader'];
        this.extraPayload = this.uiglobals.current.data['extraPayload'];
        this.hideChildStateTabs =
            this.uiglobals.current.data['hideChildStateTabs'];
        this.childStates = this.uiglobals.current.data['childStates'];
        this.stateGoAfterResolve =
            this.uiglobals.current.data['stateGoAfterResolve'];
        this.goBackState = this.uiglobals.current.data['goBackState'];
        this.values.mainDisplayValue =
            this.uiglobals.current.data['mainDisplayValue'];
        this.values.mainDisplayArray =
            this.uiglobals.current.data['mainDisplayArray'];
        this.values.mainDisplayNestedValue =
            this.values.mainDisplayValue.includes('.');

        this.values.secondaryDisplayValues =
            this.uiglobals.current.data['secondaryDisplayValues'];

        this.hpt = this.uiglobals.current.data['hpt'];

        if (this.uiglobals.current.data['defaultParams']) {
            const defaultParams = {};
            const params = this.uiglobals.current.data['defaultParams'];
            for (let index = 0; index < params.length; index++) {
                const element = params[index];
                for (const key in element) {
                    if (element[key].param) {
                        defaultParams[key] =
                            this.uiglobals.params[element[key].param];
                    } else {
                        defaultParams[key] = params[index][key];
                    }
                }
            }
            this.filterParams = defaultParams;
            if (this.uiglobals.current.data['stateParamsPayload']) {
                Object.assign(this.extraPayload, defaultParams);
            }
        }
        this.formlyJsonFilename =
            this.uiglobals.current.data['formlyJsonFilename'];
    }

    canEditSchedule(recordData) {
        const now = moment();

        return (
            recordData?.delivery_type === 'SCHEDULED_RECURRENT' ||
            now.isBefore(moment(recordData?.scheduled_at))
        );
    }

    /**
     * edit message
     * @param event segment data
     */
    editMessage = event => {
        const templateId =
            this.uiglobals?.params?.message_template_id ||
            this.uiglobals?.params?.template_id;
        this.detailService.patchMessageSegment(event, templateId).subscribe({
            next: () => {
                this.toggleModal('edit-message');
                this.showToast(
                    'bottom-right',
                    'success',
                    'Template Update',
                    'Message Template updated successfully.'
                );
                /* Reload page to update the template */
                this.state.reload();
            },
            error: err => {
                this.toggleModal('edit-message');
                this.showToast(
                    'bottom-right',
                    'danger',
                    'Template Update',
                    'Message Template failed to update. Please try again'
                );
                this.errorHandler.handleError(err, this);
            },
        });
    };

    /**
     * Edit Schedule
     */
    navigateToEditScheduleState() {
        this.state.go(
            'app.advantage.engagement.segments.detail.messages.recurrentDetail.edit'
        );
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.isMsgDetailDeliveryState =
            this.uiglobals.current?.name?.includes('.deliveries');

        this.values = {};
        this.waitForRecord();
        this.setupDataFromState();
    }

    /**
     * Method used get a nested value
     */
    mineValue(obj, path) {
        if (!path) return obj;
        const properties = path.split('.');
        if (!obj[properties[0]]) {
            return 'Not Set';
        }
        return this.mineValue(obj[properties.shift()], properties.join('.'));
    }
}
