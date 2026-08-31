import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { OperatingRegionsComponent } from './operating-regions.component';
import { TranslateService } from '@ngx-translate/core';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { StateService } from '@uirouter/angular';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { BehaviorSubject, of } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import {
    SweetAlert2LoaderService,
    SweetAlert2Module,
} from '@sweetalert2/ngx-sweetalert2';

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

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
    }
}

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

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: '6af57ac7-6ced-4a79-8493-078a63470c21',
                },
            ],
        });
    }
    update() {
        return of({
            id: '1',
        });
    }
    create() {
        return of({
            id: '6af57ac7-6ced-4a79-8493-078a63470c21',
        });
    }
}

class SweetAlert2LoaderServiceStub {
    swal() {
        return {};
    }
    preloadSweetAlertLibrary() {
        return {};
    }
    fire() {
        return {};
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

describe('OperatingRegionsComponent', () => {
    let component: OperatingRegionsComponent;
    let fixture: ComponentFixture<OperatingRegionsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [OperatingRegionsComponent],
            imports: [mockPipe('translate')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: SweetAlert2Module,
                    useClass: SweetAlert2Module,
                },
                {
                    provide: SweetAlert2LoaderService,
                    useClass: SweetAlert2LoaderServiceStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                ErrorHandlerService,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(OperatingRegionsComponent);

        // Create mock SwalComponent instances
        const childComponentInstance1 = jasmine.createSpyObj('SwalComponent', [
            'fire',
        ]);
        const childComponentInstance2 = jasmine.createSpyObj('SwalComponent', [
            'fire',
        ]);

        fixture.componentInstance.retireOperatingRegion =
            childComponentInstance1;
        fixture.componentInstance.activateOperatingRegion =
            childComponentInstance2;
        component = fixture.componentInstance;
        component.ngOnInit();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should test ngOnInit sets up table configuration', () => {
        expect(component.filterParams).toEqual({ page_size: 10 });
        expect(component.tableHeader.length).toBe(5);
        expect(component.rows.length).toBe(4);
        expect(component.actions.length).toBe(2);
        expect(component.formConfig).toEqual({
            checkExpressionOn: 'changeDetectionCheck',
        });
    });

    it('should toggle add region modal', () => {
        const initialState = component.showAddRegionModal;
        component.toggleAddRegion();
        expect(component.showAddRegionModal).toBe(!initialState);
        component.toggleAddRegion();
        expect(component.showAddRegionModal).toBe(initialState);
    });

    it('should set filter with event', () => {
        const event = 'test-query-string';
        component.setFilter(event);
        expect(component.queryArg).toBe(event);
    });

    it('should get form options', () => {
        const formOptions = { test: 'value' };
        component.getFormOptions(formOptions);
        expect(component.formOptions).toEqual(formOptions);
    });

    it('should test addOperatingRegions', () => {
        spyOn(component, 'addOperatingRegions').and.callThrough();
        component.addOperatingRegions({});
        expect(component.addOperatingRegions).toHaveBeenCalled();
    });

    it('should test Actions buttons', fakeAsync(() => {
        component.actions[0].expression(undefined);
        component.actions[0].expression({
            id: '1',
            active: true,
        });
        component.actions[0].expression({
            id: '1',
            active: false,
        });

        component.actions[1].expression(undefined);
        component.actions[1].expression({
            id: '1',
            active: true,
        });
        component.actions[1].expression({
            id: '1',
            active: false,
        });
        expect(component).toBeTruthy();
    }));

    it('should test fireSwal', fakeAsync(() => {
        component.operatingRegion = {
            active: true,
            id: 'e472d7dc-80ab-4406-b9be-012ea25d8b5b',
            name: 'Kabuchai',
            unit_type: 'SUB_COUNTY',
            country: 'KEN',
            organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
        };
        spyOn(component, 'fireSwal').and.callThrough();
        component.fireSwal({ fire: () => {} });
        expect(component.fireSwal).toHaveBeenCalled();
    }));

    it('should test toggleRetireOR when OR is active', () => {
        const event = {
            active: true,
            id: 'e472d7dc-80ab-4406-b9be-012ea25d8b5b',
            name: 'Kabuchai',
            unit_type: 'SUB_COUNTY',
            country: 'KEN',
            organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
        };
        spyOn(component, 'fireSwal');
        spyOn(component, 'toggleRetireOR').and.callThrough();
        component.toggleRetireOR(event);
        expect(component.toggleRetireOR).toHaveBeenCalledWith(event);
    });

    it('should test toggleRetireOR when OR is inactive', () => {
        const event = {
            active: false,
            id: 'e472d7dc-80ab-4406-b9be-012ea25d8b5b',
            name: 'Kabuchai',
            unit_type: 'SUB_COUNTY',
            country: 'KEN',
            organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
        };
        spyOn(component, 'toggleRetireOR').and.callThrough();
        spyOn(component, 'fireSwal');
        component.toggleRetireOR(event);
        expect(component.toggleRetireOR).toHaveBeenCalledWith(event);
    });

    it('should test confirm update OR status to active/activate', () => {
        component.operatingRegion = {
            active: false,
            id: 'e472d7dc-80ab-4406-b9be-012ea25d8b5b',
            name: 'Kabuchai',
            unit_type: 'SUB_COUNTY',
            country: 'KEN',
            organisation: '18d2cb54-b4dd186-4b2c-baad-13df951bfed9',
        };
        spyOn(component, 'showToast');

        component.confirmUpdate();

        expect(component.loading).toBe(false);
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Operating Region',
            'Operating Region has been updated'
        );
    });

    it('should test confirm update OR status to inactive/retire', () => {
        component.operatingRegion = {
            active: true,
            id: 'e472d7dc-80ab-4406-b9be-012ea25d8b5b',
            name: 'Kabuchai',
            unit_type: 'SUB_COUNTY',
            country: 'KEN',
            organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
        };
        spyOn(component, 'showToast');

        component.confirmUpdate();

        expect(component.loading).toBe(false);
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Operating Region',
            'Operating Region has been updated'
        );
    });

