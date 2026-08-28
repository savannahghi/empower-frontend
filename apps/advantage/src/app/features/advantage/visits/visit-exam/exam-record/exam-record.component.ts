import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../../shared/cookies/cookie.service';
import { VisitService } from '../../visit.service';
import { VisitExamService } from '../visit-exam.service';
import moment from 'moment';
/**
 * Component that is used to create a dynamic Exam Record
 *
 * - selector: used to define how to use the component in a template
 * - standalone: boolean indicating that the component is a standalone component
 * - imports: Modules and components used in the component
 * - templateUrl: contains the html structure of the component
 * - styleUrl: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-exam-record',
    templateUrl: './exam-record.component.html',
    styleUrl: './exam-record.component.scss',
    standalone: false,
})
/**
 * Class that creates the Exam Record component
 */
export class ExamRecordComponent implements OnInit {
    /**
     * The component constructor
     * @param translate Access an Instance of the Translate service
     * @param cookieService Access an Instance of the Cookie service
     * @param visitService Access an Instance of the Visit Service
     * @param visitExamService Access an instance of the Visit Exam Service
     */
    constructor(
        public translate: TranslateService,
        public cookieService: Cookies,
        public visitService: VisitService,
        public visitExamService: VisitExamService
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
    }
    /**
     * Contains patient information
     */
    @Input() patient: any;
    /** stores visit details */
    @Input() visit: any;
    isAddVital: boolean = false;

    /** stores patient's visit date */
    visitDate: any;

    /**
     * Saves the selected language from the cookie
     */
    selectedLanguage = this.cookieService.getLanguageCookie();
    /**
     * Contains the index of the current step
     */
    @Input() currentStep?: any = 0;
    /**
     * Used to specify if the stepper buttons should be hidden
     */
    @Input() hideStepperActions?: boolean = false;
    /**
     * Indicates that patient details are being loaded
     */
    loadingPatientDetails: boolean = false;
    /**
     * active modal id
     */
    toggleId: any;
    /**
     * Used to display different toggle modals
     * information in the table
     */
    toggle: Object = {};

    /**
     * stores the patient's visit status
     */
    patientVisitStatus: any;
    /** checks if clinical ids are save to localstorage */
    isClinicalIdsSaved: any = {};

    /**
     * Emitter that emits event used to trigger function that moves to stepper's next step
     */
    @Output() nextStepRequested?: EventEmitter<void> = new EventEmitter();

    /**
     * Emitter that emits event used to trigger function that moves to stepper's previous step
     */
    @Output() previousStepRequested?: EventEmitter<void> = new EventEmitter();

    /**
     * Used to toggle service point modal
     */
    showServicePointModal: boolean = false;

    /** Contains the number of steps */
    @Input() stepsLength?: number = 0;

    /** patients vitals */
    patientVitals: any[] = this.visitExamService.patientVitals;
    /**
     * Custom settings to determine what records to display
     */
    @Input() templateSettings = [];
    /** is visit date passed, don't save any notes */
    isVisitDatePassed: Boolean = false;
    /** stores the active service request */
    activeServiceRequest: any;
    /**
     * Toogle function to display or hide clinical components notes
     */
    toggleIsHidden(sectionId) {
        this.visitExamService.toggleSection(sectionId, this);
    }

    /**
     * @param event
     */
    toggleServicePointModal() {
        this.showServicePointModal = !this.showServicePointModal;
    }

    /** */
    /** toggle payment modal */
    toggleModal(context) {
        this.toggleId = context;
        this.toggle[context] = !this.toggle[context];
    }

    /**
     * Onclick function used to trigger previousStep emitter
     */
    requestPreviousStep() {
        this.previousStepRequested.emit();
    }

    /**
     * Onclick function used to trigger previousStep emitter
     */
    requestNextStep() {
        this.nextStepRequested.emit();
    }

    /** clinical notes template settings */
    finalExamTemplateSettings: any[] = [];

    // get visit details, contains patient details
    getVisitInfo() {
        /** Resolved observable from the state */
        /** get patient visit status */
        this.patientVisitStatus = this.visit.status;
        this.visitDate = moment(this.visit?.start).format('YYYY-MM-DD');
        this.isVisitDatePassed =
            moment(Date.now()).format('YYYY-MM-DD') > this.visitDate;
        const serviceRequestsArr = this.visit?.service_requests;
        /** get the most recent service request the patient is in */
        this.activeServiceRequest = serviceRequestsArr[0];
    }

    /**
     * Component lifecycle used after the component is initialized
     */
    ngOnInit() {
        this.finalExamTemplateSettings = this.templateSettings.filter(
            note => note.selected === true
        );
        this.isClinicalIdsSaved = JSON.parse(
            localStorage.getItem('auth.config.clinicalIds')
        );
        this.getVisitInfo();
    }
}
