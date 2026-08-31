/** Imports used in the component */
import { Component } from '@angular/core';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - style: contains the scss file used to style the component
 * - template: contains the html structure of the component
 */
@Component({
    selector: 'ngx-footer',
    styleUrls: ['./footer.component.scss'],
    template: ` <span class="created-by"></span> `,
    standalone: false,
})

/**
 * This is the class definition of the component
 */
export class FooterComponent {}
