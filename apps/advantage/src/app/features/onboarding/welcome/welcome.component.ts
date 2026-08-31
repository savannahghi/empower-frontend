import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
/**
 * Component that is used to render the welcome page
 * component used in the on boarding feature
 *
 *  Component declaration that is used to define:
 * - selector: used to define how to use the component in a template
 * - templateUrl: contains the html structure of the component
 * - styleUrls: contains the scss file used to style the component
 */
@Component({
    selector: 'ngx-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
    standalone: false,
})
/**
 * Class that creates the Welcome component
 */
export class WelcomeComponent implements OnInit {
    /** variant */
    variant: string;

    ngOnInit() {
        this.variant = environment.variant;
    }
}
