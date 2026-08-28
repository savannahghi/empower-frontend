import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
import { WalletBalanceComponent } from './wallet-balance.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { StateService } from '@uirouter/angular';
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import {
    NbAdjustment,
    NbDynamicOverlayHandler,
    NbIconLibraries,
    NbIconModule,
    NbLayoutDirectionService,
    NbOverlayConfig,
    NbOverlayContainer,
    NbOverlayContent,
    NbOverlayService,
    NbPopoverDirective,
    NbPopoverModule,
    NbPosition,
    NbPositionBuilderService,
    NbRenderableContainer,
    NbStatusService,
    NbToastrService,
    NbTrigger,
    NbTriggerStrategyBuilderService,
} from '@nebular/theme';
import { of, Subject } from 'rxjs';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    ElementRef,
    NO_ERRORS_SCHEMA,
    Type,
} from '@angular/core';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { FeatureFlagService } from 'app/@core/utils/feature.service';

class AuthorizationConfigStub {
    isLoggedIn() {
        return true;
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getErpOrganisation() {
        return {
            client_types: ['PROVIDER'],
            user_workstations: null,
        };
    }
    removeTokenData() {
        return {};
    }
    getToken() {
        return {};
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
}

class NbStatusServiceStub {
    isCustomStatus() {}
    getIcon() {}
    getPack() {}
    registerSvgPack() {}
    setDefaultPack() {}
    connectedTo() {}
    build() {}
    getDirection() {}
    subscribeOnTriggers() {}
    trigger() {}
    host() {}
    container() {}
}

const dynamicOverlayIsShow$ = new Subject();

const dynamicOverlay = {
    show() {},
    hide() {},
    toggle() {},
    destroy() {},
    isShown: dynamicOverlayIsShow$,
};

export class NbDynamicOverlayHandlerMock {
    _componentType: Type<NbRenderableContainer>;
    _host: ElementRef;
    _context: Object = {};
    _content: NbOverlayContent;
    _trigger: NbTrigger = NbTrigger.NOOP;
    _position: NbPosition = NbPosition.TOP;
    _adjustment: NbAdjustment = NbAdjustment.NOOP;
    _offset = 15;
    _overlayConfig: NbOverlayConfig = {};
    _disabled = false;

    constructor() {}

    host(host: ElementRef) {
        this._host = host;
        return this;
    }

    trigger(trigger: NbTrigger) {
        this._trigger = trigger;
        return this;
    }

    position(position: NbPosition) {
        this._position = position;
        return this;
    }

    offset(offset: number) {
        this._offset = offset;
        return this;
    }

    adjustment(adjustment: NbAdjustment) {
        this._adjustment = adjustment;
        return this;
    }

    componentType(componentType: Type<NbRenderableContainer>) {
        this._componentType = componentType;
        return this;
    }

    content(content: NbOverlayContent) {
        this._content = content;
        return this;
    }

    context(context: {}) {
        this._context = context;
        return this;
    }

    overlayConfig(overlayConfig: NbOverlayConfig) {
        this._overlayConfig = overlayConfig;
        return this;
    }

    disabled(disabled: boolean) {
        this._disabled = disabled;
        return this;
    }

    build() {
        return dynamicOverlay;
    }

    rebuild() {
        return dynamicOverlay;
    }

    connect() {}

    disconnect() {}

    destroy() {}
}

export class MockPositionBuilder {
    positionChange = new Subject();
    _connectedTo: ElementRef<any>;
    _position: NbPosition;
    _offset: NbPosition;
    _adjustment: NbAdjustment;

    connectedTo(connectedTo: ElementRef<any>) {
        this._connectedTo = connectedTo;
        return this;
    }

    position(position: NbPosition) {
        this._position = position;
        return this;
    }

    adjustment(adjustment: NbAdjustment) {
        this._adjustment = adjustment;
        return this;
    }

    subscribeOnTriggers(adjustment: NbAdjustment) {
        this._adjustment = adjustment;
        return this;
    }

    host(adjustment: NbAdjustment) {
        this._adjustment = adjustment;
        return this;
    }

    offset(offset: NbPosition) {
        this._offset = offset;
        return this;
    }

    direction(offset: NbPosition) {
        this._offset = offset;
        return this;
    }

    attach() {}

    apply() {}

    detach() {}

    dispose() {}
}

class FeatureFlagServiceStub {
    getForcedValue() {
        return true;
    }
    featuresLoaded: true;
}

describe('WalletBalanceComponent', () => {
    const overlayHandler = new NbDynamicOverlayHandlerMock();
    const mockPositionBuilder = new MockPositionBuilder();
    let component: WalletBalanceComponent;
    let fixture: ComponentFixture<WalletBalanceComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                WalletBalanceComponent,
                NbPopoverModule,
                NbIconModule,
                NbEvaIconsModule,
                FontAwesomeTestingModule,
            ],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: NbOverlayService, useClass: NbStatusServiceStub },
                { provide: NbIconLibraries, useClass: NbStatusServiceStub },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
                {
                    provide: NbOverlayContainer,
                    useValue: mockPositionBuilder,
                },
                {
                    provide: NbPositionBuilderService,
                    useValue: mockPositionBuilder,
                },
                {
                    provide: NbLayoutDirectionService,
                    useClass: NbStatusServiceStub,
                },
                {
                    provide: NbTriggerStrategyBuilderService,
                    useClass: NbStatusServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        })
            .overrideDirective(NbPopoverDirective, {
                set: {
                    providers: [
                        {
                            provide: NbDynamicOverlayHandler,
                            useValue: overlayHandler,
                        },
                    ],
                },
            })
            .compileComponents();

        fixture = TestBed.createComponent(WalletBalanceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test WalletBalanceComponent', () => {
        component.handleResponse({ bulk_sms_account: 1000 });
        component.walletBalance();
        component.errorHandlerFxn({});
        expect(component).toBeTruthy();
    });
    it('should toggle sms drawer', fakeAsync(() => {
        component.toggleSmsDrawer();
        component.walletBalanceAmount = 400;
        spyOn(component.featureService, 'getForcedValue').and.returnValue(true);
        component.handleWalletAlerts();
        component.walletBalanceAmount = 0.65;
        component.handleWalletAlerts();
        component.onCloseAlert();
        component.closePopover();
        tick(2500);
        expect(component.showSmsInstructions).toBe(true);
    }));

    it('should test ngOnit', fakeAsync(() => {
        spyOn(component, 'handleWalletAlerts');
        component.ngOnInit();
        tick(2500);
        expect(component.handleWalletAlerts).toHaveBeenCalled();
    }));

    it('should close card', () => {
        component.closeCard();
        expect(component.showSmsInstructions).toBe(false);
    });
});
