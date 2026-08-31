import { Component, OnInit, ViewChild } from '@angular/core';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import _ from 'underscore';
import { PageComponent } from '../../../../shared/page/page.component';
import { NbToastrService } from '@nebular/theme';
import { AnalyticsService } from '../../../../@core/utils';
import { SilDatatableComponent } from '../../../../shared/sil-datatable/components/sil-datatable/sil-datatable.component';

@Component({
    selector: 'ngx-group-members',
    templateUrl: './group-members.component.html',
    styleUrls: ['./group-members.component.scss'],
    standalone: false,
})
export class GroupMembersComponent extends PageComponent implements OnInit {
    /**
     * Used to define datatable header actions
     */
    actions: Array<any>;
    /**
     * Used to get a reference of siltable used in the template
     */
    @ViewChild(SilDatatableComponent) siltable: SilDatatableComponent;
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
     * Used to display a modal
     */
    showModal = false;
    /**
     * Used to determine the service used in the form
     */
    heading: any = 'add-user-to-group';

    /**
     * Constructor
     * @param uiglobals Contains the uiglobals
     */
    constructor(
        protected toastrService: NbToastrService,
        public uiglobals: UIRouterGlobals,
        public $state: StateService,
        public analytics: AnalyticsService,
        public datalayer: SilStoresService
    ) {
        super(toastrService, uiglobals, $state, analytics);
    }

    /**
     * Used to toggle the modal
     */
    toggleModal() {
        this.heading = 'add-user-to-group';
        this.showModal = !this.showModal;
    }

    /**
     * adds a member to the group
     * @param model data from form
     */
    submitGroupMember(model) {
        this.datalayer
            .get('persons', model.person)
            .subscribe({ next: this.personRetrieved });
    }

    personRetrieved = person => {
        const persn = _.pick(
            person,
            'id',
            'first_name',
            'last_name',
            'person_contacts',
            'person_ids'
        );
        let payLoad = { person: persn.id };
        payLoad = Object.assign(payLoad, {
            group: this.uiglobals.params.id,
        });
        this.datalayer
            .create('group-members', payLoad)
            .subscribe({ next: this.memberAdded });
    };

    memberAdded = () => {
        this.showToast(
            'bottom-right',
            'success',
            'Member Added',
            `Member added`
        );
        this.toggleModal();
    };

    /**
     * Lifecycle hook used when component is first initialized
     */
    ngOnInit() {
        /**
         * Used to set the table's filters
         * */
        this.filterParams = {
            page_size: '10',
            group: this.uiglobals.params.id,
        };

        /**
         * Table header
         */
        this.tableHeader = [{ text: 'Name' }, { text: 'Active?' }];

        /**
         * Table rows
         */
        this.rows = [
            {
                path: 'person.person_display',
                type: 'mineVal',
            },
            {
                key: 'active',
                type: 'boolean',
            },
        ];
    }
}
