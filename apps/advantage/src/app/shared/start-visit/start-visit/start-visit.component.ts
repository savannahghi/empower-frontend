/** Imports used in the component */
import { Component, Input, OnInit } from '@angular/core';
import { PatientService } from '../../../features/advantage/patients/patient.service';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../cookies/cookie.service';
import { VisitTypeCode } from 'app/features/advantage/models';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - styleUrls: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 * - provider: contains the services required by the component
 */
@Component({
    selector: 'start-visit',
    templateUrl: './start-visit.component.html',
    styleUrls: ['./start-visit.component.scss'],
    standalone: false,
})

/**
 * startVisit component class
 * Implements OnInit when intializing the class
 */
export class StartVisitComponent implements OnInit {
    /**
     * Defines Patient data
     */
    @Input() patient: any;

    /**
     * Contains a booked appointment that has been scheduled for a patient
     */
    @Input() selectedAppointment: any;

    /**
     * Allow starting past visit
     */
    @Input() pastVisit: boolean = false;

    /**
     * Boolean used to show the modal
     */
    showModal: boolean = true;

    /**
     * Used to display the loader when data is being fetched
     */
    loading: boolean = false;

    /**
     * Contains selected queue used to start a visit
     */
    selectedQueue: Object;

    /**
     * Contains selected billing class used to start a visit
     */
    selectedBillingClass: any;

    /**
     * Contains selected guarantor id for a credit visit
     */
    selectedGuarantor: object;

    /**
     * Boolean to check if it is a past visit
     */
    isPastVisit: boolean = false;

    /**
     * Contains all queues
     */
    queues: any;

    /**
     * max date validator for date picker
     */
    max: any;

    /**
     * saves the start date of a visit
     */
    startDate: any;

    formConfig: Object;

    /**
     * gets the stored selected language
     */
    selectedLanguage: string = this.cookieService.getLanguageCookie();

    /**
     * Selected Visit Type
     */
    selectedVisitType: VisitTypeCode = 'AMB';
    /**
     * Component constructor
     * @param patientService - Connects to the patient service
     */
    constructor(
        public patientService: PatientService,
        public translate: TranslateService,
        public cookieService: Cookies
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
    }

    /**
     * Saves the selected date on the date input field
     */
    getStartDate(event) {
        // Gets the current time and adds it to the seleted date
        const currentTime = moment().utc().format('HH:mm:ss z');
        const date = moment(event).utc().format('YYYY-MM-DD');
        this.startDate = moment(`${date} ${currentTime}`);
    }

    /**
     * toggles the isPastVisit
     */
    togglePastVisit() {
        this.isPastVisit = !this.isPastVisit;
    }

    /**
     * Start a visit with the patient details
     */
    startVisit(appointment?) {
        this.loading = true;
        this.patientService.startVisit(
            this,
            this.patient,
            appointment,
            this.selectedQueue,
            this.selectedBillingClass,
            this.startDate,
            this.selectedGuarantor,
            null,
            null,
            this.selectedVisitType
        );
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'modelChange',
        };
        this.max = moment();
        this.changeBillingClass('CASH');
    }

    /**
     * Detects changing of visit class
     */
    changeBillingClass(billingClass) {
        this.selectedBillingClass = billingClass;
    }

    /** getFilteredResponse of queues from sil-combo-box*/
    getFilteredResponse(event, item: string) {
        if (item === 'queue') {
            this.selectedQueue = event;
        } else if (item === 'guarantor') {
            const data = event === undefined ? undefined : event.id;
            this.selectedGuarantor = data;
        }
    }
}
