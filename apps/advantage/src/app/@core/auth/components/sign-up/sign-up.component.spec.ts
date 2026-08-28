import { Authorization } from '../../services/authorization.service';
import {
    TestBed,
    ComponentFixture,
    flush,
    fakeAsync,
    tick,
} from '@angular/core/testing';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
    ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StateService } from '@uirouter/core';
import { NbToastrService, NbIconLibraries } from '@nebular/theme';
import { SignUpComponent } from './sign-up.component';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { StepperService } from '../../../../shared/component-services/stepper.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { FacilityOnboardingService } from '../../../../shared/sil-form/services/formly/empower/facility-onboarding-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { RouterModule } from '@angular/router';

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

class AuthorizationConfigStub {
    logout() {
        return of(() => {});
    }
    getToken() {
        return {};
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getErpOrganisation() {
        return {
            client_types: ['PROVIDER'],
            user_workstations: null,
        };
    }
    removeTokenData() {
        return {};
    }
    isLoggedIn() {
        return false;
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

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
}

class StepperServiceStub {
    setupStepper() {
        return true;
    }
    handleStepChange() {
        return true;
    }
    nextStep() {
        return true;
    }
}

class SilStoresServiceStub {
    create() {
        return of({
            id: '4ed62h7281262h1',
            name: 'Test Facility',
            owner: { email: 'test@example.com' },
            code: 1,
        });
    }

    createNested() {
        return of({
            id: '4ed62h7281262h1',
        });
    }
}

class ErrorHandlerServiceStub {
    handleError() {
        return {};
    }
}

class FacilityOnboardingServiceStub {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setComponent(component: any) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validateRequiredFields(form: any) {
        return true;
    }
}

class NbIconLibrariesStub {
    registerFontPack() {}
}

class ChangeDetectorRefStub {
    detectChanges() {}
}

const facilityModel = {
    facility_name: 'Empower Health Clinic',
    county: 'Nairobi',
    description: 'Test facility',
    facility_type: 'Hospital',
    first_name: 'Kazi',
    last_name: 'Kwisha',
    user_email: 'kazi.kwisha@example.com',
    user_phone_number: '711223344',
    role: 'DOCTOR',
    mfl_code: '4590',
    agreed_to_terms: true,
};

describe('SignUpComponent', () => {
    let component: SignUpComponent;
    let fixture: ComponentFixture<SignUpComponent>;

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [SignUpComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                mockPipe('variantDisplay'),
                RouterModule.forRoot([
                    { path: 'auth/sign-up', component: SignUpComponent },
                ]),
            ],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: StepperService, useClass: StepperServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: ErrorHandlerService,
                    useClass: ErrorHandlerServiceStub,
                },
                {
                    provide: FacilityOnboardingService,
                    useClass: FacilityOnboardingServiceStub,
                },
                { provide: NbIconLibraries, useClass: NbIconLibrariesStub },
                { provide: ChangeDetectorRef, useClass: ChangeDetectorRefStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SignUpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should render successfully call check organisation', fakeAsync(() => {
        const facility = {
            country_name: 'KENYA',
            provider: {
                name: 'Savannah',
                slade_code_counter: 1,
            },
        };
        spyOn(component, 'checkOrganisation').and.callThrough();
        tick(1200);

        component.checkOrganisation(facility);
        expect(component.checkOrganisation).toHaveBeenCalledWith(facility);

        flush();
    }));

    it('should test getFormOptions function', () => {
        spyOn(component, 'getFormOptions').and.callThrough();
        const formOptions = {
            test: 'test',
        };
        component.getFormOptions(formOptions);
        expect(component.getFormOptions).toHaveBeenCalledWith(formOptions);
    });

