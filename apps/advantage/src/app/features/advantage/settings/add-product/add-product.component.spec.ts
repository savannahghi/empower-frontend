import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductComponent } from './add-product.component';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { NbToastrService } from '@nebular/theme';
import { CompleteService } from '../../../../@core/auth/services/login.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

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
class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}
class CompleteServiceStub {
    determineApplication() {
        return true;
    }
    goToApp() {
        return true;
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getToken() {
        return {};
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
    setOrganisationSettings() {
        return of(() => {});
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
            roles: ['Quintus'],
            permissions: ['advantage.visit_list', 'erp.dashboard_list'],
        };
    }
    getWorkstation() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
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
}

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
    }
}

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: '143224',
                    clinical_facility_id: 'sdsewerwjampisu9',
                    clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
                },
            ],
        });
    }

    create() {
        return of({
            id: '143224',
        });
    }
}

class AuthUrlConfigStub {
    setAuthDetails() {
        return of(() => {});
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
            roles: ['Quintus'],
            permissions: ['advantage.visit_list', 'erp.dashboard_list'],
        };
    }
    getToken() {
        return {};
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
}

const uIRouterGlobalsStub = {
    params: {
        id: '112',
    },
    current: {
        data: { apiList: [], defaultParams: {}, extraPayload: { id: '123' } },
    },
};

class AuthenticationServiceStub {
    checkPermission() {
        return true;
    }
}

describe('AddProductComponent', () => {
    let component: AddProductComponent;
    let fixture: ComponentFixture<AddProductComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AddProductComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('translate'),
                mockPipe('featureFlag'),
                mockPipe('variant'),
            ],
            providers: [
                DataLayerUtils,
                { provide: Oauth2Service, useClass: AuthUrlConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        fixture = TestBed.createComponent(AddProductComponent);
        component = fixture.componentInstance;
        component.recordDetailObservable = of({
            id: '1234',
        });
        component.viewEtims = true;
        fixture.detectChanges();
    });

    it('should test the showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test the createdRecord method', () => {
        spyOn(component, 'createdRecord').and.callThrough();
        component.createdRecord();
        expect(component.createdRecord).toHaveBeenCalled();
    });
    it('should test the goToProductsList method', () => {
        spyOn(component, 'goToProductsList').and.callThrough();
        component.goToProductsList();
        expect(component.goToProductsList).toHaveBeenCalled();
    });
    it('should test the saveRecord method', () => {
        const model = {
            product: {
                id: '571039a4-9ea0-42f0-b9b5-04f2ca7fac95',
                preferred_term: 'Absolute Eosinophil Count',
                slade_code: 'CM-17',
            },
            preferred_name: 'SUTURE SILK BRAIDED BLACK 2/0 WITHOUT NEEDLE',
            name: 'SUTURE SILK BRAIDED BLACK 2/0 WITHOUT NEEDLE',
            slade_code: 'CM-87',
            product_type: 'sku',
            categories: [
                '59764945-61fb-4384-baf6-a8b43d09a0b4',
                '286e59e5-3b08-40fb-b381-da72db71956a',
            ],
            selling_price: '100',
            purchasing_price: '30',
            sale_taxes: [
                'f99a18c6-7dda-4ae6-ac71-3fd7fbabea02',
                'c37f9b2b-371c-4c81-a552-55b728d54448',
            ],
            purchase_taxes: ['329db4c3-e31d-4505-9200-3b36b45c3696'],
        };
        spyOn(component, 'saveRecord').and.callThrough();
        component.saveRecord(model);
        expect(component.saveRecord).toHaveBeenCalledWith(model);
    });
    it('should test the saveOclRecord method with KNC4Drugs source', () => {
        const model = {
            product: {
                id: '571039a4-9ea0-42f0-b9b5-04f2ca7fac95',
                preferred_term: 'Absolute Eosinophil Count',
                display_name: 'SUTURE SILK BRAIDED BLACK 2/0 WITHOUT NEEDLE',
            },
            source: 'KNC4Drugs',
            categories: [
                '59764945-61fb-4384-baf6-a8b43d09a0b4',
                '286e59e5-3b08-40fb-b381-da72db71956a',
            ],
            selling_price: '100',
            purchasing_price: '30',
            sale_taxes: [
                'f99a18c6-7dda-4ae6-ac71-3fd7fbabea02',
                'c37f9b2b-371c-4c81-a552-55b728d54448',
            ],
            purchase_taxes: ['329db4c3-e31d-4505-9200-3b36b45c3696'],
        };
        spyOn(component, 'saveOclRecord').and.callThrough();
        component.saveOclRecord(model);
        expect(component.saveOclRecord).toHaveBeenCalledWith(model);
    });
    it('should test the saveOclRecord method with loinc source', () => {
        const model = {
            product: {
                id: '571039a4-9ea0-42f0-b9b5-04f2ca7fac95',
                preferred_term: 'Absolute Eosinophil Count',
                display_name: 'SUTURE SILK BRAIDED BLACK 2/0 WITHOUT NEEDLE',
            },
            source: 'KNC4Investigations',
            categories: [
                '59764945-61fb-4384-baf6-a8b43d09a0b4',
                '286e59e5-3b08-40fb-b381-da72db71956a',
            ],
            selling_price: '100',
            purchasing_price: '30',
            sale_taxes: [
                'f99a18c6-7dda-4ae6-ac71-3fd7fbabea02',
                'c37f9b2b-371c-4c81-a552-55b728d54448',
            ],
            purchase_taxes: ['329db4c3-e31d-4505-9200-3b36b45c3696'],
        };
        spyOn(component, 'saveOclRecord').and.callThrough();
        component.saveOclRecord(model);
        expect(component.saveOclRecord).toHaveBeenCalledWith(model);
    });
    it('should test the saveRecordForEtims method', () => {
        const model = { categories: '' };
        spyOn(component, 'saveRecordForEtims').and.callThrough();
        component.saveRecordForEtims(model);
        expect(component.saveRecordForEtims).toHaveBeenCalled();
    });
    it('should test the setApiList method', () => {
        const data = { id: '' };
        spyOn(component, 'setApiList').and.callThrough();
        component.setApiList(data);
        expect(component.setApiList).toHaveBeenCalled();
    });
});

