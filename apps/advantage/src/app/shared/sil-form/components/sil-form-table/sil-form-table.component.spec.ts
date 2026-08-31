import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SilFormTableComponent } from './sil-form-table.component';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { StepperService } from '../../../component-services/stepper.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

class SilStoresServiceStub {
    create() {
        return of({
            id: '4ed62h7281262h1',
        });
    }
    list() {
        return of({
            results: [
                {
                    name: 'Business',
                    id: '1234',

                    categories: [
                        {
                            id: '5678',
                            name: 'DOCUMENT',
                        },
                    ],
                },
            ],
        });
    }
}

class NbToastrServiceStub {
    show() {
        return {};
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
    reload() {
        return true;
    }
    transition() {
        return true;
    }
}

class StepperServiceStub {
    nextStep() {
        return { step: '1' };
    }
}

describe('SilFormTableComponent', () => {
    let component: SilFormTableComponent;
    let fixture: ComponentFixture<SilFormTableComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SilFormTableComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: StepperService, useClass: StepperServiceStub },
                { provide: UIRouterGlobals },
            ],
        });
        fixture = TestBed.createComponent(SilFormTableComponent);
        component = fixture.componentInstance;
        component.field = { formControl: new FormControl(), props: {} };

        fixture.detectChanges();
    });

    it('should test submitDetails function', () => {
        spyOn(component, 'toggleModal').and.callThrough();
        component.toggleModal('attachment');
        expect(component.toggleModal).toHaveBeenCalled();
    });
    it('should test submitDetails function', () => {
        const model = {
            fileEvent: {
                name: '',
                size: 1234,
                type: '',
            },
            title: '',
            description: '',
            facility: '',
        };
        spyOn(component, 'submitBankDocuments').and.callThrough();

        component.submitBankDocuments(model);
        expect(component.submitBankDocuments).toHaveBeenCalledWith(model);

        spyOn(component, 'submitBusinessDocuments').and.callThrough();

        component.submitBusinessDocuments(model);
        expect(component.submitBusinessDocuments).toHaveBeenCalledWith(model);
    });
});