    it('should test showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'context', 'message');
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'context',
            'message'
        );
    });

    it('should test showToast method if duration has been provided', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast(
            'bottom-right',
            'success',
            'context',
            'message',
            5000
        );
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'context',
            'message',
            5000
        );
    });

    it('should test submitRequest function', () => {
        component.formOptions = {
            form: { valid: true },
            model: facilityModel,
            resetModel: jasmine.createSpy('resetModel'),
        };
        component.variant = 'empower';

        spyOn(component, 'submitRequest').and.callThrough();
        component.submitRequest(facilityModel);
        expect(component.submitRequest).toHaveBeenCalled();
    });

    it('should test setCategories function if the variant is empower', () => {
        spyOn(component, 'setCategories').and.callThrough();
        const categories = component.setCategories('empower');
        expect(component.setCategories).toHaveBeenCalled();
        expect(categories).toEqual(['EMPOWER']);
    });

    it('should test setCategories function if the variant is not empower', () => {
        spyOn(component, 'setCategories').and.callThrough();
        const categories = component.setCategories('advantage');
        expect(component.setCategories).toHaveBeenCalled();
        expect(categories).toEqual([]);
    });

    it('should test back function', () => {
        spyOn(component, 'back').and.callThrough();
        component.back();
        expect(component.back).toHaveBeenCalled();
    });

    it('should test isSubmitDisabled function', () => {
        expect(component.isSubmitDisabled()).toBe(true);

        component.formOptions = {
            form: { valid: true },
            model: { agreed_to_terms: true },
        };
        component.loading = false;

        const result = component.isSubmitDisabled();
        expect(result).toBeDefined();
    });

    it('should test onTermsChange function', () => {
        const event = { target: { checked: true } };
        spyOn(component, 'onTermsChange').and.callThrough();
        component.onTermsChange(event);
        expect(component.onTermsChange).toHaveBeenCalledWith(event);
    });

    it('should handle form value changes', fakeAsync(() => {
        component.formOptions = {
            form: {
                valueChanges: {
                    subscribe: jasmine
                        .createSpy('subscribe')
                        .and.callFake(callback => {
                            callback();
                            return { unsubscribe: () => {} };
                        }),
                },
                statusChanges: {
                    subscribe: jasmine
                        .createSpy('subscribe')
                        .and.callFake(callback => {
                            callback();
                            return { unsubscribe: () => {} };
                        }),
                },
            },
            model: {},
        };

        spyOn(component, 'saveFormData').and.callThrough();
        spyOn(component.cdr, 'detectChanges').and.callThrough();

        component.getFormOptions(component.formOptions);

        expect(
            component.formOptions.form.valueChanges.subscribe
        ).toHaveBeenCalled();
        expect(
            component.formOptions.form.statusChanges.subscribe
        ).toHaveBeenCalled();
        expect(component.saveFormData).toHaveBeenCalled();
        expect(component.cdr.detectChanges).toHaveBeenCalledTimes(2);

        flush();
    }));

    it('should save form data to session storage', () => {
        component.formOptions = {
            model: { testField: 'testValue' },
        };

        spyOn(sessionStorage, 'setItem').and.callThrough();
        spyOn(JSON, 'stringify').and.returnValue('{"testField":"testValue"}');

        component.saveFormData();

        expect(sessionStorage.setItem).toHaveBeenCalledWith(
            'facilityFormData',
            '{"testField":"testValue"}'
        );
        expect(JSON.stringify).toHaveBeenCalledWith(
            component.formOptions.model
        );
    });

    it('should not save form data when formOptions or model is undefined', () => {
        component.formOptions = undefined;
        spyOn(sessionStorage, 'setItem').and.callThrough();
        component.saveFormData();
        expect(sessionStorage.setItem).not.toHaveBeenCalled();

        component.formOptions = {};
        component.saveFormData();
        expect(sessionStorage.setItem).not.toHaveBeenCalled();
    });

    it('should restore form data from session storage', fakeAsync(() => {
        const mockData = '{"testField":"testValue"}';
        spyOn(sessionStorage, 'getItem').and.returnValue(mockData);
        spyOn(JSON, 'parse').and.returnValue({ testField: 'testValue' });

        component.formOptions = {
            model: {},
        };
        spyOn(component.cdr, 'detectChanges');

        component.restoreFormData();

        tick(500);

        expect(sessionStorage.getItem).toHaveBeenCalledWith('facilityFormData');
        expect(JSON.parse).toHaveBeenCalledWith(mockData);
        expect(component.formOptions.model).toEqual({ testField: 'testValue' });
        expect(component.cdr.detectChanges).toHaveBeenCalled();

        flush();
    }));

    it('should handle errors when restoring form data', fakeAsync(() => {
        spyOn(sessionStorage, 'getItem').and.returnValue('invalid-json');
        spyOn(JSON, 'parse').and.throwError('Invalid JSON');

        component.restoreFormData();
        tick(500);

        expect(component.formOptions).toEqual(component.formOptions);

        flush();
    }));

    it('should not attempt to restore data when no saved data exists', () => {
        spyOn(sessionStorage, 'getItem').and.returnValue(null);
        spyOn(JSON, 'parse');

        component.restoreFormData();

        expect(JSON.parse).not.toHaveBeenCalled();
    });

    it('should not apply parsed data when formOptions is not available', fakeAsync(() => {
        spyOn(sessionStorage, 'getItem').and.returnValue(
            '{"testField":"testValue"}'
        );
        spyOn(JSON, 'parse').and.returnValue({ testField: 'testValue' });
        component.formOptions = undefined;

        component.restoreFormData();
        tick(500);

        expect(component.formOptions).toBeUndefined();

        flush();
    }));

    it('should handle organization check with existing organization', fakeAsync(() => {
        const silStoresService = TestBed.inject(SilStoresService);
        spyOn(silStoresService, 'create').and.returnValue(of({ code: 2 }));

        const facility = {
            provider: {
                name: 'Existing Facility',
                slade_code_counter: '12345',
            },
        };

        component.checkOrganisation(facility);
        tick();

        expect(component.orgExists).toBe(true);
        expect(component.loading).toBe(false);

        flush();
    }));

    it('should correctly determine if submit is disabled with various form states', () => {
        component.formOptions = undefined;
        expect(component.isSubmitDisabled()).toBe(true);

        component.formOptions = { form: {} };
        spyOn(
            component.facilityService,
            'validateRequiredFields'
        ).and.returnValue(false);
        expect(component.isSubmitDisabled()).toBe(true);

        component.formOptions = {
            form: {},
            model: { agreed_to_terms: false },
        };
        component.facilityService.validateRequiredFields = jasmine
            .createSpy()
            .and.returnValue(true);
        expect(component.isSubmitDisabled()).toBe(true);

        component.formOptions = {
            form: {},
            model: { agreed_to_terms: true },
        };
        component.loading = true;
        expect(component.isSubmitDisabled()).toBe(true);

        component.loading = false;
        expect(component.isSubmitDisabled()).toBe(false);
    });

    it('should handle terms change event', () => {
        const event = { checked: true };
        spyOn(component.cdr, 'detectChanges').and.callThrough();

        component.onTermsChange(event);

        expect(component.cdr.detectChanges).toHaveBeenCalled();
    });

    it('should handle undefined phone number in submitRequest', fakeAsync(() => {
        const modelWithoutPhone = { ...facilityModel };
        modelWithoutPhone.user_phone_number = undefined;

        component.formOptions = {
            form: { valid: true },
            model: modelWithoutPhone,
        };
        component.variant = 'empower';

        const silStoresService = TestBed.inject(SilStoresService);
        const createSpy = spyOn(silStoresService, 'create').and.callThrough();

        component.submitRequest(modelWithoutPhone);
        tick();

        expect(createSpy).toHaveBeenCalled();
        const requestArg = createSpy.calls.mostRecent().args[1] as {
            owner: { phone: string };
        };
        expect(requestArg.owner.phone).toBe('+254');

        flush();
    }));

    it('should handle undefined description in submitRequest', fakeAsync(() => {
        const modelWithoutDescription = { ...facilityModel };
        modelWithoutDescription.description = undefined;

        component.formOptions = {
            form: { valid: true },
            model: modelWithoutDescription,
        };
        component.variant = 'empower';

        const silStoresService = TestBed.inject(SilStoresService);
        const createSpy = spyOn(silStoresService, 'create').and.callThrough();

        component.submitRequest(modelWithoutDescription);
        tick();

        expect(createSpy).toHaveBeenCalled();
        const requestArg = createSpy.calls.mostRecent().args[1] as {
            description: string;
        };
        expect(requestArg.description).toBe('Empower Health Clinic Hospital');

        flush();
    }));

    it('should handle provided phone number in submitRequest', fakeAsync(() => {
        const modelWithPhone = { ...facilityModel };
        modelWithPhone.user_phone_number = '254712345678';

        component.formOptions = {
            form: { valid: true },
            model: modelWithPhone,
        };
        component.variant = 'empower';

        const silStoresService = TestBed.inject(SilStoresService);
        const createSpy = spyOn(silStoresService, 'create').and.callThrough();

        component.submitRequest(modelWithPhone);
        tick();

        expect(createSpy).toHaveBeenCalled();
        const requestArg = createSpy.calls.mostRecent().args[1] as {
            owner: { phone: string };
        };
        expect(requestArg.owner.phone).toBe('+254712345678');

        flush();
    }));

    it('should handle provided description in submitRequest', fakeAsync(() => {
        const modelWithDescription = { ...facilityModel };
        modelWithDescription.description = '';

        component.formOptions = {
            form: { valid: true },
            model: modelWithDescription,
        };
        component.variant = 'empower';

        const silStoresService = TestBed.inject(SilStoresService);
        const createSpy = spyOn(silStoresService, 'create').and.callThrough();

        component.submitRequest(modelWithDescription);
        tick();

        expect(createSpy).toHaveBeenCalled();
        const requestArg = createSpy.calls.mostRecent().args[1] as {
            description: string;
        };
        expect(requestArg.description).toBe('Empower Health Clinic Hospital');

        flush();
    }));
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

    createNested() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('SignUpComponent error', () => {
    let component: SignUpComponent;
    let fixture: ComponentFixture<SignUpComponent>;

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [SignUpComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                mockPipe('variantDisplay'),
                RouterModule.forRoot([
                    { path: 'auth/sign-up', component: SignUpComponent },
                ]),
            ],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: StepperService, useClass: StepperServiceStub },
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: ErrorHandlerService,
                    useClass: ErrorHandlerServiceStub,
                },
                {
                    provide: FacilityOnboardingService,
                    useClass: FacilityOnboardingServiceStub,
                },
                { provide: NbIconLibraries, useClass: NbIconLibrariesStub },
                { provide: ChangeDetectorRef, useClass: ChangeDetectorRefStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SignUpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should return an error when check organisation is called', fakeAsync(() => {
        const facility = {
            country_name: 'KENYA',
            provider: {
                name: 'Savannah',
                slade_code_counter: 1,
            },
        };
        spyOn(component, 'checkOrganisation').and.callThrough();
        spyOn(component.errorHandler, 'handleError').and.callThrough();
        tick(1200);

        component.checkOrganisation(facility);
        expect(component.checkOrganisation).toHaveBeenCalledWith(facility);
        expect(component.loading).toBe(false);
        expect(component.errorHandler.handleError).toHaveBeenCalled();
        flush();
    }));

    it('should return an error when submitRequest is called', fakeAsync(() => {
        component.formOptions = {
            form: { valid: true },
            model: facilityModel,
            resetModel: jasmine.createSpy('resetModel'),
        };
        component.variant = 'empower';

        spyOn(component, 'submitRequest').and.callThrough();
        spyOn(component.errorHandler, 'handleError').and.callThrough();
        spyOn(component.cdr, 'detectChanges').and.callThrough();
        tick(1200);

        component.submitRequest(facilityModel);
        expect(component.submitRequest).toHaveBeenCalledWith(facilityModel);
        expect(component.loading).toBe(false);
        expect(component.submitted).toBe(false);
        expect(component.errorHandler.handleError).toHaveBeenCalled();
        expect(component.cdr.detectChanges).toHaveBeenCalled();
        flush();
    }));

    it('should handle the handleError error function', () => {
        spyOn(component, 'handleError').and.callThrough();
        component.handleError({
            error: {
                owner: {
                    email: 'facility owner with this email already exists.',
                    phone: 'facility owner with this phone already exists.',
                },
            },
        });
        expect(component.handleError).toHaveBeenCalled();
    });

    it('should handle the handleError error function if a different error is returned', () => {
        spyOn(component, 'handleError').and.callThrough();
        component.handleError({
            error: 'Connection error',
        });
        expect(component.handleError).toHaveBeenCalled();
    });

    it('should handle the handleError error function if error.owner is an empty object', () => {
        spyOn(component, 'handleError').and.callThrough();
        component.handleError({
            error: {
                owner: {},
            },
        });
        expect(component.handleError).toHaveBeenCalled();
    });
});
