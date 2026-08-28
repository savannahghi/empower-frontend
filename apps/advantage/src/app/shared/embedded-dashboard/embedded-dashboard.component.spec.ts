import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
} from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { EmbeddedDashboardComponent } from './embedded-dashboard.component';
import { EmbeddedDashboardService } from './embedded-dashboard.service';
import { ErrorHandlerService } from '../sil-http-services/error-handler';
import { NbToastrService, NbGlobalPosition } from '@nebular/theme';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as embedSdk from '@superset-ui/embedded-sdk';
import { environment } from '../../../environments/environment';

describe('EmbeddedDashboardComponent', () => {
    let component: EmbeddedDashboardComponent;
    let fixture: ComponentFixture<EmbeddedDashboardComponent>;
    let dashboardServiceSpy: jasmine.SpyObj<EmbeddedDashboardService>;
    let errorHandlerSpy: jasmine.SpyObj<ErrorHandlerService>;
    let toastrSpy: jasmine.SpyObj<NbToastrService>;

    let loadingSubject: BehaviorSubject<boolean>;
    let errorSubject: BehaviorSubject<string | null>;
    let guestTokenSubject: BehaviorSubject<string>;

    function createEmbedDashboardSpy(returnValue: any = {}): jasmine.Spy {
        return spyOn(embedSdk, 'embedDashboard').and.returnValue(
            Promise.resolve(returnValue)
        );
    }

    beforeEach(async () => {
        loadingSubject = new BehaviorSubject<boolean>(false);
        errorSubject = new BehaviorSubject<string | null>(null);
        guestTokenSubject = new BehaviorSubject<string>('');

        dashboardServiceSpy = jasmine.createSpyObj('EmbeddedDashboardService', [
            'initializeDashboard',
        ]);
        Object.defineProperty(dashboardServiceSpy, 'loading$', {
            value: loadingSubject.asObservable(),
        });
        Object.defineProperty(dashboardServiceSpy, 'error$', {
            value: errorSubject.asObservable(),
        });
        Object.defineProperty(dashboardServiceSpy, 'guestToken$', {
            value: guestTokenSubject.asObservable(),
        });

        errorHandlerSpy = jasmine.createSpyObj('ErrorHandlerService', [
            'handleError',
        ]);
        toastrSpy = jasmine.createSpyObj('NbToastrService', [
            'success',
            'warning',
            'danger',
        ]);

        await TestBed.configureTestingModule({
            declarations: [EmbeddedDashboardComponent],
            providers: [
                {
                    provide: EmbeddedDashboardService,
                    useValue: dashboardServiceSpy,
                },
                { provide: ErrorHandlerService, useValue: errorHandlerSpy },
                { provide: NbToastrService, useValue: toastrSpy },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EmbeddedDashboardComponent);
        component = fixture.componentInstance;
        component.dashboardId = 'test-dashboard-id';
        component.loading = false;
        component.errorMessage = '';
        component.dashboardEmbedded = false;
        toastrSpy.success.calls.reset();
        toastrSpy.warning.calls.reset();
        toastrSpy.danger.calls.reset();
    });

    afterEach(() => {
        loadingSubject.complete();
        errorSubject.complete();
        guestTokenSubject.complete();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('constructor subscriptions', () => {
        it('should subscribe to service loading$ and update component loading state', () => {
            loadingSubject.next(true);
            expect(component.loading).toBe(true);

            loadingSubject.next(false);
            expect(component.loading).toBe(false);
        });

        it('should subscribe to service error$ and update component error state', () => {
            const mockError = 'Test error message';

            errorSubject.next(mockError);

            expect(component.errorMessage).toBe(mockError);
            expect(toastrSpy.danger).toHaveBeenCalledWith(
                mockError,
                'Dashboard Error'
            );
        });

        it('should subscribe to guestToken$ and call embedDashboard when token received', fakeAsync(() => {
            const mockToken = 'test-guest-token';
            component.dashboardId = 'test-dashboard';
            component.dashboardEmbedded = false;
            spyOn<any>(component, 'embedDashboard');

            guestTokenSubject.next(mockToken);
            tick();

            expect(component['embedDashboard']).toHaveBeenCalledWith(mockToken);
        }));
    });

    describe('timing and delay functionality', () => {
        it('should wait 2 seconds before calling embedDashboard in fakeAsync', fakeAsync(() => {
            component.dashboardId = 'test-dashboard';
            component['dashboardContainer'] = {
                nativeElement: document.createElement('div'),
            } as any;
            const embedSpy = createEmbedDashboardSpy();

            component['embedDashboard']('test-token');
            expect(embedSpy).not.toHaveBeenCalled();

            tick(1000);
            expect(embedSpy).not.toHaveBeenCalled();

            tick(1000);
            expect(embedSpy).toHaveBeenCalled();
        }));

        it('should wait 300ms in ngAfterViewInit before calling initializeDashboard', fakeAsync(() => {
            component.dashboardId = 'test-dashboard';
            spyOn<any>(component, 'initializeDashboard');

            component.ngAfterViewInit();

            expect(component['initializeDashboard']).not.toHaveBeenCalled();

            tick(300);
            expect(component['initializeDashboard']).toHaveBeenCalled();
        }));

        it('should not call initializeDashboard in ngAfterViewInit if no dashboardId', fakeAsync(() => {
            component.dashboardId = '';
            spyOn<any>(component, 'initializeDashboard');

            component.ngAfterViewInit();
            tick(300);

            expect(component['initializeDashboard']).not.toHaveBeenCalled();
        }));

        it('should not call initializeDashboard in ngAfterViewInit if already embedded', fakeAsync(() => {
            component.dashboardId = 'test-dashboard';
            component.dashboardEmbedded = true;
            spyOn<any>(component, 'initializeDashboard');

            component.ngAfterViewInit();
            tick(300);

            expect(component['initializeDashboard']).not.toHaveBeenCalled();
        }));

        it('should not call initializeDashboard in ngAfterViewInit if loading', fakeAsync(() => {
            component.dashboardId = 'test-dashboard';
            component.loading = true;
            spyOn<any>(component, 'initializeDashboard');

            component.ngAfterViewInit();
            tick(300);

            expect(component['initializeDashboard']).not.toHaveBeenCalled();
        }));
    });

    describe('component lifecycle and basic functionality', () => {
        it('should call initializeDashboard on ngOnInit if dashboardId is provided', () => {
            component.dashboardId = 'test-dashboard-id';
            spyOn<any>(component, 'initializeDashboard');

            component.ngOnInit();

            expect(component['initializeDashboard']).toHaveBeenCalled();
            expect(component.errorMessage).toBe('');
            expect(component.dashboardEmbedded).toBe(false);
        });

        it('should not call initializeDashboard on ngOnInit if dashboardId is not provided', () => {
            component.dashboardId = '';
            spyOn<any>(component, 'initializeDashboard');

            component.ngOnInit();

            expect(component['initializeDashboard']).not.toHaveBeenCalled();
            const toastrConfig = {
                position: 'bottom-right' as NbGlobalPosition,
            };
            expect(toastrSpy.danger).toHaveBeenCalledWith(
                'Missing required dashboard configuration: dashboardId',
                'Configuration Error',
                toastrConfig
            );
        });

        it('should call validateInputs and show error for missing dashboardId', () => {
            spyOn<any>(component, 'validateInputs').and.callThrough();
            component.dashboardId = '';

            component.ngOnInit();

            expect(component['validateInputs']).toHaveBeenCalled();
            expect(component.errorMessage).toBe(
                'Missing required dashboard configuration: dashboardId'
            );
            expect(toastrSpy.danger).toHaveBeenCalledWith(
                'Missing required dashboard configuration: dashboardId',
                'Configuration Error',
                { position: 'bottom-right' as NbGlobalPosition }
            );
        });

        it('should update loading state from service', () => {
            loadingSubject.next(true);
            expect(component.loading).toBe(true);
            loadingSubject.next(false);
            expect(component.loading).toBe(false);
        });

        it('should display error from service', () => {
            const testError = 'Test error message';
            errorSubject.next(testError);
            expect(component.errorMessage).toBe(testError);
            expect(toastrSpy.danger).toHaveBeenCalledWith(
                testError,
                'Dashboard Error'
            );
        });

        it('should call initializeDashboard service when initializeDashboard is called', fakeAsync(() => {
            component.dashboardId = 'test-dashboard-id';
            component.serverUrl = 'http://test-server';
            const mockElement = document.createElement('div');
            component['dashboardContainer'] = {
                nativeElement: mockElement,
            } as any;

            component['initializeDashboard']();
            tick();

            expect(
                dashboardServiceSpy.initializeDashboard
            ).toHaveBeenCalledWith({
                serverUrl: 'http://test-server',
                dashboardId: 'test-dashboard-id',
            });
        }));

        it('should use environment serverUrl when not provided in initializeDashboard', fakeAsync(() => {
            component.serverUrl = undefined;
            component.dashboardId = 'test-dashboard-id';
            const mockElement = document.createElement('div');
            component['dashboardContainer'] = {
                nativeElement: mockElement,
            } as any;

            component['initializeDashboard']();
            tick();

            expect(
                dashboardServiceSpy.initializeDashboard
            ).toHaveBeenCalledWith({
                serverUrl: undefined,
                dashboardId: 'test-dashboard-id',
            });
        }));

        it('should set minHeight if container dimensions are zero', fakeAsync(() => {
            const mockElement = document.createElement('div');
            Object.defineProperty(mockElement, 'offsetWidth', { value: 0 });
            Object.defineProperty(mockElement, 'offsetHeight', { value: 0 });

            component['dashboardContainer'] = {
                nativeElement: mockElement,
            } as any;
            component.dashboardId = 'test-dashboard';

            component['embedDashboard']('test-token');
            tick(2000);

            expect(mockElement.style.minHeight).toBe('400px');
        }));

        it('should handle errors when embedding fails', async () => {
            const testError = new Error('Embedding failed');
            spyOn(embedSdk, 'embedDashboard').and.returnValue(
                Promise.reject(testError)
            );

            const mockElement = document.createElement('div');
            component['dashboardContainer'] = {
                nativeElement: mockElement,
            } as any;

            await component['embedDashboard']('test-token');

            expect(errorHandlerSpy.handleError).toHaveBeenCalledWith(
                testError,
                component
            );
            expect(toastrSpy.danger).toHaveBeenCalled();
            expect(component.errorMessage).toContain(
                'Failed to embed dashboard'
            );
        });

        it('should show success toast when dashboard loads successfully', fakeAsync(() => {
            component.dashboardId = 'test-dashboard';
            const mockElement = document.createElement('div');
            component['dashboardContainer'] = {
                nativeElement: mockElement,
            } as any;
            const embedSpy = createEmbedDashboardSpy();

            component['embedDashboard']('test-token');
            tick(2000);

            expect(embedSpy).toHaveBeenCalled();
            expect(component.dashboardEmbedded).toBe(true);
            expect(toastrSpy.success).toHaveBeenCalledWith(
                'Dashboard loaded successfully',
                'Success',
                { position: 'bottom-right' as NbGlobalPosition }
            );
        }));

        it('should retry embedding dashboard when retry is called', () => {
            spyOn<any>(component, 'initializeDashboard');
            component.errorMessage = 'Some error';
            component.dashboardEmbedded = true;

            component.retry();

            expect(component.errorMessage).toBe('');
            expect(component.dashboardEmbedded).toBe(false);
            expect(component['initializeDashboard']).toHaveBeenCalled();
        });

        it('should unsubscribe from all subscriptions on ngOnDestroy', () => {
            const subscription1 = jasmine.createSpyObj('Subscription', [
                'unsubscribe',
            ]);
            const subscription2 = jasmine.createSpyObj('Subscription', [
                'unsubscribe',
            ]);
            component['subscriptions'] = [subscription1, subscription2];
            component.ngOnDestroy();
            expect(subscription1.unsubscribe).toHaveBeenCalled();
            expect(subscription2.unsubscribe).toHaveBeenCalled();
        });
    });

    describe('initializeDashboard', () => {
        it('should return early when dashboardContainer nativeElement is missing', fakeAsync(() => {
            const setTimeoutSpy = spyOn(window, 'setTimeout').and.callThrough();
            component['dashboardContainer'] = { nativeElement: null } as any;

            component['initializeDashboard']();
            tick(1000);

            expect(setTimeoutSpy).toHaveBeenCalledWith(
                jasmine.any(Function),
                1000
            );
            expect(
                dashboardServiceSpy.initializeDashboard
            ).not.toHaveBeenCalled();
        }));

        it('should return early when guard conditions are met (dashboardEmbedded=true)', () => {
            component.dashboardEmbedded = true;
            component.loading = false;
            component.errorMessage = '';
            const mockElement = document.createElement('div');
            component['dashboardContainer'] = {
                nativeElement: mockElement,
            } as any;

            component['initializeDashboard']();

            expect(
                dashboardServiceSpy.initializeDashboard
            ).not.toHaveBeenCalled();
        });

        it('should return early when guard conditions are met (loading=true)', () => {
            component.dashboardEmbedded = false;
            component.loading = true;
            component.errorMessage = '';
            const mockElement = document.createElement('div');
            component['dashboardContainer'] = {
                nativeElement: mockElement,
            } as any;

            component['initializeDashboard']();

            expect(
                dashboardServiceSpy.initializeDashboard
            ).not.toHaveBeenCalled();
        });

        it('should return early when guard conditions are met (errorMessage set)', () => {
            component.dashboardEmbedded = false;
            component.loading = false;
            component.errorMessage = 'Test error';
            const mockElement = document.createElement('div');
            component['dashboardContainer'] = {
                nativeElement: mockElement,
            } as any;

            component['initializeDashboard']();

            expect(
                dashboardServiceSpy.initializeDashboard
            ).not.toHaveBeenCalled();
        });

        it('should schedule a retry if dashboard container is not available', fakeAsync(() => {
            const initializeSpy = spyOn<any>(
                component,
                'initializeDashboard'
            ).and.callThrough();
            const setTimeoutSpy = spyOn(window, 'setTimeout').and.returnValue(
                123 as any
            );
            component['dashboardContainer'] = undefined as any;

            component['initializeDashboard']();
            expect(initializeSpy).toHaveBeenCalledTimes(1);
            expect(setTimeoutSpy).toHaveBeenCalledWith(
                jasmine.any(Function),
                1000
            );
        }));

        it('should schedule a retry if dashboard container nativeElement is null', fakeAsync(() => {
            const setTimeoutSpy = spyOn(window, 'setTimeout').and.returnValue(
                123 as any
            );
            component['dashboardContainer'] = { nativeElement: null } as any;

            component['initializeDashboard']();

            expect(setTimeoutSpy).toHaveBeenCalledWith(
                jasmine.any(Function),
                1000
            );
            expect(
                dashboardServiceSpy.initializeDashboard
            ).not.toHaveBeenCalled();
        }));

        it('should schedule a retry if dashboard container nativeElement is undefined', fakeAsync(() => {
            const setTimeoutSpy = spyOn(window, 'setTimeout').and.returnValue(
                123 as any
            );
            component['dashboardContainer'] = {
                nativeElement: undefined,
            } as any;

            component['initializeDashboard']();

            expect(setTimeoutSpy).toHaveBeenCalledWith(
                jasmine.any(Function),
                1000
            );
            expect(
                dashboardServiceSpy.initializeDashboard
            ).not.toHaveBeenCalled();
        }));

        it('should not attempt to embed if already embedded', () => {
            component.dashboardEmbedded = true;
            component.loading = false;
            component.errorMessage = '';
            const mockElement = document.createElement('div');
            component['dashboardContainer'] = {
                nativeElement: mockElement,
            } as any;

            component['initializeDashboard']();

            expect(
                dashboardServiceSpy.initializeDashboard
            ).not.toHaveBeenCalled();
        });

        it('should not attempt to embed if already loading', () => {
            component.dashboardEmbedded = false;
            component.loading = true;
            component.errorMessage = '';
            const mockElement = document.createElement('div');
            component['dashboardContainer'] = {
                nativeElement: mockElement,
            } as any;

            component['initializeDashboard']();

            expect(
                dashboardServiceSpy.initializeDashboard
            ).not.toHaveBeenCalled();
        });

        it('should not attempt to embed if errorMessage exists (third condition)', () => {
            component.dashboardEmbedded = false;
            component.loading = false;
            component.errorMessage = 'Some error';
            const mockElement = document.createElement('div');
            component['dashboardContainer'] = {
                nativeElement: mockElement,
            } as any;

            component['initializeDashboard']();

            expect(
                dashboardServiceSpy.initializeDashboard
            ).not.toHaveBeenCalled();
        });

        it('should proceed when dashboardContainer exists and no guard conditions are met', fakeAsync(() => {
            // Ensure all guard conditions are false
            component.dashboardEmbedded = false;
            component.loading = false;
            component.errorMessage = '';
            const mockElement = document.createElement('div');
            component['dashboardContainer'] = {
                nativeElement: mockElement,
            } as any;

            component['initializeDashboard']();
            tick();

            expect(dashboardServiceSpy.initializeDashboard).toHaveBeenCalled();
        }));

        it('should handle dashboardContainer nativeElement being falsy and schedule retry', () => {
            const setTimeoutSpy = spyOn(window, 'setTimeout').and.returnValue(
                123 as any
            );
            component['dashboardContainer'] = { nativeElement: null } as any;
            component.dashboardEmbedded = false;
            component.loading = false;
            component.errorMessage = '';

            component['initializeDashboard']();

            expect(setTimeoutSpy).toHaveBeenCalledWith(
                jasmine.any(Function),
                1000
            );
            expect(
                dashboardServiceSpy.initializeDashboard
            ).not.toHaveBeenCalled();
        });

        it('should return early when dashboardContainer is undefined', () => {
            const setTimeoutSpy = spyOn(window, 'setTimeout').and.returnValue(
                123 as any
            );
            component['dashboardContainer'] = undefined as any;
            component.dashboardEmbedded = false;
            component.loading = false;
            component.errorMessage = '';

            component['initializeDashboard']();

            expect(setTimeoutSpy).toHaveBeenCalledWith(
                jasmine.any(Function),
                1000
            );
            expect(
                dashboardServiceSpy.initializeDashboard
            ).not.toHaveBeenCalled();
        });
    });

    describe('embedDashboard early returns', () => {
        let embedSdkSpy: jasmine.Spy;

        beforeEach(() => {
            embedSdkSpy = spyOn(embedSdk, 'embedDashboard');
        });

        it('should return early if dashboardContainer is missing', async () => {
            component['dashboardContainer'] = undefined;

            await component['embedDashboard']('test-token');
            expect(embedSdkSpy).not.toHaveBeenCalled();
        });

        it('should return early if token is missing', async () => {
            component['dashboardContainer'] = {
                nativeElement: document.createElement('div'),
            } as any;

            await component['embedDashboard']('');
            expect(embedSdkSpy).not.toHaveBeenCalled();
        });
    });

    describe('input validation and edge cases', () => {
        it('should handle undefined serverUrl input', () => {
            component.serverUrl = undefined;
            component.dashboardId = 'test-id';
            spyOn<any>(component, 'initializeDashboard');

            component.ngOnInit();

            expect(component['initializeDashboard']).toHaveBeenCalled();
        });

        it('should handle boolean input flags correctly', () => {
            component.hideTitle = true;
            component.hideTab = false;
            component.hideChartControls = true;

            expect(component.hideTitle).toBe(true);
            expect(component.hideTab).toBe(false);
            expect(component.hideChartControls).toBe(true);
        });

        it('should validate dashboardId is required and show error for empty string', () => {
            component.dashboardId = '';
            component.ngOnInit();

            expect(toastrSpy.danger).toHaveBeenCalledWith(
                'Missing required dashboard configuration: dashboardId',
                'Configuration Error',
                jasmine.any(Object)
            );
        });
    });

    describe('loading state management', () => {
        it('should initialize with loading false', () => {
            expect(component.loading).toBe(false);
        });

        it('should reflect service loading state changes', () => {
            expect(component.loading).toBe(false);

            loadingSubject.next(true);
            expect(component.loading).toBe(true);

            loadingSubject.next(false);
            expect(component.loading).toBe(false);
        });

        it('should handle rapid loading state changes', () => {
            loadingSubject.next(true);
            loadingSubject.next(false);
            loadingSubject.next(true);
            loadingSubject.next(false);

            expect(component.loading).toBe(false);
        });
    });

    describe('error handling edge cases', () => {
        it('should initialize with empty error message', () => {
            expect(component.errorMessage).toBe('');
        });

        it('should handle null error from service', () => {
            errorSubject.next(null);
            expect(component.errorMessage).toBe('');
            expect(toastrSpy.danger).not.toHaveBeenCalled();
        });

        it('should handle empty error string from service', () => {
            errorSubject.next('');

            expect(component.errorMessage).toBe('');
            expect(toastrSpy.danger).not.toHaveBeenCalled();
        });

        it('should handle multiple error messages', () => {
            const error1 = 'First error';
            const error2 = 'Second error';

            errorSubject.next(error1);
            expect(component.errorMessage).toBe(error1);
            expect(toastrSpy.danger).toHaveBeenCalledWith(
                error1,
                'Dashboard Error'
            );

            errorSubject.next(error2);
            expect(component.errorMessage).toBe(error2);
            expect(toastrSpy.danger).toHaveBeenCalledWith(
                error2,
                'Dashboard Error'
            );
        });

        it('should handle non-Error objects in embedDashboard catch block', async () => {
            const nonErrorObject = { code: 500 };
            spyOn(embedSdk, 'embedDashboard').and.returnValue(
                Promise.reject(nonErrorObject)
            );

            const mockElement = document.createElement('div');
            component['dashboardContainer'] = {
                nativeElement: mockElement,
            } as any;
            component.dashboardId = 'test-dashboard';

            await component['embedDashboard']('test-token');

            expect(errorHandlerSpy.handleError).toHaveBeenCalledWith(
                nonErrorObject,
                component
            );
            expect(component.errorMessage).toBe('Failed to embed dashboard');
            expect(component.dashboardEmbedded).toBe(false);
            expect(component.loading).toBe(false);
        });
    });

    describe('embedDashboard specific behaviors', () => {
        it('should set loading to true at the start of embedDashboard', fakeAsync(() => {
            const mockElement = document.createElement('div');
            component['dashboardContainer'] = {
                nativeElement: mockElement,
            } as any;
            component.dashboardId = 'test-dashboard';
            component.loading = false;

            createEmbedDashboardSpy();

            component['embedDashboard']('test-token');

            expect(component.loading).toBe(true);

            tick(2000);
            expect(component.loading).toBe(false);
        }));

        it('should use environment serverUrl when serverUrl is undefined', fakeAsync(() => {
            const embedSpy = createEmbedDashboardSpy();
            const mockElement = document.createElement('div');
            component['dashboardContainer'] = {
                nativeElement: mockElement,
            } as any;
            component.dashboardId = 'test-dashboard';
            component.serverUrl = undefined;

            component['embedDashboard']('test-token');
            tick(2000);

            expect(embedSpy).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    supersetDomain: environment.supersetServerUrl,
                })
            );
        }));

        it('should not set minHeight if container has width > 0 and height > 0', fakeAsync(() => {
            const mockElement = document.createElement('div');
            Object.defineProperty(mockElement, 'offsetWidth', { value: 100 });
            Object.defineProperty(mockElement, 'offsetHeight', { value: 100 });

            component['dashboardContainer'] = {
                nativeElement: mockElement,
            } as any;
            component.dashboardId = 'test-dashboard';
            createEmbedDashboardSpy();

            component['embedDashboard']('test-token');
            tick(2000);

            expect(mockElement.style.minHeight).toBe('');
        }));

        it('should set minHeight if container exists but offsetWidth is 0', fakeAsync(() => {
            const mockElement = document.createElement('div');
            Object.defineProperty(mockElement, 'offsetWidth', { value: 0 });
            Object.defineProperty(mockElement, 'offsetHeight', { value: 100 });

            component['dashboardContainer'] = {
                nativeElement: mockElement,
            } as any;
            component.dashboardId = 'test-dashboard';
            createEmbedDashboardSpy();

            component['embedDashboard']('test-token');
            tick(2000);

            expect(mockElement.style.minHeight).toBe('400px');
        }));

        it('should set minHeight if container exists but offsetHeight is 0', fakeAsync(() => {
            const mockElement = document.createElement('div');
            Object.defineProperty(mockElement, 'offsetWidth', { value: 100 });
            Object.defineProperty(mockElement, 'offsetHeight', { value: 0 });

            component['dashboardContainer'] = {
                nativeElement: mockElement,
            } as any;
            component.dashboardId = 'test-dashboard';
            createEmbedDashboardSpy();

            component['embedDashboard']('test-token');
            tick(2000);

            expect(mockElement.style.minHeight).toBe('400px');
        }));

        it('should pass all UI config flags to embedDashboard', fakeAsync(() => {
            const embedSpy = createEmbedDashboardSpy();
            const mockElement = document.createElement('div');
            component['dashboardContainer'] = {
                nativeElement: mockElement,
            } as any;
            component.dashboardId = 'test-dashboard';
            component.hideTitle = true;
            component.hideTab = false;
            component.hideChartControls = true;

            component['embedDashboard']('test-token');
            tick(2000);

            expect(embedSpy).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    dashboardUiConfig: {
                        hideTitle: true,
                        hideTab: false,
                        hideChartControls: true,
                    },
                })
            );
        }));
    });

    describe('error handling in initializeDashboard', () => {
        it('should handle errors thrown during dashboard initialization with Error instance', () => {
            const testError = new Error('Initialization failed');
            dashboardServiceSpy.initializeDashboard.and.throwError(testError);

            const mockElement = document.createElement('div');
            component['dashboardContainer'] = {
                nativeElement: mockElement,
            } as any;
            component.dashboardId = 'test-dashboard';
            component.serverUrl = 'http://test-server';
            component.dashboardEmbedded = false;
            component.loading = false;
            component.errorMessage = '';

            component['initializeDashboard']();

            expect(component.errorMessage).toBe('Initialization failed');
            expect(toastrSpy.danger).toHaveBeenCalledWith(
                'Initialization failed',
                'Dashboard Error',
                {
                    position: 'bottom-right' as NbGlobalPosition,
                }
            );
        });

        it('should handle errors thrown during dashboard initialization with non-Error instance', () => {
            const testError = 'String error message';
            dashboardServiceSpy.initializeDashboard.and.callFake(() => {
                throw testError;
            });

            const mockElement = document.createElement('div');
            component['dashboardContainer'] = {
                nativeElement: mockElement,
            } as any;
            component.dashboardId = 'test-dashboard';
            component.serverUrl = 'http://test-server';
            component.dashboardEmbedded = false;
            component.loading = false;
            component.errorMessage = '';

            component['initializeDashboard']();

            expect(component.errorMessage).toBe(
                'Failed to initialize dashboard'
            );
            expect(toastrSpy.danger).toHaveBeenCalledWith(
                'Failed to initialize dashboard',
                'Dashboard Error',
                {
                    position: 'bottom-right' as NbGlobalPosition,
                }
            );
        });
    });
});