class AuthenticationServiceStub2 {
    checkPermission() {
        return false;
    }
}

describe('AddProductComponent Path 2', () => {
    let component: AddProductComponent;
    let fixture: ComponentFixture<AddProductComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AddProductComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('translate'),
                mockPipe('featureFlag'),
                mockPipe('variant'),
            ],
            providers: [
                DataLayerUtils,
                { provide: Oauth2Service, useClass: AuthUrlConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub,
                },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub2,
                },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        fixture = TestBed.createComponent(AddProductComponent);
        component = fixture.componentInstance;
        component.recordDetailObservable = of({
            id: '1234',
        });
        fixture.detectChanges();
    });

    it('should test the showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test the createdRecord method', () => {
        spyOn(component, 'createdRecord').and.callThrough();
        component.createdRecord();
        expect(component.createdRecord).toHaveBeenCalled();
    });
    it('should test the goToProductsList method', () => {
        spyOn(component, 'goToProductsList').and.callThrough();
        component.goToProductsList();
        expect(component.goToProductsList).toHaveBeenCalled();
    });
    it('should test the saveRecord method', () => {
        const model = {
            product: {
                id: '571039a4-9ea0-42f0-b9b5-04f2ca7fac95',
                preferred_term: 'Absolute Eosinophil Count',
                slade_code: 'CM-17',
            },
            preferred_name: 'SUTURE SILK BRAIDED BLACK 2/0 WITHOUT NEEDLE',
            name: 'SUTURE SILK BRAIDED BLACK 2/0 WITHOUT NEEDLE',
            slade_code: 'CM-87',
            product_type: 'sku',
            categories: [
                '59764945-61fb-4384-baf6-a8b43d09a0b4',
                '286e59e5-3b08-40fb-b381-da72db71956a',
            ],
            selling_price: '100',
            purchasing_price: '30',
            sale_taxes: [
                'f99a18c6-7dda-4ae6-ac71-3fd7fbabea02',
                'c37f9b2b-371c-4c81-a552-55b728d54448',
            ],
            purchase_taxes: ['329db4c3-e31d-4505-9200-3b36b45c3696'],
        };
        spyOn(component, 'saveRecord').and.callThrough();
        component.saveRecord(model);
        expect(component.saveRecord).toHaveBeenCalledWith(model);
    });
    it('should test the saveRecordForEtims method', () => {
        const model = { categories: '' };
        spyOn(component, 'saveRecordForEtims').and.callThrough();
        component.saveRecordForEtims(model);
        expect(component.saveRecordForEtims).toHaveBeenCalled();
    });
    it('should test the setApiList method', () => {
        const data = { id: '' };
        spyOn(component, 'setApiList').and.callThrough();
        component.setApiList(data);
        expect(component.setApiList).toHaveBeenCalled();
    });
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
}

