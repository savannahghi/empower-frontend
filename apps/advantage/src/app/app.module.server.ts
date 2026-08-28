import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
    providers: [provideCharts(withDefaultRegisterables())],
    imports: [AppModule, ServerModule],
    bootstrap: [AppComponent],
})
export class AppServerModule {}
