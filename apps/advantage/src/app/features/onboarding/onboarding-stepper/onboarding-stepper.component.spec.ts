import {
    TestBed,
    ComponentFixture,
    tick,
    fakeAsync,
} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StateService } from '@uirouter/core';
import {
    NbStepComponent,
    NbStepperComponent,
    NbToastrService,
} from '@nebular/theme';
import { Authorization } from '../../../@core/auth/services/authorization.service';
import { OnboardingStepperComponent } from './onboarding-stepper.component';
import { SilStoresService } from '../../../shared/sil-http-services/sil_datalayer.service';
import { NbStepperModule } from '@nebular/theme';
import { StepperService } from '../../../shared/component-services/stepper.service';
import { UIRouterGlobals } from '@uirouter/angular';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class AuthorizationConfigStub {
    logout() {
        return of(() => {});
    }
    getToken() {
        return {};
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getErpOrganisation() {
        return {
            organisation_id: '511',
        };
    }
    getUser() {
        return { business_partner: '511' };
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
    error() {
        return of(() => {});
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
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

class StepperServiceStub {
    nextStep() {
        return true;
    }
    previousStep() {
        return true;
    }
    getCurrentStep() {
        return 1;
    }
    setupStepper() {
        return true;
    }
    handleStepChange() {
        return true;
    }
}

class SilStoresServiceStub {
    get() {
        return of({
            email_address: 'a@a.com',
            physical_address: 'Meru',
            id: '123',
        });
    }
    customUpdate() {
        return of({
            email_address: 'a@a.com',
            physical_address: 'Meru',
            id: '123',
        });
    }
    list() {
        return of({
            results: [
                {
                    slade_code: '511',
                },
            ],
        });
    }
}

describe('OnboardingStepperComponent', () => {
    let component: OnboardingStepperComponent;
    let fixture: ComponentFixture<OnboardingStepperComponent>;

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            declarations: [OnboardingStepperComponent],
            imports: [NbStepperModule],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: StepperService, useClass: StepperServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OnboardingStepperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create component', () => {
        component.ngOnInit();
        component.nextStep();
        expect(OnboardingStepperComponent).toBeTruthy();
    });

    it('Should test the nextStep', fakeAsync(() => {
        spyOn(component, 'nextStep').and.callThrough();
        component.nextStep();
        tick(2001);
        expect(component.nextStep).toHaveBeenCalled();
    }));

    it('Should test the previousStep', fakeAsync(() => {
        spyOn(component, 'previousStep').and.callThrough();
        component.previousStep();
        tick(2001);
        expect(component.previousStep).toHaveBeenCalled();
    }));

    it('should toggleModal', () => {
        component.toggleModal('form');
        expect(component).toBeTruthy();
    });
});

class SilStoresServiceStub2 {
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
    customUpdate() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('OnboardingStepperComponent', () => {
    let component: OnboardingStepperComponent;
    let fixture: ComponentFixture<OnboardingStepperComponent>;

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            declarations: [OnboardingStepperComponent],
            imports: [NbStepperModule],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: StepperService, useClass: StepperServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub2 },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OnboardingStepperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should toggleModal', () => {
        component.handleStepChange({
            index: 0,
            step: new NbStepComponent(NbStepperComponent),
            previouslySelectedIndex: 0,
            previouslySelectedStep: new NbStepComponent(NbStepperComponent),
        });
        component.setupAPIStep(3);
        component.toggleModal('form');
        expect(component).toBeTruthy();
    });
});
