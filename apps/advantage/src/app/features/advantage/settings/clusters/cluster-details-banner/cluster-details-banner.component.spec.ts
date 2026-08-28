import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClusterDetailsBannerComponent } from './cluster-details-banner.component';
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
    create() {
        return of({ id: '123' });
    }
    update() {
        return of({ id: '1235' });
    }
    remove() {
        return of({ id: '1234' });
    }
}

class SilStoresServiceStubError {
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
    remove() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
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
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
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

describe('ClusterDetailsBannerComponent', () => {
    let component: ClusterDetailsBannerComponent;
    let fixture: ComponentFixture<ClusterDetailsBannerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ClusterDetailsBannerComponent],
            imports: [mockPipe('translate'), mockPipe('ngxCapitalize')],
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
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(ClusterDetailsBannerComponent);
        component = fixture.componentInstance;
        component.clusterObservable = of({
            id: '1234',
        });
        fixture.detectChanges();
    });

    it('should test the toggleClusterLogoModal method', () => {
        spyOn(component, 'toggleClusterLogoModal').and.callThrough();
        component.toggleClusterLogoModal('edit_cluster_logo');
        expect(component.toggleClusterLogoModal).toHaveBeenCalled();
    });

    it('should test the onFileSelected method', () => {
        const mockFile = new File([''], 'filename.png', { type: 'image/png' });
        const event = {
            target: {
                files: [mockFile],
            },
        };
        spyOn(component, 'onFileSelected').and.callThrough();
        spyOn(component, 'updateClusterLogo').and.callThrough();
        component.onFileSelected(event);
        expect(component.onFileSelected).toHaveBeenCalledWith(event);
        expect(component.updateClusterLogo).toHaveBeenCalledWith(mockFile);
    });

    it('should test the onNewFileSelected method', () => {
        const mockFile = new File([''], 'filename.png', { type: 'image/png' });
        const event = {
            target: {
                files: [mockFile],
            },
        };
        spyOn(component, 'onNewFileSelected').and.callThrough();
        component.onNewFileSelected(event);
        expect(component.onNewFileSelected).toHaveBeenCalled();
    });

    it('should test the getClusterDetails method', () => {
        spyOn(component, 'getClusterDetails').and.callThrough();
        component.getClusterDetails();
        expect(component.getClusterDetails).toHaveBeenCalled();
    });

    it('should test the uploadClusterLogo method', () => {
        const mockFile = new File([''], 'filename.png', { type: 'image/png' });
        const event = {
            target: {
                files: [mockFile],
            },
        };
        spyOn(component, 'uploadClusterLogo').and.callThrough();
        component.uploadClusterLogo(event);
        expect(component.uploadClusterLogo).toHaveBeenCalled();
    });

    it('should test the getKraPin method, get KRA PIN', () => {
        const res = {
            identifiers: [
                {
                    id: 1,
                    identifier_type: 'kraPIN',
                    identifier_value: 'F8934923I',
                },
            ],
        };
        spyOn(component, 'getKraPin').and.callThrough();
        component.getKraPin(res);
        expect(component.getKraPin).toHaveBeenCalled();
    });

    it('should test the getKraPin method, missing KRA PIN', () => {
        const res = {
            identifiers: [],
        };
        spyOn(component, 'getKraPin').and.callThrough();
        component.getKraPin(res);
        expect(component.getKraPin).toHaveBeenCalled();
    });

    it('should test the updateClusterLogo method', () => {
        // treat the Partial<ClusterModel> as a full ClusterModel, (includes other fields) for testing
        component.clusterDetails = {
            id: '123',
            orgunit_logo: { id: '12' },
        } as ClusterModel<BranchModel>;
        spyOn(component, 'updateClusterLogo').and.callThrough();
        component.updateClusterLogo({ file: { name: 'name', type: 'png' } });
        expect(component.updateClusterLogo).toHaveBeenCalled();
    });

    it('should test the removeLogo method', () => {
        component.clusterDetails = {
            id: '123',
            orgunit_logo: { id: '12' },
        } as ClusterModel<BranchModel>;
        spyOn(component, 'removeLogo').and.callThrough();
        component.removeLogo();
        expect(component.removeLogo).toHaveBeenCalled();
    });

    it('should test the showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
    });
});

describe('ClusterDetailsBannerComponent error', () => {
    let component: ClusterDetailsBannerComponent;
    let fixture: ComponentFixture<ClusterDetailsBannerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ClusterDetailsBannerComponent],
            imports: [mockPipe('translate'), mockPipe('ngxCapitalize')],
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
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(ClusterDetailsBannerComponent);
        component = fixture.componentInstance;
        component.clusterObservable = throwError(() => new Error('error'));
        fixture.detectChanges();
    });

    it('should test the getClusterDetails method', () => {
        spyOn(component, 'getClusterDetails').and.callThrough();
        component.getClusterDetails();
        expect(component.getClusterDetails).toHaveBeenCalled();
    });

    it('should test the uploadClusterLogo method', () => {
        component.clusterDetails = {
            id: '123',
            orgunit_logo: { id: '12' },
        } as ClusterModel<BranchModel>;
        spyOn(component, 'uploadClusterLogo').and.callThrough();
        component.uploadClusterLogo({ file: { name: 'name', type: 'png' } });
        expect(component.uploadClusterLogo).toHaveBeenCalled();
    });

    it('should test the updateClusterLogo method', () => {
        component.clusterDetails = {
            id: '123',
            orgunit_logo: { id: '12' },
        } as ClusterModel<BranchModel>;
        spyOn(component, 'updateClusterLogo').and.callThrough();
        component.updateClusterLogo({ file: { name: 'name', type: 'png' } });
        expect(component.updateClusterLogo).toHaveBeenCalled();
    });

    it('should test the removeLogo method', () => {
        component.clusterDetails = {
            id: '123',
            orgunit_logo: { id: '12' },
        } as ClusterModel<BranchModel>;
        spyOn(component, 'removeLogo').and.callThrough();
        component.removeLogo();
        expect(component.removeLogo).toHaveBeenCalled();
    });
});
