import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { AddFutureCheckInComponent } from './add-future-check-in.component';
import { BehaviorSubject, of } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition } from '@uirouter/angular';
import moment from 'moment';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { TranslateService } from '@ngx-translate/core';
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
    getWorkstation() {
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
        return { appointment_id: 1, state: 'home' };
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

describe('AddFutureCheckInComponent', () => {
    let component: AddFutureCheckInComponent;
    let fixture: ComponentFixture<AddFutureCheckInComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AddFutureCheckInComponent],
            imports: [mockPipe('translate')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AddFutureCheckInComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test addAppointment', () => {
        const event = {
            visit_date: moment(),
            patient: { id: '123', name: 'John', age: '20' },
        };
        spyOn(component, 'addAppointment').and.callThrough();
        component.getFormOptions(event);
        component.addAppointment(event);
        expect(component.addAppointment).toHaveBeenCalledWith(event);
    });

    it('should test back future checkin button', () => {
        spyOn(component, 'back').and.stub();
        component.back();
        expect(component.back).toHaveBeenCalled();
    });
});

class TransitionStub2 {
    params() {
        return { appointment_id: 1, state: undefined };
    }
}

describe('AddFutureCheckInComponent undefined state params', () => {
    let component: AddFutureCheckInComponent;
    let fixture: ComponentFixture<AddFutureCheckInComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AddFutureCheckInComponent],
            imports: [mockPipe('translate')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Transition, useClass: TransitionStub2 },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AddFutureCheckInComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test addAppointment', () => {
        const event = {
            visit_date: moment(),
            patient: { id: '123', name: 'John', age: '20' },
        };
        spyOn(component, 'addAppointment').and.callThrough();
        component.getFormOptions(event);
        component.addAppointment(event);
        expect(component.addAppointment).toHaveBeenCalledWith(event);
    });

    it('should test back future checkin button', () => {
        spyOn(component, 'back').and.stub();
        component.back();
        expect(component.back).toHaveBeenCalled();
    });
});

class SilStoresServiceStub2 {
    create() {
        return of({
            id: '4ed62h7281262h1',
            service_requests: [{ id: '123' }, { id: '124' }],
        });
    }
    list() {
        return of({
            results: [],
        });
    }
}

describe('AddFutureCheckInComponent with null results', () => {
    let component: AddFutureCheckInComponent;
    let fixture: ComponentFixture<AddFutureCheckInComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AddFutureCheckInComponent],
            imports: [mockPipe('translate')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub2 },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AddFutureCheckInComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test nul results', () => {
        component.checkinSchedule = { id: '123' };
        component.getSlots(moment());
        component.getCheckinSchedule();
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

describe('Test errors', () => {
    let component: AddFutureCheckInComponent;
    let fixture: ComponentFixture<AddFutureCheckInComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AddFutureCheckInComponent],
            imports: [mockPipe('translate')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Transition, useClass: TransitionStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: AnalyticsService, useClass: AnalyticsServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AddFutureCheckInComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test addAppointment error', () => {
        const event = {
            visit_date: moment(),
            patient: { id: '123', name: 'John', age: '20' },
        };
        spyOn(component, 'getCheckinSchedule').and.stub();
        component.addAppointment(event);
        expect(component.getCheckinSchedule).toHaveBeenCalled();
    });
    it('should test getCheckinSchedule and getSlots error', () => {
        component.getCheckinSchedule();
        spyOn(component, 'getSlots').and.callThrough();
        component.checkinSchedule = { id: '123' };
        component.getSlots(moment());
        expect(component.getSlots).toHaveBeenCalled();
    });
});
