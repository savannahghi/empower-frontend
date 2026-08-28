/**
 * Imports used in the component
 */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import _ from 'underscore';
import { UIRouterGlobals } from '@uirouter/core';

/**
 * Definition of the component including
 * the template, styleUrl and selector
 */
@Component({
    selector: 'sil-datatable-filters',
    templateUrl: './sil-datatable-filters.component.html',
    styleUrls: ['./sil-datatable-filters.component.scss'],
    standalone: false,
})

/**
 * Definition of the component's class and the lifecycle hooks it uses: OnInit and OnChanges
 */
export class SilDatatableFiltersComponent implements OnInit {
    /**
     * Constructor for the settings class component
     * @param UIRouterGlobals injects instance of uiglobal service
     */
    constructor(public uiglobals: UIRouterGlobals) {}
    /**
     * @Output queryFilterArg
     *
     * Event emitted when a filter is selected.
     * The event emits object data that is received by the parent datatable component.
     *
     * E.g.
     * { from_date: moment().toISOString()},
     * from_date will be sent to the backend api with a date ISOString
     */
    @Output() queryFilterArg = new EventEmitter();

    /**
     * @Input statusFilter
     *
     * Array used to defined the filters used in the component
     *
     * E.g.
     *  [
     *
     *      {
     *
     *           display: 'ALL',
     *
     *           filter: {},
     *
     *           active: true,
     *
     *       },
     *
     *       {
     *
     *           display: 'UPCOMING APPOINTMENTS',
     *
     *           filter: { from_date: moment().toISOString()},
     *
     *       }
     *
     *   ]
     *
     *  Each object in the array has the following:
     *
     *  display: String used to show what is displayed to the user in text
     *
     *  filter: Object used to send filtering data to the backend api
     *
     *  active: Boolean used to show which filter button is active
     */
    @Input() statusFilter: Array<any>;

    /**
     * @method
     * setActive
     * Used to set the active filter by finding the filter that matches the display given.
     * It also disables the current active filter from statusFilter Array.
     * @param key
     * Used to indicate which filter to set as active. The key maps to the `display` key
     * in the status object given to setStatus
     *
     * E.g. setActive('ALL');
     *
     * if the key given is 'ALL', it will look for the statusFilter object that
     * has display set as 'ALL' as the value.
     */
    setActive(key: string) {
        const currInd = _.indexOf(
            this.statusFilter,
            _.findWhere(this.statusFilter, { active: true })
        );
        if (currInd >= 0) {
            this.statusFilter[currInd].active = false;
        }
        const nxtInd = _.indexOf(
            this.statusFilter,
            _.findWhere(this.statusFilter, { display: key })
        );
        if (nxtInd >= 0) {
            this.statusFilter[nxtInd].active = true;
        }
    }

    /**
     * clickSetStatus
     * Used by the template to set the current status of the filter by calling the setActive method
     * and also sets the current page to page 1.
     * It emits the filter object back to the parent datatable component.
     *
     * @param status
     * Used to propagate the `filter` key used in the queryFilterArg event emitter.
     * Used to indicate which filter object to set as active.
     *
     * Used to indicate the `display` key in the status object supplied for the setActive method.
     * E.g. setStatus({ display: 'ALL', filter: '{ from_date: moment().toISOString()}'})
     *
     * If the example above is used, then the display will set 'ALL' as the active display.
     * It will also send `from_date: moment().toISOString()}'` to the datatable for filtering
     */
    clickSetStatus(status: object) {
        this.queryFilterArg.emit({ ...status['filter'], page: '1' });
        this.setActive(status['display']);
    }

    /**
     * setStatus
     * Used to set the current status of the filter by calling the setActive method.
     * It emits the filter object back to the parent datatable component.
     *
     * @param status
     * Used to propagate the `filter` key used in the queryFilterArg event emitter.
     * Used to indicate which filter object to set as active.
     *
     * Used to indicate the `display` key in the status object supplied for the setActive method.
     * E.g. setStatus({ display: 'ALL', filter: '{ from_date: moment().toISOString()}'})
     *
     * If the example above is used, then the display will set 'ALL' as the active display.
     * It will also send `from_date: moment().toISOString()}'` to the datatable for filtering
     */
    setStatus(status: object) {
        this.queryFilterArg.emit(status['filter']);
        this.setActive(status['display']);
    }

    /**
     * OnInit lifecycle hooks that setups the component and fetches the data
     * when the component initially loads
     */
    ngOnInit() {
        this.setActiveFilter();
    }

    /**
     * setActiveFilter determines what filter is active so as to set the class
     */
    setActiveFilter() {
        const stateparams = _.omit(this.uiglobals.params, '#');
        const activeParams = JSON.parse(JSON.stringify(stateparams));
        const item = _.find(this.statusFilter, function (filt) {
            return _.isMatch(activeParams, filt.filter);
        });
        if (!_.isUndefined(item)) {
            this.setActive(item['display']);
        } else {
            const filter = _.find(this.statusFilter, function (filt) {
                return filt.filter.status === 'clear';
            });
            if (filter) {
                this.setActive(filter.display);
            }
        }
    }
}
