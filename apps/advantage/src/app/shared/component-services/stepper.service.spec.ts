import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Authorization } from '../../@core/auth/services/authorization.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StepperService } from './stepper.service';
import { StateParams, StateService, UIRouterGlobals } from '@uirouter/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class AuthorizationConfigStub {
    isLoggedIn() {
        return true;
    }
    getUser() {
        return {
            id: 133944,
            guid: 'bfdc441d-80a2-4817-9aa3-5567312a2864',
            roles: ['Quintus'],
            permissions: ['erp.dashboard_list'],
        };
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
        step: '2',
    },
    params: new StateParams({ step: '1' }),
    $current: {
        params: {
            step: 1,
        },
    },
};
describe('StepperService', () => {
    let service: StepperService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                StepperService,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { params: { step: '1' } },
                    },
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(StepperService);
        service.uiglobals.params.step = '2';
    });

    it('should tested methods', () => {
        const stepper = {
            steps: {
                _results: [
                    { completed: false },
                    { completed: false },
                    { completed: false },
                ],
                length: 1,
            },
            changeStep: () => {},
            next: () => {},
        };
        service.uiglobals.params.step = '2';
        service.handleStepChange({}, stepper);
        service.nextStep(stepper, {});
        service.uiglobals.params.step = '2';
        service.setupStepper(stepper);
        service.nextStep(stepper, {});
        service.handleStepChange({}, stepper);
        service.previousStep(stepper, {});
        expect(service.stepsLength).toBe(1);
    });
});

const uIRouterGlobalsStub2 = {
    current: {
        name: 'state',
    },
    params: {},
    $current: {
        params: {},
    },
};

describe('StepperService: undefined params.step', () => {
    let service: StepperService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                StepperService,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub2 },
                { provide: StateService, useClass: StateServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(StepperService);
    });

    it('should test params.step', () => {
        const stepper = {
            steps: {
                _results: [{ completed: false }, { completed: false }],
                length: 1,
            },
            changeStep: () => {},
            next: () => {},
        };
        service.setupStepper(stepper);
        service.handleStepChange({});
        service.nextStep(stepper, {});
        service.previousStep(stepper, {});
        expect(service.stepsLength).toBe(1);
    });

    it('should set orientation to horizontal when screen width is less than or equal to 1400px', fakeAsync(() => {
        const mediaMatcher = service.mediaMatcher;
        spyOn(mediaMatcher, 'matchMedia').and.returnValue({
            matches: true,
            media: '(max-width: 1400px)',
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: null,
            removeEventListener: null,
            dispatchEvent: null,
        } as MediaQueryList);

        const breakpointObserver = TestBed.inject(BreakpointObserver);
        spyOn(breakpointObserver, 'observe').and.returnValue(
            of({ breakpoints: {}, matches: true } as BreakpointState)
        );
        const comp = { orientation: 'vertical' };
        service.checkOrientationChange(comp);
        tick();

        expect(comp.orientation).toBe('horizontal');
    }));

    it('should set orientation to vertical when screen width is greater than 1400px', fakeAsync(() => {
        const mediaMatcher = service.mediaMatcher;
        spyOn(mediaMatcher, 'matchMedia').and.returnValue({
            matches: false,
            media: '(max-width: 991px)',
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: null,
            removeEventListener: null,
            dispatchEvent: null,
        } as MediaQueryList);

        const breakpointObserver = TestBed.inject(BreakpointObserver);
        spyOn(breakpointObserver, 'observe').and.returnValue(
            of({ breakpoints: {}, matches: false } as BreakpointState)
        );

        const comp = { orientation: 'vertical' };
        service.checkOrientationChange(comp, '991px');
        tick();

        expect(comp.orientation).toBe('vertical');
    }));
});