describe('AddProductComponent: Error', () => {
    let component: AddProductComponent;
    let fixture: ComponentFixture<AddProductComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AddProductComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('translate'),
                mockPipe('featureFlag'),
                mockPipe('variant'),
            ],
            providers: [
                DataLayerUtils,
                // Setup,
                { provide: Oauth2Service, useClass: AuthUrlConfigStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Transition, useClass: TransitionStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: CompleteService, useClass: CompleteServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        fixture = TestBed.createComponent(AddProductComponent);
        component = fixture.componentInstance;
        component.recordDetailObservable = throwError('Error thrown ');
        fixture.detectChanges();
    });

    it('should test the showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test the createdRecord method', () => {
        spyOn(component, 'createdRecord').and.callThrough();
        component.createdRecord();
        expect(component.createdRecord).toHaveBeenCalled();
    });
    it('should test the saveRecord method', () => {
        const model = {
            product: {
                id: '571039a4-9ea0-42f0-b9b5-04f2ca7fac95',
                preferred_term: 'Absolute Eosinophil Count',
                slade_code: 'CM-17',
            },
            preferred_name: 'SUTURE SILK BRAIDED BLACK 2/0 WITHOUT NEEDLE',
            name: 'SUTURE SILK BRAIDED BLACK 2/0 WITHOUT NEEDLE',
            slade_code: 'CM-87',
            product_type: 'sku',
            categories: [
                '59764945-61fb-4384-baf6-a8b43d09a0b4',
                '286e59e5-3b08-40fb-b381-da72db71956a',
            ],
            selling_price: '100',
            purchasing_price: '30',
            sale_taxes: [
                'f99a18c6-7dda-4ae6-ac71-3fd7fbabea02',
                'c37f9b2b-371c-4c81-a552-55b728d54448',
            ],
            purchase_taxes: ['329db4c3-e31d-4505-9200-3b36b45c3696'],
        };
        spyOn(component, 'saveRecord').and.callThrough();
        component.saveRecord(model);
        expect(component.saveRecord).toHaveBeenCalled();
    });
    it('should test the saveRecordForEtims method', () => {
        const model = { categories: '' };
        spyOn(component, 'saveRecordForEtims').and.callThrough();
        component.saveRecordForEtims(model);
        expect(component.saveRecordForEtims).toHaveBeenCalled();
    });
    it('should test the saveRecordForOclEtims method', () => {
        const model = {
            categories: '',
            product: { display_name: 'Bale Mpya' },
        };
        spyOn(component, 'saveRecordForOclEtims').and.callThrough();
        component.saveRecordForOclEtims(model);
        expect(component.saveRecordForOclEtims).toHaveBeenCalled();
    });
    it('should test the goToProductsList method', () => {
        spyOn(component, 'goToProductsList').and.callThrough();
        component.goToProductsList();
        expect(component.goToProductsList).toHaveBeenCalled();
    });
});
