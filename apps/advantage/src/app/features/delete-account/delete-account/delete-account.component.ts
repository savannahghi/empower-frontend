import { Component } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
    selector: 'ngx-delete-account',
    templateUrl: './delete-account.component.html',
    styleUrl: './delete-account.component.scss',
    standalone: false,
})
export class DeleteAccountComponent {
    submitted: boolean;
    email: any;
    window: any;
    variant: any;

    constructor() {
        this.window = window;
        this.variant = environment.variant;
    }

    sendEmail() {
        const email = 'asd@savannahghi.atlassian.net';
        const mailto = `mailto:${email}?subject=${encodeURIComponent(
            'Delete Account Request'
        )}&body=${encodeURIComponent(
            `Kindly delete the following account: ${email}`
        )}`;
        this.assignToWindow(mailto);
    }

    assignToWindow(mailto): any {
        this.window.location.assign(mailto);
    }
}
