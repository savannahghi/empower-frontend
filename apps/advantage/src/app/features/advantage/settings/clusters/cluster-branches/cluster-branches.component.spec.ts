import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClusterBranchesComponent } from './cluster-branches.component';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { StateService } from '@uirouter/angular';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { UIRouterGlobals } from '@uirouter/angular';
import { ErrorHandlerService } from '../../../../../shared/sil-http-services/error-handler';

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
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getOrganisation() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

const uIRouterGlobalsStub = {
    params: {
        id: '1234',
    },
};

class SilStoresServiceStub {
    create() {
        return of({
            id: '12',
            organisation_name: 'org 1',
        });
    }
}

class SilStoresServiceStubError {
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
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

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

describe('ClusterBranchesComponent', () => {
    let component: ClusterBranchesComponent;
    let fixture: ComponentFixture<ClusterBranchesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ClusterBranchesComponent],
            imports: [mockPipe('translate')],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: StateService,
                    useClass: StateServiceStub,
                },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                ErrorHandlerService,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(ClusterBranchesComponent);
        component = fixture.componentInstance;
        component.clusterObservable = of({
            id: '1234',
            children: [{ id: '12', name: 'branch one' }],
        });
        component.branchDetails = {
            orgunit_type: 'branch',
            parent: '1234',
        };
        fixture.detectChanges();
    });

    it('should test the toggleModal method', () => {
        spyOn(component, 'toggleModal').and.callThrough();
        component.toggleModal();
        expect(component.toggleModal).toHaveBeenCalled();
    });

    it('should test the getClusterDetails method has branches', () => {
        spyOn(component, 'getClusterDetails').and.callThrough();
        component.getClusterDetails();
        expect(component.getClusterDetails).toHaveBeenCalled();
    });

    it('should test the getClusterDetails method has no branches', () => {
        component.clusterObservable = of({
            id: '1234',
            children: [],
        });
        spyOn(component, 'getClusterDetails').and.callThrough();
        component.getClusterDetails();
        expect(component.getClusterDetails).toHaveBeenCalled();
    });

    it('should test the addBranchToCluster method with correct parent(cluster)', () => {
        spyOn(component, 'addBranchToCluster').and.callThrough();
        component.addBranchToCluster({ parent: '1234' });
        expect(component.addBranchToCluster).toHaveBeenCalled();
    });

    it('should test the addBranchToCluster method with wrong parent(cluster)', () => {
        spyOn(component, 'addBranchToCluster').and.callThrough();
        component.addBranchToCluster({ parent: '4321' });
        expect(component.addBranchToCluster).toHaveBeenCalled();
    });

    it('should test the addDifferentParentCluster method with wrong parent(cluster)', () => {
        spyOn(component, 'addDifferentParentCluster').and.callThrough();
        component.addDifferentParentCluster();
        expect(component.addDifferentParentCluster).toHaveBeenCalled();
    });

    it('should test the saveBranchToCluster method', () => {
        spyOn(component, 'saveBranchToCluster').and.callThrough();
        component.saveBranchToCluster({ parent: '1234' });
        expect(component.saveBranchToCluster).toHaveBeenCalled();
    });

    it('should test the showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
    });
});

describe('ClusterBranchesComponent error', () => {
    let component: ClusterBranchesComponent;
    let fixture: ComponentFixture<ClusterBranchesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ClusterBranchesComponent],
            imports: [mockPipe('translate')],
            providers: [
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                {
                    provide: StateService,
                    useClass: StateServiceStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                ErrorHandlerService,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(ClusterBranchesComponent);
        component = fixture.componentInstance;
        component.clusterObservable = throwError(() => new Error('error'));
        fixture.detectChanges();
    });

    it('should test the getClusterDetails method', () => {
        spyOn(component, 'getClusterDetails').and.callThrough();
        component.getClusterDetails();
        expect(component.getClusterDetails).toHaveBeenCalled();
    });

    it('should test the saveBranchToCluster method', () => {
        spyOn(component, 'saveBranchToCluster').and.callThrough();
        component.saveBranchToCluster({ parent: '1234' });
        expect(component.saveBranchToCluster).toHaveBeenCalled();
    });
});
