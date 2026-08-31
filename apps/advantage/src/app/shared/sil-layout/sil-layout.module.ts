import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import {
    NbLayoutModule,
    NbAlertModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
} from '@nebular/theme';
import { AuthInterceptor } from '../sil-http-services/auth-interceptor';

import { SilAlertComponent } from './components/sil-alert/sil-alert.component';
import { SkikaTitleComponent } from './components/skika-title/skika-title.component';
import { SkikaDialogueComponent } from './components/skika-dialogue/skika-dialogue.component';
import { SkikaDrawerComponent } from './components/skika-drawer/skika-drawer.component';
import { SkikaNoDataComponent } from './components/skika-no-data/skika-no-data.component';
import { SkikaPageComponent } from './components/skika-page/skika-page.component';
import { SkikaPageTitleComponent } from './components/skika-page-title/skika-page-title.component';
import { SkikaSideContentComponent } from './components/skika-side-content/skika-side-content.component';
import { SkikaSidescrollComponent } from './components/skika-sidescroll/skika-sidescroll.component';
import { SilSidecontComponent } from './components/sil-sidecont-layout/sil-sidecont-layout.component';
import { CommonModule } from '@angular/common';
import { SkikaChatComponent } from './components/skika-chat/skika-chat.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        NbLayoutModule,
        NbInputModule,
        NbAlertModule,
        NbCardModule,
        NbButtonModule,
    ],
    declarations: [
        SilAlertComponent,
        SkikaTitleComponent,
        SkikaDialogueComponent,
        SkikaDrawerComponent,
        SkikaNoDataComponent,
        SkikaPageComponent,
        SkikaPageTitleComponent,
        SkikaSideContentComponent,
        SkikaSidescrollComponent,
        SilSidecontComponent,
        SkikaChatComponent,
    ],
    exports: [
        SilAlertComponent,
        SkikaTitleComponent,
        SkikaDialogueComponent,
        SkikaDrawerComponent,
        SkikaNoDataComponent,
        SkikaPageComponent,
        SkikaPageTitleComponent,
        SkikaSideContentComponent,
        SkikaSidescrollComponent,
        SilSidecontComponent,
        SkikaChatComponent,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ],
})
export class SkikaLayoutModule {}
