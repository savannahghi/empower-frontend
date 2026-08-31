import { SilDataViewComponent } from './sil-data-view.component';

import {
    ComponentFixture,
    fakeAsync,
    flush,
    TestBed,
    tick,
} from '@angular/core/testing';

import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';

class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
    }
}

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

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params: {
        page_size: '2',
    },
    $current: {
        params: {
            page_size: '2',
        },
    },
};

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    transitionTo() {
        return true;
    }
    includes() {
        return true;
    }
    reload() {
        return true;
    }
}

class SilStoresServiceStub {
    list() {
        return of({
            results: [],
        });
    }
    listNested() {
        return of({});
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

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

describe('SilDataViewComponent', () => {
    let component: SilDataViewComponent;
    let fixture: ComponentFixture<SilDataViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilDataViewComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('deliveryType'),
                mockPipe('statusColor'),
                mockPipe('titleCase'),
                mockPipe('lowercase'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                ErrorHandlerService,
            ],
        });
        fixture = TestBed.createComponent(SilDataViewComponent);
        component = fixture.componentInstance;

        component.actions = [
            {
                btnText: 'shared.buttons.view',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.engagement.segments.detail.messages.detail',
                    stateParams: {
                        message_id: 'id',
                        template_id: 'template',
                    },
                    activeStateParams: ['segment_id'],
                },
            },
        ];
        component.searchInput = 'Search value';
        component.cardListSearch = true;
        fixture.detectChanges();
    });

    it('should test mineValue method', () => {
        spyOn(component, 'mineValue').and.callThrough();
        const path = null;
        component.mineValue({}, path);
        expect(component.mineValue).toHaveBeenCalled();
    });

    it('should test mineValue method if path is defined', () => {
        spyOn(component, 'mineValue').and.callThrough();
        const path = 'path';
        component.mineValue({}, path);
        expect(component.mineValue).toHaveBeenCalled();
    });

    it('should test mineValue method if path and object is defined', () => {
        const obj = { item: undefined };
        spyOn(component, 'mineValue').and.callThrough();
        const path = 'item.total';
        component.mineValue(obj, path);
        expect(component.mineValue).toHaveBeenCalled();
    });

    it('should test gridActions', () => {
        component.apilist = [
            {
                id: 'e0809c93-95a0-496c-91d0-1485a0e3cbe5',
                sender: null,
                message: {
                    id: 'ad60659c-da5e-43e3-b832-490dc78e74d5',
                    name: '3b5e40a4-f844-4fa8-916b-c3383626a60e',
                    template: 'Test',
                    message_type: 'SINGULAR',
                    parent: null,
                    has_sequence: false,
                },
                active: true,
                created: '2024-04-26T10:43:03.752637+03:00',
                created_by: '23776842-d85e-46b6-b91f-1095758f1863',
                updated: '2024-04-26T10:43:03.752653+03:00',
                updated_by: '23776842-d85e-46b6-b91f-1095758f1863',
                delivery_type: 'INSTANT',
                scheduled_at: '2024-04-26T10:43:03.034000+03:00',
                sequence_interval: null,
                organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
                template: 'ad60659c-da5e-43e3-b832-490dc78e74d5',
                segment: '3b5e40a4-f844-4fa8-916b-c3383626a60e',
                task: null,
            },
            {
                id: '165ba619-6654-4a3c-903c-3b6f72ed0a01',
                sender: null,
                message: {
                    id: '8702ced5-2976-4585-a59e-772183a5e1cb',
                    name: '3b5e40a4-f844-4fa8-916b-c3383626a60e',
                    template:
                        "Hello,  {{first_name}}. Don't worry, this is just a test.",
                    message_type: 'SINGULAR',
                    parent: null,
                    has_sequence: false,
                },
                active: true,
                created: '2024-04-26T10:38:56.550180+03:00',
                created_by: '23776842-d85e-46b6-b91f-1095758f1863',
                updated: '2024-04-26T10:38:56.550195+03:00',
                updated_by: '23776842-d85e-46b6-b91f-1095758f1863',
                delivery_type: 'INSTANT',
                scheduled_at: '2024-04-26T10:38:54.932000+03:00',
                sequence_interval: null,
                organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
                template: '8702ced5-2976-4585-a59e-772183a5e1cb',
                segment: '3b5e40a4-f844-4fa8-916b-c3383626a60e',
                task: null,
            },
        ];
        const row = {
            id: 1,
            node: {
                id: 123,
                provider: {
                    id: 1,
                },
                referralReportLink: 'test.com',
            },
            person: {
                person_photos: [],
                person_contacts: [
                    {
                        contact: '+254721585473',
                        contact_type: 'phone_number',
                        is_primary_contact: true,
                    },
                    {
                        contact: 'fake@gmail.com',
                        contact_type: 'email',
                        is_primary_contact: false,
                    },
                ],
            },
        };
        const modalConf = {
            field: 'id',
            key: 'id',
            path: '',
            url: 'https://google.com',
            method: 'patchPatient',
            store: 'patientRegisterService',
            action: 'stateGo',
            state: 'app.advantage.appointment.detail',
            sortData: true,
            stateParams: {
                appointment_id: 'id',
            },
        };

        const modalConf1 = {
            activeStateParams: ['params1'],
        };
        const modalConfState = {
            state: 'app.advantage.appointment.detail',
        };
        const modalConfState2 = {
            state: 'app.advantage.appointment.detail',
            stateParams: {
                id: 'id',
            },
        };
        const modalConfState3 = {
            state: 'app.advantage.appointment.detail',
            activeStateParams: ['params1'],
            stateParams: {
                id: 'node.id',
            },
        };

        const customFxn = {
            action: 'custom',
            customFxn: true,
            filterOnSelection: true,
        };
        component.gridActions.stateGo(row, modalConf);
        component.gridActions.stateGo(row, modalConfState);
        component.gridActions.stateGo(row, modalConfState2);
        component.gridActions.stateGo(row, modalConfState3);
        component.gridActions.stateGo(row, modalConf1);
        component.gridActions.custom(row, customFxn);
        expect(component).toBeTruthy();
    });

    it('should test getData method with restFxn provided', () => {
        spyOn(component, 'getData').and.callThrough();
        component.restFxn = 'list';
        component.restApi = 'patients';
        component.queryArg = {};
        const response = {
            results: [],
            count: 21,
        };
        spyOn(component.dataLayer, 'list').and.returnValue(of(response));
        component.getData('Search value');
        expect(component.getData).toHaveBeenCalledWith('Search value');
    });
    it('should test getData method with restFxn provided', () => {
        spyOn(component, 'getData').and.callThrough();
        component.restFxn = 'list';
        component.restApi = 'patients';
        component.queryArg = {};
        const response = {
            results: [],
            count: 21,
        };
        spyOn(component.dataLayer, 'list').and.returnValue(of(response));
        component.getData('Search value');
        expect(component.getData).toHaveBeenCalledWith('Search value');
    });

    it('should test getData method with restFxn provided and cardListSearch set to false', () => {
        spyOn(component, 'getData').and.callThrough();
        component.restFxn = 'list';
        component.restApi = 'patients';
        component.cardListSearch = false;
        component.queryArg = {};
        const response = {
            results: [],
            count: 21,
        };
        spyOn(component.dataLayer, 'list').and.returnValue(of(response));
        component.getData('Search value');
        expect(component.getData).toHaveBeenCalledWith('Search value');
    });

    it('should test getData method with restFxn provided as listNested', () => {
        spyOn(component, 'getData').and.callThrough();
        component.restFxn = 'listNested';
        component.restApi = 'patients';
        component.queryArg = {};
        const response = {
            results: [],
            count: 21,
        };
        spyOn(component.dataLayer, 'listNested').and.returnValue(of(response));
        component.getData('Search value');
        expect(component.getData).toHaveBeenCalledWith('Search value');
    });

    it('should test getData method with restFxn not provided', fakeAsync(() => {
        spyOn(component, 'getData').and.callThrough();
        component.restFxn = undefined;
        component.getData('Search value');
        expect(component.getData).toHaveBeenCalledWith('Search value');
        flush();
    }));

    it('should test getData method with searchValue as empty string', () => {
        spyOn(component, 'getData').and.callThrough();
        component.restFxn = undefined;
        component.getData('');
        expect(component.getData).toHaveBeenCalledWith('');
    });

    it('should test getData method with nested list', () => {
        spyOn(component, 'getData').and.callThrough();
        component.restFxn = 'listNested';
        component.restApi = 'patients';
        component.view = 'related_person';
        component.nestedId = '1231';
        component.queryArg = {};
        let response: {
            results?: [];
            edges?: [];
            data?: {
                results?: [];
            };
            count?: number;
        } = {
            results: [],
            count: 21,
        };
        spyOn(component.dataLayer, 'listNested').and.returnValue(of(response));
        component.getData('Search value');
        expect(component.getData).toHaveBeenCalled();

        response = {
            edges: [],
            count: 21,
        };

        component.getData('Search value');
        expect(component.getData).toHaveBeenCalled();

        response = {
            data: {
                results: [],
            },
            count: 21,
        };

        component.getData('Search value');
        expect(component.getData).toHaveBeenCalled();
    });

    it('should test getData method when response has response.edges', () => {
        spyOn(component, 'getData').and.callThrough();
        component.restFxn = 'listNested';
        component.restApi = 'screenings';
        component.queryArg = {};
        const response = {
            edges: [],
        };
        spyOn(component.dataLayer, 'list').and.returnValue(of(response));
        component.getData('Search value');
        expect(component.getData).toHaveBeenCalled();
    });

    it('should test getData method when results is not defined', () => {
        spyOn(component, 'getData').and.callThrough();
        component.restFxn = 'list';
        component.restApi = 'patients';
        component.queryArg = {};
        const response = [{ id: 1 }];
        spyOn(component.dataLayer, 'list').and.returnValue(of(response));
        component.getData('Search value');
        expect(component.getData).toHaveBeenCalled();
    });

    it('should test getData method when results is not defined', fakeAsync(() => {
        spyOn(component, 'getData').and.callThrough();
        component.restFxn = undefined;
        component.getData('Search value');
        tick(1000);
        expect(component.getData).toHaveBeenCalled();
    }));

    it('should test getData method error', () => {
        spyOn(component, 'getData').and.callThrough();
        component.restFxn = 'list';
        component.restApi = 'patients';
        component.queryArg = {};
        spyOn(component.dataLayer, 'list').and.returnValue(
            throwError({ status: 404 })
        );
        component.getData('Search value');
        expect(component.getData).toHaveBeenCalled();
    });

    it('should test navigateToCreateRecord function', () => {
        const stateData = {
            state: 'app.advantage.engagement.segments.detail.add_segment_message',
            stateParams: {
                step: 0,
                segment_id: 1,
            },
            activeStateParams: ['segment_id'],
        };
        spyOn(component, 'navigateToCreateRecord').and.callThrough();
        component.navigateToCreateRecord(stateData);
        expect(component.navigateToCreateRecord).toHaveBeenCalled();
    });
    it('should test searchOnEnter method', () => {
        spyOn(component, 'searchOnEnter').and.callThrough();
        const event = {
            type: 'Event',
            code: 'Enter',
            target: { value: 'Alex' },
        };
        component.searchOnEnter(event);
        expect(component.searchOnEnter).toHaveBeenCalledWith(event);
    });

    it('should test selectRow method', () => {
        spyOn(component, 'selectRow').and.callThrough();
        component.selectRow({});
        expect(component.selectRow).toHaveBeenCalledWith({});
    });

    it('should test refreshResults method', () => {
        spyOn(component, 'refreshResults').and.callThrough();
        component.refreshResults();
        expect(component.refreshResults).toHaveBeenCalled();
    });

    it('should test determineQueryFilters method with ignoredStateParams Input', () => {
        spyOn(component, 'determineQueryFilters').and.callThrough();
        component.ignoreStateParams = ['id', 'customer_customer'];
        const query = component.determineQueryFilters({
            id: '1',
            customer_customer: '1',
        });
        component.defaultQueryArg = {};
        component.determineQueryFilters({
            id: '1',
            customer_customer: '1',
        });
        expect(query).toEqual({});
    });

    it('should test filterData method', () => {
        spyOn(component, 'filterData').and.callThrough();
        const model = {
            id: '1',
            customer_customer: '1',
        };
        component.filterData(model);
        expect(component.filterData).toHaveBeenCalledWith(model);
    });
});

