import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import moment from 'moment';
import { BehaviorSubject, of } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/core';
import { AddAppointmentComponent } from './add-appointment.component';
import { PatientService } from '../../patients/patient.service';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { PatientModel } from '../../models';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { AnalyticsService } from 'app/@core/utils/analytics.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { FeatureFlagService } from 'app/@core/utils/feature.service';
import { VariantPipe } from 'app/@theme/pipes/variant/variant.pipe';

export const mockPatientData: PatientModel = {
    person: {
        first_name: 'John',
        gender: 'MALE',
        last_name: 'Doe',
        person_contacts: [
            {
                contact_type: 'phone_number',
                contact: '+254712345678',
                is_primary_contact: true,
            },
        ],
        person_photos: [],
        person_ids: [],
    },
};

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

class PatientServiceStub {
    patientVisitDataEmitter() {
        return of({
            id: '143224',
        });
    }
}

class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
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

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    reload() {
        return true;
    }
    transitionTo() {
        return true;
    }
}
class TransitionStub {
    params() {
        return { appointment_id: 1 };
    }
}

class AuthenticationStub {
    checkPermission() {
        return true;
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    $current: {
        is: () => true,
    },
};

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
            client_types: ['PROVIDER'],
        };
    }
    setUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getOrgSettings() {
        return [
            {
                name: 'patients:patient_full_name',
                value: 'true',
            },
        ];
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
}

class SilStoresServiceStub {
    get() {
        return of({
            id: 'grsgg342332sf',
            start: '2022-12-07T21:00:00.000Z',
            sched_id: '4ed62h7281262h1',
            patient_details: {
                id: '1',
                person: {
                    gender: 'MALE',
                },
            },
        });
    }

