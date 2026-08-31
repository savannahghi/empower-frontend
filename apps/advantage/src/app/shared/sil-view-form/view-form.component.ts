import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NbCardModule, NbToastrService, NbButtonModule } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { ErrorHandlerService } from '../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../shared/sil-http-services/sil_datalayer.service';
import { SkikaFormModule } from '../sil-form/sil-form.module';
import moment from 'moment';

@Component({
    selector: 'ngx-view-form',
    templateUrl: './view-form.component.html',
    styleUrls: ['./view-form.component.scss'],
    imports: [NbCardModule, NbButtonModule, SkikaFormModule, CommonModule],
})
export class ViewFormComponent implements OnInit {
    constructor(
        protected dataLayer: SilStoresService,
        protected errorHandler: ErrorHandlerService,
        protected toastrService: NbToastrService,
        public uiglobals: UIRouterGlobals,
        public state: StateService
    ) {}
    /** contains the field by which the form is fetched */
    formId: string;
    /** contains the field by which the form is patched */
    patchId: string;
    /** Contains the fields to the form */
    formFields: string;
    /** Used to display the record in a toast */
    recordDisplay: string;
    /** Used to set a state to go back to */
    goBackState: string;
    /** Contains the store to fetch the information  */
    formStore: string;
    /** Contains the data on the form */
    data: any;
    /** Tells form that api has been called  */
    loading: boolean;
    /** Tells if the data has been fetched  */
    dataFetched: boolean;
    /** Contains page title */
    pageTitle: string;
    /** Contains page sub-title */
    pageSubTitle: string;
    /**
     * Used to tell if the list is a tabbed view
     */
    isTabList: boolean;

    /**
     * Used to tell if the formly is a service
     */
    isService: boolean = false;
    /**
     * Contains the observable resolved from the state service
     */
    @Input() recordObservable: any;
    /**
     * Defines the record
     */
    record: any;

    ngOnInit() {
        /**
         * This defines thid used to fetch the form
         */
        this.formId =
            this.uiglobals.params[this.uiglobals.current.data['formRecordId']];
        /**
         * This defines thid used to fetch the form
         */
        this.patchId = this.uiglobals.current.data['patchId'];
        /**
         * This defines the fields that make up the form
         */
        this.formFields = this.uiglobals.current.data['formFields'];
        /**
         * This defines the store to fetch from
         */
        this.formStore = this.uiglobals.current.data['formStore'];
        /**
         * This defines the field displayed in the toast when updating the record
         */
        this.recordDisplay = this.uiglobals.current.data['recordDisplay'];
        /**
         * This defines the state to back to when navigated to the view form component
         */
        this.goBackState = this.uiglobals.current.data['goBackState'];
        /**
         * This defines the page title and sizing is affected by isTabList boolean
         */
        this.pageTitle = this.uiglobals.current.data['pageTitle'];
        /**
         * This defines the page sub title and sizing is affected by isTabList boolean
         */
        this.pageSubTitle = this.uiglobals.current.data['pageSubTitle'];

        this.isService = this.uiglobals.current.data['isService'];
        this.fetchRecord(this.formId);
    }

    /** Fetch record */
    fetchRecord(id) {
        if (id) {
            this.dataLayer.get(this.formStore, id).subscribe({
                next: this.fetchedRecord,
                error: this.errorFetchRecord,
            });
        } else {
            this.dataFetched = true;
        }
    }

    /** Fetched record */
    fetchedRecord = data => {
        this.data = data;
        this.dataFetched = true;
    };

    /** Save details*/
    saveDetails(data) {
        this.loading = true;

        // Handling date formats
        const formatDate = date => moment(date).format('YYYY-MM-DD');

        for (const key in data) {
            if (moment(data[key], moment.ISO_8601, true).isValid()) {
                data[key] = formatDate(data[key]);
            }
        }
        //  For patching existing record
        if (this.formId) {
            this.dataLayer
                .update(this.formStore, this.data[this.patchId], data)
                .subscribe({
                    next: this.savedData,
                    error: this.errorFetchRecord,
                });
        } else {
            //  For creating a new record
            this.dataLayer.create(this.formStore, data).subscribe({
                next: this.savedData,
                error: this.errorFetchRecord,
            });
        }
    }

    /** Saved data */
    savedData = () => {
        this.loading = false;
        //  When creating a record
        if (!this.formId) {
            this.showToast(
                'bottom-right',
                'success',
                `Updated ${this.recordDisplay}`,
                `${this.recordDisplay}'s details have been created`
            );
            this.goBack();
        } else {
            // When updating a record
            this.showToast(
                'bottom-right',
                'success',
                `Updated ${this.recordDisplay}`,
                `${this.recordDisplay}'s details have been updated`
            );
        }
    };

    /** Go Back */
    goBack() {
        this.state.go(this.goBackState, {}, { reload: true });
    }

    /** Error when fetching record */
    errorFetchRecord = err => {
        this.loading = false;
        this.errorHandler.handleError(err, this);
    };

    /** Show Toast */
    showToast(position, status, title, msg) {
        const duration = 7000;
        this.toastrService.show(msg, title, {
            position,
            status,
            duration,
        });
    }
}
