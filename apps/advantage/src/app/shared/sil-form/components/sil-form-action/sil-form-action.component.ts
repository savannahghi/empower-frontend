import { Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';

@Component({
    selector: 'ngx-sil-form-action',
    templateUrl: './sil-form-action.component.html',
    styleUrls: ['./sil-form-action.component.scss'],
    standalone: false,
})
export class SilFormActionComponent
    extends FieldType<FieldTypeConfig>
    implements OnInit
{
    /** Contains the value of the button */
    buttonValue: any;
    /** Contains boolean that checks if the user has the permission to see
     * the button
     */
    hasPermission: boolean;
    /** Contains auth service */
    auth: AuthenticationService;

    /**
     * Constructor for the class
     * @param auth contains the authentication service
     */
    constructor(auth: AuthenticationService) {
        super();
        this.auth = auth;
    }

    /** Detects click events from the user */
    onClick() {
        this.buttonValue = true;
        setTimeout(() => {
            this.buttonValue = false;
        }, 1000);
    }

    /** Checks if the user has permission to use the button */
    checkIfHasPermission() {
        this.hasPermission = this.auth.checkPermission(this.props.permission);
    }

    /** Hook when the component is initialized */
    ngOnInit() {
        this.checkIfHasPermission();
    }
}
