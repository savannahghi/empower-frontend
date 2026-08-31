import { NgModule } from '@angular/core';
import { UIRouterModule } from '@uirouter/angular';
import {
    NbLayoutModule,
    NbRadioModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbTreeGridModule,
    NbSpinnerModule,
    NbButtonModule,
    NbCheckboxModule,
    NbTagModule,
    NbFormFieldModule,
    NbTooltipModule,
    NbDatepickerModule,
    NbButtonGroupModule,
    NbTabsetModule,
} from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SilStoresService } from '../../shared/sil-http-services/sil_datalayer.service';
import { ThemeModule } from '../../@theme/theme.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { PUBLIC_RISK_ASSESSMENT_STATES } from './public-risk-assessment.states';
import { SkikaLayoutModule } from '../../shared/sil-layout/sil-layout.module';
import { PublicRiskAssessmentComponent } from './public-risk-assessment.component';
import { QuestionnaireModule } from '../advantage/questionnaire/questionnaire.module';
import { SkikaAuthModule } from '../../@core/auth/auth.module';

/**
 * Module that creates Public Assessment Module.
 */
@NgModule({
    imports: [
        UIRouterModule.forChild({ states: PUBLIC_RISK_ASSESSMENT_STATES }),
        CommonModule,
        ThemeModule,
        NbCardModule,
        NbButtonModule,
        SkikaLayoutModule,
        NbCheckboxModule,
        NbDatepickerModule,
        NbIconModule,
        NbRadioModule,
        NgxSkeletonLoaderModule,
        NgSelectModule,
        NbSpinnerModule,
        NbTabsetModule,
        NbTagModule,
        NbFormFieldModule,
        NbTooltipModule,
        NbInputModule,
        NbTreeGridModule,
        NbLayoutModule,
        NbButtonGroupModule,
        QuestionnaireModule,
        SkikaAuthModule,
    ],
    declarations: [PublicRiskAssessmentComponent],
    providers: [SilStoresService],
})
export class PublicRiskAssessmentModule {}
