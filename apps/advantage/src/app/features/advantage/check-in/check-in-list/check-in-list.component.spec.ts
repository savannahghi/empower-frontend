import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckInListComponent } from './check-in-list.component';
import { BehaviorSubject, of } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { PatientService } from '../../patients/patient.service';
import { LocalStateService } from '../../../../@core/utils/state.service';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { FeatureFlagService } from 'app/@core/utils/feature.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { VariantPipe } from 'app/@theme/pipes/variant/variant.pipe';
import { AnalyticsService } from 'app/@core/utils/analytics.service';

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
    getOrgSettings() {
        return [
            {
                name: 'patients:patient_full_name',
                value: 'true',
            },
        ];
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'fsdfs09344mlw03434',
            clinical_org_id: 'asdkasdisefd832ksd',
        };
    }
}

class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
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

class LocalStateServiceStub {
    getFinalFilters() {
        return { start: '2023-10-29' };
    }
}

class PatientServiceStub {
    patientVisitDataEmitter() {
        return of({
            id: '143224',
        });
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

class PipeStub {
    transform() {
        return true;
    }
}
class TransitionStub {
    params() {
        return { appointment_id: 1 };
    }
}

const uIRouterGlobalsStub = {
    params: {},
    current: {
        name: 'state',
    },
    $current: {
        is: () => true,
    },
};

class AuthenticationStubError {
    checkPermission() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

class SilStoresServiceStub {
    create() {
        return of({
            id: '4ed62h7281262h1',
            service_requests: [{ id: '123' }, { id: '124' }],
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
                },
            ],
        });
    }
}

class AuthenticationStub {
    checkPermission() {
        return true;
    }
}

class NbToastrServiceStub {
    show() {
        return {};
    }
}

class AnalyticsServiceStub {
    logEvent() {
        return true;
    }
}

describe('CheckInListComponent appointment status booked', () => {
    let component: CheckInListComponent;
    let fixture: ComponentFixture<CheckInListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CheckInListComponent],
            imports: [mockPipe('translate'), mockPipe('variantDisplay')],
            providers: [
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: LocalStateService, useClass: LocalStateServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CheckInListComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
    });

    it('should test getVisitDetail', () => {
        const event = {
            patient_details: { id: '123', name: 'John', age: '20' },
        };
        component.setFilter(event);
        component.getVisitDetails(event);
        expect(component).toBeTruthy();
    });

    it('should test addAppointment', () => {
        component.actions[0].expression({
            appointment_status: 'BOOKED',
            patient_details: {
                id: '123',
                person: {
                    date_of_birth: '2023-02-10',
                    first_name: 'Maina',
                    last_name: 'Kimani',
                    other_names: 'Alex',
                    gender: 'Male',
                },
            },
        });
        component.actions[1].expression({
            appointment_status: 'BOOKED',
            patient_details: {
                id: '123',
                person: {
                    date_of_birth: '2023-02-10',
                    first_name: 'Maina',
                    last_name: '',
                    other_names: 'Alex',
                    gender: '',
                },
            },
        });
        component.actions[2].expression({
            row: { appointment_status: 'ARRIVED' },
        });
        component.actions[3].expression({
            appointment_status: 'PENDING',
            start: moment(),
        });
        component.actions[4].expression({
            appointment_status: 'PENDING',
            start: moment().add(1, 'days'),
        });
        const model = {
            patient: { id: '123', name: 'John', age: '20' },
        };
        component.getFormOptions(model);
        component.addAppointment(model);
        expect(component).toBeTruthy();
    });

    it('should test addAppointment method when there are no slots', () => {
        // simulates a falsy outcome
        component.timeSlots = {};
        const checkInDetails = {
            patient: { id: '123', name: 'John', age: '20' },
        };
        spyOn(component, 'showToast');
        component.addAppointment(checkInDetails);
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'Failed!',
            'Cannot check in patient'
        );
        expect(component.loading).toBeFalse();
    });

    it('should test addAppointment method when slot has no id', () => {
        component.timeSlots = {
            end: '23:00',
            start: '21:00',
        };
        const checkInDetails = {};
        spyOn(component, 'showToast');
        component.addAppointment(checkInDetails);
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'Failed!',
            'Cannot check in patient'
        );
        expect(component.loading).toBeFalse();
    });
    it('should test handleDateChange', () => {
        const event = moment();
        const event2 = moment().add(1, 'days');
        component.handleDateChange(event);
        component.handleDateChange(event2);
        expect(component).toBeTruthy();
    });
});

