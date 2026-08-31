import {
    ComponentFixture,
    fakeAsync,
    flush,
    TestBed,
    tick,
} from '@angular/core/testing';
import { ClusterDetailsComponent } from './cluster-details.component';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { StateService } from '@uirouter/angular';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { BranchModel, ClusterModel } from '../../../models';

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
    update() {
        return of({
            id: '12',
            organisation_name: 'org 1',
        });
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

class SilStoresServiceStubError {
    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
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

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

describe('ClusterDetailsComponent', () => {
    let component: ClusterDetailsComponent;
    let fixture: ComponentFixture<ClusterDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ClusterDetailsComponent],
            imports: [mockPipe('translate')],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: StateService,
                    useClass: StateServiceStub,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(ClusterDetailsComponent);
        component = fixture.componentInstance;
        component.clusterObservable = of({
            id: '1234',
        });
        fixture.detectChanges();
    });

    it('should test the getClusterDetails method', () => {
        spyOn(component, 'getClusterDetails').and.callThrough();
        component.getClusterDetails();
        expect(component.getClusterDetails).toHaveBeenCalled();
    });

    it('should test the updateOrganisationCluster method', fakeAsync(() => {
        component.clusterDetails = { id: '1234' } as ClusterModel<BranchModel>;
        spyOn(component, 'updateOrganisationCluster').and.callThrough();
        component.updateOrganisationCluster({
            id: '1234',
            name: 'updated name',
        });
        tick(2000);
        flush();
        expect(component.updateOrganisationCluster).toHaveBeenCalled();
    }));

    it('should test the back method', () => {
        spyOn(component, 'back').and.callThrough();
        component.back();
        expect(component.back).toHaveBeenCalled();
    });

    it('should test the showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
    });
});

describe('ClusterDetailsComponent error', () => {
    let component: ClusterDetailsComponent;
    let fixture: ComponentFixture<ClusterDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ClusterDetailsComponent],
            imports: [mockPipe('translate')],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: StateService,
                    useClass: StateServiceStub,
                },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(ClusterDetailsComponent);
        component = fixture.componentInstance;
        component.clusterObservable = throwError(() => new Error('error'));
        fixture.detectChanges();
    });

    it('should test the getClusterDetails method', () => {
        spyOn(component, 'getClusterDetails').and.callThrough();
        component.getClusterDetails();
        expect(component.getClusterDetails).toHaveBeenCalled();
    });

    it('should test the updateOrganisationCluster method', () => {
        component.clusterDetails = { id: '1234' } as ClusterModel<BranchModel>;
        spyOn(component, 'updateOrganisationCluster').and.callThrough();
        component.updateOrganisationCluster({
            id: '1234',
            name: 'updated name',
        });
        expect(component.updateOrganisationCluster).toHaveBeenCalled();
    });
});
