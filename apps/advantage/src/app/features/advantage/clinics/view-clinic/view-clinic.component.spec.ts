import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { BehaviorSubject, of } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { Transition } from '@uirouter/core';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { ViewClinicComponent } from './view-clinic.component';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';

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
}

class TransitionStub {
    params() {
        return { id: 1 };
    }
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
}

class SilStoresServiceStub {
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

    get() {
        return of({
            sort: () => {},
            description: 'Dr. Jane Doe',
            specialty: 'GENERAL PRACTITIONER',
            slot_duration: 30,
            availability: {
                '0': [{ start: '08:00', end: '17:00' }],
            },
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

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
        data: {
            useThisParamInstead: 'id',
        },
    },
    params() {
        return { appointment_id: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { appointment_id: 1 };
        },
    },
};

describe('CreateClinicComponent', () => {
    let component: ViewClinicComponent;
    let fixture: ComponentFixture<ViewClinicComponent>;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ViewClinicComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                ReactiveFormsModule,
                FormsModule,
                NgSelectModule,
                mockPipe('translate'),
                mockPipe('featureFlag'),
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                        snapshot: { url: ['add-clinic'] },
                    },
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Router, useValue: routerSpy },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ViewClinicComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
    });

    it('should test showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast(
            'bottom-right',
            'success',
            'msg',
            'Clinic has been updated'
        );
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'msg',
            'Clinic has been updated'
        );
    });

    it('should test toggleModal method', () => {
        spyOn(component, 'toggleModal').and.callThrough();
        component.toggleModal();
        expect(component.toggleModal).toHaveBeenCalled();
    });

    it('should test changeTimePeriodVisibility method', () => {
        spyOn(component, 'changeTimePeriodVisibility').and.callThrough();
        component.changeTimePeriodVisibility(false, 0);
        expect(component.changeTimePeriodVisibility).toHaveBeenCalledWith(
            false,
            0
        );
    });

    it('should test changeTimePeriodVisibility method when true', () => {
        spyOn(component, 'changeTimePeriodVisibility').and.callThrough();
        component.changeTimePeriodVisibility(true, 0);
        expect(component.changeTimePeriodVisibility).toHaveBeenCalledWith(
            true,
            0
        );
    });

    it('should test addTimePeriod method', () => {
        spyOn(component, 'addTimePeriod').and.callThrough();
        component.addTimePeriod(0);
        expect(component.addTimePeriod).toHaveBeenCalledWith(0);
    });

    it('should test removeTimePeriod method and hide timeslot', () => {
        spyOn(component, 'removeTimePeriod').and.callThrough();
        component.removeTimePeriod(0, 0);
        expect(component.removeTimePeriod).toHaveBeenCalledWith(0, 0);
    });

    it('should test removeTimePeriod method', () => {
        spyOn(component, 'removeTimePeriod').and.callThrough();
        component.removeTimePeriod(1, 0);
        expect(component.removeTimePeriod).toHaveBeenCalledWith(1, 0);
    });

    it('should test getLastEndTime method', () => {
        spyOn(component, 'getLastEndTime').and.callThrough();
        component.getLastEndTime([{ start: '09:00', end: '17:00' }]);
        expect(component.getLastEndTime).toHaveBeenCalledWith([
            { start: '09:00', end: '17:00' },
        ]);
    });

    it('should test createClinic method', () => {
        component.clinicId = '1234';
        spyOn(component, 'createClinic').and.callThrough();
        component.createClinic();
        component.updateName();
        expect(component.createClinic).toHaveBeenCalled();
    });

    it('should test createClinic method with a missing day', () => {
        component.availability = { 0: [{ start: '08:00', end: '17:00' }] };
        spyOn(component, 'createClinic').and.callThrough();
        component.createClinic();
        expect(component.createClinic).toHaveBeenCalled();
    });

    it('should test patch clinic method', () => {
        component.clinicId = undefined;
        spyOn(component, 'createClinic').and.callThrough();
        component.createClinic();
        expect(component.createClinic).toHaveBeenCalled();
    });

    it('should test fetchClinic method', () => {
        component.clinicId = '1234';
        spyOn(component, 'fetchClinic').and.callThrough();
        component.fetchClinic();
        expect(component.fetchClinic).toHaveBeenCalled();
    });

    it('should test fetchClinic method without clinicId', () => {
        component.clinicId = undefined;
        spyOn(component, 'fetchClinic').and.callThrough();
        component.fetchClinic();
        expect(component.fetchClinic).toHaveBeenCalled();
    });

    it('should test trackByIndex method', () => {
        component.clinicId = '1234';
        spyOn(component, 'trackByIndex').and.callThrough();
        component.trackByIndex(0);
        expect(component.trackByIndex).toHaveBeenCalled();
    });
});

