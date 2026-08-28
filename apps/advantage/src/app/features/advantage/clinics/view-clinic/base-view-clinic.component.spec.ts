import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { of, throwError } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { Transition } from '@uirouter/core';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { ViewClinicBaseComponent } from './base-view-clinic.component';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';

// Mock Pipe Function
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

// Service Stubs
class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
    }
}

class TranslateServiceStub {
    setFallbackLang() {}
    use() {}
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
        return { id: '1' };
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

class SilStoresServiceStubError extends SilStoresServiceStub {
    create() {
        return throwError(() => new Error('Boom'));
    }

    update() {
        return throwError(() => new Error('Boom'));
    }

    get() {
        return throwError(() => new Error('Boom'));
    }

    list() {
        return throwError(() => new Error('Boom'));
    }
}

class NbToastrServiceStub {
    show() {}
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
        data: {
            useThisParamInstead: 'id',
        },
    },
    params() {
        return { appointment_id: '1' };
    },
    $current: {
        is: () => true,
        params() {
            return { appointment_id: '1' };
        },
    },
};

describe('ViewClinicBaseComponent', () => {
    let component: ViewClinicBaseComponent;
    let fixture: ComponentFixture<ViewClinicBaseComponent>;
    let toastrService: NbToastrService;
    let errorHandler: jasmine.SpyObj<ErrorHandlerService>;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };
    const mockActivatedRoute = {
        queryParams: of({ id: 123 }),
        snapshot: { url: ['add-clinic'] },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ViewClinicBaseComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                ReactiveFormsModule,
                FormsModule,
                NgSelectModule,
                mockPipe('translate'),
                mockPipe('featureFlag'),
            ],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: Router, useValue: routerSpy },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                {
                    provide: ErrorHandlerService,
                    useValue: jasmine.createSpyObj('ErrorHandlerService', [
                        'handleError',
                    ]),
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ViewClinicBaseComponent);
        component = fixture.componentInstance;
        toastrService = TestBed.inject(NbToastrService);
        errorHandler = TestBed.inject(
            ErrorHandlerService
        ) as jasmine.SpyObj<ErrorHandlerService>;
        fixture.detectChanges();
    });

    describe('Default Behavior', () => {
        it('should initialize component and fetch clinic with useThisParamInstead', () => {
            spyOn(component, 'fetchClinic');
            component.ngOnInit();
            expect(component.clinicId).toBe('1');
            expect(component.fetchClinic).toHaveBeenCalled();
        });

        it('should call toastrService.show with correct parameters', () => {
            spyOn(toastrService, 'show');
            component.showToast(
                'bottom-right',
                'success',
                'msg',
                'Clinic has been updated'
            );
            expect(toastrService.show).toHaveBeenCalledWith(
                'Clinic has been updated successfully',
                'msg',
                {
                    position: 'bottom-right' as NbGlobalPhysicalPosition,
                    status: 'success',
                    duration: 7000,
                }
            );
        });

        it('should toggle showModal from false to true', () => {
            component.showModal = false;
            component.toggleModal();
            expect(component.showModal).toBeTrue();
        });

        it('should test validate form', () => {
            component.actor = 'PRACTITIONER';
            component.validateForm();
            component.actor = 'FACILITY';
            component.validateForm();
        });

        it('should show time periods when event is true', () => {
            const dayIndex = 0;
            component.selectedDay[dayIndex] = false;
            component.availability = {
                ...component.availability,
                [dayIndex]: [],
            };
            component.changeTimePeriodVisibility(true, dayIndex);
            expect(component.selectedDay[dayIndex]).toBeTrue();
            expect(component.availability[dayIndex].length).toBe(1);
            expect(component.availability[dayIndex][0].start).toBe(
                component.start
            );
            expect(component.availability[dayIndex][0].end).toBe(component.end);
        });

        it('should hide time periods when event is false', () => {
            const dayIndex = 0;
            component.selectedDay[dayIndex] = true;
            component.availability = {
                ...component.availability,
                [dayIndex]: [{ start: '08:00', end: '17:00' }],
            };
            component.changeTimePeriodVisibility(false, dayIndex);
            expect(component.selectedDay[dayIndex]).toBeFalse();
            expect(component.availability[dayIndex].length).toBe(0);
        });

        it('should remove the specified time period', () => {
            const dayIndex = 0;
            component.availability = {
                ...component.availability,
                [dayIndex]: [
                    { start: '08:00', end: '12:00' },
                    { start: '13:00', end: '17:00' },
                ],
            };
            component.selectedDay[dayIndex] = true;

            component.removeTimePeriod(dayIndex, 1);
            expect(component.availability[dayIndex].length).toBe(1);
            expect(component.availability[dayIndex][0].start).toBe('08:00');
            expect(component.availability[dayIndex][0].end).toBe('12:00');
        });

        it('should return the end time of the last time period', () => {
            const dayList = [
                { start: '08:00', end: '12:00' },
                { start: '13:00', end: '17:00' },
            ];
            const lastEndTime = component.getLastEndTime(dayList);
            expect(lastEndTime).toBe('17:00');
        });

        it('should modify practitioner with title', () => {
            const practitioner = {
                id: 'practitioner1',
                person: {
                    person_display: 'Jane Doe',
                    title: 'Dr',
                    phone_number: '1234567890',
                    email: 'jane.doe@example.com',
                },
                qualification: 'GENERAL PRACTITIONER',
            };

            const modified = component.modifyPractitioner(practitioner);
            expect(modified).toEqual({
                id: 'practitioner1',
                description: 'Dr Jane Doe',
                specialty: 'GENERAL PRACTITIONER',
                phone_number: '1234567890',
                email: 'jane.doe@example.com',
            });
        });

        it('should modify practitioner without title', () => {
            const practitioner = {
                id: 'practitioner1',
                person: {
                    person_display: 'Jane Doe',
                    phone_number: '1234567890',
                    email: 'jane.doe@example.com',
                },
                qualification: 'GENERAL PRACTITIONER',
            };

            const modified = component.modifyPractitioner(practitioner);
            expect(modified).toEqual({
                id: 'practitioner1',
                description: 'Jane Doe',
                specialty: 'GENERAL PRACTITIONER',
                phone_number: '1234567890',
                email: 'jane.doe@example.com',
            });
        });

        it('should handle undefined practitioner', () => {
            const modified = component.modifyPractitioner(undefined);
            expect(modified).toEqual({
                id: undefined,
                description: undefined,
                specialty: undefined,
                phone_number: undefined,
                email: undefined,
            });
        });

        it('should track by index', () => {
            const index = 5;
            const result = component.trackByIndex(index);
            expect(result).toBe(index);
        });

        it('should return only selected days', () => {
            component.selectedDay = [
                true,
                false,
                true,
                false,
                false,
                false,
                false,
            ];
            const selected = component.selectedDays;
            expect(selected.length).toBe(2);
            expect(selected[0].day).toBe(0);
            expect(selected[1].day).toBe(2);
        });

        it('should return an empty array if no days are selected', () => {
            component.selectedDay = [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
            ];
            const selected = component.selectedDays;
            expect(selected.length).toBe(0);
        });
    });

    describe('Error Handling', () => {
        beforeEach(() => {
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                declarations: [ViewClinicBaseComponent],
                schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
                imports: [
                    ReactiveFormsModule,
                    FormsModule,
                    NgSelectModule,
                    mockPipe('translate'),
                    mockPipe('featureFlag'),
                ],
                providers: [
                    { provide: ActivatedRoute, useValue: mockActivatedRoute },
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
                    {
                        provide: TranslateService,
                        useClass: TranslateServiceStub,
                    },
                    { provide: Cookies, useClass: CookieServiceStub },
                    {
                        provide: ErrorHandlerService,
                        useValue: jasmine.createSpyObj('ErrorHandlerService', [
                            'handleError',
                        ]),
                    },
                ],
            }).compileComponents();

            fixture = TestBed.createComponent(ViewClinicBaseComponent);
            component = fixture.componentInstance;
            toastrService = TestBed.inject(NbToastrService);
            errorHandler = TestBed.inject(
                ErrorHandlerService
            ) as jasmine.SpyObj<ErrorHandlerService>;
            fixture.detectChanges();
        });

        it('should handle error when creating a new clinic', fakeAsync(() => {
            component.clinicId = undefined;
            component.selectedDuration = '30';
            component.selectedPractitioner = {
                description: 'Dr. Jane Doe',
                specialty: 'GENERAL PRACTITIONER',
                id: 'practitioner1',
            };
            component.availability = {
                '0': [{ start: '08:00', end: '17:00' }],
                '1': [],
                '2': [],
                '3': [],
                '4': [],
                '5': [],
                '6': [],
            };

            component.createClinic();
            tick();
            component.selectedDays;
            expect(errorHandler.handleError).toHaveBeenCalled();
            expect(component.loading).toBeFalse();
        }));

        it('should handle error when updating an existing clinic', fakeAsync(() => {
            component.clinicId = 'clinic123';
            component.selectedDuration = '30';
            component.availability = {
                '0': [{ start: '08:00', end: '17:00' }],
                '1': [],
                '2': [],
                '3': [],
                '4': [],
                '5': [],
                '6': [],
            };

            component.createClinic();
            tick();

            expect(errorHandler.handleError).toHaveBeenCalled();
            expect(component.loading).toBeFalse();
        }));

        it('should handle error when fetching clinic', fakeAsync(() => {
            component.clinicId = 'clinic123';
            component.fetchClinic();
            tick();

            expect(errorHandler.handleError).toHaveBeenCalled();
            expect(component.loadingClinic).toBeFalse();
        }));

        it('should handle error in getFilteredResponse', fakeAsync(() => {
            const response = {
                id: 'practitioner1',
                description: 'Dr. Jane Doe',
                specialty: 'GENERAL PRACTITIONER',
            };
            component.getFilteredResponse(response);
            tick();

            expect(errorHandler.handleError).toHaveBeenCalled();
        }));
    });
});
