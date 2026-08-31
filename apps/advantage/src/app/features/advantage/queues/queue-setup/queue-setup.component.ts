import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'ngx-queue-setup',
    templateUrl: './queue-setup.component.html',
    styleUrls: ['./queue-setup.component.scss'],
    standalone: false,
})
export class QueueSetupComponent implements OnInit {
    /**
     * Shows the loading of the xhr requests
     */
    loading: boolean = false;
    /**
     * Used to define datatable header actions
     */
    actions: Array<any>;
    /**
     * Array used to define datatable grid actions
     */
    gridActions: Array<any>;

    /**
     * Array used to define the rows of the datatable
     */
    rows: Array<any>;

    /**
     * Array used to define the headers of the datatable
     */
    tableHeader: Array<any>;

    /**
     * Object used to define the default filter params of the datatable
     */
    filterParams: Object;

    /**
     * Lifecycle hook used when component is first initialized
     */
    ngOnInit() {
        /**
         * Table header
         */
        this.tableHeader = [
            { text: 'queues.table_header.name' },
            { text: 'queues.table_header.active' },
            { text: 'queues.table_header.action' },
        ];

        /**
         * Table rows
         */
        this.rows = [
            {
                key: 'name',
                type: 'string',
            },
            {
                key: 'active',
                type: 'booleanToString',
            },
        ];

        /**
         * Edit Action button with quick patch action from sil.datatable
         */
        this.actions = this['actions'] = [
            {
                btnText: 'shared.buttons.edit',
                status: 'success',
                action: 'modal',
                modalConf: {
                    context: 'Edit Queue',
                    store: 'edit-queue',
                    isService: false,
                    action: 'quickPatch',
                    method: 'patchQueue',
                },
            },
        ];
    }
}
