import { Component, Input } from '@angular/core';

@Component({
    selector: 'skika-page-title',
    styleUrls: ['./skika-page-title.component.scss'],
    template: `
        <div class="title-section fixed-top">
            <div class="col-12">
                {{ title }}
                <a
                    nbButton
                    class="float-right"
                    style="margin-left:2rem;"
                    status="success"
                    shape="round"
                    uiSref="[link]"
                    size="small">
                    {{ linkText }}
                </a>
                <span
                    *ngIf="submitted && !edited"
                    class="text-muted loading-text float-right">
                    <small class="small">Saving your changes...</small>
                </span>
                <span
                    *ngIf="edited && !submitted"
                    class="text-muted loading-text float-right">
                    <span class="small"> Your changes have been saved </span>
                </span>
            </div>
        </div>
    `,
    standalone: false,
})
export class SkikaPageTitleComponent {
    @Input() link: string;
    @Input('link-text') linkText: string;
    @Input() title: string;
    @Input() edited: boolean;
    @Input() submitted: boolean;
}
