import { Component, Input, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { StateService } from '@uirouter/angular';

/**
 * Component that is used to render the basic details page
 *
 *  Component declaration that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-basic-details',
    templateUrl: './basic-details.component.html',
    styleUrls: ['./basic-details.component.scss'],
    standalone: false,
})
/**
 * Class that creates the BasicDetails component
 */
export class BasicDetailsComponent implements OnInit {
    constructor(
        protected toastrService: NbToastrService,
        public $state: StateService
    ) {}

    /** Used display action button */
    @Input() showActionButton: boolean = true;

    ngOnInit() {}
}
