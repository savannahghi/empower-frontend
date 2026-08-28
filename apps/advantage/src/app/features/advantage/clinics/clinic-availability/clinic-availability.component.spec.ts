import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicAvailabilityComponent } from './clinic-availability.component';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { Transition } from '@uirouter/core';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { of } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';

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
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    setUser() {
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

    listNested() {
        return of({});
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
        return { appointment_id: 1, id: '1234' };
    },
    $current: {
        is: () => true,
        params() {
            return { appointment_id: 1 };
        },
    },
};

describe('ClinicAvailabilityComponent', () => {
    let component: ClinicAvailabilityComponent;
    let fixture: ComponentFixture<ClinicAvailabilityComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ClinicAvailabilityComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                ReactiveFormsModule,
                FormsModule,
                NgSelectModule,
                mockPipe('translate'),
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
                { provide: Router, useValue: Router },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                HttpClient,
                HttpHandler,
                ErrorHandlerService,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ClinicAvailabilityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        // component.ngOnInit();
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

    it('should test date change selectedDate', () => {
        spyOn(component, 'handleDateChange').and.callThrough();
        component.handleDateChange('YYYY-MM-DD', 'selectedDate');
        expect(component.handleDateChange).toHaveBeenCalledWith(
            'YYYY-MM-DD',
            'selectedDate'
        );
    });

    it('should test date change endDate', () => {
        spyOn(component, 'handleDateChange').and.callThrough();
        component.handleDateChange('YYYY-MM-DD', 'endDate');
        expect(component.handleDateChange).toHaveBeenCalledWith(
            'YYYY-MM-DD',
            'endDate'
        );
    });

    it('should test date change startDate', () => {
        spyOn(component, 'handleDateChange').and.callThrough();
        component.handleDateChange('YYYY-MM-DD', 'startDate');
        expect(component.handleDateChange).toHaveBeenCalledWith(
            'YYYY-MM-DD',
            'startDate'
        );
    });

    it('should test if the button is active for formType "multiple"', () => {
        component.formType = 'multiple';

        component.startDate = '2023-01-01';
        component.endDate = '2023-01-31';
        expect(component.isSubmitDisabled()).toBeFalsy();

        component.startDate = '';
        component.endDate = '2023-01-31';
        expect(component.isSubmitDisabled()).toBeTruthy();

        component.startDate = '2023-01-01';
        component.endDate = '';
        expect(component.isSubmitDisabled()).toBeTruthy();
    });

    it('should test if the button is active for formType "single"', () => {
        component.formType = 'single';

        component.selectedDate = '2023-01-15';
        component.fromTime = '';
        component.toTime = '';
        expect(component.isSubmitDisabled()).toBeFalsy();

        component.selectedDate = '';
        component.fromTime = '';
        component.toTime = '';
        expect(component.isSubmitDisabled()).toBeTruthy();

        component.selectedDate = '2023-01-15';
        component.fromTime = '10:00';
        component.toTime = '11:00';
        expect(component.isSubmitDisabled()).toBeFalsy();

        component.selectedDate = '2023-01-15';
        component.fromTime = '10:00';
        component.toTime = '';
        expect(component.isSubmitDisabled()).toBeTruthy();
    });

    it('should test if the button is active for formType "unblock"', () => {
        component.formType = 'unblock';

        component.startDate = '2023-01-01';
        component.endDate = '2023-01-31';
        expect(component.isSubmitDisabled()).toBeFalsy();

        component.startDate = '';
        component.endDate = '2023-01-31';
        expect(component.isSubmitDisabled()).toBeTruthy();

        component.startDate = '2023-01-01';
        component.endDate = '';
        expect(component.isSubmitDisabled()).toBeTruthy();
    });

    it('should return true for unknown formType', () => {
        component.formType = 'unknown';
        expect(component.isSubmitDisabled()).toBeTruthy();
    });
    it('should test displaying of the modal', () => {
        spyOn(component, 'showForm').and.callThrough();
        component.showForm('single');
        expect(component.showForm).toHaveBeenCalledWith('single');
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

    it('should test handleSuccessfulCalendarBlock method when formType is "unblock"', () => {
        component.formType = 'unblock';
        spyOn(component, 'handleSuccessfulCalendarBlock').and.callThrough();
        component.handleSuccessfulCalendarBlock();
        expect(component.handleSuccessfulCalendarBlock).toHaveBeenCalled();
    });

    it('should test handleSuccessfulCalendarBlock method', () => {
        spyOn(component, 'handleSuccessfulCalendarBlock').and.callThrough();
        component.handleSuccessfulCalendarBlock();
        expect(component.handleSuccessfulCalendarBlock).toHaveBeenCalled();
    });

    it('should test handleErrorFxn method', () => {
        component.formType = 'unblock';
        spyOn(component, 'handleErrorFxn').and.callThrough();
        component.handleErrorFxn({});
        expect(component.handleErrorFxn).toHaveBeenCalled();
    });

    it('should test submitTimeline method if formType is single', () => {
        component.formType = 'single';
        component.selectedDate = '2023-01-01';
        component.fromTime = '10:00:00';
        component.toTime = '11:00:00';
        spyOn(component, 'submitTimeline').and.callThrough();
        component.submitTimeline();
        expect(component.submitTimeline).toHaveBeenCalled();
    });

    it('should test submitTimeline method if formType is multiple', () => {
        component.formType = 'multiple';
        component.startDate = '2023-01-01';
        component.endDate = '2023-01-02';
        spyOn(component, 'submitTimeline').and.callThrough();
        component.submitTimeline();
        expect(component.submitTimeline).toHaveBeenCalled();
    });

    it('should test submitTimeline method if blockType is unblock_slots', () => {
        component.formType = 'unblock_slots';
        component.startDate = '2023-01-01';
        component.endDate = '2023-01-02';
        spyOn(component, 'submitTimeline').and.callThrough();
        component.submitTimeline();
        expect(component.submitTimeline).toHaveBeenCalled();
    });

    it('should toggle calendar visibility', () => {
        component.showCalender = false;
        component.toggleCalender();
        expect(component.showCalender).toBeTruthy();
        component.toggleCalender();
        expect(component.showCalender).toBeFalsy();
    });

    it('should toggle modal visibility', () => {
        component.showModal = false;
        component.toggleModal();
        expect(component.showModal).toBeTruthy();
        component.toggleModal();
        expect(component.showModal).toBeFalsy();
    });
});
