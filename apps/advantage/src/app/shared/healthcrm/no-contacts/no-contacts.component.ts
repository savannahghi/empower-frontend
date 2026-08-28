import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-no-contacts',
    template: `
        <div
            class="border d-flex flex-column justify-content-center align-items-center"
            style="height: 298px;">
            <img
                src="../../../../../assets/images/Group 626352.svg"
                alt=""
                style="width: 153px; height: 114px;" />
            <div class="mt-3">
                <p class="text-muted">
                    {{ firstName | titlecase }} does not have any contacts
                    linked to them
                </p>
            </div>
        </div>
    `,
    standalone: false,
})
export class NoContactsComponent {
    @Input() firstName: string;
}
