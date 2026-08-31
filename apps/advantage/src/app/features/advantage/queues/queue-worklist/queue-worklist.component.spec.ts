import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueWorklistComponent } from './queue-worklist.component';
import { of } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { NbSidebarService, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { LayoutService } from 'app/@core/utils';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: 1,
                    serviceRequest: 1,
                },
            ],
        });
    }
    get() {
        return of({
            id: 1,
            serviceRequest: 1,
        });
    }
}
class LayoutServiceStub {
    changeLayoutSize() {
        return {};
    }
    onMediaQueryChange() {
        return of([{ currentBreakpoint: { width: {} } }, {}]);
    }
    onThemeChange() {
        return of([{ currentBreakpoint: { width: {} } }, {}]);
    }
    changeTheme() {
        return of([{ currentBreakpoint: { width: {} } }, {}]);
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params() {
        return { service_request: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { visit: 1 };
        },
        parent: {
            name: 'app.advantage.queues.worklist.request',
        },
    },
};

class AuthorizationStub {
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
            user_workstations: [{ workstation: '1' }],
        };
    }
}

class AuthenticationServiceStub {
    checkPermission() {
        return false;
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

class NbSidebarServiceStub {
    toggle() {
        return {};
    }
    collapse() {
        return {};
    }
    compact() {
        return {};
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
    }
}

describe('QueueWorklistComponent', () => {
    let component: QueueWorklistComponent;
    let fixture: ComponentFixture<QueueWorklistComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [QueueWorklistComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [BrowserAnimationsModule],
            providers: [
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub,
                },
                { provide: LayoutService, useClass: LayoutServiceStub },
                { provide: NbSidebarService, useClass: NbSidebarServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(QueueWorklistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test mapQueueType', () => {
        let type = component.mapQueueType('triage');
        expect(type).toBe('TRIAGE');
        type = component.mapQueueType('consultation');
        expect(type).toBe('CONSULTATION');
        type = component.mapQueueType('lab');
        expect(type).toBe('LAB');
        type = component.mapQueueType('imaging');
        expect(type).toBe('IMAGING');
        type = component.mapQueueType('pharmacy_dispensing');
        expect(type).toBe('PHARMACY');
        type = component.mapQueueType('cashier');
        expect(type).toBe('BILLING');
        type = component.mapQueueType('procedure');
        expect(type).toBe('PROCEDURE');
        type = component.mapQueueType('optical');
        expect(type).toBe('OPTICAL');
        type = component.mapQueueType('breast_cancer_screening');
        expect(type).toBe('BREAST CANCER SCREENING');
        type = component.mapQueueType('cervical_cancer_screening');
        expect(type).toBe('CERVICAL CANCER SCREENING');
        type = component.mapQueueType('cancer_screening');
        expect(type).toBe('CANCER SCREENING');
    });

    it('should test service request emission', () => {
        spyOn(component, 'emitServiceRequest').and.callThrough();
        component.emitServiceRequest({});
        expect(component.emitServiceRequest).toHaveBeenCalled();
        spyOn(component, 'handleError').and.callThrough();
        component.handleError({});
        expect(component.handleError).toHaveBeenCalled();
    });

    it('should test when data has no results', () => {
        spyOn(component, 'handleWorkstationServiceRequests').and.callThrough();
        component.handleWorkstationServiceRequests({
            results: [{ id: 1, serviceRequest: 1 }],
        });
        component.handleWorkstationServiceRequests({
            results: [],
        });
        expect(component.handleWorkstationServiceRequests).toHaveBeenCalled();
        spyOn(component, 'handleFetchedQueue').and.callThrough();
        component.handleFetchedQueue({ results: [] });
        component.handleFetchedQueue({
            results: [
                { id: 1, serviceRequest: 1 },
                { id: 2, serviceRequest: 1 },
            ],
        });
        expect(component.handleFetchedQueue).toHaveBeenCalled();
    });

    it('should test navigateToServiceRequestView', () => {
        component.currentWorkstationType = 'consultation';
        spyOn(component, 'navigateToServiceRequestView').and.callThrough();
        component.navigateToServiceRequestView();
        component.currentWorkstationType = 'triage';
        component.navigateToServiceRequestView();
        component.currentWorkstationType = 'cashier';
        component.navigateToServiceRequestView();
        component.currentWorkstationType = 'screening';
        component.navigateToServiceRequestView();
        expect(component.navigateToServiceRequestView).toHaveBeenCalled();
    });
});

const uIRouterGlobalsStub2 = {
    current: {
        name: 'state',
    },
    params: { visit: 1, service_request: 1 },
    $current: {
        is: () => true,
        params() {
            return { visit: 1, service_request: 1 };
        },
        parent: {
            name: 'app.advantage.queues.worklist.request',
        },
    },
};

class StateServiceStub2 {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    includes() {
        return false;
    }
}

describe('QueueWorklistComponent: visit state param', () => {
    let component: QueueWorklistComponent;
    let fixture: ComponentFixture<QueueWorklistComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [QueueWorklistComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [BrowserAnimationsModule],
            providers: [
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub,
                },
                { provide: StateService, useClass: StateServiceStub2 },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: LayoutService, useClass: LayoutServiceStub },
                { provide: NbSidebarService, useClass: NbSidebarServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(QueueWorklistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test handleWorkstationServiceRequests', () => {
        spyOn(component, 'handleWorkstationServiceRequests').and.callThrough();
        component.handleWorkstationServiceRequests({
            results: [
                { id: 1, visit: 1 },
                { id: 2, visit: 1 },
            ],
        });
        component.searchObservable();
        component.searchValueEmit('Searching');
        component.searchValueUpdate.next('Searching..');
        expect(component.handleWorkstationServiceRequests).toHaveBeenCalled();
    });

    it('should test navigateToServiceRequestView', () => {
        component.currentWorkstationType = 'consultation';
        spyOn(component, 'navigateToServiceRequestView').and.callThrough();
        component.navigateToServiceRequestView();
        component.currentWorkstationType = 'triage';
        component.navigateToServiceRequestView();
        component.currentWorkstationType = 'screening';
        component.navigateToServiceRequestView();
        expect(component.navigateToServiceRequestView).toHaveBeenCalled();
    });
});

const uIRouterGlobalsStub3 = {
    current: {
        name: 'app.advantage.queues.worklist',
    },
    params: { visit: 1, service_request: 1 },
    $current: {
        is: () => true,
        params() {
            return { visit: 1, service_request: 1 };
        },
        parent: {
            name: 'app.advantage.queues',
        },
    },
};

describe('QueueWorklistComponent navigateToServiceRequestView current state set:', () => {
    let component: QueueWorklistComponent;
    let fixture: ComponentFixture<QueueWorklistComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [QueueWorklistComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [BrowserAnimationsModule],
            providers: [
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub,
                },
                { provide: StateService, useClass: StateServiceStub2 },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: LayoutService, useClass: LayoutServiceStub },
                { provide: NbSidebarService, useClass: NbSidebarServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub3 },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(QueueWorklistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test navigateToServiceRequestView', () => {
        component.currentWorkstationType = 'consultation';
        spyOn(component, 'navigateToServiceRequestView').and.callThrough();
        component.navigateToServiceRequestView();
        expect(component.navigateToServiceRequestView).toHaveBeenCalled();
    });
});

const uIRouterGlobalsStub4 = {
    current: {
        name: 'null',
    },
    params: { visit: 1, service_request: 1 },
    $current: {
        is: () => true,
        params() {
            return { visit: 1, service_request: 1 };
        },
        parent: {
            name: 'app.advantage.queues',
        },
    },
};

describe('QueueWorklistComponent navigateToServiceRequestView current state is null:', () => {
    let component: QueueWorklistComponent;
    let fixture: ComponentFixture<QueueWorklistComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [QueueWorklistComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [BrowserAnimationsModule],
            providers: [
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub,
                },
                { provide: StateService, useClass: StateServiceStub2 },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: LayoutService, useClass: LayoutServiceStub },
                { provide: NbSidebarService, useClass: NbSidebarServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub4 },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(QueueWorklistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test navigateToServiceRequestView', () => {
        component.currentWorkstationType = 'consultation';
        spyOn(component, 'navigateToServiceRequestView').and.callThrough();
        component.navigateToServiceRequestView();
        expect(component.navigateToServiceRequestView).toHaveBeenCalled();
    });
});
