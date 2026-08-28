import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    NbIconLibraries,
    NbStatusService,
    NbToastrService,
} from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { BehaviorSubject, of } from 'rxjs';
import { ErrorHandlerService } from '../../shared/sil-http-services/error-handler';
import { SilStoresService } from '../../shared/sil-http-services/sil_datalayer.service';
import { ViewFormComponent } from './view-form.component';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cookies } from '../cookies/cookie.service';
import { TranslateService } from '@ngx-translate/core';
import { Authorization } from '../../@core/auth/services/authorization.service';
import { AuthenticationService } from '../../@core/auth/services/authentication.service';
import { CurrencyPipe } from '@angular/common';
import { SilCurrencyPipe } from '../../@theme/pipes/currency/currency.pipe';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { Apollo } from 'apollo-angular';
import { BankDetailsSetupService } from '../sil-form/services/formly/bank-account-setup';
import { MobileMoneySetupService } from '../sil-form/services/formly/mobile-money-setup';

class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
    }
}

class NbStatusServiceStub {
    isCustomStatus() {}
    getIcon() {}
    getPack() {}
    registerSvgPack() {}
    setDefaultPack() {}
    connectedTo() {}
    build() {}
    getDirection() {}
    subscribeOnTriggers() {}
    trigger() {}
    host() {}
    container() {}
}

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
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

class AuthenticationServiceStub {
    checkPermission() {
        return false;
    }
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
    getOrgSettings() {
        return of([
            {
                name: 'patients:patient_full_name',
                value: 'true',
            },
        ]);
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
        data: {
            formRecordId: 'id',
            formFields: 'add-user',
            formStore: 'auth-erp-users',
        },
    },
    params() {
        return {
            formRecordId: 'id',
            formFields: 'add-user',
            formStore: 'auth-erp-users',
        };
    },
};

class NbToastrServiceStub {
    show() {
        return {};
    }
}

class SilStoresServiceStub {
    get() {
        return of({
            id: 'grsgg342332sf',
        });
    }

    create() {
        return of({
            id: 'grsgg342332sf',
        });
    }

    update() {
        return of({
            id: '4ed62h7281262h1',
        });
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

describe('ViewFormComponent', () => {
    let component: ViewFormComponent;
    let fixture: ComponentFixture<ViewFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, ViewFormComponent, ApolloTestingModule],
            providers: [
                SilCurrencyPipe,
                { provide: CurrencyPipe, useValue: mockPipe('currencyPipe') },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: NbIconLibraries, useClass: NbStatusServiceStub },
                {
                    provide: ErrorHandlerService,
                },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: Apollo },
                BankDetailsSetupService,
                MobileMoneySetupService,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewFormComponent);
        component = fixture.componentInstance;
        component.recordObservable = of({
            id: '12',
        });
        fixture.detectChanges();
    });

    it('should test fetchedRecord method', () => {
        spyOn(component, 'fetchedRecord').and.callThrough();
        component.fetchedRecord({ id: 2 });
        expect(component.fetchedRecord).toHaveBeenCalled();
    });

    it('should test saveDetails method when there is no formId', () => {
        spyOn(component, 'saveDetails').and.callThrough();
        component.saveDetails({
            id: 2,
            date: '2024-09-04T16:33:20.688057+03:00',
        });
        expect(component.saveDetails).toHaveBeenCalled();
    });

    it('should test saveDetails method when there is formId', () => {
        spyOn(component, 'saveDetails').and.callThrough();
        component.data = { id: '123' };
        component.patchId = 'id';
        component.formId = '12';
        component.saveDetails({
            id: 2,
            date: '2024-09-04T16:33:20.688057+03:00',
        });
        expect(component.saveDetails).toHaveBeenCalled();
    });

    it('should test savedData method when there is no formId', () => {
        spyOn(component, 'savedData').and.callThrough();
        spyOn(component, 'goBack');
        component.showToast('bottom-right', 'success', 'message', 'context');
        component.savedData();
        expect(component.savedData).toHaveBeenCalled();
    });

    it('should test savedData method when there is formId', () => {
        spyOn(component, 'savedData').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        component.formId = '12';
        component.formStore = 'ingredients';
        component.savedData();
        expect(component.savedData).toHaveBeenCalled();
    });

    it('should test goBack method', () => {
        spyOn(component, 'goBack').and.callThrough();
        component.goBack();
        expect(component.goBack).toHaveBeenCalled();
    });

    it('should test the showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('bottom-right', 'success', 'message', 'context');
        expect(component.showToast).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('ViewFormComponent error', () => {
    let component: ViewFormComponent;
    let fixture: ComponentFixture<ViewFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, ViewFormComponent, ApolloTestingModule],
            providers: [
                SilCurrencyPipe,
                { provide: CurrencyPipe, useValue: mockPipe('currencyPipe') },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: NbIconLibraries, useClass: NbStatusServiceStub },
                {
                    provide: ErrorHandlerService,
                },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: Apollo },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test errorFetchRecord ', () => {
        component.formId = '12';
        component.fetchRecord(undefined);
        component.fetchRecord(12);
        component.formStore = 'ingredients';
        spyOn(component, 'errorFetchRecord').and.callThrough();
        component.errorFetchRecord(new Error('kaboooom!'));
        expect(component).toBeTruthy();
    });
});