    it('should test fireSwal fires the swal', () => {
        const mockSwal = { fire: jasmine.createSpy('fire') };
        component.fireSwal(mockSwal);
        expect(mockSwal.fire).toHaveBeenCalled();
    });

    it('should set operatingRegionAction and text correctly on toggleRetireOR', () => {
        const event = {
            active: true,
            id: 'test-id',
            name: 'Test Region',
            unit_type: 'SUB_COUNTY',
            country: 'KEN',
            organisation: 'org-id',
        };

        spyOn(component, 'fireSwal');
        component.toggleRetireOR(event);

        expect(component.operatingRegion).toEqual(event);
        expect(component.operatingRegionAction).toBe('retire');
        expect(component.operatingRegionText).toBe(
            'Are you sure you want to retire Test Region?'
        );
        expect(component.fireSwal).toHaveBeenCalledWith(
            component.retireOperatingRegion
        );
    });

    it('should set operatingRegionAction to activate when region is inactive', () => {
        const event = {
            active: false,
            id: 'test-id',
            name: 'Test Region',
            unit_type: 'SUB_COUNTY',
            country: 'KEN',
            organisation: 'org-id',
        };

        spyOn(component, 'fireSwal');
        component.toggleRetireOR(event);

        expect(component.operatingRegionAction).toBe('activate');
        expect(component.operatingRegionText).toBe(
            'Are you sure you want to activate Test Region?'
        );
        expect(component.fireSwal).toHaveBeenCalledWith(
            component.activateOperatingRegion
        );
    });

    it('should display toast with correct parameters', () => {
        const spy = spyOn(component['toastrService'], 'show');
        component.showToast(
            'bottom-right',
            'success',
            'Test Message',
            'Test Context'
        );
        expect(spy).toHaveBeenCalledWith(
            'Test Context successfully',
            'Test Message',
            {
                position: 'bottom-right',
                status: 'success',
                duration: 7000,
            } as any
        );
    });

    it('should refresh table data after adding operating region', () => {
        component.siltable = { getData: jasmine.createSpy('getData') } as any;
        component.addOperatingRegions({ sub_county: 'Test Region' });
        expect(component.siltable.getData).toHaveBeenCalled();
    });

    it('should refresh table data after confirming update', () => {
        component.siltable = { getData: jasmine.createSpy('getData') } as any;
        component.operatingRegion = {
            active: true,
            id: '1',
            name: 'Test',
            unit_type: 'SUB_COUNTY',
            country: 'KEN',
            organisation: 'org-id',
        };
        component.confirmUpdate();
        expect(component.siltable.getData).toHaveBeenCalled();
    });