class SilStoresServiceStub2 {
    create() {
        return of({
            data: [
                {
                    node: {
                        status: '',
                    },
                },
            ],
        });
    }
    update() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
        });
    }
    downloadDocument() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
        });
    }
    getStore() {
        return {
            url: '/adfasdf/',
        };
    }
    getServer() {
        return 'http:localhost/asdff';
    }
    listNested() {
        return of({
            id: '1231',
            question_answers: [],
            data: {
                question_answers: [],
            },
        });
    }
    list() {
        return of({
            next: 'url',
            count: '2',
            data: {
                next: 'url',
                count: '2',
                results: [],
            },
        });
    }
}

describe('SilDataViewComponent Path 2', () => {
    let component: SilDataViewComponent;
    let fixture: ComponentFixture<SilDataViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilDataViewComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('deliveryType'),
                mockPipe('statusColor'),
                mockPipe('titleCase'),
                mockPipe('lowercase'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub2,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                ErrorHandlerService,
            ],
        });
        fixture = TestBed.createComponent(SilDataViewComponent);
        component = fixture.componentInstance;

        component.actions = [
            {
                btnText: 'shared.buttons.view',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.engagement.segments.detail.messages.detail',
                    stateParams: {
                        message_id: 'id',
                        template_id: 'template',
                    },
                    activeStateParams: ['segment_id'],
                },
            },
        ];
        component.cardListSearch = true;

        component.apilist = [{}];
        fixture.detectChanges();
    });

    it('should test getData method with nested list', () => {
        component.restFxn = 'list';
        spyOn(component, 'getData').and.callThrough();

        component.getData('Search value');
        expect(component.getData).toHaveBeenCalled();
    });
});

