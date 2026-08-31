import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'ngx-enrollment-list',
    templateUrl: './enrollment-list.component.html',
    styleUrl: './enrollment-list.component.scss',
    standalone: false,
})
export class EnrollmentListComponent implements OnInit {
    tableHeader: Array<any>;

    rows: Array<any>;

    actions: Array<any>;

    filterParams: Object;

    ngOnInit() {
        this.tableHeader = [
            { text: 'Registration Info' },
            { text: 'Name' },
            { text: 'DoB' },
            { text: 'Phone No' },
            { text: 'Action' },
        ];

        this.rows = [
            {
                nested: [
                    {
                        label: 'Patient No',
                        value: 'patient_id',
                        type: 'string',
                    },
                    {
                        label: 'Added On',
                        value: 'created',
                        type: 'date',
                    },
                ],
            },
            {
                path: 'person.person_display',
                type: 'mineVal',
                nested: [
                    {
                        label: 'Gender',
                        path: 'person.gender',
                        type: 'nestedVal',
                    },
                ],
            },
            {
                label: 'Age:',
                path: 'person.age',
                type: 'age',
                nested: [
                    {
                        label: 'DOB',
                        path: 'person.date_of_birth',
                        type: 'nestedValDate',
                    },
                ],
            },
            {
                path: 'person.phone_number',
                type: 'phoneNumber',
            },
        ];

        this.actions = this['actions'] = [
            {
                btnText: 'shared.buttons.view',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.enrollment.detail',
                },
            },
        ];

        this.filterParams = {
            fields: 'id,patient_id,person,expected_delivery_date,created',
            is_deceased: false,
            page_size: '10',
            active: true,
        };
    }
}
