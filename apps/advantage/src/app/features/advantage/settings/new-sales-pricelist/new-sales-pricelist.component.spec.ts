import {
    ComponentFixture,
    fakeAsync,
    flush,
    TestBed,
    tick,
} from '@angular/core/testing';
import { NewSalesPricelistComponent } from './new-sales-pricelist.component';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import {
    NbStepComponent,
    NbStepperComponent,
    NbToastrService,
} from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { BehaviorSubject, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ResolverService } from '../../../../features/services/resolver.service';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { StepperService } from '../../../../shared/component-services/stepper.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { NewSalesPricelistFieldsService } from '../../../../shared/sil-form/services/formly/new-sales-pricelist-form';
import { PricelistStatusTypeModel } from '../../models';
import moment from 'moment';

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

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: 1,
                },
            ],
        });
    }
    update() {
        return of({
            pricelist_type: 'sales',
            name: 'April Offers',
            effective_from: '2024-04-09T21:00:00.000Z',
            effective_to: '2024-04-10T21:00:00.000Z',
            description: 'Holiday offers for the April Holiday!',
            is_internal_pricelist: true,
            pricelist_status: 'promotional',
            business_partner: null,
        });
    }
    create() {
        return of({
            id: '6af57ac7-6ced-4a79-8493-078a63470c21',
            is_internal_pricelist: true,
            active: true,
            pricelist_type: 'sales',
            name: 'April Offers',
            effective_from: '2024-04-09T21:00:00.000Z',
            effective_to: '2024-04-10T21:00:00.000Z',
            description: 'Holiday offers for the April Holiday!',
            pricelist_status: 'promotional',
            business_partner: null,
        });
    }
}

const resolverServiceStub = {
    resolveItem() {
        return of({
            pricelist_type: 'sales',
            name: 'April Offers',
            effective_from: '2024-04-09T21:00:00.000Z',
            effective_to: '2024-04-10T21:00:00.000Z',
            description: 'Holiday offers for the April Holiday!',
            is_internal_pricelist: true,
            pricelist_status: 'promotional',
            business_partner: 'aa6b9c7c-b643-4f41-83bb-56cedb3878bf',
            id: '6af57ac7-6ced-4a79-8493-078a63470c21',
            organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
            active: true,
        });
    },
};

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getUser() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
            organisation: '123',
        };
    }
}

