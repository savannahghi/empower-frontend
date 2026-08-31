import { NgModule } from '@angular/core';

import { UIRouterModule } from '@uirouter/angular';
import { ThemeModule } from '../@theme/theme.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SkikaFormModule } from '../shared/sil-form/sil-form.module';
import { FeaturesComponent } from './features.component';

import {
    NbAccordionModule,
    NbAlertModule,
    NbButtonModule,
    NbCheckboxModule,
    NbInputModule,
    NbRadioModule,
    NbCardModule,
    NbCalendarModule,
    NbListModule,
    NbLayoutModule,
    NbMenuModule,
} from '@nebular/theme';
import { ResolverService } from './services/resolver.service';
import { NgxTranslateModule } from '../shared/translate/translate.module';
import { DirectivesModule } from '../shared/directives/directive.module';

@NgModule({
    imports: [
        UIRouterModule,
        ThemeModule,
        NbAccordionModule,
        NbCardModule,
        NbCalendarModule,
        NbLayoutModule,
        NbAlertModule,
        NbInputModule,
        NbButtonModule,
        NbCheckboxModule,
        NbRadioModule,
        NbMenuModule,
        NgSelectModule,
        NbListModule,
        FormsModule,
        SkikaFormModule,
        NgxTranslateModule,
        DirectivesModule,
    ],
    declarations: [FeaturesComponent],
    providers: [ResolverService],
})
export class FeaturesModule {}
