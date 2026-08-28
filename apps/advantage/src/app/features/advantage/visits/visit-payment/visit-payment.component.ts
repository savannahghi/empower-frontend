/**
 * Imports used in the component
 */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';
import { Transition, StateService } from '@uirouter/core';
import { VisitService } from '../visit.service';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - style: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 * - providers: contains the services used within the component
 */
@Component({
    selector: 'visit-payment',
    styleUrls: ['./visit-payment.component.scss'],
    templateUrl: './visit-payment.component.html',
    providers: [VisitService],
    standalone: false,
})

/**
 * This is the class definition of the component
 */
export class VisitPaymentComponent implements OnInit {
    /**
     * Used to get a reference of siltable used in the template
     */
    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;
    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;
    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;
    /**
     * Array used to define the actions of the datatable
     */
    actions: Array<any>;
    /**
     * Contains the actions used in the table row
     */
    gridActions: Array<any>;
    /**
     * Defines the default params used to filter
     * information in the table
     */
    filterParams: Object;
    /**
     * Used to manipulate the query params used to fetch
     * data from the api for the table
     */
    queryArg: string;
    /**
     * Defines visit data
     */
    @Input() visit: any;
    /**
     * Defines visit id
     */
    visitId: string;
    /**
     * Defines loading state
     */
    loading: boolean = true;
    /**
     * Boolean used to show the modal
     */
    showModal = false;
    /**
     * Time used to show a toast
     */
    toastTime = 7000;
    /**
     * id that contains the patient identifier
     */
    patientId: any;
    /**
     * Contains patient information
     */
    patient: any;

    /**
     * Constructor used for the VisitPaymentComponent class
     * @param toastrService Access instance of toastrService from nebular
     * @param transition Access instance of the TransitionService from uirouter
     * @param $state Access instance of the StateService from uirouter
     * @param visitService Access instance of the visit service
     */
    constructor(
        protected toastrService: NbToastrService,
        public transition: Transition,
        public $state: StateService,
        private visitService: VisitService
    ) {}

    /**
     * Method used to display a toast
     */
    showToast(position, status, msg, context) {
        const duration = this.toastTime;
        this.toastrService.show(`${context} successfully`, msg, {
            position,
            status,
            duration,
        });
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.visitId = this.transition.params().id;
        // Table header
        this.tableHeader = [
            { text: 'visits.billing.recorded' },
            { text: 'visits.billing.amt_paid' },
            { text: 'visits.billing.balance' },
        ];

        // Table rows
        this.rows = [
            {
                type: 'date',
                key: 'created',
                nested: [
                    {
                        label: 'Time',
                        value: 'created',
                        type: 'time',
                    },
                ],
            },
            {
                type: 'currency',
                key: 'amount',
            },
            {
                type: 'balance',
                key: 'invoice_amount_balance',
            },
        ];

        this.visitObservable();

        // Fields called from the backend
        this.filterParams = {};

        // Edit Action button with quick patch action from sil.datatable`
        this.actions = this['actions'] = undefined;
    }

    visitObservable() {
        this.visitService.visitDataEmitter.subscribe({ next: this.setVisit });
    }

    setVisit = vis => {
        this.visit = vis;
    };
}
