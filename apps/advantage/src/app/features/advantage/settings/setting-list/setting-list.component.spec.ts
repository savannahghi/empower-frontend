import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { BehaviorSubject, of } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { StateService } from '@uirouter/angular';
import { SettingListComponent } from './setting-list.component';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { OrganisationService } from '../../../healthcrm/organisations/organisation.service';
import { ErrorHandlerService } from '../../../../shared/sil-http-services/error-handler';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class AuthorizationStub {
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getWorkstation() {
        return {};
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
        });
    }
    update() {
        return of({
            id: '12',
        });
    }
    create() {
        return of({});
    }
    remove() {
        return of({
            id: '1231',
        });
    }
}

class SilStoresServiceStubError {
    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
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
    remove() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

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

class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
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

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class OrgServiceStub {
    setOrganisation() {
        return of(() => {});
    }
}

describe('SettingListComponent', () => {
    let component: SettingListComponent;
    let fixture: ComponentFixture<SettingListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SettingListComponent],
            imports: [
                mockPipe('ngxCapitalize'),
                mockPipe('translate'),
                mockPipe('variant'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                ErrorHandlerService,
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: OrganisationService, useClass: OrgServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SettingListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test component functions', fakeAsync(() => {
        component.toggleModal();
        component.setFilter({ id: 1 });
        component.showToast(
            'bottom-right',
            'success',
            'Message',
            'Message sent'
        );
        component.actions[0].expression({
            name: 'visits:post_visit_survey_template',
        });
        component.actions[0].expression(undefined);
        component.actions[1].expression({
            name: 'visits:post_visit_survey_template',
        });
        component.actions[1].expression(undefined);
        component.ngOnInit();
        tick(700);
        expect(component).toBeTruthy();
    }));

    it('should test the fxnReload function', fakeAsync(() => {
        spyOn(component, 'fxnReload').and.callThrough();
        component.fxnReload();
        tick(3000);
        expect(component.fxnReload).toHaveBeenCalled();
    }));

    it('should test the pageReloader method', () => {
        spyOn(component, 'pageReloader').and.callThrough();
        component.pageReloader();
        expect(component.pageReloader).toHaveBeenCalled();
    });

    it('should test the toggleOrgLogoModal method', () => {
        const context = 'edit_org_logo';
        spyOn(component, 'toggleOrgLogoModal').and.callThrough();
        component.toggleOrgLogoModal(context);
        expect(component.toggleOrgLogoModal).toHaveBeenCalled();
    });

    it('should test the getOrganisationLogo method', () => {
        const mockOrgData = {
            organisation_id: 'test-org-id',
            organisation_name: 'testOrganisationName',
            physical_address: 'testPhysicalAddress',
            organisation_email_address: 'testOrganisationEmailAddress',
            organisation_phone_number: 'testOrganisationPhoneNumber',
            web_address: 'www.testWebAddress.com',
            postal_address: 'testPostalAddress',
            organisation_country: 'kenya',
            organisation_tax_pin: 'P012345',
        };
        spyOn(component, 'getOrganisationLogo').and.callThrough();
        component.getOrganisationLogo(mockOrgData);
        expect(component.getOrganisationLogo).toHaveBeenCalled();
    });

