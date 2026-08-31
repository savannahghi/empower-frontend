import { Component } from '@angular/core';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - style: contains the scss file used to style the component
 * - template: contains the html structure of the component
 */
@Component({
    selector: 'page-header',
    styleUrls: ['./page-header.component.scss'],
    template: `
        <span class="created-by"
            >by
            <b
                ><a href="https://savannahinformatics.com" target="_blank">
                    Savannah Informatics</a
                ></b
            >
            2019</span
        >
    `,
    standalone: false,
})
export class PageHeaderComponent {}
