import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { of } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { PaymentMethodsComponent } from './payment-methods.component';
import { TranslateService } from '@ngx-translate/core';
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

class SilStoresServiceStub {
    create() {
        return of({
            id: '4ed62h7281262h1',
            service_requests: [{ id: '2' }],
        });
    }

    update() {
        return of({
            id: '4ed62h7281262h1',
        });
    }

    get() {
        return of({
            description: 'Promotional pricelist',
        });
    }
}

class NbToastrServiceStub {
    show() {
        return {};
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

class AuthorizationConfigStub {
    setAuthDetails() {
        return of(() => {});
    }
    isLoggedIn() {
        return true;
    }
    getUser() {
        return {
            client_types: [],
        };
    }
    setOrganisationDetails() {
        return of(() => {});
    }

    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
    setAdvantageOrganisationDetails() {
        return {
            client_types: ['PROVIDER'],
            user_workstations: null,
        };
    }
    getOrganisation() {
        return {};
    }
    getErpOrganisation() {
        return {
            client_types: ['PROVIDER'],
            user_workstations: [{ workstation: '1' }],
        };
    }
}

const uIRouterGlobalsStub = {
    params: {
        page_size: '2',
    },
    $current: {
        params: {
            page_size: '2',
        },
    },
};

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
}

describe('PaymentMethodsComponent', () => {
    let component: PaymentMethodsComponent;
    let fixture: ComponentFixture<PaymentMethodsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PaymentMethodsComponent],
            imports: [mockPipe('translate'), mockPipe('featureFlag')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PaymentMethodsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        component.toggleModal();
        component.showToast('left', 'success', 'Message', 'Title');
        expect(component).toBeTruthy();
    });
});
