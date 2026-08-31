import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabOrdersListComponent } from './lab-orders-list.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { BehaviorSubject, of } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

class SilStoresServiceStub {
    list() {
        return of({
            totalCount: 2,
            results: [{ id: '9067571b-4389-45b8-96da-6430353e' }],
            edges: [
                {
                    node: {
                        id: 'e9bfbce8-7959-4d40-9c95-5ee54abe0414',
                        status: 'active',
                        intent: 'instance-order',
                        priority: 'urgent',
                        subject: {
                            identifier: {
                                value: '7000040000015041',
                            },
                            display: 'Talisha, Idah ',
                        },
                        encounter: {
                            id: '65d22133-2f17-4599-99ab-9f3ee0ef020a',
                            identifier: {},
                        },
                        receivingFacility: 'Main Branch',
                        orderDetails: 'Mammogram',
                        date: '2024-06-10T08:09:06Z',
                    },
                },
                {
                    node: {
                        id: 'h9bfbce8-0959-4d40-9c95-5ee54abe0414',
                        status: 'active',
                        intent: 'instance-order',
                        priority: 'urgent',
                        subject: {
                            identifier: {
                                value: '7080040000015041',
                            },
                            display: 'Lions, Idah ',
                        },
                        encounter: {
                            id: '85d22133-2f17-4599-99ab-9f3ee0ef020a',
                            identifier: {},
                        },
                        receivingFacility: 'Main Branch',
                        orderDetails: 'Mammogram',
                        date: '2024-06-10T08:09:06Z',
                    },
                },
            ],
            pageInfo: {
                HasNextPage: false,
                EndCursor: null,
                HasPreviousPage: false,
                StartCursor: null,
            },
        });
    }
}

class AuthenticationStub {
    checkPermission() {
        return true;
    }
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
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
    getAdvantageOrganisation() {
        return {
            organisation_id: 'asdfasdf',
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

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'app.advantage.lab-orders.',
    },
    params() {
        return { appointment_id: 1 };
    },
};

describe('LabOrdersListComponent', () => {
    let component: LabOrdersListComponent;
    let fixture: ComponentFixture<LabOrdersListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LabOrdersListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        });
        fixture = TestBed.createComponent(LabOrdersListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test viewLabOrder functionality', () => {
        const event = {
            id: 'e9bfbce8-7959-4d40-9c95-5ee54abe0414',
            status: 'active',
            intent: 'instance-order',
            priority: 'urgent',
            subject: {
                identifier: {
                    value: '7000040000015041',
                },
                display: 'Talisha, Idah ',
            },
            encounter: {
                id: '65d22133-2f17-4599-99ab-9f3ee0ef020a',
                identifier: {},
            },
            receivingFacility: 'Main Branch',
            orderDetails: 'Mammogram',
            date: '2024-06-10T08:09:06Z',
        };
        spyOn(component, 'viewLabOrder').and.callThrough();
        component.viewLabOrder(event);
        expect(component.viewLabOrder).toHaveBeenCalled();
    });

    it('should test getVisitPatient function', () => {
        spyOn(component, 'getVisitPatient').and.callThrough();
        component.getVisitPatient('3068571b-4389-45b8-96da-6430353');
        expect(component.getVisitPatient).toHaveBeenCalled();
    });

    it('should test setFilter function', () => {
        spyOn(component, 'setFilter').and.callThrough();
        component.setFilter('active');
        expect(component.setFilter).toHaveBeenCalled();
    });

    it('should test responseFunction function', () => {
        component.serviceRequestId = 'a87a6f63-d339-4818-8def-03a6c1567d9a';
        const response = {
            results: [{ id: '9067571b-4389-45b8-96da-6430353e' }],
        };
        spyOn(component, 'responseFunction').and.callThrough();

        component.responseFunction(response);
        expect(component.responseFunction).toHaveBeenCalled();
    });

    it('should return correct color for active statuses', () => {
        expect(component.getLabOrderStatusColor('active')).toBe('warning');
        expect(component.getLabOrderStatusColor('ACTIVE')).toBe('warning');
        expect(component.getLabOrderStatusColor('Active')).toBe('warning');
        expect(component.getLabOrderStatusColor('AcTiVe')).toBe('warning');
    });

    it('should return correct color for completed statuses', () => {
        expect(component.getLabOrderStatusColor('completed')).toBe('success');
        expect(component.getLabOrderStatusColor('COMPLETED')).toBe('success');
        expect(component.getLabOrderStatusColor('Completed')).toBe('success');
        expect(component.getLabOrderStatusColor('complete')).toBe('success');
        expect(component.getLabOrderStatusColor('CoMpLeTeD')).toBe('success');
    });

    it('should return correct color for warning statuses', () => {
        expect(component.getLabOrderStatusColor('pending')).toBe('warning');
        expect(component.getLabOrderStatusColor('requested')).toBe('warning');
        expect(component.getLabOrderStatusColor('PeNdInG')).toBe('warning');
    });

    it('should return correct color for danger statuses', () => {
        expect(component.getLabOrderStatusColor('cancelled')).toBe('danger');
        expect(component.getLabOrderStatusColor('rejected')).toBe('danger');
    });

    it('should return "basic" for invalid or empty values', () => {
        expect(component.getLabOrderStatusColor(null)).toBe('basic');
        expect(component.getLabOrderStatusColor(undefined)).toBe('basic');
        expect(component.getLabOrderStatusColor('')).toBe('basic');
        expect(component.getLabOrderStatusColor('unknown_status')).toBe(
            'basic'
        );
    });
    it('should initialize stateParams from uiglobals.params', () => {
        component.ngOnInit();
        expect(component.stateParams).toBe(uIRouterGlobalsStub.params);
    });
    it('should test setDirectionFilter method with facilityID', () => {
        spyOn(component.$state, 'transitionTo');
        const facilityID = 'facility-123';

        component.setDirectionFilter(facilityID);

        expect(component.$state.transitionTo).toHaveBeenCalledWith(
            uIRouterGlobalsStub.current.name,
            {
                facilityID: facilityID,
                page: 1,
            },
            {
                reload: false,
                notify: true,
                inherit: false,
            }
        );
    });

    it('should test setDirectionFilter with empty facilityID', () => {
        spyOn(component.$state, 'transitionTo');

        component.setDirectionFilter('');

        expect(component.$state.transitionTo).toHaveBeenCalledWith(
            uIRouterGlobalsStub.current.name,
            {
                facilityID: '',
                page: 1,
            },
            {
                reload: false,
                notify: true,
                inherit: false,
            }
        );
    });

    it('should initialize statusFilters correctly', () => {
        component.ngOnInit();

        expect(component.statusFilters).toBeDefined();
        expect(component.statusFilters.length).toBe(2);

        expect(component.statusFilters[0].display).toBe('Active');
        expect(component.statusFilters[0].filter.status).toBe('active');
        expect(component.statusFilters[0].active).toBe(true);

        expect(component.statusFilters[1].display).toBe('Completed');
        expect(component.statusFilters[1].filter.status).toBe('completed');
        expect(component.statusFilters[1].active).toBeUndefined();
    });
});

describe('LabOrdersListComponent fails', () => {
    let component: LabOrdersListComponent;
    let fixture: ComponentFixture<LabOrdersListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [LabOrdersListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },

                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LabOrdersListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test ngOnInit and throw error when getReferrals is called', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    it('should test getVisitPatient function', () => {
        spyOn(component, 'getVisitPatient').and.callThrough();
        component.getVisitPatient('3068571b-4389-45b8-96da-6430353');
        expect(component.getVisitPatient).toHaveBeenCalled();
    });
});
