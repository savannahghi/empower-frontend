/**
 * List of imports used in the injectable
 */
import { Injectable, Input } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ErrorHandlerService } from '../../../sil-http-services/error-handler';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import moment from 'moment';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines appointment form controls, methods
 */
export class checkinFieldService {
    /**
     * patient details input resolved from state
     */
    @Input() patientDetails: any;
    /**
     * Boolean to determine whether to hide the date field or not
     */
    showDate: boolean = false;
    /**
     * determines whether the checkin is for future(greater than today)
     */
    futureCheckIn: boolean = false;
    /**
     * Observable that loads the patients
     */
    patients$: Observable<any>;
    /**
     * Subject that checks the patient search
     */
    patientsInput$ = new Subject<string>();
    /**
     * Check if patient exists in the checkin queue
     */
    patientExists: boolean = false;
    /**
     * Used to control loading for search
     */
    loading: boolean = false;
    /**
     * Stores the search term
     */
    term: string;
    /**
     * Stores instance of the form component
     */
    component: any;
    /**
     * Stores the form model data
     */
    model: Object;
    loadingPatients: any;

    /** current date */
    currentDate: any = moment();
    /**
     * Imports datalayer for service calls
     * and the error handler for http calls
     */
    constructor(
        private dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService
    ) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'visit_date',
                hideExpression: !this.showDate,
                className: 'col-sm-12',
                type: 'datepicker',
                props: {
                    type: 'text',
                    label: 'Appointment Date',
                    dateFormat: 'YYYY-MM-DD',
                    placeholder: 'YYYY-MM-DD',
                    required: true,
                    min: this.futureCheckIn
                        ? this.currentDate.add(1, 'days')
                        : this.currentDate,
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },
            {
                key: 'patient',
                type: 'combobox',
                className: 'col-sm-12',
                hideExpression: this.component.model !== undefined,
                props: {
                    placeholder: 'Search for patient',
                    label: 'Patient Search (search by Name, Phone Number or ID)',
                    store: 'patients',
                    responseKey: 'results',
                    objectLabel: 'person',
                    bindLabel: [
                        {
                            key: 'person_display',
                            class: 'me-1 mb-1',
                        },
                        {
                            key: 'gender',
                            newline: true,
                            class: 'text-muted fs-13px',
                        },
                        {
                            key: 'phone_number',
                            label: 'Phone number',
                            class: 'fs-13px',
                        },
                    ],
                    bindValue: 'id',
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: false,
                    clearSearchOnAdd: false,
                    loadingText: 'Searching patients..',
                    typeToSearchText: 'Please enter 3 or more characters',
                    searchable: true,
                    searchWhileComposing: false,
                    hideSelected: true,
                    required: true,
                    virtualScroll: true,
                },
                asyncValidators: {
                    custom: {
                        expression: control => {
                            /** Setup params to search for the appointment */
                            let date;
                            let appointmentStatus;
                            if (control.parent?.controls?.visit_date?.value) {
                                /** Validate for Future Checkin */
                                date =
                                    control.parent.controls.visit_date.value.format(
                                        'YYYY-MM-DD'
                                    );
                                appointmentStatus = 'PENDING';
                            } else {
                                /** Validate for Checkin */
                                date = moment().format('YYYY-MM-DD');
                                appointmentStatus = 'BOOKED';
                            }
                            const params = {
                                patient: control.value,
                                start: date,
                                fields: 'id',
                                schedule_actor: 'FACILITY',
                                appointment_status: appointmentStatus,
                            };

                            return this.dataLayer
                                .list('appointments', params)
                                .pipe(switchMap(this.switchMapFunction));
                        },
                    },
                },
            },
            {
                key: 'priority',
                type: 'select',
                className: 'col-12',
                defaultValue: 'ROUTINE',
                props: {
                    label: 'Priority while checking in',
                    placeholder: 'Select the priority of the patient',
                    options: [
                        {
                            value: 'ROUTINE',
                            name: 'Routine',
                            helpText: 'Routine service being offered',
                        },
                        {
                            value: 'EMERGENCY',
                            name: 'Emergency',
                            helpText:
                                'Immediate action is required for the patient',
                        },
                        {
                            value: 'ASAP',
                            name: 'ASAP',
                            helpText:
                                'As soon as possible, after emergency check-ins',
                        },
                    ],
                    bindValue: 'value',
                    bindLabel: 'name',
                    required: true,
                    closeOnSelect: true,
                },
            },
            {
                className: 'p-0',
                expressionProperties: {
                    template: () => {
                        if (this.patientExists) {
                            const template = `<div class="text-danger">
                                    <div>
                                        This patient has already been checked in on this date
                                    </div>
                                </div>
                            </div>`;
                            return template;
                        }
                    },
                },
            },
        ];
    }

    /**
     * Return boolean to tell if patient already exists in the check-in schedule
     * @param data
     * @returns
     */
    switchMapFunction = data => {
        const patientExists = data['results'].length < 1;
        this.patientExists = !patientExists;
        return of(patientExists);
    };

    /**
     *  setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
        this.showDate = this.component.secondaryData?.showDate;
        this.futureCheckIn = this.component.secondaryData?.futureCheckIn;
        this.patientExists = false;
    }
}
