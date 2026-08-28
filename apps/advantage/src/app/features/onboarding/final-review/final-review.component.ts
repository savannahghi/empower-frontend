import { Component, Input, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService } from '@uirouter/angular';

/**
 * Component that is used to render the review & submission page
 *
 *  Component declaration that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-final-review',
    templateUrl: './final-review.component.html',
    styleUrls: ['./final-review.component.scss'],
    standalone: false,
})
/**
 * Class that creates the SignUp component
 */
export class FinalReviewComponent implements OnInit {
    /** provider data */
    @Input() providerData: any;

    constructor(
        protected toastrService: NbToastrService,
        public $state: StateService
    ) {}

    /**
     * used to display action button
     */
    showActionButton = false;

    ngOnInit() {}
}
