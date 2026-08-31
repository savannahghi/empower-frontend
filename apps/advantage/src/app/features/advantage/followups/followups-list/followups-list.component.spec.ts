import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { BehaviorSubject, of } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { FollowupsListComponent } from './followups-list.component';

class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'app.advantage.followups.list',
    },
    params() {
        return { id: '6724-0191', appointment_id: 1 };
    },
};

class SilStoresServiceStub {
    list() {
        return of({
            totalCount: 2,
            edges: [
                {
                    node: {
                        id: 'c00c53c3-1241-4add-b94d-9d92fd59bcfb',
                        encounterID: 'b45cef00-3779-409c-8c96-85f092256366',
                        task: 'VIA test',
                        description: 'A VIA test',
                        status: 'requested',
                        workflow: 'Cervical Cancer Screening',
                        authoredOn: '2024-05-12T10:39:23+03:00',
                    },
                    cursor: 'c00c53c3-1241-4add-b94d-9d92fd59bcfb',
                },
                {
                    node: {
                        id: '5462db5f-b7a9-4c8e-a18b-0b4c609a242b',
                        encounterID: 'b45cef00-3779-409c-8c96-85f092256366',
                        task: 'VIA test',
                        description: 'A VIA test',
                        status: 'requested',
                        workflow: 'Cervical Cancer Screening',
                        authoredOn: '2024-05-12T10:18:01+03:00',
                    },
                    cursor: '5462db5f-b7a9-4c8e-a18b-0b4c609a242b',
                },
            ],
            pageInfo: {
                HasNextPage: true,
                EndCursor:
                    'AfOl5oX74j2DI0ts-6NcxKSF2jvQ1RaVWj782Ok3miRrzgOx-2oS3G_0XbEnp8MoI5Fk9uJHgTwfA7-O_gz6U7Y9mDJjb5vUFZgGa4tM4kCaotS2m9Z4ciGeUkEEu_fLdiHtcfLsOSS4LQhGBigtaxGQ2yCZXzRinUGW6AKJ4QsNzOQdBHPdpO7VXALqAb0dFr-YmN9sA13dmh_m98XHxl7-pvMy9B0yBkY=',
                HasPreviousPage: false,
                StartCursor: '',
            },
        });
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    setUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getOrgSettings() {
        return [
            {
                name: 'patients:patient_full_name',
                value: true,
            },
        ];
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

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
    transition() {
        return true;
    }
}

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

class NbToastrServiceStub {
    show() {
        return {};
    }
}

describe('FollowUpsListComponent: ', () => {
    let component: FollowupsListComponent;
    let fixture: ComponentFixture<FollowupsListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [FollowupsListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FollowupsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test viewPostScreeningReport', () => {
        spyOn(component, 'viewPostScreeningReport').and.callThrough();
        const event = {
            encounterId: '827472-029492-14184',
        };
        component.viewPostScreeningReport(event);
        expect(component.viewPostScreeningReport).toHaveBeenCalled();
    });

    it('should test complete action button when follow up task status is COMPLETED', () => {
        component.ngOnInit();
        const checkCompleted = component.actions[1].expression({
            node: {
                status: 'completed',
            },
        });
        component.actions[1].expression(undefined);
        expect(checkCompleted).toBe(false);
    });

    it('should test complete action button when follow up task status is CANCELLED', () => {
        component.ngOnInit();
        const checkCancelled = component.actions[1].expression({
            node: {
                status: 'cancelled',
            },
        });
        expect(checkCancelled).toBe(false);
    });

    it('should test setFilter method with string filter', () => {
        const mockFilters = 'status=requested&date=2024-01-01';
        component.setFilter(mockFilters);
        expect(component.queryArg).toBe(mockFilters);
    });

    it('should initialize statusFilters correctly in ngOnInit', () => {
        component.ngOnInit();
        expect(component.statusFilters).toBeDefined();
        expect(component.statusFilters.length).toBe(2);
    });

    it('should have correct statusFilters structure', () => {
        component.ngOnInit();

        expect(component.statusFilters[0].display).toBe('Requested');
        expect(component.statusFilters[0].filter.status).toBe('requested');
        expect(component.statusFilters[0].active).toBe(true);

        expect(component.statusFilters[1].display).toBe('Completed');
        expect(component.statusFilters[1].filter.status).toBe('completed');
        expect(component.statusFilters[1].active).toBeUndefined();
    });

    it('should initialize filterParams as empty object', () => {
        component.ngOnInit();
        expect(component.filterParams).toEqual({});
    });

    it('should call setFilter and update queryArg with string value', () => {
        const queryString = 'status=requested&date=2024-01-01';
        component.setFilter(queryString);
        expect(component.queryArg).toBe(queryString);
    });

    it('should call setFilter with null value', () => {
        component.setFilter(null);
        expect(component.queryArg).toBeNull();
    });

    it('should call setFilter with undefined value', () => {
        component.setFilter(undefined);
        expect(component.queryArg).toBeUndefined();
    });
});

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('FollowUpsListComponent fails', () => {
    let component: FollowupsListComponent;
    let fixture: ComponentFixture<FollowupsListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [FollowupsListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FollowupsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        component.actions = [
            {
                btnText: 'Complete',
                status: 'success',
                action: 'modal',
                expression: (row: any) => {
                    if (!row) {
                        return;
                    } else {
                        return (
                            row.node.status?.toLowerCase() !== 'completed' &&
                            row.node.status?.toLowerCase() !== 'cancelled'
                        );
                    }
                },
                modalConf: {
                    openModal: true,
                    context: 'Complete Follow Up Task',
                    formConfig: {
                        checkExpressionOn: 'changeDetectionCheck',
                    },
                    store: 'completePostScreening',
                    isService: true,
                    action: 'quickPatch',
                    method: 'updateFollowUp',
                    data: {
                        status: 'completed',
                    },
                },
            },
        ];
    });

    it('should test ngOnInit and throw error when getFollowUps is called', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });
});
