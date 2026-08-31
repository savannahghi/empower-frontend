import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PricelistLocationComponent } from './pricelist-location.component';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { of, throwError } from 'rxjs';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';

class SilStoresServiceStub {
    create() {
        return of({
            id: 'loc1',
            name: 'Location loc1',
        });
    }
    update() {
        return of({
            id: 'loc1',
        });
    }
    get(entity?: string, id?: string) {
        if (entity === 'pricelists') {
            return of({
                id: '9f8ce3f3-247c-4a42-8f93-4a4c5fde11e9',
                locations: ['23bafb80-2702-4bba-9a0c-65b7b8c7a9de'],
            });
        }
        if (
            entity === 'org-units' &&
            id === '23bafb80-2702-4bba-9a0c-65b7b8c7a9de'
        ) {
            return of({
                id: '23bafb80-2702-4bba-9a0c-65b7b8c7a9de',
                orgunit_logo: null,
                identifiers: [],
                org_id: 'efb3447a-ad54-430c-ba14-da925c488bbc',
                active: true,
                organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
                parent: 'd1bfd667-4839-4851-b923-655dc9d2165f',
            });
        }
    }
}

class SilStoresServiceErrorStub {
    create() {
        return throwError(() => new Error('create error'));
    }
    update() {
        return throwError(() => new Error('update error'));
    }
    get() {
        return throwError(() => new Error('get error'));
    }
}

class NbToastrServiceStub {
    show() {
        return {};
    }
}

const uIRouterGlobalsStub = {
    params: {
        id: 'pricelist123',
    },
};

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
    isLoggedIn() {
        return true;
    }
    get name() {
        return 'testName';
    }
}

class StateServiceStub {
    go() {
        return true;
    }
    reload() {
        return true;
    }
}

class ErrorHandlerStub {
    handleError() {}
}

describe('PricelistLocationComponent', () => {
    let component: PricelistLocationComponent;
    let fixture: ComponentFixture<PricelistLocationComponent>;
    let dataLayer: SilStoresServiceStub;
    let errorHandler: ErrorHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PricelistLocationComponent],
            imports: [mockPipe('translate')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: StateService,
                    useClass: StateServiceStub,
                },
                { provide: ErrorHandlerService, useClass: ErrorHandlerStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PricelistLocationComponent);
        component = fixture.componentInstance;
        dataLayer = TestBed.inject(SilStoresService) as any;
        errorHandler = TestBed.inject(ErrorHandlerService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle modal', () => {
        component.toggleModal('addLocation');
        expect(component.toggle['addLocation']).toBeTrue();
        component.toggleModal('addLocation');
        expect(component.toggle['addLocation']).toBeFalse();
    });

    it('should show toast', () => {
        spyOn(component['toastrService'], 'show');
        component.showToast('top-right', 'success', 'Title', 'Message');
        expect(component['toastrService'].show).toHaveBeenCalled();
    });

    it('should load locations', async () => {
        spyOn(dataLayer, 'get').and.callThrough();
        await component.loadLocations();
        expect(dataLayer.get).toHaveBeenCalled();
    });

    it('should add location', () => {
        component.toggle['addLocation'] = false;
        component.addLocation();
        expect(component.toggle['addLocation']).toBeTrue();
    });

    it('should save location and reload', () => {
        component.locations = [{ id: 'loc1' }];
        spyOn(dataLayer, 'update').and.callThrough();
        spyOn(component, 'showToast');
        spyOn(component, 'loadLocations');
        component.pricelistId = 'pricelist123';
        component.saveLocation({ location: 'loc2' });
        expect(dataLayer.update).toHaveBeenCalled();
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Success',
            'Location added successfully!'
        );
        expect(component.toggle['addLocation']).toBeFalse();
        expect(component.loadLocations).toHaveBeenCalled();
    });

    it('should not save location if model is invalid', () => {
        spyOn(dataLayer, 'update');
        component.saveLocation({});
        expect(dataLayer.update).not.toHaveBeenCalled();
    });

    it('should set locations to [] if pricelist.locations is empty', async () => {
        spyOn(dataLayer, 'get').and.returnValue(
            of({ id: 'test-id', locations: [], description: '' })
        );
        component.locations = [{ id: 'loc1' }];
        await component.loadLocations();
        expect(component.locations).toEqual([]);
    });

    it('should set locations to [] if pricelist.locations is undefined', async () => {
        spyOn(dataLayer, 'get').and.returnValue(
            of({ id: 'test-id', locations: undefined, description: '' })
        );
        component.locations = [{ id: 'loc1' }];
        await component.loadLocations();
        expect(component.locations).toEqual([]);
    });

    it('should call errorHandler and set locations to [] if loading org-units fails', async () => {
        spyOn(dataLayer, 'get').and.callFake((entity?: string) => {
            if (entity === 'pricelists') {
                return of({ id: 'test-id', locations: ['loc1'] });
            }
            if (entity === 'org-units') {
                return throwError(() => new Error('org-unit load failed'));
            }
            return of({ id: '', locations: [] });
        });
        spyOn(errorHandler, 'handleError');
        component.locations = [{ id: 'loc1' }];
        await component.loadLocations();
        await Promise.resolve();
        await Promise.resolve();
        expect(errorHandler.handleError).toHaveBeenCalled();
        expect(component.locations).toEqual([]);
    });
});

describe('PricelistLocationComponent error cases', () => {
    let component: PricelistLocationComponent;
    let errorFixture: ComponentFixture<PricelistLocationComponent>;

    beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [PricelistLocationComponent],
            imports: [mockPipe('translate')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceErrorStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: StateService,
                    useClass: StateServiceStub,
                },
                { provide: ErrorHandlerService, useClass: ErrorHandlerStub },
            ],
        }).compileComponents();

        errorFixture = TestBed.createComponent(PricelistLocationComponent);
        component = errorFixture.componentInstance;
        errorFixture.detectChanges();
    });

    it('should handle error when loading locations', async () => {
        spyOn(component, 'showToast');
        await component.loadLocations();
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'Error',
            'Failed to load locations.'
        );
    });

    it('should handle error when saving location', () => {
        spyOn(component, 'showToast');
        component.pricelistId = 'pricelist123';
        component.saveLocation({ location: 'loc2' });
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'Error',
            'Failed to add location.'
        );
    });
});
