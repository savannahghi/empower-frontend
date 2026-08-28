/**
 * Imports used in the component
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Contains the component decorator and defines
 * the selector, style url and template url
 */
@Component({
    selector: 'skika-sidescroll',
    styleUrls: ['./skika-sidescroll.component.scss'],
    template: `
        <ul
            class="col-9 nav nav-pills
        flex-column side-nav">
            <li *ngFor="let nav of navLinks" class="nav-item">
                <a
                    class="nav-link"
                    [ngClass]="{ active: nav.active }"
                    (click)="scrollTo(nav.name)">
                    {{ nav.title }}
                </a>
            </li>
        </ul>
    `,
    standalone: false,
})

/**
 * Definition of the component's class
 */
export class SkikaSidescrollComponent {
    /**
     * Input that gets the navigation links
     */
    @Input('nav-links') navLinks: any[];

    /**
     * Output lets you know when the user navigates
     */
    @Output() switchNav = new EventEmitter();
    constructor() {}

    scrollTo(title) {
        this.switchNav.emit(title);
    }
}
