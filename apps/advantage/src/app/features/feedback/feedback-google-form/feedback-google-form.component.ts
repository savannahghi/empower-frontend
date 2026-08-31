import { Component } from '@angular/core';
import { FeedbackFormComponent } from '../feedback-form/feedback-form.component';

/**
 * Component decorator that is used to define:
 * - selector: used to define how to use the component in a template
 * - styleUrls: contains the scss file used to style the component
 * - templateUrl: contains the html structure of the component
 * - provider: contains the services required by the component
 */
@Component({
    selector: 'ngx-feedback-google-form',
    templateUrl: './feedback-google-form.component.html',
    styleUrls: ['./feedback-google-form.component.scss'],
    standalone: false,
})
export class FeedbackGoogleFormComponent extends FeedbackFormComponent {}
