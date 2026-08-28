import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { BehaviorSubject, of } from 'rxjs';
import { ProviderFeaturesDetailsComponent } from './provider-features-details.component';

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    setUser() {
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
            total_payments: 4500,
        });
    }

    list() {
        return of({
            results: [
                {
                    id: '143224',
                },
            ],
        });
    }

    create() {
        return of({
            autorecon_enabled: false,
        });
    }

    update() {
        return of({
            id: '12',
        });
    }

    createNested() {
        return of({
            id: '12312',
        });
    }
    listNested() {
        return of({});
    }
}

class NbToastrServiceStub {
    show() {
        return {};
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

describe('ProviderFeaturesDetailsComponent', () => {
    let component: ProviderFeaturesDetailsComponent;
    let fixture: ComponentFixture<ProviderFeaturesDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProviderFeaturesDetailsComponent],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(ProviderFeaturesDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should test toggleModal method', () => {
        spyOn(component, 'toggleModal').and.callThrough();
        component.toggleModal('editSettings');
        expect(component.toggleModal).toHaveBeenCalled();
    });

    it('should test the getOrganisationFeatures method', () => {
        spyOn(component, 'getOrganisationFeatures').and.callThrough();
        component.getOrganisationFeatures();
        expect(component.getOrganisationFeatures).toHaveBeenCalled();
    });

    it('should test the addOrgFeature method', () => {
        const model = {};

        spyOn(component, 'addOrgFeature').and.callThrough();
        component.addOrgFeature(model);
        expect(component.addOrgFeature).toHaveBeenCalled();
    });

    it('should test the addOrgFeatureSuccessfully method', () => {
        spyOn(component, 'addOrgFeatureSuccessfully').and.callThrough();
        component.addOrgFeatureSuccessfully();
        expect(component.addOrgFeatureSuccessfully).toHaveBeenCalled();
    });

    it('should show "Activate" action only when row.active is false', () => {
        const inactiveRow = { active: false };
        const activateAction = component.actions.find(
            a => a.btnText === 'Activate'
        );
        expect(activateAction.expression(inactiveRow)).toBeTrue();
    });

    it('should NOT show "Activate" action when row.active is true', () => {
        const activeRow = { active: true };
        const activateAction = component.actions.find(
            a => a.btnText === 'Activate'
        );
        expect(activateAction.expression(activeRow)).toBeFalse();
    });

    it('should show "Deactivate" action only when row.active is true', () => {
        const activeRow = { active: true };
        const deactivateAction = component.actions.find(
            a => a.btnText === 'Deactivate'
        );
        expect(deactivateAction.expression(activeRow)).toBeTrue();
    });

    it('should NOT show "Deactivate" action when row.active is false', () => {
        const inactiveRow = { active: false };
        const deactivateAction = component.actions.find(
            a => a.btnText === 'Deactivate'
        );
        expect(deactivateAction.expression(inactiveRow)).toBeFalse();
    });
});

class SilStoresServiceStubError {
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

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

    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    createNested() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    listNested() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('ProviderFeaturesDetailsComponent with error', () => {
    let component: ProviderFeaturesDetailsComponent;
    let fixture: ComponentFixture<ProviderFeaturesDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProviderFeaturesDetailsComponent],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(ProviderFeaturesDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test handleErrorFxn method', () => {
        spyOn(component, 'handleErrorFxn').and.callThrough();
        component.handleErrorFxn({});

        expect(component.handleErrorFxn).toHaveBeenCalled();
    });
});