class SilStoresServiceStub2 {
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

    get() {
        return of({
            sort: () => {},
            description: 'Dr. Jane Doe',
            specialty: 'GENERAL PRACTITIONER',
            practitioner_data: {
                person: {
                    person_display: 'Jane Doe',
                    title: 'Dr',
                },
            },
            slot_duration: 30,
            availability: {
                '0': [{ start: '08:00', end: '17:00' }],
            },
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
const uIRouterGlobalsStub2 = {
    current: {
        name: 'state',
        data: {
            useThisParamInstead: undefined,
        },
    },
    params() {
        return { appointment_id: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { appointment_id: 1 };
        },
    },
};

describe('CreateClinicComponent', () => {
    let component: ViewClinicComponent;
    let fixture: ComponentFixture<ViewClinicComponent>;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ViewClinicComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                ReactiveFormsModule,
                FormsModule,
                NgSelectModule,
                mockPipe('translate'),
                mockPipe('featureFlag'),
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                        snapshot: { url: ['add-clinic'] },
                    },
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Router, useValue: routerSpy },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub2 },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ViewClinicComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
    });

    it('should test fetchClinic method with practitioner_data', () => {
        component.clinicId = '1234';
        spyOn(component, 'fetchClinic').and.callThrough();
        component.fetchClinic();
        expect(component.fetchClinic).toHaveBeenCalled();
    });

    it('should test getFilteredResponse method', () => {
        const response = {
            id: '123',
            description: 'Jane Doe',
            specialty: 'other',
        };
        spyOn(component, 'getFilteredResponse').and.callThrough();
        component.getFilteredResponse(response);
        expect(component.getFilteredResponse).toHaveBeenCalledWith(response);
    });
});

class SilStoresServiceStubError {
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

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
}

describe('ViewClinicComponent: error', () => {
    let component: ViewClinicComponent;
    let fixture: ComponentFixture<ViewClinicComponent>;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ViewClinicComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                        snapshot: { url: ['add-clinic'] },
                    },
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Router, useValue: routerSpy },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
            ],
            imports: [
                ReactiveFormsModule,
                FormsModule,
                NgSelectModule,
                mockPipe('translate'),
                mockPipe('featureFlag'),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ViewClinicComponent);
        component = fixture.componentInstance;
    });

    it('should test createClinic method', () => {
        component.clinicId = '1234';
        spyOn(component, 'createClinic').and.callThrough();
        component.createClinic();
        expect(component.createClinic).toHaveBeenCalled();
    });

    it('should test patch clinic method', () => {
        component.clinicId = undefined;
        spyOn(component, 'createClinic').and.callThrough();
        component.createClinic();
        expect(component.createClinic).toHaveBeenCalled();
    });

    it('should test fetchClinic method', () => {
        component.clinicId = '1234';
        spyOn(component, 'fetchClinic').and.callThrough();
        component.fetchClinic();
        expect(component.fetchClinic).toHaveBeenCalled();
    });

    it('should test getFilteredResponse method', () => {
        const response = {
            id: '123',
            description: 'Jane Doe',
            specialty: 'other',
        };
        spyOn(component, 'getFilteredResponse').and.callThrough();
        component.getFilteredResponse(response);
        expect(component.getFilteredResponse).toHaveBeenCalledWith(response);
    });
});