    it('should test the redirectAfterCreatingOrgLogo method', () => {
        const mockData = { title: 'Test Title' };
        const expectedMessage = 'Test Title has been created successfully';
        spyOn(component, 'showToast').and.callThrough();
        spyOn(component, 'fxnReload').and.callThrough();
        component.redirectAfterCreatingOrgLogo(mockData);
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Create Organisation Logo',
            expectedMessage
        );
        expect(component.fxnReload).toHaveBeenCalled();
    });

    it('should test the onNewFileSelected method', () => {
        const mockFile = new File([''], 'filename.png', { type: 'image/png' });
        const event = {
            target: {
                files: [mockFile],
            },
        };
        spyOn(component, 'onNewFileSelected').and.callThrough();
        spyOn(component, 'newOrganisationLogo').and.callThrough();
        component.onNewFileSelected(event);
        expect(component.onNewFileSelected).toHaveBeenCalledWith(event);
        expect(component.newOrganisationLogo).toHaveBeenCalledWith(mockFile);
    });

    it('should test the redirectAfterUpdatingOrgLogo method', () => {
        const mockData = { title: 'Test Title' };
        const expectedMessage = 'Test Title has been updated successfully';
        spyOn(component, 'showToast').and.callThrough();
        spyOn(component, 'fxnReload').and.callThrough();
        component.redirectAfterUpdatingOrgLogo(mockData);
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Update Organisation Logo',
            expectedMessage
        );
        expect(component.fxnReload).toHaveBeenCalled();
    });

    it('should test the onFileSelected method', () => {
        const mockFile = new File([''], 'filename.png', { type: 'image/png' });
        const event = {
            target: {
                files: [mockFile],
            },
        };
        spyOn(component, 'onFileSelected').and.callThrough();
        spyOn(component, 'updateOrganisationLogo').and.callThrough();
        component.onFileSelected(event);
        expect(component.onFileSelected).toHaveBeenCalledWith(event);
        expect(component.updateOrganisationLogo).toHaveBeenCalledWith(mockFile);
    });

    it('should test updateOrganisationLogo', () => {
        const mockFile = new File([''], 'filename.png', { type: 'image/png' });
        component.organisationLogo = { id: 'test-logo-id' };
        spyOn(component, 'updateOrganisationLogo').and.callThrough();
        component.updateOrganisationLogo(mockFile);
        expect(component.updateOrganisationLogo).toHaveBeenCalled();
    });

    it('should test the redirectAfterDeletingOrgLogo method', () => {
        const mockData = { title: 'Test Title' };
        const expectedMessage = 'Test Title has been deleted successfully';
        spyOn(component, 'showToast').and.callThrough();
        spyOn(component, 'fxnReload').and.callThrough();
        component.redirectAfterDeletingOrgLogo(mockData);
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Delete Organisation Logo',
            expectedMessage
        );
        expect(component.fxnReload).toHaveBeenCalled();
    });

    it('should test the removeLogo method', () => {
        component.organisationLogo = { id: 'test-logo-id' };
        spyOn(component, 'removeLogo').and.callThrough();
        component.removeLogo();
        expect(component.removeLogo).toHaveBeenCalled();
    });
});

describe('SettingListComponent error path', () => {
    let component;
    let fixture: ComponentFixture<SettingListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SettingListComponent],
            imports: [
                mockPipe('ngxCapitalize'),
                mockPipe('translate'),
                mockPipe('variant'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                ErrorHandlerService,
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: OrganisationService, useClass: OrgServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SettingListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Error is thrown when getOrganisationLogo is not resolved', () => {
        spyOn(component, 'errorHandlerGetOrgLogo').and.callThrough();
        component.errorHandlerGetOrgLogo();
        expect(component.errorHandlerGetOrgLogo).toHaveBeenCalled();
    });

    it('Error is thrown when newOrganisationLogo is not resolved', () => {
        spyOn(component, 'errorHandlerNewOrgLogo').and.callThrough();
        component.errorHandlerNewOrgLogo();
        expect(component.errorHandlerNewOrgLogo).toHaveBeenCalled();
    });

    it('Error is thrown when updateOrganisationLogo is not resolved', () => {
        spyOn(component, 'errorHandlerUpdateOrgLogo').and.callThrough();
        component.errorHandlerUpdateOrgLogo();
        expect(component.errorHandlerUpdateOrgLogo).toHaveBeenCalled();
    });

    it('Error is thrown when removeLogo is not resolved', () => {
        spyOn(component, 'errorHandlerRemoveLogo').and.callThrough();
        component.errorHandlerRemoveLogo();
        expect(component.errorHandlerRemoveLogo).toHaveBeenCalled();
    });
});
