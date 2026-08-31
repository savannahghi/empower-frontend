/**
 * List of imports used in the injectable
 */
import { Injectable, Input } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, Subject } from 'rxjs';
import { ErrorHandlerService } from '../../../sil-http-services/error-handler';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines appointment form controls, methods
 */
export class AppointmentFieldsService {
    /**
     * patient details input resolved from state
     */
    @Input() patientDetails: any;
    /**
     * Observable that loads the patients
     */
    patients$: Observable<any>;
    /**
     * Subject that checks the patient search
     */
    patientsInput$ = new Subject<string>();
    /**
     * Observable that loads the patients
     */
    clinics$: Observable<any>;
    /**
     * Subject that checks the clinic search
     */
    clinicsInput$ = new Subject<string>();
    /**
     * Stores the schedule name for search
     */
    scheduleName: string;
    /**
     * Stores the start date to filter slots
     */
    startDate: string;
    /**
     * Stores the end date to filter slots
     */
    endDate: string;
    /**
     * Used to control loading for search
     */
    loading: boolean = false;
    /**
     * Stores the schedule formly field
     */
    scheduleField: FormlyFieldConfig;
    /**
     * Stores the slot formly field
     */
    slotField: FormlyFieldConfig;
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
    loadingClinics: boolean;
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
                key: 'patient',
                type: 'combobox',
                className: 'col-12',
                props: {
                    store: 'patients',
                    responseKey: 'results',
                    placeholder: 'Search for patient',
                    label: 'Patient Search (search by Name, Phone Number or ID)',
                    bindLabel: [
                        {
                            key: 'person_display',
                            class: 'me-1 mb-1',
                        },
                        {
                            key: 'gender',
                            newline: true,
                            class: 'text-muted',
                        },
                        {
                            key: 'phone_number',
                            label: 'Phone number',
                        },
                    ],
                    bindValue: 'id',
                    options: [],
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: false,
                    minTermLength: 0,
                    clearSearchOnAdd: false,
                    loading: this.loadingPatients,
                    loadingText: 'Searching patients..',
                    typeToSearchText: 'Please enter 3 or more characters',
                    searchable: true,
                    searchWhileComposing: false,
                    hideSelected: true,
                    required: true,
                    virtualScroll: true,
                    objectLabel: 'person',
                },
            },
            {
                key: 'schedule',
                type: 'combobox',
                className: 'col-12 mt-3',
                props: {
                    store: 'schedules',
                    responseKey: 'results',
                    extendParams: {
                        actor: 'PRACTITIONER,HEALTHCARE_SERVICE,FACILITY',
                        fields: 'id,description,specialty,practitioner_data',
                    },
                    clearSearchOnAdd: false,
                    minTermLength: 0,
                    placeholder: 'Select clinic...',
                    label: 'Select a clinic to pick a slot',
                    bindLabel: [
                        {
                            key: 'description',
                            class: 'me-1 mb-1',
                            newline: true,
                        },
                        {
                            key: 'specialty',
                            label: 'Speciality',
                        },
                    ],
                    bindValue: 'id',
                    options: [],
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: false,
                    loading: this.loadingClinics,
                    loadingText: 'Searching clinics...',
                    searchable: true,
                    hideSelected: true,
                    required: true,
                    virtualScroll: true,
                },
                expressions: {
                    'model.schedule': field => {
                        this.model = field.model;
                        if (
                            field.model.schedule &&
                            !field.formControl.pristine
                        ) {
                            this.scheduleName = field.model.schedule;
                            field.formControl.markAsPristine();
                            this.component.getModel(field.model);
                        }
                    },
                },
            },
            {
                key: 'reason',
                type: 'textarea',
                className: 'col-12 display-grid pad-t-12 ',
                props: {
                    label: 'Reason',
                },
                modelOptions: {
                    updateOn: 'blur',
                    debounce: {
                        default: 2000,
                    },
                },
            },
        ];
    }

    /**
     *  setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component) {
        this.component = component;
    }
}
