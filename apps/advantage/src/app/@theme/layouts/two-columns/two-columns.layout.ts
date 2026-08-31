/** Imports used in the component */
import { Component } from '@angular/core';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - styleUrl: contains scss information for styling the component
 * - template: contains the html structure of the component
 */
@Component({
    selector: 'ngx-two-columns-layout',
    styleUrls: ['./two-columns.layout.scss'],
    template: `
        <nb-layout windowMode>
            <nb-layout-header fixed>
                <ngx-header></ngx-header>
            </nb-layout-header>

            <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>
                <ng-content select="nb-menu"> </ng-content>
            </nb-sidebar>

            <nb-layout-column class="small"> </nb-layout-column>

            <nb-layout-column>
                <ui-view></ui-view>
            </nb-layout-column>

            <nb-layout-footer fixed>
                <ngx-footer></ngx-footer>
            </nb-layout-footer>
        </nb-layout>
    `,
    standalone: false,
})

/**
 * TwoColumnsLayoutComponent component class
 */
export class TwoColumnsLayoutComponent {}
