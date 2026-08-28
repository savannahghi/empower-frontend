import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { UIRouterGlobals } from '@uirouter/angular';
import { of } from 'rxjs';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { UserFormComponent } from './user-form.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { InitializeFlagsService } from '../../../../@core/utils/initialize-flags.service';

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
        data: {
            formRecordId: 'id',
            formFields: 'add-user',
            formStore: 'auth-erp-users',
            pageTitle: 'User Management',
            pageSubTitle: 'Edit User Details',
        },
    },
    params: {
        id: 'user-123',
    },
};

class InitializeFlagsServiceStub {
    growthbook: any = {
        setFeatures: () => {},
        evalFeature: () => ({ value: false }),
    };
    featureFlags: any = {};
    growthbookResponse: any = {};
    flagsReady$ = of(true);

    async loadFlags(): Promise<void> {
        return Promise.resolve();
    }

    waitForReady(): Promise<boolean> {
        return Promise.resolve(true);
    }

    getForcedValue(): boolean {
        return false;
    }
}

class NbToastrServiceStub {
    show() {
        return {};
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

    update() {
        return of({
            id: '4ed62h7281262h1',
        });
    }
}

describe('UserFormComponent', () => {
    let component: UserFormComponent;
    let fixture: ComponentFixture<UserFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [UserFormComponent],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: ErrorHandlerService,
                    useValue: { handleError: jasmine.createSpy() },
                },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: InitializeFlagsService,
                    useClass: InitializeFlagsServiceStub,
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should initialize with keycloak disabled and call fetchRecord', () => {
            spyOn(component, 'fetchRecord');
            component.ngOnInit();
            expect(component.formId).toBeDefined();
            expect(component.formFields).toBe('add-user');
            expect(component.formStore).toBe('auth-erp-users');
            expect(component.fetchRecord).toHaveBeenCalled();
        });

        it('should initialize with keycloak enabled and subscribe to recordObservable', () => {
            const mockObservable = of({ data: { id: '123' } });
            component.recordObservable = mockObservable;
            spyOn(
                component.featureFlagService,
                'getForcedValue'
            ).and.returnValue(true);
            spyOn(mockObservable, 'subscribe').and.callThrough();

            component.ngOnInit();

            expect(mockObservable.subscribe).toHaveBeenCalled();
            expect(component.data).toEqual({ id: '123' });
        });
    });

    describe('fetchedRecord', () => {
        it('should set data correctly when response has data property', () => {
            const mockData = { data: { id: '123', name: 'Test' } };
            component.fetchedRecord(mockData);
            expect(component.data).toEqual({ id: '123', name: 'Test' });
            expect(component.dataFetched).toBe(true);
        });

        it('should set data correctly when response does not have data property', () => {
            const mockData = { id: '456', name: 'Direct' };
            component.fetchedRecord(mockData);
            expect(component.data).toEqual({ id: '456', name: 'Direct' });
            expect(component.dataFetched).toBe(true);
        });
    });

    describe('saveDetails', () => {
        let dataLayerSpy: jasmine.Spy;

        beforeEach(() => {
            const dataLayer = TestBed.inject(SilStoresService);
            dataLayerSpy = spyOn(dataLayer, 'update').and.returnValue(
                of({ first_name: 'John' })
            );
        });

        it('should save with keycloak enabled and user_roles present', () => {
            spyOn(
                component.featureFlagService,
                'getForcedValue'
            ).and.returnValue(true);
            const mockData = {
                id: 'user-123',
                user_roles: [{ id: 'role-1' }, { id: 'role-2' }],
            };

            component.saveDetails(mockData);

            expect(dataLayerSpy).toHaveBeenCalledWith(
                'hermes-roles',
                '',
                { user_id: 'user-123', role_ids: ['role-1', 'role-2'] },
                true,
                true
            );
            expect(component.loading).toBe(false);
        });

        it('should save with keycloak enabled and user_roles missing', () => {
            spyOn(
                component.featureFlagService,
                'getForcedValue'
            ).and.returnValue(true);
            const mockData = {
                id: 'user-123',
            };

            component.saveDetails(mockData);

            expect(dataLayerSpy).toHaveBeenCalledWith(
                'hermes-roles',
                '',
                { user_id: 'user-123', role_ids: [] },
                true,
                true
            );
        });

        it('should save with keycloak disabled', () => {
            spyOn(
                component.featureFlagService,
                'getForcedValue'
            ).and.returnValue(false);
            const mockData = { id: 'user-456', name: 'Jane' };

            component.saveDetails(mockData);

            expect(dataLayerSpy).toHaveBeenCalledWith(
                'auth-erp-users',
                '',
                mockData,
                true,
                true
            );
        });
    });

    describe('savedData', () => {
        it('should reset loading and show success toast', () => {
            spyOn(component, 'showToast');
            const mockData = { first_name: 'John' };

            component.savedData(mockData);

            expect(component.loading).toBe(false);
            expect(component.showToast).toHaveBeenCalledWith(
                'bottom-right',
                'success',
                'Updated User',
                "John's details have been updated"
            );
        });
    });

    describe('errorFetchRecord', () => {
        it('should reset loading and handle error', () => {
            const errorHandler = TestBed.inject(ErrorHandlerService);
            const mockError = { status: 500 };

            component.loading = true;
            component.errorFetchRecord(mockError);

            expect(component.loading).toBe(false);
            expect(errorHandler.handleError).toHaveBeenCalledWith(
                mockError,
                component
            );
        });
    });

    describe('showToast', () => {
        it('should call toastr service with correct parameters', () => {
            const toastrService = TestBed.inject(NbToastrService);
            spyOn(toastrService, 'show');

            component.showToast(
                'top-right',
                'info',
                'Test Title',
                'Test Message'
            );

            expect(toastrService.show).toHaveBeenCalledWith(
                'Test Message',
                'Test Title',
                jasmine.objectContaining({
                    status: 'info',
                    duration: 7000,
                })
            );
        });
    });

    describe('enabledKeycloak getter', () => {
        it('should return false when keycloak feature flag is disabled', () => {
            spyOn(
                component.featureFlagService,
                'getForcedValue'
            ).and.returnValue(false);
            expect(component.enabledKeycloak).toBe(false);
        });

        it('should return true when keycloak feature flag is enabled', () => {
            spyOn(
                component.featureFlagService,
                'getForcedValue'
            ).and.returnValue(true);
            expect(component.enabledKeycloak).toBe(true);
        });
    });
});
