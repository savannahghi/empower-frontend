import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { StateService } from '@uirouter/angular';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../shared/cookies/cookie.service';
import { BranchSettingListComponent } from './branchsetting-list.component';
import { of } from 'rxjs';
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
    getWokrstation() {
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
    getOrgSettings() {
        return [
            {
                name: 'patients:patient_full_name',
                value: true,
            },
        ];
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

describe('BranchsettingListComponent', () => {
    let component: BranchSettingListComponent;
    let fixture: ComponentFixture<BranchSettingListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [BranchSettingListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [mockPipe('translate')],
            providers: [
                SilStoresService,
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BranchSettingListComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
        fixture.detectChanges();
    });

    it('should test showToast method', () => {
        spyOn(component, 'showToast').and.callThrough();
        component.showToast('position', 'status', 'msg', []);
        expect(component.showToast).toHaveBeenCalled();
    });

    it('should test component functions', fakeAsync(() => {
        spyOn(component, 'setFilter').and.callThrough();
        component.setFilter({ id: 1 });
        expect(component.setFilter).toHaveBeenCalled();
    }));
});
