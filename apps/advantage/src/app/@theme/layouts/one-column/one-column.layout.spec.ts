import { OneColumnLayoutComponent } from './one-column.layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import {
    NbMenuService,
    NbSidebarService,
    NbToastrService,
} from '@nebular/theme';
import { Authorization } from '../../../@core/auth/services/authorization.service';
import { BehaviorSubject, of } from 'rxjs';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { environment } from '../../../../environments/environment';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { NotificationService } from '../../../shared/component-services/notification-count.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { VariantPipe } from '../../pipes/variant/variant.pipe';
import {
    HttpClient,
    HttpHandler,
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { UserGuideMenuService } from 'app/features/user-guide/user-guide-menu.service';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';

function mockPipe(name: string): Pipe {
    const metadata: Pipe = {
        name,
    };

    return Pipe(metadata)(
        class MockPipe implements PipeTransform {
            transform() {}
        }
    );
}

class SilStoresServiceStub {
    get() {
        return of({
            id: '123',
            count: 1,
        });
    }

    list() {
        return of({
            results: [
                {
                    id: '143224',
                },
            ],
        });
    }

    createNested() {
        return of({
            id: '12312',
        });
    }
}

class SilStoresServiceStubError {
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    createNested() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class AuthorizationStub {
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    setUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getWorkstation() {
        return {
            workstation: {
                workstation__name: 'Consultation',
            },
        };
    }
    getOrganisation() {
        return {
            bp_type: 'PROVIDER',
        };
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

class AuthorizationStub2 {
    getUser() {
        return {
            client_types: ['LENDER'],
        };
    }
    setUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getWorkstation() {
        return {
            workstation: {
                workstation__name: 'Consultation',
            },
        };
    }
    getOrganisation() {
        return {
            bp_type: 'PAYER',
        };
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

const uIRouterGlobalsStub = {
    params: {
        id: '112',
        service_request: 'wer',
        page_size: '2',
        queue: 1,
    },
    current: {
        data: {},
        params: {
            page_size: '2',
        },
    },
};

const uIRouterGlobalsStubWithCurrentName = {
    params: {
        id: '112',
        service_request: 'wer',
        page_size: '2',
        queue: 1,
        notification_id: '12345',
    },
    current: {
        data: {},
        params: {
            notification_id: '12345',
        },
        name: 'app.autorecon.clients.payers.detail.invoices-report.detail.invoice-report',
    },
};

class PipeStub {
    transform() {
        return true;
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    includes() {
        return true;
    }
}

class NbMenuServiceStub {
    onItemClick() {
        return of(
            { tag: 'my-context-menu', item: { title: 'Log out' } },
            { tag: 'my-context-menu', item: { title: 'Profile' } },
            { tag: 'my-context-menu', item: { title: 'Else' } }
        );
    }
    navigateHome() {
        return {};
    }
}

class NbSidebarServiceStub {
    toggle() {
        return {};
    }
    collapse() {
        return {};
    }
    expand() {
        return {};
    }
    compact() {
        return {};
    }
}

describe('OneColumnLayoutComponent', () => {
    let component: OneColumnLayoutComponent;
    let fixture: ComponentFixture<OneColumnLayoutComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [OneColumnLayoutComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('app'),
                mockPipe('featureFlag'),
                mockPipe('variant'),
            ],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: NbMenuService, useClass: NbMenuServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: NbSidebarService, useClass: NbSidebarServiceStub },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(OneColumnLayoutComponent);
        component = fixture.componentInstance;
        component.providerBpType = ['PROVIDER', 'PRACTITIONER'];
        fixture.detectChanges();
    });

    it('should test toggleSubMenu Fxn', () => {
        spyOn(component, 'toggleSubMenu').and.callThrough();
        spyOn(component, 'openSidebar').and.callThrough();
        component.toggleSubMenu('dashboard');
        component.openSidebar();
        expect(component.toggleSubMenu).toHaveBeenCalled();
        expect(component.openSidebar).toHaveBeenCalled();
    });

    it('should initialize screeningsmenu correctly', () => {
        expect(component.screeningsmenu).toEqual([
            {
                title: 'Risk Assessments',
                url: 'app.advantage.screenings.risk-assessments',
            },
            {
                title: 'Examinations',
                url: 'app.advantage.screenings.examinations',
            },
        ]);
    });
});

const uIRouterGlobalsStub2 = {
    params: {
        id: '112',
        service_request: 'wer',
        page_size: '2',
        queue: 1,
    },
    current: {
        data: { requiresAuth: true },
        params: {
            page_size: '2',
        },
    },
};

describe('OneColumnLayoutComponent 2', () => {
    let component: OneColumnLayoutComponent;
    let fixture: ComponentFixture<OneColumnLayoutComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [OneColumnLayoutComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('app'),
                mockPipe('featureFlag'),
                mockPipe('variant'),
            ],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub2 },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: NbMenuService, useClass: NbMenuServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: NbSidebarService, useClass: NbSidebarServiceStub },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(OneColumnLayoutComponent);
        component = fixture.componentInstance;
        component.payerBpType = ['PAYER'];

        fixture.detectChanges();
    });

    it('should test toggleSubMenu Fxn', () => {
        spyOn(component, 'toggleSubMenu').and.callThrough();
        component.toggleSubMenu('engagement');
        expect(component.toggleSubMenu).toHaveBeenCalled();
    });
});