    create() {
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

    list() {
        return of({
            results: [
                {
                    id: '143224',
                },
            ],
        });
    }
}

class NbToastrServiceStub {
    show() {
        return {};
    }
}

class NbDialogServiceStub {
    open() {
        return {};
    }
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

class FeatureFlagServiceStub {
    checkVariantFlag(): boolean {
        return false;
    }
    getForcedValue(): boolean {
        return false;
    }
}

class FeatureFlagServiceStubTrue {
    checkVariantFlag(): boolean {
        return true;
    }
    getForcedValue(): boolean {
        return true;
    }
}

describe('AddAppointmentComponent', () => {
    let component: AddAppointmentComponent;
    let fixture: ComponentFixture<AddAppointmentComponent>;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddAppointmentComponent],
            imports: [
                mockPipe('titleCase'),
                mockPipe('age'),
                mockPipe('gender'),
                mockPipe('translate'),
                mockPipe('statusColor'),
                mockPipe('replaceWith'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                VariantPipe,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                        snapshot: { url: ['add-appointment'] },
                    },
                },
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Router, useValue: routerSpy },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: NbDialogService, useClass: NbDialogServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AddAppointmentComponent);
        component = fixture.componentInstance;
        component.startWalkthrough();
        fixture.detectChanges();
        component.model = {
            start: moment(),
        };
        component.formOptions = {
            resetModel: () => {},
        };
        component.selectedSlot = {
            id: '12345',
            start: '2022-01-2',
            end: '2022-01-2',
        };
        component.patient = {
            id: '123',
            patient_full_name: 'Maina Kimani',
            person: { other_names: 'Kimani' },
        };
        component.patientService.patientVisitDataEmitter.next({ id: 1 });
        spyOn(console, 'error').and.callFake(() => {});
    });

    it('should test navigateToStartVisit method', () => {
        spyOn(component, 'navigateToStartVisit').and.callThrough();
        component.navigateToStartVisit();
        expect(component.navigateToStartVisit).toHaveBeenCalled();
    });

    it('should test displayScheduler method', () => {
        spyOn(component, 'displayScheduler').and.callThrough();
        component.displayScheduler();
        expect(component.displayScheduler).toHaveBeenCalled();
    });

    it('should test selectSlot method', () => {
        spyOn(component, 'selectSlot').and.callThrough();
        component.selectSlot('26713172');
        expect(component.selectSlot).toHaveBeenCalledWith('26713172');
    });

    it('should test handleDateChange method', () => {
        spyOn(component, 'handleDateChange').and.callThrough();
        component.handleDateChange({});
        component.handleDateChange('2022-11-11');
        expect(component.handleDateChange).toHaveBeenCalledWith({});
    });

    it('should test addAppointment method', () => {
        spyOn(component, 'addAppointment').and.callThrough();
        component.addAppointment();
        expect(component.addAppointment).toHaveBeenCalled();
    });

    it('should test changeQueue method', () => {
        spyOn(component, 'changeQueue').and.callThrough();
        component.changeQueue({ id: 1 });
        expect(component.changeQueue).toHaveBeenCalled();
    });

    it('should test rescheduleAppointment method', () => {
        spyOn(component, 'rescheduleAppointment').and.callThrough();
        component.rescheduleAppointment();
        expect(component.rescheduleAppointment).toHaveBeenCalledWith();
    });

    it('should test getModelData method when submitted', () => {
        component.displayScheduling = true;
        component.appointmentId = 'dsd';
        component.getModelData({ reason: 'sick', schedule: null });
        component.getModelData({ schedule: '123456' });
        component.appointmentId = null;
        component.model['schedule'] = '654321';
        spyOn(component, 'getModelData').and.callThrough();
        component.getModelData({ schedule: '123456' });
        component.getModelData({ schedule: '123456', patient: '123123' });
        expect(component.getModelData).toHaveBeenCalledWith({
            schedule: '123456',
        });
    });

    it('should test getModelData method when not submitted', () => {
        component.displayScheduling = false;
        spyOn(component, 'getModelData').and.callThrough();
        component.getModelData({});
        expect(component.getModelData).toHaveBeenCalledWith({});
    });

    it('should test showTimeSlots method when slot exists', () => {
        component.model['schedule'] = '123456';
        component.model['patient'] = '16v2b2w';
        spyOn(component, 'showTimeSlots').and.callThrough();
        component.showTimeSlots();
        expect(component.showTimeSlots).toHaveBeenCalled();
    });

    it('should test showTimeSlots', () => {
        component.model['schedule'] = null;
        component.model['patient'] = null;
        spyOn(component, 'showTimeSlots').and.callThrough();
        component.showTimeSlots();
        expect(component.showTimeSlots).toHaveBeenCalled();
    });

    it('should test getAppointmentDetails method', () => {
        component.model['schedule'] = '123456';
        component.model['patient'] = '16v2b2w';
        component.appointmentId = '123456';
        component.patient = { id: '123' };
        spyOn(component, 'getAppointmentDetails').and.callThrough();
        component.getAppointmentDetails();
        expect(component.getAppointmentDetails).toHaveBeenCalled();
    });

    it('should test getAppointmentDetails method without appointmentId', () => {
        component.appointmentId = null;
        spyOn(component, 'getAppointmentDetails').and.callThrough();
        component.getAppointmentDetails();
        expect(component.getAppointmentDetails).toHaveBeenCalled();
    });

    it('should test setTableFilter method', () => {
        component.appointmentId = null;
        spyOn(component, 'setTableFilter').and.callThrough();
        component.setTableFilter('');
        expect(component.setTableFilter).toHaveBeenCalledWith('');
    });

    it('should test openDialog method', () => {
        component.appointmentId = null;
        spyOn(component, 'openDialog').and.callThrough();
        component.openDialog('');
        expect(component.openDialog).toHaveBeenCalledWith('');
    });

    it('should test getPatientArrivedVisit method', () => {
        spyOn(component, 'getPatientArrivedVisit').and.callThrough();
        component.getPatientArrivedVisit();
        component.patientService.patientVisitDataEmitter.next(() => '');
        expect(component.getPatientArrivedVisit).toHaveBeenCalled();
    });

    it('should call fireSwal', fakeAsync(() => {
        spyOn(component, 'fireSwal').and.callThrough();
        component.fireSwal({ fire: () => {} });
        expect(component.fireSwal).toHaveBeenCalled();
    }));

    it('should test updateConfirmArrivalStatus method', fakeAsync(() => {
        spyOn(component, 'updateConfirmArrivalStatus').and.callThrough();
        spyOn(component, 'fireSwal');
        component.updateConfirmArrivalStatus();
        expect(component.updateConfirmArrivalStatus).toHaveBeenCalled();
    }));

    it('should test updateConfirmBookedStatus method', fakeAsync(() => {
        spyOn(component, 'updateConfirmBookedStatus').and.callThrough();
        spyOn(component, 'fireSwal');
        component.updateConfirmBookedStatus();
        expect(component.updateConfirmBookedStatus).toHaveBeenCalled();
    }));

    it('should test confirmUpdate method', fakeAsync(() => {
        spyOn(component, 'confirmUpdate').and.callThrough();
        component.confirmUpdate();
        tick(500);
        expect(component.confirmUpdate).toHaveBeenCalled();
    }));

    it('should test transitionToFulfilled method', fakeAsync(() => {
        spyOn(component, 'transitionToFulfilled').and.callThrough();
        component.transitionToFulfilled();
        tick(500);
        expect(component.transitionToFulfilled).toHaveBeenCalled();
    }));

    it('should test transitionToBooked method', fakeAsync(() => {
        spyOn(component, 'fireSwal');
        spyOn(component, 'transitionToBooked').and.callThrough();
        component.transitionToBooked();
        tick(500);
        expect(component.transitionToBooked).toHaveBeenCalled();
    }));

    it('should test  handleAppointmentStartVisit method', () => {
        spyOn(component, 'handleAppointmentStartVisit').and.callThrough();
        component.handleAppointmentStartVisit();
        expect(component.handleAppointmentStartVisit).toHaveBeenCalled();
    });
});

