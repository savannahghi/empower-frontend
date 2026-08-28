/**
 * List of imports used in the injectable
 */
import { Injectable } from '@angular/core';
import moment from 'moment';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../sil-http-services/error-handler';
/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})
export class FilterAppointmentsService {
    loading: boolean = false;
    component: any;
    /**
     * Stores the search term
     */
    term: string;

    /**
     * Stores the schedule formly field
     */
    scheduleField: FormlyFieldConfig;

    /**
     * Imports datalayer for service calls
     * and the error handler for http calls
     */
    constructor(
        public dataLayer: SilStoresService,
        private errorHandler: ErrorHandlerService
    ) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields() {
        return [
            {
                key: 'appointment_status',
                type: 'select',
                defaultValue: 'BOOKED',
                className: 'col-12',
                props: {
                    label: 'Status',
                    class: 'margin-t-10',
                    bindLabel: 'title',
                    bindValue: 'value',
                    options: [
                        {
                            title: 'Booked',
                            value: 'BOOKED',
                            helpText:
                                'The appointment is confirmed to go ahead at the date/times specified.',
                        },
                        {
                            title: 'Cancelled',
                            value: 'CANCELLED',
                            helpText: 'The appointment has been cancelled.',
                        },
                        {
                            title: 'Pending',
                            value: 'PENDING',
                            helpText:
                                'The patient has not finalized their acceptance of the appointment.',
                        },
                        {
                            title: 'Proposed',
                            value: 'PROPOSED',
                            helpText:
                                'The patient has not finalized their acceptance and the time is yet to be set.',
                        },
                        {
                            title: 'Fulfilled',
                            value: 'FULFILLED',
                            helpText:
                                'This appointment has completed and may have resulted into a visit.',
                        },
                        {
                            title: 'No Show',
                            value: 'NO_SHOW',
                            helpText:
                                'The patient did not show up for the appointment',
                        },
                        {
                            title: 'Arrived',
                            value: 'ARRIVED',
                            helpText:
                                'The patient has arrived for their appointment.',
                        },
                    ],
                    searchable: false,
                    multiple: false,
                    closeOnSelect: true,
                    required: false,
                },
            },
            {
                type: 'datepicker',
                key: 'start',
                className: 'col-12 mt-5',
                props: {
                    label: 'Select date to filter by',
                    dateFormat: 'YYYY-MM-DD',
                    required: false,
                },
                expressions: {
                    'model.start': field => {
                        if (field.model?.start) {
                            field.model.start = moment(
                                field.model.start
                            ).format('YYYY-MM-DD');
                            return moment(field.model.start);
                        }
                    },
                },
            },
            {
                key: 'schedule',
                type: 'select',
                className: 'col-12 mt-3',
                props: {
                    serverSide: true,
                    placeholder: 'Select clinic',
                    label: 'Select a clinic',
                    bindLabel: ['description'],
                    bindValue: 'id',
                    options: [],
                    dropdownPosition: 'bottom',
                    closeOnSelect: true,
                    multiple: false,
                    searchable: true,
                    hideSelected: true,
                    virtualScroll: true,
                    searchFn: field => this.searchFxn(field),
                },
                modelOptions: {
                    debounce: 1500,
                },
                hooks: {
                    onInit: (field, item) => this.getSchedules(field, item),
                },
            },
        ];
    }

    /**
     *  searchFxn
     * Used to get the schedules setup for the provider
     */
    private searchFxn(term) {
        setTimeout(() => {
            this.term = term;
            this.getSchedules(this.scheduleField, this.term);
        }, 2000);
    }

    /**
     *  getSchedules
     * Calls the data layer to fetch the schedules
     */
    private getSchedules(field?: FormlyFieldConfig, term?) {
        this.loading = true;
        const params = { actor: 'PRACTITIONER' };
        if (term) {
            params['search'] = term;
        }
        this.dataLayer.list('schedules', params).subscribe({
            next: (response: any) => {
                if (field) {
                    this.scheduleField = field;
                    this.component.fields[2].props['options'] =
                        response.results;
                    this.component.cd.detectChanges();
                }
                this.loading = false;
            },
            error: err => {
                this.errorHandler.handleError(err, this.component);
                this.loading = false;
            },
        });
    }

    setComponent(component) {
        this.component = component;
    }
}