describe('OneColumnLayoutComponent: uzazi variant', () => {
    let component: OneColumnLayoutComponent;
    let fixture: ComponentFixture<OneColumnLayoutComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [OneColumnLayoutComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('app'),
                mockPipe('featureFlag'),
                mockPipe('variant'),
            ],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub2 },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: NbMenuService, useClass: NbMenuServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: NbSidebarService, useClass: NbSidebarServiceStub },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        environment.variant = 'uzazisalama';
        fixture = TestBed.createComponent(OneColumnLayoutComponent);
        component = fixture.componentInstance;
        component.payerBpType = ['PAYER'];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

describe('OneColumnLayoutComponent: !uzazi variant', () => {
    let component: OneColumnLayoutComponent;
    let fixture: ComponentFixture<OneColumnLayoutComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [OneColumnLayoutComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('app'),
                mockPipe('featureFlag'),
                mockPipe('variant'),
            ],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub2 },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: NbMenuService, useClass: NbMenuServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: NbSidebarService, useClass: NbSidebarServiceStub },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    });

    beforeEach(() => {
        environment.variant = 'default';
        fixture = TestBed.createComponent(OneColumnLayoutComponent);
        component = fixture.componentInstance;
        component.payerBpType = ['PAYER'];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

class NotificationServiceStub {
    private notificationCountSubject = new BehaviorSubject<string>('Ritta');
    notificationCount$ = this.notificationCountSubject.asObservable();

    updateNotificationCount(data: any): void {
        this.notificationCountSubject.next(data);
    }
}

describe('OneColumnLayoutComponent with notification counter for auto recon', () => {
    let component: OneColumnLayoutComponent;
    let fixture: ComponentFixture<OneColumnLayoutComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                mockPipe('app'),
                mockPipe('featureFlag'),
                mockPipe('variant'),
            ],
            declarations: [OneColumnLayoutComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: UIRouterGlobals,
                    useValue: uIRouterGlobalsStubWithCurrentName,
                },
                { provide: NbMenuService, useClass: NbMenuServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: NbSidebarService, useClass: NbSidebarServiceStub },
                {
                    provide: NotificationService,
                    useClass: NotificationServiceStub,
                },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(OneColumnLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test the getNotificationsInfo method on auto recon app', () => {
        spyOn(component, 'getNotificationsInfo').and.callThrough();
        component.getNotificationsInfo();
        expect(component.getNotificationsInfo).toHaveBeenCalled();
    });
});

