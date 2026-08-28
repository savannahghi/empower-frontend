import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportDetailsComponent } from './import-details.component';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';

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
    get() {
        return of({
            id: '12312',
            workflow_state: 'SUBMITTED',
        });
    }

    createNested() {
        return of({
            id: '4ed62h7281262h1',
        });
    }

    update() {
        return of({
            id: '4ed62h7281262h1',
        });
    }
}

class NbToastrServiceStub {
    show() {
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
    reload() {
        return true;
    }
    transition() {
        return true;
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'app.advantage.purchases.purchase-invoice.detail',
    },
    params() {
        return { id: 1 };
    },
};

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

describe('ImportDetailsComponent', () => {
    let component: ImportDetailsComponent;
    let fixture: ComponentFixture<ImportDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ImportDetailsComponent],
            imports: [mockPipe('split'), mockPipe('statusColor')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Transition, useClass: TransitionStub },
            ],
        });
        fixture = TestBed.createComponent(ImportDetailsComponent);
        component = fixture.componentInstance;
        component.importsObservable = of({
            id: '12312',
            workflow_state: 'SUBMITTED',
        });
        fixture.detectChanges();
    });

    it('should test the getImportInfo method', () => {
        spyOn(component, 'getImportInfo').and.callThrough();
        component.getImportInfo();
        expect(component.getImportInfo).toHaveBeenCalled();
    });

    it('should test the toggleModal method', () => {
        spyOn(component, 'toggleModal').and.callThrough();
        component.toggleModal('map');
        expect(component.toggleModal).toHaveBeenCalled();
    });

    it('should test the acceptIntoStock method', () => {
        component.import = [{ product: null }];
        spyOn(component, 'acceptIntoStock').and.callThrough();
        spyOn(component, 'showToast').and.callThrough();
        component.acceptIntoStock();
        expect(component.acceptIntoStock).toHaveBeenCalled();
    });

    it('should test the acceptIntoStock method', () => {
        component.import = [{ product: 'test' }];
        spyOn(component, 'acceptIntoStock').and.callThrough();
        spyOn(component, 'showToast').and.callThrough();
        component.acceptIntoStock();
        expect(component.acceptIntoStock).toHaveBeenCalled();
    });

    it('should test the processImport method', () => {
        spyOn(component, 'processImport').and.callThrough();
        spyOn(component, 'showToast').and.callThrough();
        component.processImport();
        expect(component.processImport).toHaveBeenCalled();
    });

    it('should test the mapImport method', () => {
        const model = {
            product: 'Test',
            number_of_packages: 5,
            quantity_per_package: 2,
        };
        spyOn(component, 'mapImport').and.callThrough();
        spyOn(component, 'showToast').and.callThrough();
        component.mapImport(model);
        expect(component.mapImport).toHaveBeenCalledWith(model);
    });
});

class SilStoresServiceStubError {
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    createNested() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('ImportDetailsComponent: Error', () => {
    let component: ImportDetailsComponent;
    let fixture: ComponentFixture<ImportDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ImportDetailsComponent],
            imports: [mockPipe('split'), mockPipe('statusColor')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Transition, useClass: TransitionStub },
            ],
        });
        fixture = TestBed.createComponent(ImportDetailsComponent);
        component = fixture.componentInstance;
        component.importsObservable = throwError('Error Thrown');
        component.import = [{ workflow_state: 'SUBMITTED' }];
        fixture.detectChanges();
    });

    it('should test the getImportInfo method', () => {
        spyOn(component, 'getImportInfo').and.callThrough();
        component.getImportInfo();
        expect(component.getImportInfo).toHaveBeenCalled();
    });

    it('should test the acceptIntoStock method', () => {
        component.import = [{ product: null }];
        spyOn(component, 'acceptIntoStock').and.callThrough();
        spyOn(component, 'showToast').and.callThrough();
        component.acceptIntoStock();
        expect(component.acceptIntoStock).toHaveBeenCalled();
    });

    it('should test the acceptIntoStock method', () => {
        component.import = [{ product: 'test' }];
        spyOn(component, 'acceptIntoStock').and.callThrough();
        spyOn(component, 'showToast').and.callThrough();
        component.acceptIntoStock();
        expect(component.acceptIntoStock).toHaveBeenCalled();
    });

    it('should test the processImport method', () => {
        spyOn(component, 'processImport').and.callThrough();
        spyOn(component, 'showToast').and.callThrough();
        component.processImport();
        expect(component.processImport).toHaveBeenCalled();
    });

    it('should test the mapImport method', () => {
        const model = {
            product: 'Test',
            number_of_packages: 5,
            quantity_per_package: 2,
        };
        spyOn(component, 'mapImport').and.callThrough();
        spyOn(component, 'showToast').and.callThrough();
        component.mapImport(model);
        expect(component.mapImport).toHaveBeenCalledWith(model);
    });
});
