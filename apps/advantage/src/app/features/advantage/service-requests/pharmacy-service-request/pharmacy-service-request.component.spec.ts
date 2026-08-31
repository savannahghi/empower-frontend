import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyServiceRequestComponent } from './pharmacy-service-request.component';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { of } from 'rxjs';
import { UIRouterGlobals } from '@uirouter/angular';
import { NbStatusService, NbToastrService } from '@nebular/theme';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: '143224',
                    dosage: [
                        {
                            dose_unit: 'h',
                        },
                    ],
                    clinical_facility_id: 'sdsewerwjampisu9',
                    clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
                },
            ],
        });
    }
}

const uIRouterGlobalsStub = {
    current: {
        name: 'state',
    },
    params() {
        return { appointment_id: 1 };
    },
    $current: {
        is: () => true,
        params() {
            return { appointment_id: 1 };
        },
    },
};

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getToken() {
        return {};
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
    setOrganisationSettings() {
        return of(() => {});
    }
    getUser() {
        return {
            client_types: ['PROVIDER'],
            roles: ['Quintus'],
            permissions: ['advantage.visit_list', 'erp.dashboard_list'],
        };
    }
    getWorkstation() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

class ErrorHandlerServiceStub {
    handleError() {
        return {};
    }
}

class NbStatusServiceStub {
    isCustomStatus() {}
    monitor() {
        return of(() => {});
    }
    getIcon() {}
    getPack() {}
    registerSvgPack() {}
    setDefaultPack() {}
    connectedTo() {}
    build() {}
    close() {}
    getDirection() {}
    subscribeOnTriggers() {}
    trigger() {}
    host() {}
    container() {}
}

describe('PharmacyServiceRequestComponent', () => {
    let component: PharmacyServiceRequestComponent;
    let fixture: ComponentFixture<PharmacyServiceRequestComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PharmacyServiceRequestComponent],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                {
                    provide: ErrorHandlerService,
                    useClass: ErrorHandlerServiceStub,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PharmacyServiceRequestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        component.handleError({});
        expect(component).toBeTruthy();
    });
});
