import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../@core/auth/services/authentication.service';
import { UIRouterModule, Ng2StateDeclaration } from '@uirouter/angular';
import { StateRegistry } from '@uirouter/core';
import { SkikaFormModule } from '../../../shared/sil-form/sil-form.module';
import { NgPipesModule } from 'ngx-pipes';
import {
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbUserModule,
    NbTabsetModule,
    NbListModule,
    NbThemeModule,
    NbSpinnerModule,
    NbToastrModule,
    NbAlertModule,
    NbAccordionModule,
    NbTooltipModule,
    NbTagModule,
} from '@nebular/theme';
import { SilDatatableModule } from '../../../shared/sil-datatable/sil-datatable.module';
import { FeaturesModule } from '../../features.module';
import { SilDatatableService } from '../../../shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { SkikaLayoutModule } from '../../../shared/sil-layout/sil-layout.module';
import { ThemeModule } from '../../../@theme/theme.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { USERMGMT_STATES } from './usermgmt.states';
import { ORGMGMT_STATES } from './organisation-management/orgmgmt.states';
import { RolePermissionsComponent } from './role-permissions/role-permissions.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NgxTranslateModule } from 'app/shared/translate/translate.module';
import { NbFormFieldModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { Authorization } from '../../../@core/auth/services/authorization.service';

/**
 * Factory function to dynamically select states based on keycloak flag
 * @param injector Angular injector to get Authorization service
 * @returns Array of states (ORGMGMT_STATES if keycloak enabled, USERMGMT_STATES otherwise)
 */
export function getUserMgmtStatesFactory(
    injector: Injector
): Ng2StateDeclaration[] {
    const authService = injector.get(Authorization);
    const isKeycloakEnabled = authService.enabledKeycloak;

    // Use org states when keycloak is enabled (true), user states when disabled (false)
    return isKeycloakEnabled ? ORGMGMT_STATES : USERMGMT_STATES;
}

@NgModule({
    imports: [
        UIRouterModule.forChild({
            states: [],
        }),
        CommonModule,
        NbInputModule,
        NbCardModule,
        NbButtonModule,
        NbActionsModule,
        NbUserModule,
        NbCheckboxModule,
        NbRadioModule,
        NbDatepickerModule,
        NbSelectModule,
        NbIconModule,
        NbListModule,
        NbThemeModule,
        NbTabsetModule,
        NbSpinnerModule,
        NbToastrModule,
        NbAlertModule,
        NbAccordionModule,
        NbTagModule,
        NbTooltipModule,
        NgPipesModule,
        NgxSkeletonLoaderModule,
        FeaturesModule,
        SkikaFormModule,
        SilDatatableModule,
        SkikaLayoutModule,
        ThemeModule,
        SweetAlert2Module,
        NgxTranslateModule,
        NbFormFieldModule,
        ReactiveFormsModule,
    ],
    declarations: [
        RolePermissionsComponent,
        UserFormComponent,
        UserProfileComponent,
    ],
    providers: [SilStoresService, SilDatatableService, AuthenticationService],
})
export class UserMgmtModule {
    constructor(
        private injector: Injector,
        private stateRegistry: StateRegistry
    ) {
        // Dynamically register states based on keycloak flag
        const states = getUserMgmtStatesFactory(this.injector);
        states.forEach(state => this.stateRegistry.register(state));
    }
}
