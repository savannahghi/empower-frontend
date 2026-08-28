import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
    NbCardModule,
    NbButtonModule,
    NbRadioModule,
    NbInputModule,
    NbFormFieldModule,
    NbIconModule,
    NbAlertModule,
    NbTooltipModule,
    NbSpinnerModule,
    NbCheckboxModule,
    NbSelectModule,
    NbBadgeModule,
    NbListModule,
    NbAccordionModule,
    NbSearchModule,
} from '@nebular/theme';

import { QuestionnaireRendererComponent } from './renderer/questionnaire-renderer.component';
import { QuestionnaireService } from './questionnaire.service';

@NgModule({
    declarations: [QuestionnaireRendererComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NbCardModule,
        NbButtonModule,
        NbRadioModule,
        NbInputModule,
        NbFormFieldModule,
        NbIconModule,
        NbAlertModule,
        NbTooltipModule,
        NbSpinnerModule,
        NbCheckboxModule,
        NbSelectModule,
        NbBadgeModule,
        NbListModule,
        NbAccordionModule,
        NbSearchModule,
    ],
    providers: [QuestionnaireService],
    exports: [QuestionnaireRendererComponent],
})
export class QuestionnaireModule {}
