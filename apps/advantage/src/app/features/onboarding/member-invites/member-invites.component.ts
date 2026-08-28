import { Component, OnInit } from '@angular/core';
/**
 * Component that is used to render the member invites page
 * component used in the on boarding feature
 *
 *  Component declaration that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-member-invites',
    templateUrl: './member-invites.component.html',
    styleUrls: ['./member-invites.component.scss'],
    standalone: false,
})
/**
 * Class that creates the MemberInvites component
 */
export class MemberInvitesComponent implements OnInit {
    /**
     * Used to override default form configurations
     */
    formConfig: any;
    /**
     * Used to determine if the content of a form has been submitted
     */
    submitted: boolean = false;
    /**
     * Contains the member invite details
     */
    memberInvite: any;
    /**
     * Used to send the member invite
     * @param model object containing the form data used to send member invites
     */
    sendMemberInvite(model) {
        model.member_email = model.member_email;
        model.user_type = model.user_type;
    }
    /**
     * Hook that is called when the component is initialized
     */
    ngOnInit() {
        /** Set the form to detect changes on any changes happening */
        this.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
    }
}