class NbToastrServiceStub {
    show() {
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
    transitionTo() {
        return true;
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

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params: {
        id: '112',
        page_size: '2',
        queue: 1,
        step: 1,
    },
    $current: {
        params: {
            page_size: '2',
        },
    },
};

const basePricelistDetails = {
    id: 'mock-id',
    is_internal_pricelist: true,
    active: true,
    created: '',
    created_by: '',
    updated: '',
    updated_by: '',
    name: '',
    description: '',
    pricelist_type: 'sales',
    pricelist_status: 'promotional' as PricelistStatusTypeModel,
    effective_from: '',
    effective_to: '',
    organisation: '',
    business_partner: null,
    location: null,
    locations: [],
};

describe('NewSalesPricelistComponent', () => {
    let component: NewSalesPricelistComponent;
    let fixture: ComponentFixture<NewSalesPricelistComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [NewSalesPricelistComponent, NbStepperComponent],
            imports: [mockPipe('translate')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                ErrorHandlerService,
                NewSalesPricelistFieldsService,
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StepperService, useClass: StepperServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: ResolverService,
                    useValue: resolverServiceStub,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(NewSalesPricelistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test component functions', fakeAsync(() => {
        component.toastTime = 3000;
        expect(component).toBeTruthy();
        component.formConfig = {
            checkExpressionOn: 'changeDetectionCheck',
        };
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();

        component.goToProductsList();

        component.pricelistDetails = null;
        component.submitPricelist({
            pricelist_type: 'sales',
            name: 'April Offers',
            effective_from: '2024-04-09T21:00:00.000Z',
            effective_to: '2024-04-10T21:00:00.000Z',
            description: 'Holiday offers for the April Holiday!',
            is_internal_pricelist: true,
            pricelist_status: 'promotional',
        });
        tick(component.toastTime);

        component.pricelistID = '6af57ac7-6ced-4a79-8493-078a63470c21';
        component.nextStep({
            pricelistId: '123',
        });
        component.getPricelistDetails();

        component.handleStepChange({
            index: 1,
            step: new NbStepComponent(NbStepperComponent),
            previouslySelectedIndex: 0,
            previouslySelectedStep: new NbStepComponent(NbStepperComponent),
        });
        component.setupOnboarding();

        flush();
    }));

    it('should test submitPricelist update method', () => {
        component.pricelistDetails = {
            id: '6af57ac7-6ced-4a79-8493-078a63470c21',
            is_internal_pricelist: true,
            active: true,
            created: '2023-12-08T14:54:53.039849+03:00',
            created_by: '8f2a5970-d6c2-42bc-b26b-117e51c378af',
            updated: '2023-12-08T14:54:53.039859+03:00',
            updated_by: '81473289-82c8-4465-9950-d8254cbb8ab1',
            name: 'April Offers',
            description: 'Holiday offers for the April Holiday!',
            pricelist_type: 'sales',
            pricelist_status: 'promotional',
            effective_from: '2024-04-10T00:00:00+03:00',
            effective_to: '2024-05-27T00:00:00+03:00',
            organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
            business_partner: null,
            location: null,
            locations: [],
        };

        component.submitPricelist({
            pricelist_type: 'sales',
            name: 'April Offers',
            effective_from: '2024-04-09T21:00:00.000Z',
            effective_to: '2024-04-10T21:00:00.000Z',
            description: 'Holiday offers for the April Holiday!',
            is_internal_pricelist: true,
            pricelist_status: 'promotional',
            business_partner: 'aa6b9c7c-b643-4f41-83bb-56cedb3878bf',
        });

        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
        expect(component).toBeTruthy();
    });

    it('should return true for isNextDisabled if pricelistDetails is undefined', () => {
        component.pricelistDetails = undefined;
        expect(component.isNextDisabled).toBe(true);
    });

    it('should return empty tooltip when isNextDisabled is false', () => {
        component.pricelistDetails = {
            ...basePricelistDetails,
            locations: ['loc1'],
        };
        expect(component.nextButtonTooltip).toBe('');
    });

    it('should return null for buttonTooltip when isNextDisabled is false', () => {
        component.pricelistDetails = {
            ...basePricelistDetails,
            locations: ['loc1'],
        };
        expect(component.buttonTooltip).toBeNull();
    });

    it('should return correct buttonTooltip when isNextDisabled is true (locational, no locations)', () => {
        component.pricelistDetails = {
            ...basePricelistDetails,
            pricelist_status: 'locational',
            locations: [],
        };
        expect(component.buttonTooltip).toBe(
            'Please add at least one location to proceed.'
        );
    });

    it('should call getPricelistDetails on onLocationsChanged', () => {
        spyOn(component, 'getPricelistDetails');
        component.onLocationsChanged();
        expect(component.getPricelistDetails).toHaveBeenCalled();
    });

    it('should show success toast and set loading to false on update success', () => {
        spyOn(component, 'showToast');
        component.pricelistDetails = { ...basePricelistDetails, id: 'mock-id' };
        const model = {
            pricelist_type: 'sales',
            name: 'Test',
            effective_from: moment().add(1, 'day').toISOString(),
            effective_to: moment().add(2, 'day').toISOString(),
            description: 'desc',
            is_internal_pricelist: true,
            pricelist_status: 'promotional',
        };

        component.submitPricelist(model as any);

        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Basic details for April Offers have been updated successfully',
            'Basic details'
        );
        expect(component.loading).toBe(false);
    });

    it('should show success toast, call nextStep, and set loading to false on create success', fakeAsync(() => {
        spyOn(component, 'showToast');
        spyOn(component, 'nextStep');
        component.pricelistDetails = { ...basePricelistDetails, id: undefined };
        const model = {
            pricelist_type: 'sales',
            name: 'Test',
            effective_from: moment().add(1, 'day').toISOString(),
            effective_to: moment().add(2, 'day').toISOString(),
            description: 'desc',
            is_internal_pricelist: true,
            pricelist_status: 'promotional',
        };

        component.submitPricelist(model as any);

        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Basic details for April Offers have been created successfully',
            'Basic details'
        );

        tick(component.toastTime);

        expect(component.nextStep).toHaveBeenCalledWith({
            pricelistId: '6af57ac7-6ced-4a79-8493-078a63470c21',
        });
        expect(component.loading).toBe(false);

        flush();
    }));

    it('should return true for isNextDisabled if pricelist_status is "locational" and locations is empty', () => {
        component.pricelistDetails = {
            ...basePricelistDetails,
            pricelist_status: 'locational',
            locations: [],
        };
        expect(component.isNextDisabled).toBe(true);
    });

    it('should return false for isNextDisabled if pricelist_status is "locational" and locations has items', () => {
        component.pricelistDetails = {
            ...basePricelistDetails,
            pricelist_status: 'locational',
            locations: ['loc1'],
        };
        expect(component.isNextDisabled).toBe(false);
    });

    it('should return false for isNextDisabled if pricelist_status is not "locational", regardless of locations', () => {
        component.pricelistDetails = {
            ...basePricelistDetails,
            pricelist_status: 'promotional',
            locations: [],
        };
        expect(component.isNextDisabled).toBe(false);

        component.pricelistDetails = {
            ...basePricelistDetails,
            pricelist_status: 'promotional',
            locations: undefined as any,
        };
        expect(component.isNextDisabled).toBe(false);

        component.pricelistDetails = {
            ...basePricelistDetails,
            pricelist_status: 'promotional',
            locations: ['loc1'],
        };
        expect(component.isNextDisabled).toBe(false);
    });
});

