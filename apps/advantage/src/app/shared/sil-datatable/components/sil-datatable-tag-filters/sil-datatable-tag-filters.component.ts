import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import moment from 'moment';

@Component({
    selector: 'sil-datatable-tag-filters',
    templateUrl: './sil-datatable-tag-filters.component.html',
    styleUrl: './sil-datatable-tag-filters.component.scss',
    standalone: false,
})
export class SilDatatableTagFiltersComponent implements OnInit {
    /**
     * Contains title for modal filter modal
     */
    @Input() modalFiltersTitle: string = '';

    /**
     * Contains subtitle for modal filter modal
     */
    @Input() modalFiltersSubTitle: string = '';

    /**
     * Contains list of modal filters
     */
    @Input() modalFilters: Array<any>;

    /**
     * Contains configuration for the tags modal
     */
    @Input() modalFiltersConf?: { [key: string]: any };

    /**
     * Contains configuration for the tags modal
     */
    @Input() multipleFilters?: boolean = false;

    /**
     * Contains configuration for the tags modal
     */
    @Input() filterByTypes?: boolean = false;

    /**
     * Contains configuration for the tags modal
     */
    @Input() filterReconModeByTypes?: boolean = false;

    /**
     * Contains filter button loading state
     */
    @Input() filterButtonLoading?: boolean = false;

    /**
     * Contains filter button text
     */
    @Input() filterButtonText?: string = 'Filter';

    /**
     * Emitted once filter modal action is fired
     */
    @Output() toggleTagsModal = new EventEmitter();

    /**
     * Emitted once a filter selection has been done
     */
    @Output() pickModalFilter = new EventEmitter();

    /**
     * Contains copy of modal filters list
     */
    modalFiltersCopy: Array<{ name: string; value: any; active?: boolean }>;

    /**
     * Selected start date
     */
    dateFrom: moment.MomentInput;

    /**
     * Selected emd date
     */
    dateTo: moment.MomentInput;

    /**
     * Maximum date for filters
     */
    max: moment.Moment;

    deliveryTypes = [
        {
            name: 'ALL',
            value: '',
            active: true,
        },
        {
            name: 'INBOUND',
            value: 'INBOUND',
        },
        {
            name: 'OUTBOUND',
            value: 'OUTBOUND',
        },
    ];

    constructor() {}

    filterAction() {
        const activeElements = this.modalFiltersCopy?.filter(
            filterItem => filterItem.active
        );

        const activeTypes = this.deliveryTypes?.filter(
            filterItem => filterItem.active
        );

        if (this.multipleFilters) {
            this.pickModalFilter.emit(activeElements);
        } else if (this.filterByTypes) {
            const filterParams = {
                ...activeElements[0].value,
                delivery_type: activeTypes[0].value,
            };
            this.pickModalFilter.emit(filterParams);
        } else {
            this.pickModalFilter.emit(activeElements[0]);
        }
    }

    emitToggleTagsModal() {
        this.toggleTagsModal.emit();
    }

    onFilterSelect(item: string, type?: string) {
        /**
         * Iterate through the list of modal filters and
         * set active the item selected and subsequently set to inactive all other items
         */
        if (type !== 'delivery_type') {
            this.modalFiltersCopy?.forEach(filterItem => {
                if (filterItem.name === item) {
                    filterItem.active = true;
                } else {
                    filterItem.active = false;
                }
            });
        } else if (type === 'delivery_type') {
            this.deliveryTypes?.forEach(filterItem => {
                if (filterItem.name === item) {
                    filterItem.active = true;
                } else {
                    filterItem.active = false;
                }
            });
        }
    }

    /**
     * Return custom date
     */
    getCustomDateField() {
        const customDate = this.modalFiltersCopy?.find(
            item => item.name === 'Custom'
        );

        return customDate;
    }

    /**
     * Confirms that the user has picked from the tags
     */
    determineWhetherToShow(name?: string) {
        const customDate = this.getCustomDateField();

        if (name === 'Custom') {
            return !!customDate?.active;
        }
        if (!!customDate?.active) {
            /**
             * If there is no end date or no start date for the filter
             */
            const isDurationPicked = !this.dateFrom || !this.dateTo;
            return !isDurationPicked;
        }
        return !!this.modalFiltersCopy?.find(item => item.active);
    }

    /**
     * selected calendar date
     * @param event
     * @param context
     */
    handleScheduledDateChange(event: any, context: 'start_date' | 'end_date') {
        const dateEvent = moment(event).format('YYYY-MM-DD');
        const customDate = this.modalFiltersCopy.find(
            item => item.name === 'Custom'
        );

        switch (context) {
            case 'start_date':
                this.dateFrom = dateEvent;
                customDate['value']['date_from'] = this.dateFrom;

                break;
            case 'end_date':
                this.dateTo = dateEvent;
                customDate['value']['date_to'] = this.dateTo;

                break;
            default:
                break;
        }
    }

    ngOnInit(): void {
        this.modalFiltersCopy = this.modalFilters;
        this.max = moment();
    }
}
