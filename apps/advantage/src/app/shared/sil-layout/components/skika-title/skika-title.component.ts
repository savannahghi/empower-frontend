/**
 * Imports used in the component
 */
import { Component, Input } from '@angular/core';

/**
 * Contains the component decorator and defines
 * the selector, style url and template url
 */
@Component({
    selector: 'skika-title',
    styleUrls: ['./skika-title.component.scss'],
    template: `
        <div class="row show-grid pad-h-60">
            <div class="">
                <div class="row">
                    <div class="col-md-12">
                        <h1 class="fs-22">
                            <b>{{ title }}</b>
                        </h1>
                        <div>
                            {{ subtitle }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    standalone: false,
})

/**
 * Definition of the component's class
 */
export class SkikaTitleComponent {
    /** Contains the the title input as used in the template */
    @Input() title: string;

    /** Contains the the sub title input as used in the template */
    @Input() subtitle: string;
}
