import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ServiceRequestListItemComponent } from './service-request-list-item.component';
import { of, Subject } from 'rxjs';
import {
    NbAdjustment,
    NbDialogRef,
    NbDynamicOverlayHandler,
    NbFocusMonitor,
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
    NbTooltipDirective,
    NbTrigger,
    NbTriggerStrategyBuilderService,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ElementRef, Type } from '@angular/core';

class NbStatusServiceStub {
    isCustomStatus() {}
    monitor() {
        return of(() => {});
    }
    getIcon() {}
    getPack() {}
    registerSvgPack() {}
    setDefaultPack() {}
    connectedTo() {}
    build() {}
    close() {}
    getDirection() {}
    subscribeOnTriggers() {}
    trigger() {}
    host() {}
    container() {}
}

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
    }
}

const dynamicOverlayIsShow$ = new Subject();

const dynamicOverlay = {
    show() {},
    hide() {},
    toggle() {},
    destroy() {},
    isShown: dynamicOverlayIsShow$,
};

class NbDynamicOverlayHandlerMock {
    _componentType: Type<NbRenderableContainer>;
    _host: ElementRef = new ElementRef(document.createElement('div')); // Ensure a valid host
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
        this._host = host || new ElementRef(document.createElement('div')); // Ensure host is always set
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

class MockPositionBuilder {
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

describe('ServiceRequestListItemComponent', () => {
    let component: ServiceRequestListItemComponent;
    let fixture: ComponentFixture<ServiceRequestListItemComponent>;
    const overlayHandler = new NbDynamicOverlayHandlerMock();
    const mockPositionBuilder = new MockPositionBuilder();
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ServiceRequestListItemComponent,
                NbPopoverModule,
                NbIconModule,
                NbEvaIconsModule,
            ],
            providers: [
                { provide: NbFocusMonitor, useClass: NbStatusServiceStub },
                { provide: NbDialogRef, useClass: NbStatusServiceStub },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: NbOverlayService, useClass: NbStatusServiceStub },
                { provide: NbIconLibraries, useClass: NbStatusServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
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
            .overrideDirective(NbTooltipDirective, {
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

        fixture = TestBed.createComponent(ServiceRequestListItemComponent);
        component = fixture.componentInstance;
        component.serviceRequest = {
            patient_name: 'John Doe',
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        component.getInitials('John Doe');
        expect(component).toBeTruthy();
    });
});