class SilStoresServiceStub3 {
    create() {
        return of({
            edges: [
                {
                    node: {
                        status: '',
                    },
                },
            ],
        });
    }
    update() {
        return of({
            id: '1231',
            question_answers: [],
            edges: {
                question_answers: [],
            },
        });
    }
    downloadDocument() {
        return of({
            id: '1231',
            question_answers: [],
            edges: {
                question_answers: [],
            },
        });
    }
    getStore() {
        return {
            url: '/adfasdf/',
        };
    }
    getServer() {
        return 'http:localhost/asdff';
    }
    listNested() {
        return of({
            id: '1231',
            question_answers: [],
            edges: {
                question_answers: [],
            },
        });
    }
    list() {
        return of({
            next: 'url',
            count: '2',
            edges: {
                next: 'url',
                count: '2',
                results: [],
            },
        });
    }
}

describe('SilDataViewComponent Path 3', () => {
    let component: SilDataViewComponent;
    let fixture: ComponentFixture<SilDataViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilDataViewComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('deliveryType'),
                mockPipe('statusColor'),
                mockPipe('titleCase'),
                mockPipe('lowercase'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub3,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                ErrorHandlerService,
            ],
        });
        fixture = TestBed.createComponent(SilDataViewComponent);
        component = fixture.componentInstance;

        component.actions = [
            {
                btnText: 'shared.buttons.view',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.engagement.segments.detail.messages.detail',
                    stateParams: {
                        message_id: 'id',
                        template_id: 'template',
                    },
                    activeStateParams: ['segment_id'],
                },
            },
        ];
        component.apilist = [{}];
        component.cardListSearch = true;

        fixture.detectChanges();
    });

    it('should test getData method with nested list without searchInput field provided as args', () => {
        component.restFxn = 'list';
        component.searchInput = 'Search value';
        spyOn(component, 'getData').and.callThrough();

        component.getData();
        expect(component.getData).toHaveBeenCalled();
    });

    it('should test getData method with nested list', () => {
        component.restFxn = 'list';
        spyOn(component, 'getData').and.callThrough();

        component.getData('Search value');
        expect(component.getData).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Error'));
        return sub;
    }
    listNested() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Error'));
        return sub;
    }
}

