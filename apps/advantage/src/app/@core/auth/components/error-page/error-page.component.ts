import { Component, OnInit } from '@angular/core';
import { UIRouterGlobals } from '@uirouter/angular';
import _ from 'underscore';

@Component({
    selector: 'ngx-error-page',
    templateUrl: './error-page.component.html',
    styleUrls: ['./error-page.component.scss'],
    standalone: false,
})
export class ErrorPageComponent implements OnInit {
    params: object;
    constructor(public uiglobals: UIRouterGlobals) {
        this.getStateParams();
    }

    getStateParams() {
        const stateparams = _.omit(this.uiglobals.params, '#');
        this.params = stateparams;
    }

    /**
     * Hook called when component is initialized
     */
    ngOnInit(): void {
        this.getStateParams();
    }
}