describe('OneColumnLayoutComponent with error', () => {
    let component: OneColumnLayoutComponent;
    let fixture: ComponentFixture<OneColumnLayoutComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                mockPipe('app'),
                mockPipe('featureFlag'),
                mockPipe('variant'),
            ],
            declarations: [OneColumnLayoutComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: UIRouterGlobals,
                    useValue: uIRouterGlobalsStubWithCurrentName,
                },
                { provide: NbMenuService, useClass: NbMenuServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: NbSidebarService, useClass: NbSidebarServiceStub },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(OneColumnLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test the getNotificationsInfo method on auto recon with error', () => {
        spyOn(component, 'getNotificationsInfo').and.callThrough();
        component.getNotificationsInfo();
        expect(component.getNotificationsInfo).toHaveBeenCalled();
    });
});

describe('OneColumnLayoutComponent userguide menu', () => {
    let component: OneColumnLayoutComponent;
    let fixture: ComponentFixture<OneColumnLayoutComponent>;
    let userGuideMenuServiceSpy: jasmine.SpyObj<UserGuideMenuService>;
    let stateServiceSpy: jasmine.SpyObj<StateService>;
    let toastrServiceSpy: jasmine.SpyObj<NbToastrService>;
    let errorHandlerSpy: jasmine.SpyObj<ErrorHandlerService>;
    let menuItemsSubject: BehaviorSubject<any[]>;
    let activeSubtopicIdSubject: BehaviorSubject<string | null>;

    beforeEach(() => {
        menuItemsSubject = new BehaviorSubject<any[]>([]);
        activeSubtopicIdSubject = new BehaviorSubject<string | null>(null);
        null;

        userGuideMenuServiceSpy = jasmine.createSpyObj('UserGuideMenuService', [
            'getMenuItems',
            'setIframeUrl',
            'setActiveSubtopicId',
            'setMenuItems',
        ]);
        Object.defineProperty(userGuideMenuServiceSpy, 'userGuideMenuItems$', {
            configurable: true,
            get: () => menuItemsSubject.asObservable(),
        });
        Object.defineProperty(userGuideMenuServiceSpy, 'activeSubtopicId$', {
            get: () => activeSubtopicIdSubject.asObservable(),
        });

        stateServiceSpy = jasmine.createSpyObj('StateService', [
            'is',
            'go',
            'includes',
        ]);
        stateServiceSpy.is.and.returnValue(false);
        stateServiceSpy.includes.and.returnValue(false);

        toastrServiceSpy = jasmine.createSpyObj('NbToastrService', ['show']);

        errorHandlerSpy = jasmine.createSpyObj('ErrorHandlerService', [
            'handleError',
        ]);

        TestBed.configureTestingModule({
            imports: [
                mockPipe('app'),
                mockPipe('featureFlag'),
                mockPipe('variant'),
            ],
            declarations: [OneColumnLayoutComponent],
            providers: [
                {
                    provide: UserGuideMenuService,
                    useValue: userGuideMenuServiceSpy,
                },
                { provide: StateService, useValue: stateServiceSpy },
                { provide: NbToastrService, useValue: toastrServiceSpy },
                { provide: ErrorHandlerService, useValue: errorHandlerSpy },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: NbMenuService, useClass: NbMenuServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbSidebarService, useClass: NbSidebarServiceStub },
                {
                    provide: NotificationService,
                    useClass: NotificationServiceStub,
                },
                { provide: HttpClient, useClass: HttpClient },
                { provide: VariantPipe, useClass: PipeStub },
                { provide: HttpHandler, useClass: HttpHandler },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(OneColumnLayoutComponent);
        component = fixture.componentInstance;

        component.errorHandler = errorHandlerSpy;

        menuItemsSubject.next([]);
        activeSubtopicIdSubject.next(null);
    });

    it('should set userGuideMenuItems to [] if menu is null or undefined', () => {
        menuItemsSubject.next(null as any);

        component.ngOnInit();

        expect(component.userGuideMenuItems).toEqual([]);
    });

    it('should initialize menu items and subtopics in ngOnInit', () => {
        const mockMenu = [
            {
                id: '77de9df8-ee1a-4763-84fa-6881264df811',
                title: 'Check-ins and Appointments',
                subtopics: [
                    {
                        id: '48631a64-399a-4078-bf2a-6c98d807bd81',
                        title: 'How to Schedule an Appointment in Slade Advantage',
                        url: 'https://scribehow.com/embed/How_to_Schedule_an_Appointment_in_Slade_Advantage__QTDKB6OYTeqtcuH0OpvnIA',
                        parent: '77de9df8-ee1a-4763-84fa-6881264df811',
                    },
                ],
            },
        ];
        userGuideMenuServiceSpy.getMenuItems.and.returnValue(mockMenu);
        menuItemsSubject.next(mockMenu);

        component.ngOnInit();

        expect(component.selectedGuide).toEqual(mockMenu[0]);
        expect(component.subtopics).toEqual(mockMenu[0].subtopics);
    });

    it('should handle empty menu items in ngOnInit', () => {
        userGuideMenuServiceSpy.getMenuItems.and.returnValue([]);
        menuItemsSubject.next([]);

        component.ngOnInit();

        expect(component.selectedGuide).toBeNull();
        expect(component.subtopics).toEqual([]);
    });

    it('should handle invalid subtopic', () => {
        component.renderSubtopic(null);

        expect(errorHandlerSpy.handleError).toHaveBeenCalledWith(
            new Error('Invalid subtopic: Missing required data.')
        );
    });

    it('should handle case where no parent topic is found', () => {
        const subtopic = { id: '1-1', title: 'Subtopic 1-1', parent: null };
        userGuideMenuServiceSpy.getMenuItems.and.returnValue([]);

        component.renderSubtopic(subtopic);

        expect(errorHandlerSpy.handleError).toHaveBeenCalledWith(
            new Error('Subtopic is missing a valid URL.')
        );
    });

    it('should handle case where first subtopic has no URL', () => {
        const subtopic = {
            id: '48631a64-399a-4078-bf2a-6c98d807bd81',
            title: 'Subtopic 1-1',
            parent: '1',
        };
        const parentTopic = {
            id: '1',
            title: 'Topic 1',
            subtopics: [
                { id: '48631a64-399a-4078-bf2a-6c98d807bd81', url: null },
            ],
        };
        userGuideMenuServiceSpy.getMenuItems.and.returnValue([parentTopic]);
        stateServiceSpy.is.and.returnValue(true);

        component.renderSubtopic(subtopic);

        expect(errorHandlerSpy.handleError).toHaveBeenCalledWith(
            new Error('Subtopic is missing a valid URL.')
        );
        expect(component.iframeUrl).toBe('');
    });

    it('should handle valid subtopic in list state', () => {
        const subtopic = {
            id: '48631a64-399a-4078-bf2a-6c98d807bd81',
            title: 'How to Schedule an Appointment in Slade Advantage',
            url: 'https://scribehow.com/embed/How_to_Schedule_an_Appointment_in_Slade_Advantage__QTDKB6OYTeqtcuH0OpvnIA',
            parent: '77de9df8-ee1a-4763-84fa-6881264df811',
        };
        const parentTopic = {
            id: '77de9df8-ee1a-4763-84fa-6881264df811',
            title: 'Check-ins and Appointments',
            subtopics: [subtopic],
        };

        component.userGuideMenuItems = [parentTopic];
        userGuideMenuServiceSpy.getMenuItems.and.returnValue([parentTopic]);
        stateServiceSpy.is.and.returnValue(false);

        component.renderSubtopic(subtopic);

        expect(stateServiceSpy.is).toHaveBeenCalledWith(
            'app.userguide.list.topic',
            {
                topicId: '77de9df8-ee1a-4763-84fa-6881264df811',
                topicName: 'check-ins-and-appointments',
            }
        );
        expect(userGuideMenuServiceSpy.setIframeUrl).toHaveBeenCalledWith(
            'https://scribehow.com/embed/How_to_Schedule_an_Appointment_in_Slade_Advantage__QTDKB6OYTeqtcuH0OpvnIA'
        );
        expect(
            userGuideMenuServiceSpy.setActiveSubtopicId
        ).toHaveBeenCalledWith('48631a64-399a-4078-bf2a-6c98d807bd81');
    });

    it('should handle valid subtopic in non-list state', () => {
        const subtopic = {
            id: '48631a64-399a-4078-bf2a-6c98d807bd81',
            title: 'How to Schedule an Appointment in Slade Advantage',
            url: 'https://scribehow.com/embed/How_to_Schedule_an_Appointment_in_Slade_Advantage__QTDKB6OYTeqtcuH0OpvnIA',
        };
        component.subtopics = [
            {
                id: '48631a64-399a-4078-bf2a-6c98d807bd81',
                title: 'Subtopic 1-1',
                active: false,
            },
            { id: '1-2', title: 'Subtopic 1-2', active: false },
        ];
        stateServiceSpy.is.and.returnValue(false);

        component.renderSubtopic(subtopic);

        expect(userGuideMenuServiceSpy.setIframeUrl).toHaveBeenCalledWith(
            'https://scribehow.com/embed/How_to_Schedule_an_Appointment_in_Slade_Advantage__QTDKB6OYTeqtcuH0OpvnIA'
        );
        expect(
            userGuideMenuServiceSpy.setActiveSubtopicId
        ).toHaveBeenCalledWith('48631a64-399a-4078-bf2a-6c98d807bd81');
    });

    it('should handle case where userGuideMenuItems$ is undefined', () => {
        Object.defineProperty(userGuideMenuServiceSpy, 'userGuideMenuItems$', {
            get: () => undefined,
        });

        component.ngOnInit();

        expect(component.selectedGuide).toBeNull();
        expect(component.subtopics).toEqual([]);
    });
    it('should handle subtopic with no matching parent topic', () => {
        const mockMenu = [
            {
                id: 'topic-1',
                title: 'Topic 1',
                subtopics: [{ id: 'sub-1', title: 'Sub 1' }],
            },
            {
                id: 'topic-2',
                title: 'Topic 2',
                subtopics: [{ id: 'sub-2', title: 'Sub 2' }],
            },
        ];
        component.userGuideMenuItems = mockMenu;

        const subtopic = {
            id: 'not-in-menu',
            title: 'Orphan Subtopic',
            parent: 'topic-3',
        };

        component.renderSubtopic(subtopic);

        expect(stateServiceSpy.is).toHaveBeenCalledWith(
            'app.userguide.list.topic',
            {
                topicId: 'topic-3',
                topicName: 'user-guide-topic',
            }
        );
    });
    it('should render subtopic if firstSubtopic is undefined', () => {
        const subtopic = {
            id: '1-1',
            title: 'Subtopic 1-1',
            url: 'https://example.com',
            parent: '1',
        };

        const parentTopic = {
            id: '1',
            title: 'Topic 1',
            subtopics: [],
        };

        userGuideMenuServiceSpy.getMenuItems.and.returnValue([parentTopic]);
        stateServiceSpy.is.and.returnValue(true);

        component.renderSubtopic(subtopic);

        expect(userGuideMenuServiceSpy.setIframeUrl).toHaveBeenCalledWith(
            'https://example.com'
        );
        expect(
            userGuideMenuServiceSpy.setActiveSubtopicId
        ).toHaveBeenCalledWith('1-1');
    });

    it('should render subtopic if parentTopic.subtopics is undefined', () => {
        const subtopic = {
            id: '1-1',
            title: 'Subtopic 1-1',
            url: 'https://example.com',
            parent: '1',
        };
        const parentTopic = {
            id: '1',
            title: 'Topic 1',
        };

        userGuideMenuServiceSpy.getMenuItems.and.returnValue([parentTopic]);
        stateServiceSpy.is.and.returnValue(true);

        component.renderSubtopic(subtopic);

        expect(userGuideMenuServiceSpy.setIframeUrl).toHaveBeenCalledWith(
            'https://example.com'
        );
        expect(
            userGuideMenuServiceSpy.setActiveSubtopicId
        ).toHaveBeenCalledWith('1-1');
    });

    it('should navigate to the correct topic state if not already there', () => {
        const subtopic = {
            id: '1-1',
            title: 'Subtopic 1-1',
            url: 'https://example.com',
            parent: '1',
        };

        const parentTopic = {
            id: '1',
            title: 'Topic 1',
            subtopics: [subtopic],
        };

        userGuideMenuServiceSpy.getMenuItems.and.returnValue([parentTopic]);

        stateServiceSpy.is.and.callFake((stateName: string) => {
            if (stateName === 'app.userguide.list') {
                return true;
            }
            if (stateName === 'app.userguide.list.topic') {
                return false;
            }
            return false;
        });

        component.renderSubtopic(subtopic);

        const topicName = 'user-guide-topic';
        expect(stateServiceSpy.is).toHaveBeenCalledWith(
            'app.userguide.list.topic',
            {
                topicId: '1',
                topicName,
            }
        );
        expect(stateServiceSpy.go).toHaveBeenCalledWith(
            'app.userguide.list.topic',
            { topicId: '1', topicName },
            { reload: true }
        );
    });

    it('should set subtopics to an empty array if selectedGuide.subtopics is undefined or empty', () => {
        const mockMenu = [
            {
                id: '77de9df8-ee1a-4763-84fa-6881264df811',
                title: 'Check-ins and Appointments',
                subtopics: undefined,
            },
        ];
        userGuideMenuServiceSpy.getMenuItems.and.returnValue(mockMenu);
        menuItemsSubject.next(mockMenu);

        component.ngOnInit();

        expect(component.selectedGuide).toEqual(mockMenu[0]);
        expect(component.subtopics).toEqual([]);
    });

    it('should complete destroy$ subject on ngOnDestroy', () => {
        const destroySpy = spyOn<any>(
            component['destroy$'],
            'next'
        ).and.callThrough();
        const completeSpy = spyOn<any>(
            component['destroy$'],
            'complete'
        ).and.callThrough();

        component.ngOnDestroy();

        expect(destroySpy).toHaveBeenCalled();
        expect(completeSpy).toHaveBeenCalled();
    });

    it('should auto-expand the parent topic of the active subtopic', () => {
        const mockMenu = [
            {
                id: 'topic-1',
                title: 'Topic 1',
                subtopics: [
                    { id: 'sub-1', title: 'Sub 1' },
                    { id: 'sub-2', title: 'Sub 2' },
                ],
            },
            {
                id: 'topic-2',
                title: 'Topic 2',
                subtopics: [{ id: 'sub-3', title: 'Sub 3' }],
            },
        ];
        userGuideMenuServiceSpy.getMenuItems.and.returnValue(mockMenu);
        menuItemsSubject.next(mockMenu);

        component.subMenuToggle = {
            'Topic 1': false,
            'Topic 2': false,
        };
        component.userGuideMenuItems = mockMenu;

        activeSubtopicIdSubject.next('sub-3');

        component.ngOnInit();

        expect(component.subMenuToggle['Topic 1']).not.toBeTrue();
        expect(component.subMenuToggle['Topic 2']).toBeTrue();
    });

    it('should not expand any topic if active subtopic id does not match', () => {
        const mockMenu = [
            {
                id: 'topic-1',
                title: 'Topic 1',
                subtopics: [{ id: 'sub-1', title: 'Sub 1' }],
            },
        ];
        userGuideMenuServiceSpy.getMenuItems.and.returnValue(mockMenu);
        menuItemsSubject.next(mockMenu);

        component.subMenuToggle = { 'Topic 1': false };
        component.userGuideMenuItems = mockMenu;

        activeSubtopicIdSubject.next('not-a-real-id');

        component.ngOnInit();

        expect(component.subMenuToggle['Topic 1']).not.toBeTrue();
    });
});