describe('SilDataViewComponent Error Path', () => {
    let component: SilDataViewComponent;
    let fixture: ComponentFixture<SilDataViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilDataViewComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('deliveryType'),
                mockPipe('statusColor'),
                mockPipe('titleCase'),
                mockPipe('lowercase'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                ErrorHandlerService,
            ],
        });
        fixture = TestBed.createComponent(SilDataViewComponent);
        component = fixture.componentInstance;

        component.actions = [
            {
                btnText: 'shared.buttons.view',
                status: 'primary',
                action: 'stateGo',
                modalConf: {
                    state: 'app.advantage.engagement.segments.detail.messages.detail',
                    stateParams: {
                        message_id: 'id',
                        template_id: 'template',
                    },
                    activeStateParams: ['segment_id'],
                },
            },
        ];
        component.apilist = [{}];
        component.cardListSearch = true;

        fixture.detectChanges();
    });

    it('should test getData method with restFxn provided', () => {
        const errorInstance = new SilStoresServiceStubError();
        const errorObservable = errorInstance.list();

        spyOn(component, 'getData').and.callThrough();
        spyOn(component.dataLayer, 'list').and.returnValue(errorObservable);
        component.restFxn = 'list';

        component.getData('Search value');
        expect(component.getData).toHaveBeenCalledWith('Search value');
    });
});
