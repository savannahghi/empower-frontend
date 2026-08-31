import { Component } from '@angular/core';

/**
 * Decorator for the skika page component
 */
@Component({
    selector: 'skika-page',
    styleUrls: ['./skika-page.component.scss'],
    template: `
        <div class="row no-gutters cmp-cont">
            <div class="col-12 main-cont">
                <nb-card class="no-border">
                    <nb-card-body class="page-cont">
                        <ng-content></ng-content>
                    </nb-card-body>
                </nb-card>
            </div>
        </div>
    `,
    standalone: false,
})
/** Contains the class for the skika page */
export class SkikaPageComponent {}
