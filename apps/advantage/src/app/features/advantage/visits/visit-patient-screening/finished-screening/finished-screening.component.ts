import { Component, Input } from '@angular/core';
/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-finished-screening',
    templateUrl: './finished-screening.component.html',
    styleUrls: ['./finished-screening.component.scss'],
    standalone: false,
})
/**
 * This is the class definition of the component
 */
export class FinishedScreeningComponent {
    /**
     * The Type of Cancer Screening being done
     */
    @Input() cancerType: string;
}
