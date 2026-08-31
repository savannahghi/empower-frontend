import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    NbThemeModule,
} from '@nebular/theme';
import { ThemeModule } from '../../../@theme/theme.module';
import { NgxTranslateModule } from '../../translate/translate.module';
import { Authorization } from '../../../@core/auth/services/authorization.service';

@Component({
    selector: 'ngx-sil-error-view',
    standalone: true,
    imports: [
        NbButtonModule,
        NbThemeModule,
        ThemeModule,
        NbCardModule,
        NbIconModule,
        NgxTranslateModule,
    ],
    templateUrl: './sil-error-view.component.html',
    styleUrl: './sil-error-view.component.scss',
})
export class SilErrorViewComponent {
    /**
     * Message title
     */
    @Input() messageTitle: string = 'Failed request';

    /**
     * Message body
     */
    @Input() messageBody: string =
        'We encountered an issue while trying to complete the request.';

    /**
     * customFxn button title
     */
    @Input() customFxnTitle: string = '';

    /**
     * Display the CTA button icon
     */
    @Input() showIcon?: boolean = false;

    /**
     *  CTA button icon
     */
    @Input() icon?: string = 'refresh-outline';

    /**
     * Display the CTA button icon before the CTA button text
     */
    @Input() iconBefore?: boolean = false;

    /**
     * Display the CTA button icon after the CTA button text
     */
    @Input() iconAfter?: boolean = true;

    /**
     * emitted when a custom function action button is clicked
     */
    @Output() customFxn = new EventEmitter<string>();

    /**
     * Constructor used for the SilErrorViewComponent class
     * @param authConfig Access instance of the authorization service
     */
    constructor(public authConfig: Authorization) {}

    /**
     * emit custom function
     */
    customFxnEmitter() {
        this.customFxn.emit();
    }
}
