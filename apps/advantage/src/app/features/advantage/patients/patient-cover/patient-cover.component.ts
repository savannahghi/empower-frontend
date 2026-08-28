/** Imports used in the component */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PatientService } from '../patient.service';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { PatientModel, SchemeModel, CustomerModel } from '../../models';
import { StateService } from '@uirouter/angular';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - styleUrls: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 * - provider: contains the services required by the component
 */
@Component({
    selector: 'patient-cover',
    templateUrl: './patient-cover.component.html',
    styleUrls: ['./patient-cover.component.scss'],
    standalone: false,
})

/**
 * startVisit component class
 * Implements OnInit when intializing the class
 */
export class PatientCoverComponent implements OnInit {
    /**
     * Defines Patient data
     */
    @Input() patient: PatientModel;
    /**
     * Contains model information for the form
     */
    @Input() model: Object;

    /**
     * Refresh state after adding cover
     */
    @Input() refreshAfterAddingCover: boolean;

    /**
     * Defines toggleFunction to be passed to the parent component
     */
    @Output() toggleFunction = new EventEmitter();

    /**
     * max date validator for patient cover start date
     */
    startDateMax: moment.Moment;

    /**
     * min date validator for patient cover end date
     */
    endDateMin: moment.Moment;

    /**
     * saves the start date for patient cover
     */
    validFrom: string | null = null;

    /**
     * saves the end date for patient cover
     */
    validTo: string | null = null;

    /**
     * template reference variable for start date time picker
     */
    startDateTimePicker: Date;

    /**
     * template reference variable for end date time picker
     */
    endDateTimePicker: Date;

    /**
     * Used to display the loader for the addPatientCover request
     */
    loading: boolean = false;

    /**
     * Contains the user entered member number
     */
    memberNumber: string = '';

    /** Contains the window object */
    window: any;

    /**
     * gets the stored selected language
     */
    selectedLanguage: string = this.cookieService.getLanguageCookie();

    /**
     * sets the selected scheme
     */
    selectedScheme: SchemeModel;

    /**
     * sets the selected scheme
     */
    selectedCustomer: CustomerModel;

    /**
     * Component constructor
     * @param patientService - Connects to the patient service
     */
    constructor(
        public patientService: PatientService,
        public translate: TranslateService,
        public cookieService: Cookies,
        public state: StateService
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
        this.window = window;
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.startDateMax = moment();
        if (this.model) {
            this.selectedCustomer = this.model['guarantor'];
        }
    }

    /**
     * Saves the selected valid from date on the date input field
     */
    getValidFromDate(event) {
        // Gets the seleted date and set's it to the expected format
        const date = moment(event).utc().format('YYYY-MM-DD');
        this.validFrom = date;
        this.validTo = moment(event).add(1, 'y').utc().format('YYYY-MM-DD');
        this.endDateMin = this.startDateMax;
    }

    /**
     * Saves the selected valid to date on the date input field
     */
    getValidToDate(event) {
        // Gets the seleted date and set's it to the expected format
        const date = moment(event).utc().format('YYYY-MM-DD');
        this.validTo = date;
    }

    createPatientCover() {
        this.loading = true;
        this.patientService
            .addPatientCover(
                this,
                this.selectedScheme,
                this.memberNumber,
                this.patient,
                this.validFrom,
                this.validTo
            )
            .subscribe({
                next: () => {
                    this.callToggleFunction();
                    if (this.refreshAfterAddingCover) {
                        this.state.reload();
                    }
                    this.loading = false;
                },
            });
    }

    /** getFilteredResponse of queues from sil-combo-box*/
    getFilteredResponse(event, item: string) {
        if (item === 'scheme') {
            this.selectedScheme = event;
        }
        if (item === 'customer') {
            this.selectedCustomer = event.id;
        }
    }

    /** Opens a new tab that allows you to add a scheme to a payer */
    navigateToSchemePage() {
        const url = `/advantage/accounting/customers/view/${this.selectedCustomer}/schemes`;
        this.window.open(url, '_blank');
    }

    /** Call the toggle function received from the parent component */
    callToggleFunction() {
        this.toggleFunction.emit();
    }
}
