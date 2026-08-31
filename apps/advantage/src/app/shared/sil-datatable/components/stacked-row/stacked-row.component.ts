/**
 * Imports used in the component
 */
import { Component, Input, OnInit } from '@angular/core';
import { UIRouterGlobals } from '@uirouter/angular';

/**
 * This component is used in for loops to format data that comes from an API.
 * It has access to item which is repeated within the component template
 * and is given configurations, confs, as a prop
 *
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - styleUrls: contains the scss file used to style the component
 * - template: contains the html structure of the component
 */

@Component({
    selector: 'stacked-row',
    styleUrls: ['stacked-row.component.scss'],
    templateUrl: `./stacked-row.component.html`,
    standalone: false,
})

/**
 * This is the class definition of the component
 */
export class StackedRowComponent implements OnInit {
    /**
     * Defines the configurations, see the example below:
     *
     * {
     *
     *  label: 'Phone',
     *
     *  value: 'phone_number',
     *
     *  type: 'string'
     *
     * }
     */
    @Input() confs: any;

    toggle: Object = {};
    /**
     * Defines an item contained in an apilist(an object in a datatable component)
     */
    @Input() item: any;
    /**
     * Defines any additional data for configurations of type answer
     */
    @Input() secondaryData: any;

    /**
     * The component constructor
     */
    constructor(public uiglobals: UIRouterGlobals) {}

    /**
     * Used to override default form configurations
     */
    formConfig: any;

    /**
     * Array used to define the table headers of the  invoices datatable
     */
    headers: Array<any>;

    /**
     * Array used to define the rows of the invoice datatable
     */
    rows: Array<any>;

    /** used to filter datatable params */
    filterParams: Object;

    /**
     * Method used to get a nested property
     */
    nestedProperty(obj, path) {
        if (!obj) return null;
        if (!path) return obj;
        const properties = path.split('.');
        return this.nestedProperty(
            obj[properties.shift()],
            properties.join('.')
        );
    }

    toggleModal(context) {
        this.toggle[context] = !this.toggle[context];
    }

    onAdjudicationHistorySelected(row: any) {
        this.filterParams = {
            invoice_line: row.id,
        };

        this.toggleModal('adjudicationHistory');
    }

    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };

        /**
         * Set the Adjudication History table header
         */
        this.headers = [
            { text: 'Date' },
            { text: 'Name' },
            { text: 'Amt. Approved' },
            { text: 'Status' },
        ];

        /**
         * Set the Adjudication History rows
         */
        this.rows = [
            {
                key: 'created',
                type: 'date',
            },
            {
                key: 'created_by_name',
                type: 'truncated-string',
                truncate_size: 20,
            },
            {
                key: 'approved_amount',
                type: 'currency',
            },
            {
                key: 'action',
                type: 'statusColor',
            },
        ];
    }
}
