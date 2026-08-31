import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NbStepperModule, NbToastrService } from '@nebular/theme';
import { of } from 'rxjs';
import { Authorization } from '../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../sil-http-services/sil_datalayer.service';
import { SilTableFormComponent } from './sil-table-form.component';
class AuthorizationStub {
    getUser() {
        return {
            business_partner: 2,
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

class SilStoresServiceStub {
    customUpdate() {
        return of({
            id: 1,
            slade_code: 2,
            current: 1,
            step: 5,
        });
    }

    list() {
        return of({
            results: [
                {
                    id: 1,
                    slade_code: 2,
                },
            ],
        });
    }

    get() {
        return of({
            id: '1231',
            current_session_level: 5,
            business_owners: [],
            provider_kyc_docs: [],
            bank_kyc_docs: [],
            question_answers: [],
            questions: [],
            facility_photos: [],
            bank_details: [{}],
            current: '1',
        });
    }

    create() {
        return of({
            id: 1,
        });
    }
}

describe('Test sil table form component:', () => {
    let component: SilTableFormComponent;
    let fixture: ComponentFixture<SilTableFormComponent>;
    const routerSpy = { navigate: jasmine.createSpy('navigate') };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NbStepperModule,
                RouterTestingModule.withRoutes([
                    {
                        path: 'features/clinic/onboarding',
                        component: SilTableFormComponent,
                    },
                ]),
            ],
            declarations: [SilTableFormComponent],
            providers: [
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: () => '1',
                            },
                        },
                    },
                },
                { provide: Router, useValue: routerSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilTableFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should test the ngOnInit', () => {
        spyOn(component, 'setupTable').and.callThrough();
        component.tableModel = {
            headers: [{ text: 'Name' }],
        };
        component.tableModel['title'] = 'Owner';
        component.tableModel['action'] = true;
        component.tableModel['rows'] = [
            {
                key: 'full_name',
                type: 'string',
            },
        ];
        component.tableModel['actions'] = [
            {
                btnText: 'Edit',
                status: 'success',
                action: 'modal',
            },
        ];
        component.tableModel['headerActions'] = [
            {
                btnText: 'ADD',
                status: 'success',
                action: 'modal',
            },
        ];
        component.refreshFxn();
        fixture.detectChanges();
        component.ngOnInit();
        fixture.detectChanges();
        expect(component.setupTable).toHaveBeenCalled();
    });
});
