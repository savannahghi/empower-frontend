import { Component, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';
/**
 * Component that is used to render the terms and conditions page
 * component used in the on boarding feature
 *
 *  Component declaration that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-terms-and-conditions',
    templateUrl: './terms-and-conditions.component.html',
    styleUrls: ['./terms-and-conditions.component.scss'],
    standalone: false,
})
/**
 * Class that creates the Terms and Conditions component
 */
export class TermsAndConditionsComponent {
    /** Used display action button */
    @Input() showActionButton: boolean = true;
    variant = environment.variant;
}