class SilStoresServiceStub2 {
    get() {
        return of({
            id: 'grsgg342332sf',
            start: '2022-12-07T21:00:00.000Z',
            sched_id: '4ed62h7281262h1',
            patient_details: {
                id: '1',
                person: {
                    gender: 'MALE',
                },
            },
        });
    }

    list() {
        return of([
            {
                id: '143224',
            },
        ]);
    }
}

describe('AddAppointmentComponent when response is an array', () => {
    let component: AddAppointmentComponent;
    let fixture: ComponentFixture<AddAppointmentComponent>;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddAppointmentComponent],
            imports: [
                mockPipe('titleCase'),
                mockPipe('age'),
                mockPipe('gender'),
                mockPipe('translate'),
                mockPipe('statusColor'),
                mockPipe('replaceWith'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                VariantPipe,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                        snapshot: { url: ['add-appointment'] },
                    },
                },
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Router, useValue: routerSpy },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStubTrue,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: NbDialogService, useClass: NbDialogServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub2 },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AddAppointmentComponent);
        component = fixture.componentInstance;
        component.startWalkthrough();
        spyOn(console, 'error').and.callFake(() => {});

        fixture.detectChanges();
    });

    it('should test  getSettings method', () => {
        spyOn(component, 'getSettings').and.callThrough();
        spyOn(component, 'handleAppointmentStartVisit').and.callThrough();
        component.getSettings();
        expect(component.getSettings).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('AddAppointmentComponent: error', () => {
    let component: AddAppointmentComponent;
    let fixture: ComponentFixture<AddAppointmentComponent>;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddAppointmentComponent],
            imports: [
                mockPipe('titleCase'),
                mockPipe('age'),
                mockPipe('gender'),
                mockPipe('translate'),
                mockPipe('statusColor'),
                mockPipe('replaceWith'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                VariantPipe,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                        snapshot: { url: ['add-appointment'] },
                    },
                },
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Router, useValue: routerSpy },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                { provide: NbDialogService, useClass: NbDialogServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStubTrue,
                },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AddAppointmentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.model = {
            start: moment(),
        };
        component.selectedSlot = {
            id: '12345',
            start: '2022-01-2',
            end: '2022-01-2',
        };
        component.patient = { id: '123' };
        spyOn(console, 'error').and.callFake(() => {});
    });

    it('should test getSlots method', () => {
        spyOn(component, 'getSlots').and.callThrough();
        component.getSlots('2022-09-11');
        expect(component.getSlots).toHaveBeenCalledWith('2022-09-11');
    });

    it('should test addAppointment method', () => {
        spyOn(localStorage, 'getItem').and.returnValue(
            JSON.stringify([1, 2, 4])
        );
        spyOn(component, 'addAppointment').and.callThrough();
        component.addAppointment();
        component.getSchedule();
        component.filterDay(moment());
        expect(component.addAppointment).toHaveBeenCalled();
    });

    it('should test rescheduleAppointment method', () => {
        spyOn(component, 'rescheduleAppointment').and.callThrough();
        component.rescheduleAppointment();
        expect(component.rescheduleAppointment).toHaveBeenCalledWith();
    });

    it('should test getAppointmentDetails method', () => {
        component.model['schedule'] = '123456';
        component.model['patient'] = '16v2b2w';
        component.model['appointment_status'] = 'BOOKED';
        component.appointmentId = '123456';
        spyOn(component, 'getAppointmentDetails').and.callThrough();
        component.model['start'] = moment()
            .add(1, 'month')
            .format('YYYY-MM-DD');
        component.getAppointmentDetails();
        expect(component.getAppointmentDetails).toHaveBeenCalled();
    });

    it('should test confirmUpdate method', () => {
        spyOn(component, 'confirmUpdate').and.callThrough();
        component.confirmUpdate();
        expect(component.confirmUpdate).toHaveBeenCalled();
    });

    it('should test transitionToFulfilled method', () => {
        spyOn(component, 'transitionToFulfilled').and.callThrough();
        component.transitionToFulfilled();
        expect(component.transitionToFulfilled).toHaveBeenCalled();
    });

    it('should test transitionToBooked method', fakeAsync(() => {
        spyOn(component, 'fireSwal');
        spyOn(component, 'transitionToBooked').and.callThrough();
        component.transitionToBooked();
        tick(500);
        expect(component.transitionToBooked).toHaveBeenCalled();
    }));
});
