import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmbeddedDashboardComponent } from './embedded-dashboard.component';
import { DashboardWrapperComponent } from './dashboard-wrapper.component';
import { EmbeddedDashboardService } from './embedded-dashboard.service';

@NgModule({
    declarations: [EmbeddedDashboardComponent, DashboardWrapperComponent],
    imports: [CommonModule],
    exports: [EmbeddedDashboardComponent, DashboardWrapperComponent],
    providers: [EmbeddedDashboardService],
})
export class EmbeddedDashboardModule {}
