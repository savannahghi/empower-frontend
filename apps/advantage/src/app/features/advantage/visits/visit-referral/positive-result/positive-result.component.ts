import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    NbButtonModule,
    NbCardModule,
    NbSpinnerModule,
    NbToastrModule,
    NbToastrService,
} from '@nebular/theme';
import moment from 'moment';
import _ from 'underscore';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../../../@theme/theme.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SkikaFormModule } from '../../../../../shared/sil-form/sil-form.module';
import { ReferralFormComponent } from '../../visit-patient-screening/referral-form/referral-form.component';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';

interface EventData {
    servicerequestId: string;
    referralType: string;
}
/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-positive-result',
    imports: [
        CommonModule,
        ThemeModule,
        NbButtonModule,
        NbSpinnerModule,
        NbToastrModule,
        SkikaFormModule,
        NgxSkeletonLoaderModule,
        NbCardModule,
        ReferralFormComponent,
    ],
    templateUrl: './positive-result.component.html',
    styleUrls: ['./positive-result.component.scss'],
})
/**
 * This is the class definition of the component
 */
export class PositiveResultComponent implements OnInit {
    /**
     * The component constructor
     * @param toastService Connects to the toast service
     * @param errorHandler injects instance of errorhandler service
     */
    constructor(
        protected toastService: NbToastrService,
        private errorHandler: ErrorHandlerService,
        public dataLayer: SilStoresService
    ) {}
    /**
     * Test result
     */
    @Input() testResult: string = '';
    /**
     * Encounter ID
     */
    @Input() encounterID: string;

    /**
     * Stores the minimum date
     */
    minDate: Object = moment();
    /**
     * Used to override default form configurations
     */
    formConfig: any;
    /**
     * Type of referral
     */
    referralType: string;
    /**
     * emitted when referral response is successfully received
     */
    @Output() emitReferralData = new EventEmitter<EventData>();

    /**
     * The Type of Cancer Screening being done
     */
    @Input() cancerType: string;

    /**
     * Has the current date from the calendar filter
     */
    date: Object;
    /**
     * Defines loading state
     */
    loading: boolean;
    /**
     * Patient's return date after referral
     */
    returnDate: string;
    /**
     * Text and colors that are rendered based on the screening results
     */
    pageText: any = {
        cervical: {
            text: 'The test results are ',
            label: 'positive',
            text1: ', indicating the need for further evaluation and treatment. The next steps would be to:',
            action1: 'Educate the patient on what these test results mean',
            action2: 'Refer the patient for further evaluation and treatment',
        },
        breast: {
            text: 'The test results are ',
            label: 'abnormal',
            text1: ', indicating the need for further evaluation and treatment. The next steps would be to:',
            action1: 'Educate the patient on what these test results mean',
            action2:
                'Advise them to return for routine screening at the facility',
        },
    };
    /**
     * holds the form data
     */
    formData: any;
    /**
     * Action chosen as a follow up
     * Can be additional_test, specialist_referral or treatment_referral
     */
    followUpStep: any;
    /**
     * Specifies if the component is in a drawer component
     */
    @Input() isChild?: boolean;
    /**
     * Time used to show a toast
     */
    toastTime = 7000;
    /**
     * servicerequest id used to fetch referral form
     */
    servicerequestId: string;
    /**
     * template reference variable for start date time picker
     */
    returnDatePicker: Date;
    /**
     * emitted when a custom function action button is clicked
     */
    @Output() customFxn = new EventEmitter<string>();
    /**
     * Function to cancel clear the send sms details
     * and navigate user back to a base state
     */
    cancelFxn() {
        this.customFxn.emit();
    }
    /**
     * Function to navigate back to the report
     */
    returnBack() {
        if (this.isChild) {
            this.cancelFxn();
            return;
        }
        window.history.back();
        return;
    }
    /**
     * Method used to display a toast
     */
    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastService.show(`${context} successfully`, msg, {
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
        this.toastService.show(`${context}`, msg, {
            position,
            status,
            duration,
        });
    }
    /**
     * Function used to fetch form data on change
     * @param model form data model
     */
    getModelData(model) {
        model.referral_note = model.referral_note;
        this.formData = model;
        this.followUpStep = model.referral_type;
    }
    /**
     * @param event on date change event
     * Sends the day selected from the calender to the payload for filtering appointments
     */
    handleDateChange(event) {
        this.returnDate = moment(event).format('YYYY-MM-DD');
    }
    /**
     * Gets the facility's contact information
     * @param contacts the facility's contacts
     * @param type the type of contact
     * @returns the value of the contact found
     */
    findContactByType(contacts, type) {
        const contactObj = _.find(contacts, function (contact) {
            return (
                contact?.contact_type?.toLowerCase().replace(/ /g, '_') === type
            );
        });
        return contactObj?.contact_value;
    }

    /**
     * Function used to handle form submission
     */
    recordResults() {
        this.loading = true;
        const selectedOptions = { ...this.formData };

        this.referralType = selectedOptions.referral_type;

        const commonData = {
            encounterID: this.encounterID,
            usageContext: `${this.cancerType.toUpperCase()}_CANCER_SCREENING`,
            notes:
                selectedOptions?.referral_note ??
                'Patient test followup referral',
        };

        let referralChoice: any = {
            facility: {
                fhirOrganisationID: selectedOptions?.facility?.tenant_id,
                name: selectedOptions?.facility?.organisation_name,
                county: 'NAKURU',
                contact: this.findContactByType(
                    selectedOptions?.facility?.contacts,
                    'phone_number'
                ),
            },
        };

        switch (selectedOptions.referral_type) {
            case 'treatment_referral':
                referralChoice = {
                    ...referralChoice,
                    referralType: 'TREATMENT',
                    tests: [selectedOptions?.selected_test],
                };
                break;

            case 'specialist_referral':
                referralChoice = {
                    ...referralChoice,
                    referralType: 'SPECIALIST',
                    specialist: selectedOptions?.specialist,
                };
                break;

            default:
                break;
        }

        const followUpData = Object.assign({
            ...commonData,
            ...referralChoice,
        });

        this.dataLayer.create('refer-patient', followUpData).subscribe({
            next: (response: any) => {
                this.showToast(
                    'bottom-right',
                    'success',
                    'Successful',
                    `Referral created`
                );
                this.servicerequestId = response?.id;
                this.emitReferralData.emit({
                    servicerequestId: this.servicerequestId,
                    referralType: this.referralType,
                });
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.showToastError(
                    'bottom-right',
                    'danger',
                    'Failed',
                    'Sorry, an error occured creating the Referral. Please try again.'
                );
            },
        });

        return;
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
    }
}
