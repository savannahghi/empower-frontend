import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
/**
 * Component that is used to render the onboarding interests page
 *
 *  Component declaration that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-interests',
    templateUrl: './interests.component.html',
    styleUrls: ['./interests.component.scss'],
    standalone: false,
})
/**
 * Class that creates the Interests component
 */
export class InterestsComponent implements OnInit {
    /**
     * Topics of interest for providers
     */
    topicsOfInterest: Array<string> = [
        'Cancer',
        'Diabetes',
        'Hypertension',
        'Wellness and fitness',
        'ICD10',
        'Nutritionist',
    ];

    /** variant */
    variant: string;

    /** Used display action button */
    @Input() showActionButton: boolean = true;

    ngOnInit() {
        this.variant = environment.variant;
    }
}