class SilStoresServiceStub2 {
    list() {
        return of({ results: [] });
    }
    create() {
        return of({
            id: '4ed62h7281262h1',
        });
    }
}

const uIRouterGlobalsStub2 = {
    params: { page: '1', appointment_status: 'Arrived', ordering: 'start' },
    current: {
        name: 'state',
    },
    $current: {
        is: () => true,
    },
};

describe('CheckInListComponent - no checkin schedule', () => {
    let component: CheckInListComponent;
    let fixture: ComponentFixture<CheckInListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CheckInListComponent],
            imports: [mockPipe('translate'), mockPipe('variantDisplay')],
            providers: [
                { provide: Transition, useClass: TransitionStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStub,
                },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub2 },
                { provide: LocalStateService, useClass: LocalStateServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CheckInListComponent);
        component = fixture.componentInstance;
        component.isMounted = true;
        component.ngOnInit();
    });

    it('should test add no checkin schedule', () => {
        expect(component).toBeTruthy();
    });
});

class SilStoresServiceStub3 {
    list() {
        return of({
            results: [
                {
                    id: '143223',
                    actor: 'FACILITY',
                    specialty: 'OTHER',
                },
                {
                    id: '143224',
                    actor: 'FACILITY',
                    specialty: 'OTHER',
                },
            ],
        });
    }
    create() {
        return of({
            id: '4ed62h7281262h1',
        });
    }
}

class AuthorizationStubNoOrgId {
    getOrganisation() {
        return {};
    }
    setUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getWorkstation() {
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
    getAdvantageOrganisation() {
        return {
            organisation_id: undefined,
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
    setClinicalIds() {
        return {
            clinical_facility_id: 'fsdfs09344mlw03434',
            clinical_org_id: 'asdkasdisefd832ksd',
        };
    }
}

class FeatureFlagServiceStub {
    getForcedValue() {
        return true;
    }
    featuresLoaded: true;
}

describe('CheckInListComponent - more than one checkin schedule', () => {
    let component: CheckInListComponent;
    let fixture: ComponentFixture<CheckInListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CheckInListComponent],
            imports: [mockPipe('translate'), mockPipe('variantDisplay')],
            providers: [
                { provide: Transition, useClass: TransitionStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStubError,
                },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStub,
                },
                { provide: Authorization, useClass: AuthorizationStubNoOrgId },
                { provide: SilStoresService, useClass: SilStoresServiceStub3 },
                { provide: LocalStateService, useClass: LocalStateServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CheckInListComponent);
        component = fixture.componentInstance;
        component.isMounted = true;
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should test add no checkin schedule', () => {
        component.getCheckinSchedule();
        component.loadFlag();
        expect(component.addMinDateToCalendar).toBeUndefined();
        expect(component).toBeTruthy();
    });
});

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

class FeatureFlagServiceStuError {
    getForcedValue() {
        return true;
    }
    featuresLoaded: true;
}

describe('CheckInListComponent error', () => {
    let component: CheckInListComponent;
    let fixture: ComponentFixture<CheckInListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CheckInListComponent],
            imports: [mockPipe('translate'), mockPipe('variantDisplay')],
            providers: [
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: FeatureFlagService,
                    useClass: FeatureFlagServiceStuError,
                },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationStubError,
                },
                { provide: LocalStateService, useClass: LocalStateServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CheckInListComponent);
        component = fixture.componentInstance;
    });

    it('should test errors', () => {
        spyOn(component, 'getCheckinSchedule').and.callFake(function () {});
        component.ngOnInit();
        const event = {
            patient_details: { id: '123', name: 'John', age: '20' },
        };
        component.getVisitDetails(event);
        component.createCheckinSchedule();
        const today = {};
        component.checkinSchedule = {
            id: '123',
            schedule: 'check-in',
            sched_actor: 'FACILITY',
        };
        component.getSlots(today);
        const model = { patient: { id: '123' } };
        component.timeSlots = {
            id: '123',
            start: '2023-10-29T00:00:05',
            end: '2023-10-29T00:10:05',
        };
        component.loadFlag();
        expect(component.addMinDateToCalendar).toBeUndefined();
        component.addAppointment(model);
        expect(component).toBeTruthy();
    });
});
