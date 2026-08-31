import { Component, Input } from '@angular/core';

@Component({
    selector: 'skika-side-content',
    styleUrls: ['./skika-side-content.component.scss'],
    template: `
        <div
            class="float-right affix col-3"
            data-offset-top="30"
            style="padding:0px;height:100vh;">
            <!-- Title card -->
            <nb-card class="margin-b-0" style="height:100%;">
                <nb-card-header>
                    {{ title }}
                </nb-card-header>
                <nb-card-body *ngIf="item" style="padding:0px;">
                    <ng-content></ng-content>
                </nb-card-body>
            </nb-card>
        </div>
    `,
    standalone: false,
})
export class SkikaSideContentComponent {
    @Input() title: string;
    @Input() item: any;
}
