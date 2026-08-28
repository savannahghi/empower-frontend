import { Component, Input, OnInit } from '@angular/core';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';

@Component({
    selector: 'ngx-group-details',
    templateUrl: './group-details.component.html',
    styleUrls: ['./group-details.component.scss'],
    standalone: false,
})
export class GroupDetailsComponent implements OnInit {
    /** contains group information */
    group: any;
    /**
     * Contains the observable resolved from the state service
     */
    @Input() groupObservable: any;

    loading: any;

    constructor(public errorHandler: ErrorHandlerService) {}

    /**
     * Hook called when component is initialized
     */
    ngOnInit() {
        this.getGroupInfo();
    }

    /**
     * Fetches the group information
     */
    getGroupInfo() {
        this.groupObservable.subscribe(
            (response: any) => {
                this.group = response;
            },
            err => {
                this.errorHandler.handleError(err, this);
            }
        );
    }
}
