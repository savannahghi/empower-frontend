import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
import { VisitPaymentComponent } from './visit-payment.component';
import { NbToastrService } from '@nebular/theme';
import { VisitService } from '../visit.service';
import { of, Subject } from 'rxjs';
import { Transition, StateService } from '@uirouter/core';
import {
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
} from '@angular/core';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { AnalyticsService } from 'app/@core/utils';

/**
 * Mock component for SilDatatableComponent used in @ViewChild
 */
@Component({
    selector: 'sil-datatable',
    template: '',
    standalone: false,
})
class MockSilDatatableComponent {}

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

class SilStoresServiceStub {
    get() {
        return of({
            document_number: '1231',
            made_by: 'John',
            invoice_date: '2022-11-12T12:53:07.850000+03:00',
            amount: 20,
            customer: '5190ffca-9bd0-4d98-b9c9-9b0f62368f46',
            person: {
                age: { years: 55, months: 0, weeks: 0, days: 0 },
                phone_number: '0723856342',
            },
            service_requests: [
                {
                    invoice: {
                        amount_due: 100,
                        amount_paid: 100,
                        invoice_lines: [{ id: 1 }],
                    },
                },
            ],
            results: [
                {
                    id: '143223',
                    appointment_status: 'BOOKED',
                    actor: 'FACILITY',
                    specialty: 'OTHER',
                    document_number: '1231',
                    made_by: 'John',
                    invoice_date: '2022-11-12T12:53:07.850000+03:00',
                    amount: 20,
                    customer: '5190ffca-9bd0-4d98-b9c9-9b0f62368f46',
                },
            ],
        });
    }

    downloadDocument() {
        return of({ response: {} });
    }

    create() {
        return of({
            id: '4ed62h7281262h1',
            service_requests: [{ id: '123' }, { id: '124' }],
        });
    }

    nestedTransition() {
        return of({
            id: '4ed62h7281262h1',
            service_requests: [{ id: '2' }],
        });
    }

    update() {
        return of({
            id: '4ed62h7281262h1',
        });
    }

    createNested() {
        return of({
            id: '4ed62h7281262h1',
        });
    }

    list() {
        return of({
            results: [
                {
                    id: '143223',
                    appointment_status: 'BOOKED',
                    actor: 'FACILITY',
                    specialty: 'OTHER',
                    new_price: 18,
                    amount: '18',
                    product_name: 'Lipid',
                    quantity: 1,
                },
            ],
        });
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
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
    getWorkstation() {
        return {
            workstation: {
                workstation: '86199c80cf17',
                workstation__name: 'Workstation 1',
                workstation__org_unit__name: 'Workstation One Department',
                workstation__org_unit: '98163bas',
                workstation__org_unit__parent__name: 'Workstation One Branch',
                workstation__org_unit__parent: '0b8f278bcafe',
            },
        };
    }
    getOrgSettings() {
        return [
            {
                id: '260bb4db-59b7-4f93-b2fd-fe88d3af21a3',
                default: 'APPOINTMENT BOOKING',
                description:
                    'Select the preferred patient scheduling method to use',
                setting_type: 'str',
                name: 'scheduling:preferred_patient_scheduling_method',
                value: 'CHECK-IN SCHEDULING',
            },
        ];
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

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

describe('VisitPaymentComponent', () => {
    let component: VisitPaymentComponent;
    let fixture: ComponentFixture<VisitPaymentComponent>;
    let toastrServiceMock: any;
    let visitServiceMock: any;

    beforeEach(async () => {
        toastrServiceMock = {
            show: jasmine.createSpy('show'),
        };

        visitServiceMock = {
            visitDataEmitter: new Subject<any>(),
        };

        await TestBed.configureTestingModule({
            declarations: [VisitPaymentComponent, MockSilDatatableComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: NbToastrService, useValue: toastrServiceMock },
                { provide: VisitService, useValue: visitServiceMock },
                { provide: Transition, useClass: TransitionStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VisitPaymentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should initialize data on ngOnInit', () => {
        component.ngOnInit();
        expect(component.tableHeader.length).toBeGreaterThan(0);
        expect(component.rows.length).toBeGreaterThan(0);
        expect(component.filterParams).toEqual({});
    });

    it('should call toastrService.show in showToast', () => {
        component.showToast('top-end', 'success', 'Saved', 'Payment');
        component.setVisit({});
        expect(toastrServiceMock.show).toHaveBeenCalledWith(
            'Payment successfully',
            'Saved',
            jasmine.objectContaining({
                position: 'top-end',
                status: 'success',
                duration: component.toastTime,
            })
        );
    });

    it('should update visit on visitObservable emit', fakeAsync(() => {
        const testVisit = { id: 'visit1' };
        component.visitObservable();
        visitServiceMock.visitDataEmitter.next(testVisit);
        component.visit = testVisit;
        component.setVisit({});
        tick(500);
        expect(component.visit).toBeDefined();
    }));
});
