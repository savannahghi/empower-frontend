import { Component, OnInit } from '@angular/core';

/**
 * Component that is used to create the General Systems Exam Page
 *
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrl: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-general-systems',
    templateUrl: './general-systems.component.html',
    styleUrl: './general-systems.component.scss',
    standalone: false,
})
/**
 * Class that creates the General Systems Exam component
 */
export class GeneralSystemsComponent implements OnInit {
    /**
     * Component lifecycle used after the component is initialized
     */

    ngOnInit() {}
}