    it('should trigger change detection after setting operating region', () => {
        const cdrSpy = spyOn(component['cdr'], 'detectChanges');
        spyOn(component, 'fireSwal');
        component.toggleRetireOR({
            active: true,
            id: '1',
            name: 'Test',
            unit_type: 'SUB_COUNTY',
            country: 'KEN',
            organisation: 'org-id',
        });
        expect(cdrSpy).toHaveBeenCalled();
    });

    it('should set loading to false after successful add', () => {
        component.loading = true;
        component.addOperatingRegions({ sub_county: 'New Region' });
        expect(component.loading).toBe(false);
    });

    it('should toggle modal state when toggleAddRegion is called twice', () => {
        const initialState = component.showAddRegionModal;
        component.toggleAddRegion();
        const firstToggle = component.showAddRegionModal;
        component.toggleAddRegion();
        const secondToggle = component.showAddRegionModal;
        expect(firstToggle).toBe(!initialState);
        expect(secondToggle).toBe(initialState);
    });

    it('should call toggleAddRegion after successfully adding region', () => {
        spyOn(component, 'toggleAddRegion');
        component.addOperatingRegions({ sub_county: 'Test Region' });
        expect(component.toggleAddRegion).toHaveBeenCalled();
    });

    it('should set operatingRegion when toggleRetireOR is called', () => {
        const event = {
            active: true,
            id: 'new-id',
            name: 'New Region',
            unit_type: 'SUB_COUNTY',
            country: 'KEN',
            organisation: 'org-id',
        };
        spyOn(component, 'fireSwal');
        component.toggleRetireOR(event);
        expect(component.operatingRegion).toEqual(event);
    });

    it('should update operatingRegionAction based on active status', () => {
        const activeEvent = {
            active: true,
            id: 'test-1',
            name: 'Active Region',
            unit_type: 'SUB_COUNTY',
            country: 'KEN',
            organisation: 'org-id',
        };
        spyOn(component, 'fireSwal');
        component.toggleRetireOR(activeEvent);
        expect(component.operatingRegionAction).toBe('retire');

        const inactiveEvent = { ...activeEvent, active: false };
        component.toggleRetireOR(inactiveEvent);
        expect(component.operatingRegionAction).toBe('activate');
    });
});

const silStoresServiceStubError = {
    create() {
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

describe('OperatingRegionsComponent error', () => {
    let component: OperatingRegionsComponent;
    let fixture: ComponentFixture<OperatingRegionsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [OperatingRegionsComponent],
            imports: [mockPipe('translate')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: SilStoresService,
                    useValue: silStoresServiceStubError,
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SweetAlert2Module,
                    useClass: SweetAlert2Module,
                },
                {
                    provide: SweetAlert2LoaderService,
                    useClass: SweetAlert2LoaderServiceStub,
                },
                ErrorHandlerService,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(OperatingRegionsComponent);

        // Create mock SwalComponent instances
        const childComponentInstance1 = jasmine.createSpyObj('SwalComponent', [
            'fire',
        ]);
        const childComponentInstance2 = jasmine.createSpyObj('SwalComponent', [
            'fire',
        ]);

        fixture.componentInstance.retireOperatingRegion =
            childComponentInstance1;
        fixture.componentInstance.activateOperatingRegion =
            childComponentInstance2;
        component = fixture.componentInstance;
        component.ngOnInit();
        fixture.detectChanges();
    });

    it('should handle error when addOperatingRegions fails', () => {
        spyOn(component['errorHandler'], 'handleError');
        component.addOperatingRegions({ sub_county: 'Test' });
        expect(component['errorHandler'].handleError).toHaveBeenCalled();
        expect(component.loading).toBe(false);
    });

    it('should handle error when confirmUpdate fails', () => {
        component.operatingRegion = {
            active: true,
            id: 'test-id',
            name: 'Test',
            unit_type: 'SUB_COUNTY',
            country: 'KEN',
            organisation: 'org-id',
        };
        spyOn(component['errorHandler'], 'handleError');
        component.confirmUpdate();
        expect(component['errorHandler'].handleError).toHaveBeenCalled();
        expect(component.loading).toBe(false);
    });
});
