import {
    Component,
    OnInit,
    OnDestroy,
    AfterViewInit,
    ViewChild,
    ElementRef,
    Input,
    inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { embedDashboard } from '@superset-ui/embedded-sdk';
import { EmbeddedDashboardService } from './embedded-dashboard.service';
import { ErrorHandlerService } from '../sil-http-services/error-handler';
import { NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-embedded-dashboard',
    templateUrl: './embedded-dashboard.component.html',
    styleUrls: ['./embedded-dashboard.component.scss'],
    standalone: false,
})
export class EmbeddedDashboardComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    @ViewChild('dashboardContainer')
    dashboardContainer!: ElementRef<HTMLDivElement>;

    /**
     * Optional Superset server URL. If not provided, the default from environment settings will be used.
     */
    @Input() serverUrl?: string;

    /**
     * Required Superset dashboard ID to embed.
     */
    @Input() dashboardId!: string;

    /**
     * Optional flags to customize the dashboard UI.
     */
    @Input() hideTitle: boolean = false;
    @Input() hideTab: boolean = true;
    @Input() hideChartControls: boolean = false;

    /**
     * Loading and error state management
     */
    loading: boolean = false;
    errorMessage: string = '';

    dashboardEmbedded = false;
    private subscriptions: Subscription[] = [];
    private dashboardService = inject(EmbeddedDashboardService);
    private errorHandler = inject(ErrorHandlerService);
    private toastrService = inject(NbToastrService);

    constructor() {
        this.subscriptions.push(
            this.dashboardService.loading$.subscribe(isLoading => {
                this.loading = isLoading;
            })
        );

        this.subscriptions.push(
            this.dashboardService.error$.subscribe(error => {
                if (error) {
                    this.errorMessage = error;
                    this.toastrService.danger(error, 'Dashboard Error');
                }
            })
        );

        this.subscriptions.push(
            this.dashboardService.guestToken$.subscribe(token => {
                if (token && this.dashboardId && !this.dashboardEmbedded) {
                    this.embedDashboard(token);
                }
            })
        );
    }

    ngOnInit(): void {
        this.validateInputs();
        if (this.dashboardId) {
            this.errorMessage = '';
            this.dashboardEmbedded = false;
            this.initializeDashboard();
        }
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            if (this.dashboardId && !this.dashboardEmbedded && !this.loading) {
                this.initializeDashboard();
            }
        }, 300);
    }

    private validateInputs(): void {
        if (!this.dashboardId) {
            const errorMessage =
                'Missing required dashboard configuration: dashboardId';
            this.errorMessage = errorMessage;
            this.toastrService.danger(errorMessage, 'Configuration Error', {
                position: 'bottom-right' as NbGlobalPosition,
            });
        }
    }

    /**
     * Initialize dashboard
     */
    private initializeDashboard(): void {
        try {
            if (!this.dashboardContainer?.nativeElement) {
                setTimeout(() => this.initializeDashboard(), 1000);
                return;
            }

            if (this.dashboardEmbedded || this.loading || this.errorMessage) {
                return;
            }

            this.dashboardService.initializeDashboard({
                serverUrl: this.serverUrl,
                dashboardId: this.dashboardId,
            });
        } catch (error) {
            this.errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to initialize dashboard';
            this.toastrService.danger(this.errorMessage, 'Dashboard Error', {
                position: 'bottom-right' as NbGlobalPosition,
            });
        }
    }

    private async embedDashboard(token: string): Promise<void> {
        try {
            this.loading = true;
            const serverUrl = this.serverUrl || environment.supersetServerUrl;

            if (
                this.dashboardContainer?.nativeElement.offsetWidth === 0 ||
                this.dashboardContainer?.nativeElement.offsetHeight === 0
            ) {
                if (this.dashboardContainer) {
                    this.dashboardContainer.nativeElement.style.minHeight =
                        '400px';
                }
            }

            if (!this.dashboardContainer || !token) {
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 2000));

            await embedDashboard({
                id: this.dashboardId,
                supersetDomain: serverUrl,
                mountPoint: this.dashboardContainer.nativeElement,
                fetchGuestToken: () => Promise.resolve(token),
                dashboardUiConfig: {
                    hideTitle: this.hideTitle,
                    hideTab: this.hideTab,
                    hideChartControls: this.hideChartControls,
                },
            });

            this.dashboardEmbedded = true;
            this.toastrService.success(
                'Dashboard loaded successfully',
                'Success',
                { position: 'bottom-right' as NbGlobalPosition }
            );
        } catch (error) {
            this.errorMessage = 'Failed to embed dashboard';
            this.dashboardEmbedded = false;
            this.errorHandler.handleError(error, this);

            if (error instanceof Error) {
                this.errorMessage = `Failed to embed dashboard: ${error.message}`;
                this.toastrService.danger(
                    this.errorMessage,
                    'Dashboard Error',
                    {
                        position: 'bottom-right' as NbGlobalPosition,
                    }
                );
            }
        } finally {
            this.loading = false;
        }
    }

    retry(): void {
        this.errorMessage = '';
        this.dashboardEmbedded = false;
        this.initializeDashboard();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
