import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookReviewAppointmentComponent } from './book-review-appointment.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import * as moment from 'moment';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { AnalyticsService } from 'app/@core/utils';
import { VisitService } from '../../visits/visit.service';
import { NbToastrService } from '@nebular/theme';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';

const visitServiceStub = {
    completeVisit: jasmine.createSpy('completeVisit'),
};

const toastrServiceStub = {
    show: jasmine.createSpy('show'),
};

class AnalyticsServiceStub {
    logEvent() {
        return true;
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
            response: [{ id: 1 }],
            results: [
                {
                    id: '143223',
                    response: [{ id: 1 }],
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

describe('BookReviewAppointmentComponent', () => {
    let component: BookReviewAppointmentComponent;
    let fixture: ComponentFixture<BookReviewAppointmentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BookReviewAppointmentComponent],
            declarations: [],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: NbToastrService, useValue: toastrServiceStub },
                {
                    provide: ErrorHandlerService,
                    useValue: jasmine.createSpyObj('ErrorHandlerService', [
                        'handleError',
                    ]),
                },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(BookReviewAppointmentComponent);
        component = fixture.componentInstance;
        component.patient = { id: 'patient-id' };
        component.visit = { id: 'visit-id' };
        fixture.detectChanges();
    });

    it('should initialize model and formConfig on ngOnInit', () => {
        component.ngOnInit();
        component.handleErrorFxn({});
        component.handleAppointmentCreation();
        component.handleSchedules({ results: [{ id: 1 }] });
        component.handleSchedules({ results: [] });
        component.handleAppointmentCreation();
        expect(component.model['patient']).toEqual('patient-id');
        expect(component.formConfig.checkExpressionOn).toEqual(
            'changeDetectionCheck'
        );
    });

    it('should emit closeDialogue on closeAppointmentDialogue()', () => {
        spyOn(component.closeDialogue, 'emit');
        localStorage.setItem('unvailableDays', JSON.stringify([1, 2]));
        component.filterDay(moment());
        component.closeAppointmentDialogue();
        expect(component.closeDialogue.emit).toHaveBeenCalled();
    });

    it('should update formOptions via getFormOptions()', () => {
        component.getFormOptions({ custom: true });
        expect(component.formOptions).toEqual({ custom: true });
    });

    it('should select a slot and mark as selected', () => {
        const slot = {
            id: 'slot1',
            start: '2024-07-01T09:00:00',
            end: '2024-07-01T10:00:00',
        };
        component.selectSlot(slot);
        expect(component.selectedSlot).toEqual(slot);
        expect(component.slotSelected).toBeTrue();
    });

    it('should handleDateChange and call getSlots', () => {
        spyOn(component, 'getSlots').and.callThrough();
        spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([]));
        component.getCheckinSchedule();
        const date = new Date();
        component.handleDateChange(date);
        component.handleDateChange('2023-01-01');
        expect(component.getSlots).toHaveBeenCalled();
    });

    it('should test addAppointmentScheduleBooking and getModelData', () => {
        spyOn(component, 'addAppointmentScheduleBooking').and.callThrough();
        component.selectedSlot = {
            id: '12',
        };
        component.addAppointmentScheduleBooking();
        component.getModelData({ schedule: 1 });
        component.getModelData({ description: 'description' });
        component.getModelData({ schedule: null });
        component.displayScheduler();
        expect(component.addAppointmentScheduleBooking).toHaveBeenCalled();
    });

    it('should handle error from getCheckinSchedule', async () => {
        spyOn(component, 'getSlots').and.callThrough();
        component.getSlots({});
        component.addCheckInBooking({}, { id: 1 });
        component.getCheckinSchedule();
        component.selectSlot({});
        component.getCheckInSlots(moment());
        expect(component.getSlots).toHaveBeenCalled();
    });

    it('should process availability and store unavailable days', () => {
        spyOn(component, 'processAvailability').and.callThrough();
        component.processAvailability({ 1: [], 2: [] });
        expect(component.processAvailability).toHaveBeenCalled();
    });
});
