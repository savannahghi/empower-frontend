import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'sil-table-form',
    template: ` <div class="col-md-12">
        <sil-table
            [title]="tableTitle"
            [subtitle]="tableSubtitle"
            [headerActions]="gridActions"
            [headers]="tableHeader"
            [rows]="tableRows"
            [apilist]="data"
            [secondaryData]="secondaryData"
            [actions]="tableActions"
            [has-action]="tableAction"
            (refresh)="refreshFxn()">
        </sil-table>
    </div>`,
    styleUrls: ['./sil-table-form.component.scss'],
    standalone: false,
})
export class SilTableFormComponent implements OnInit {
    @Input() list: any;
    @Input() tableModel: Object;
    @Output() refresh = new EventEmitter();

    tableTitle: string;
    tableSubtitle: string;
    tableHeader: any; // table header data
    tableAction: boolean; // table action
    gridActions: any[]; // grid action
    tableRows: Array<any>; // table rows
    tableActions: Array<any>; // table rows
    data: Array<any>; // table data
    secondaryData: Array<any>; // secondary set of data

    loading: boolean = true;

    constructor() {}

    setupTable() {
        if (this.tableModel) {
            this.tableHeader = this.tableModel['headers'];
            this.tableTitle = this.tableModel['title'];
            this.tableSubtitle = this.tableModel['subtitle'];
            this.tableRows = this.tableModel['rows'];
            this.tableActions = this.tableModel['actions'];
            this.gridActions = this.tableModel['headerActions'];
            this.data = this.tableModel['data'];
            this.secondaryData = this.tableModel['secondaryData'];
            this.tableAction = this.tableModel['action'];
        }
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.setupTable();
    }

    refreshFxn() {
        this.refresh.emit();
    }
}
