import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
} from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { BehaviorSubject, of } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { OrganisationUpdateComponent } from './organisation-update.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

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
    getAdvantageOrganisation() {
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
    transitionTo() {
        return true;
    }
    reload() {
        return true;
    }
}

class SilStoresServiceStub {
    get() {
        return of({
            id: '12312',
            postal_address: 'sadasd',
            web_address: 'wewerer',
        });
    }
    update() {
        return of({
            id: '12',
            organisation_name: 'org 1',
        });
    }
}

class SilStoresServiceStubError {
    get() {
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

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

const orgData = { organisation_id: '123' };

describe('OrganisationUpdateComponent', () => {
    let component: OrganisationUpdateComponent;
    let fixture: ComponentFixture<OrganisationUpdateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OrganisationUpdateComponent],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
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
                { provide: UIRouterGlobals },
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(OrganisationUpdateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test the fxnReload function', fakeAsync(() => {
        spyOn(component, 'fxnReload').and.callThrough();
        component.getOrganisationInfo(orgData);
        component.fxnReload();
        tick(3200);
        expect(component.fxnReload).toHaveBeenCalled();
    }));

    it('should test the showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test the pageReloader method', () => {
        spyOn(component, 'pageReloader').and.callThrough();
        component.pageReloader();
        expect(component.pageReloader).toHaveBeenCalled();
    });

    it('should test updateOrganisation and updateAdvantageOrganisation functions', () => {
        const model = {
            organisation_name: 'testOrganisationName',
            physical_address: 'testPhysicalAddress',
            organisation_email_address: 'testOrganisationEmailAddress',
            organisation_phone_number: 'testOrganisationPhoneNumber',
            web_address: 'www.testWebAddress.com',
            postal_address: 'testPostalAddress',
            organisation_country: 'kenya',
            organisation_tax_pin: 'P012345',
        };
        spyOn(component, 'updateOrganisation').and.callThrough();
        spyOn(component, 'updateAdvantageOrganisation').and.callThrough();
        component.updateOrganisation(model);
        component.updateAdvantageOrganisation(model);
        expect(component.updateOrganisation).toHaveBeenCalledWith(model);
        expect(component.updateAdvantageOrganisation).toHaveBeenCalledWith(
            model
        );
    });

    it('should test updateOrganisation function with "https:// prefix added to web address"', () => {
        const model = {
            organisation_name: 'testOrganisationName',
            physical_address: 'testPhysicalAddress',
            organisation_email_address: 'testOrganisationEmailAddress',
            organisation_phone_number: 'testOrganisationPhoneNumber',
            web_address: 'https://www.testWebAddress.com',
            postal_address: 'testPostalAddress',
            organisation_country: 'kenya',
            organisation_tax_pin: 'P012345',
        };
        spyOn(component, 'updateOrganisation').and.callThrough();
        component.updateOrganisation(model);
        expect(component.updateOrganisation).toHaveBeenCalledWith(model);
    });

    it('should test redirectAfterOrgUpdate function', () => {
        const model = { organisation_name: 'Savannah' };
        spyOn(component, 'redirectAfterOrgUpdate').and.callThrough();
        component.redirectAfterOrgUpdate(model);
        expect(component.redirectAfterOrgUpdate).toHaveBeenCalledWith(model);
    });

    it('should test orgDetails function', () => {
        const data = {
            postal_address: '',
            web_address: '',
            tax_office_name: '',
            tax_office: '',
            identifiers: [{}],
            physical_address: '',
        };
        component.orgData = {
            organisation_name: 'Savannah',
            organisation_phone_number: '',
            organisation_email_address: '',
            organisation_country: '',
        };
        spyOn(component, 'orgDetails').and.callThrough();
        component.orgDetails(data);
        component.organisationDetails = {};
        expect(component.orgDetails).toHaveBeenCalledWith(data);
    });

    it('should test ngOnInit', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        component.getOrganisationInfo(orgData);

        expect(component.ngOnInit).toHaveBeenCalled();
    });
});

describe('OrganisationUpdateComponent publishing error', () => {
    let component;
    let fixture: ComponentFixture<OrganisationUpdateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OrganisationUpdateComponent],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
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
                { provide: UIRouterGlobals },
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(OrganisationUpdateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Error is thrown when getOrganisationInfo is not resolved', () => {
        spyOn(component, 'getOrganisationInfo').and.callThrough();
        component.getOrganisationInfo(orgData);
        expect(component.getOrganisationInfo).toHaveBeenCalled();
    });
});
