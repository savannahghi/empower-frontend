import { Component, OnInit } from '@angular/core';
import { UIRouterGlobals } from '@uirouter/angular';
/**
 * Component that is used to create the Patient Screening Report Page
 *
 *  Component declaration that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-patient-segment-messages',
    templateUrl: './patient-segment-messages.component.html',
    styleUrls: ['./patient-segment-messages.component.scss'],
    standalone: false,
})
/**
 * Class that creates the Patient Screening Messages component
 */
export class PatientSegmentMessagesComponent implements OnInit {
    /**
     * The component constructor
     * @param uiglobals Access instance of uirouter global service
     */
    constructor(public uiglobals: UIRouterGlobals) {}

    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;
    /**
     * Segment Id
     */
    segment_id: string = '';
    /**
     * Patient First name
     */
    name: string = '';
    /**
     * Member Id
     */
    member: string;
    /**
     * Message Segment
     */
    segment: string;

    /**
     * Defines default filter params
     */
    filterParams: any;

    /** when component mounts */

    ngOnInit() {
        // Table headers
        this.tableHeader = [
            { text: 'Sent On' },
            { text: 'Message Sent' },
            { text: 'Delivery Status' },
        ];

        /**
         * Error occurs when nested values such as sms.state are used
         */
        this.rows = [
            {
                type: 'dateUTC',
                path: 'dispatched_at',
            },
            {
                type: 'string',
                key: 'message',
            },
            {
                type: 'mineValWithStatus',
                path: 'sms.state',
            },
        ];

        this.segment_id = this.uiglobals.params.segment_id;
        this.member = this.uiglobals.params.member;
        this.segment = this.uiglobals.params?.segment?.replace(/_/g, ' ');
        this.name = this.uiglobals.params?.name;
        this.filterParams = {
            segment_id: this.segment_id,
            member: this.member,
        };
    }
}
