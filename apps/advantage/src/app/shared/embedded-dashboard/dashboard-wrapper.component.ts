import { Component, Input, Inject, Optional } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-dashboard-wrapper',
    standalone: false,
    template: `
        <div class="dashboard-wrapper">
            <div class="dashboard-container">
                <app-embedded-dashboard
                    [dashboardId]="resolvedDashboardId"
                    [hideTitle]="false"
                    [hideTab]="true"
                    [hideChartControls]="false">
                </app-embedded-dashboard>
            </div>
        </div>
    `,
    styleUrls: ['./embedded-dashboard.component.scss'],
    host: {
        class: 'w-full',
    },
})
export class DashboardWrapperComponent {
    /**
     * Dynamic Dashboard UUID input
     */
    @Input() dashboardId?: string;

    @Input() dashboardKey?: string;

    constructor(
        @Optional()
        @Inject('dashboardKey')
        private injectedDashboardKey?: string
    ) {}

    get resolvedDashboardId(): string {
        // Use injected dashboard key from state resolution first
        const keyToUse = this.dashboardKey || this.injectedDashboardKey;

        let resolvedKey = '';
        if (keyToUse && environment.supersetDashboardUuids) {
            const dashboardIds = JSON.parse(environment.supersetDashboardUuids);
            resolvedKey = dashboardIds[keyToUse] || '';
        }

        return this.dashboardId || resolvedKey;
    }
}
