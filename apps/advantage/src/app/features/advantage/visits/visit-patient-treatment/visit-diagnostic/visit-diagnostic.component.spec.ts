import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    NbDatepickerModule,
    NbStatusService,
    NbThemeModule,
    NbToastrService,
} from '@nebular/theme';
import { VisitDiagnosticComponent } from './visit-diagnostic.component';
import { of } from 'rxjs';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { AuthenticationService } from 'app/@core/auth/services/authentication.service';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';

const payload = {
    id: '9e82e1bc-9518-4c93-a938-ff1b6656b28d',
    name: 'visit diagnostic',
};

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

class NbStatusServiceStub {
    isCustomStatus() {}
}

class SilStoreServiceStub {
    create() {
        return of([payload]);
    }
}

class AuthorizationStub {
    getOrganisation() {
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
    getToken() {
        return {
            access_token: 'token',
        };
    }

    getWorkstation() {
        return {
            workstation__name: 'Breast Cancer Screening',
        };
    }
    setClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
    getUserClinicalIds() {
        return {
            clinical_facility_id: 'sdsewerwjampisu9',
            clinical_org_id: '85e4b0d3-1d69-47ba-b265-579d125f18e5',
        };
    }
}

class AuthenticationServiceStub {
    checkPermission() {
        return false;
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
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

const uIRouterGlobalsStub = {
    params: {
        id: 'someId',
        cancer_type: 'breast',
        patient_id: '2359',
    },
    current: {
        name: 'state',
    },
};

describe('VisitDiagnosticComponent', () => {
    let component: VisitDiagnosticComponent;
    let fixture: ComponentFixture<VisitDiagnosticComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [
                mockPipe('titileCase'),
                NbThemeModule.forRoot(),
                NbDatepickerModule.forRoot(),
                VisitDiagnosticComponent,
            ],
            providers: [
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                { provide: SilStoresService, useClass: SilStoreServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
            ],
        });

        fixture = TestBed.createComponent(VisitDiagnosticComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have loading as false by default', () => {
        expect(component.loading).toBeFalse();
    });

    it('should test getModelData method', () => {
        spyOn(component, 'getModelData').and.callThrough();

        const model = {
            lab_number: '123',
            date_of_specimen_collection: '2023-10-01',
            date_of_reporting: '2023-10-02',
            laterality: 'left',
            specimen_type: 'blood',
            test_type: 'CBC',
        };

        component.getModelData(model);
        expect(component.getModelData).toHaveBeenCalled();
        expect(component.formData).toEqual(model);
    });
});