const silStoresServiceStubError = {
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    },
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    },
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    },
    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    },
};

const resolverServiceStubError = {
    resolveItem() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    },
};

const uIRouterGlobalsStubError = {
    current: {
        name: 'state',
    },
    params: {
        service_request: 'wer',
        page_size: '2',
        queue: 1,
        step: 2,
    },
    $current: {
        params: {
            page_size: '2',
        },
    },
};

describe('NewSalesPricelistComponent Error', () => {
    let component: NewSalesPricelistComponent;
    let fixture: ComponentFixture<NewSalesPricelistComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [NewSalesPricelistComponent, NbStepperComponent],
            imports: [mockPipe('translate')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                ErrorHandlerService,
                {
                    provide: ResolverService,
                    useValue: resolverServiceStubError,
                },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StepperService, useClass: StepperServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: SilStoresService,
                    useValue: silStoresServiceStubError,
                },
                {
                    provide: UIRouterGlobals,
                    useValue: uIRouterGlobalsStubError,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(NewSalesPricelistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test component functions Error path', () => {
        component.submitPricelist({
            pricelist_type: 'sales',
            name: 'April Offers',
            effective_from: '2024-04-09T21:00:00.000Z',
            effective_to: '2024-04-10T21:00:00.000Z',
            description: 'Holiday offers for the April Holiday!',
            is_internal_pricelist: true,
            pricelist_status: 'promotional',
            business_partner: 'aa6b9c7c-b643-4f41-83bb-56cedb3878bf',
        });
        component.pricelistID = '6af57ac7-6ced-4a79-8493-078a63470c21';
        component.getPricelistDetails();

        component.handleStepChange({
            index: 2,
            step: new NbStepComponent(NbStepperComponent),
            previouslySelectedIndex: 1,
            previouslySelectedStep: new NbStepComponent(NbStepperComponent),
        });

        component.nextStep({
            pricelistId: '123',
        });

        component.setupOnboarding();

        expect(component).toBeTruthy();
    });

    it('should test submitPricelist update method Error path', () => {
        component.pricelistDetails = {
            id: '6af57ac7-6ced-4a79-8493-078a63470c21',
            is_internal_pricelist: true,
            active: true,
            created: '2023-12-08T14:54:53.039849+03:00',
            created_by: '8f2a5970-d6c2-42bc-b26b-117e51c378af',
            updated: '2023-12-08T14:54:53.039859+03:00',
            updated_by: '81473289-82c8-4465-9950-d8254cbb8ab1',
            name: 'April Offers',
            description: 'Holiday offers for the April Holiday!',
            pricelist_type: 'sales',
            pricelist_status: 'promotional',
            effective_from: '2024-04-10T00:00:00+03:00',
            effective_to: '2024-05-27T00:00:00+03:00',
            organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
            business_partner: null,
            location: null,
            locations: [],
        };

        component.submitPricelist({
            pricelist_type: 'sales',
            name: 'April Offers',
            effective_from: '2024-04-09T21:00:00.000Z',
            effective_to: '2024-04-10T21:00:00.000Z',
            description: 'Holiday offers for the April Holiday!',
            is_internal_pricelist: true,
            pricelist_status: 'promotional',
            business_partner: 'aa6b9c7c-b643-4f41-83bb-56cedb3878bf',
        });
        component.getPricelistDetails();

        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should handle error in update branch of submitPricelist', () => {
        spyOn(component.errorHandler, 'handleError');
        component.pricelistDetails = { ...basePricelistDetails, id: 'mock-id' };
        const model = {
            pricelist_type: 'sales',
            name: 'Test',
            effective_from: moment().add(1, 'day').toISOString(),
            effective_to: moment().add(2, 'day').toISOString(),
            description: 'desc',
            is_internal_pricelist: true,
            pricelist_status: 'promotional',
        };

        component.submitPricelist(model as any);

        expect(component.errorHandler.handleError).toHaveBeenCalled();
        expect(component.loading).toBe(false);
        expect(component.submitted).toBe(false);
    });

    it('should handle error in create branch of submitPricelist', () => {
        spyOn(component.errorHandler, 'handleError');
        component.pricelistDetails = { ...basePricelistDetails, id: undefined };
        const model = {
            pricelist_type: 'sales',
            name: 'Test',
            effective_from: moment().add(1, 'day').toISOString(),
            effective_to: moment().add(2, 'day').toISOString(),
            description: 'desc',
            is_internal_pricelist: true,
            pricelist_status: 'promotional',
        };

        component.submitPricelist(model as any);

        expect(component.errorHandler.handleError).toHaveBeenCalled();
        expect(component.loading).toBe(false);
        expect(component.submitted).toBe(false);
    });
});
