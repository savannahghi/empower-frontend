import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SilStoresService } from '../../shared/sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../@core/auth/services/authentication.service';
import { UIRouterModule } from '@uirouter/angular';
import { SkikaFormModule } from '../../shared/sil-form/sil-form.module';
import {
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbCalendarModule,
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
    NbLayoutModule,
    NbStepperModule,
} from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { SkikaLayoutModule } from '../../shared/sil-layout/sil-layout.module';
import { SilDatatableService } from '../../shared/sil-datatable/components/sil-datatable/sil-datatable.service';
import { SilDatatableModule } from '../../shared/sil-datatable/sil-datatable.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MultiSelectModule } from 'primeng/multiselect';
import { ONBOARDING_STATES } from './onboarding.states';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { NextStepsComponent } from './next-steps/next-steps.component';
import { InterestsComponent } from './interests/interests.component';
import { OnboardingStepperComponent } from './onboarding-stepper/onboarding-stepper.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { MemberInvitesComponent } from './member-invites/member-invites.component';
import { StepsCompletionComponent } from './completion/steps-completion.component';
import { SilTableFormModule } from '../../shared/sil-table-form/sil-table-form.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FacilityOnboardingDetailsComponent } from './facility-details/facility-details.component';
import { OnboardingBusinessDetailsComponent } from './business-details/business-details.component';
import { FinalReviewComponent } from './final-review/final-review.component';
import { VariantDisplayPipe } from '../../@theme/pipes/variant-display/variant-display.pipe';
import { StepperService } from '../../shared/component-services/stepper.service';

@NgModule({
    imports: [
        UIRouterModule.forChild({ states: ONBOARDING_STATES }),
        ThemeModule,
        MultiSelectModule,
        SkikaLayoutModule,
        CommonModule,
        NbInputModule,
        NbCardModule,
        NbCalendarModule,
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
        SilDatatableModule,
        SilTableFormModule,
        SkikaFormModule,
        NbToastrModule,
        NbAlertModule,
        NbAccordionModule,
        NbTooltipModule,
        SweetAlert2Module,
        NbLayoutModule,
        NbStepperModule,
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        VariantDisplayPipe,
    ],
    declarations: [
        BasicDetailsComponent,
        WelcomeComponent,
        NextStepsComponent,
        InterestsComponent,
        OnboardingStepperComponent,
        BasicDetailsComponent,
        TermsAndConditionsComponent,
        StepsCompletionComponent,
        MemberInvitesComponent,
        FacilityOnboardingDetailsComponent,
        OnboardingBusinessDetailsComponent,
        FinalReviewComponent,
    ],
    providers: [
        SilStoresService,
        AuthenticationService,
        SilDatatableService,
        StepperService,
    ],
})
export class OnboardingModule {}
