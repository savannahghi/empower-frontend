import { Component } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { Transition } from '@uirouter/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { TranslateService } from '@ngx-translate/core';
import { ViewClinicBaseComponent } from './base-view-clinic.component';

/**
 * Component decorator used in templates
 * The selector, style URL, and template
 */
@Component({
    selector: 'sil-view-clinic',
    templateUrl: './view-clinic.component.html',
    styleUrls: ['./view-clinic.component.scss'],
    standalone: false,
})
/** Defines the ViewClinicComponent class */
export class ViewClinicComponent extends ViewClinicBaseComponent {
    /**
     * Constructor for the ViewClinicComponent class
     * @param dataLayer Access instance of SilStoresService
     * @param errorHandler Access instance of ErrorHandlerService
     * @param toastrService Access instance of NbToastrService from Nebular
     * @param transition Access instance of the TransitionService from UI-Router
     * @param $state Access instance of the StateService from UI-Router
     * @param cookieService Access instance of Cookies service
     * @param translate Access instance of TranslateService
     * @param uiglobals Access instance of UIRouterGlobals
     */
    constructor(
        dataLayer: SilStoresService,
        errorHandler: ErrorHandlerService,
        toastrService: NbToastrService,
        transition: Transition,
        $state: StateService,
        cookieService: Cookies,
        translate: TranslateService,
        uiglobals: UIRouterGlobals
    ) {
        super(
            dataLayer,
            errorHandler,
            toastrService,
            transition,
            $state,
            cookieService,
            translate,
            uiglobals
        );
    }
}
