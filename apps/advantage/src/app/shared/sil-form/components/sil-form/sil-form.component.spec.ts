import { SilFormComponent } from './sil-form.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import {
    NbButtonModule,
    NbDatepickerModule,
    NbInputModule,
    NbStatusService,
    NbToastrService,
} from '@nebular/theme';
import { NbMomentDateModule } from '@nebular/moment';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { SkikaSaveOnChangesService } from '../../services/skika-save-onchanges.service';
import { SilFormlyService } from '../../services/skika-formly-service';
import { of } from 'rxjs';
import { SilFormCheckboxComponent } from '../sil-checkbox/sil-checkbox.component';
import { SilInputComponent } from '../sil-input/sil-input.component';
import { SilFormTemplateComponent } from '../sil-form-template/sil-form-template.component';
import { SilFormTextareaComponent } from '../sil-textarea/sil-textarea.component';
import { SilFormSelectComponent } from '../sil-select/sil-select.component';
import { SilFormDatepickerComponent } from '../sil-datepicker/sil-datepicker.component';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    InjectionToken,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
    SimpleChange,
} from '@angular/core';
import { NbAuthService, NB_AUTH_OPTIONS } from '@nebular/auth';
import { SkikaSafePipe } from '../../../sil-pipes/skika-safety.pipe';
import { RouterModule } from '@angular/router';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { CurrencyPipe } from '@angular/common';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { StateService } from '@uirouter/core';
import { Apollo } from 'apollo-angular';
import { SilCurrencyPipe } from '../../../../@theme/pipes/currency/currency.pipe';
import { SilFormTableComponent } from '../sil-form-table/sil-form-table.component';
import { BusinessDetailsRegistrationService } from '../../services/formly/business-details-form';
import { PayerRegistrationService } from '../../services/formly/payer-registration-form';
import { LicensingService } from '../../services/formly/payer-licensing-form';
import { EmployerRegistrationService } from '../../services/formly/employer-registration-form';
import { UIRouterGlobals } from '@uirouter/angular';
import { BankDetailsSetupService } from '../../services/formly/bank-account-setup';
import { MobileMoneySetupService } from '../../services/formly/mobile-money-setup';
import { VariantPipe } from '../../../../@theme/pipes/variant/variant.pipe';
import { EditPricelistDetailsFormService } from '../../services/formly/edit-pricelist-details-form';
class SilFormlyServiceStub {
    getFields() {
        return of({});
    }
    getServiceFields() {
        return [];
    }
}

class AuthenticationServiceStub {
    checkPermission() {
        return false;
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

class NbStatusServiceStub {
    isCustomStatus() {}
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    includes() {
        return true;
    }
}

class HttpClientStub {
    get() {
        return of([{ props: {} }, {}, { formControls: { status: 'VALID' } }]);
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class NbAuthServiceStub {
    authenticate() {
        return of({
            response: { body: '' },
            errors: [],
            isSuccess: () => true,
            getMessages: () => ['Hi', 'Yeah'],
        });
    }
}

class AuthorizationStub {
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getOrganisation() {
        return {};
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

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: 1,
                },
            ],
        });
    }
    isNestedList() {
        return of({
            results: [
                {
                    id: 1,
                },
            ],
        });
    }
}

class PipeStub {
    transform() {
        return true;
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

describe('SilFormComponent', () => {
    let component: SilFormComponent;
    let fixture: ComponentFixture<SilFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ReactiveFormsModule,
                mockPipe('CurrencyPipe'),
                FormlyModule.forRoot({
                    types: [
                        { name: 'input', component: SilInputComponent },
                        {
                            name: 'checkbox',
                            component: SilFormCheckboxComponent,
                        },
                        {
                            name: 'template',
                            component: SilFormTemplateComponent,
                        },
                        {
                            name: 'datepicker',
                            component: SilFormDatepickerComponent,
                        },
                        {
                            name: 'textarea',
                            component: SilFormTextareaComponent,
                        },
                        { name: 'select', component: SilFormSelectComponent },
                        { name: 'table', component: SilFormTableComponent },
                    ],
                    extras: { checkExpressionOn: 'modelChange' },
                }),
                NbButtonModule,
                RouterModule,
                NbDatepickerModule,
                NbMomentDateModule,
                NbInputModule,
                ReactiveFormsModule,
                FormlyModule,
                FormsModule,
            ],
            declarations: [
                SilFormComponent,
                SilFormCheckboxComponent,
                SilFormTemplateComponent,
                SilFormDatepickerComponent,
                SilFormTextareaComponent,
                SilFormSelectComponent,
                SkikaSafePipe,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: CurrencyPipe, useValue: mockPipe('currencyPipe') },
                HttpHandler,
                SkikaSaveOnChangesService,
                BusinessDetailsRegistrationService,
                PayerRegistrationService,
                EmployerRegistrationService,
                LicensingService,
                SilCurrencyPipe,
                {
                    provide: SilFormlyService,
                    useClass: SilFormlyServiceStub,
                },
                {
                    provide: VariantPipe,
                    useClass: PipeStub,
                },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStub,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: HttpClient, useClass: HttpClientStub },
                { provide: NbAuthService, useClass: NbAuthServiceStub },
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: Apollo },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: NB_AUTH_OPTIONS, useValue: NB_AUTH_OPTIONS },
                { provide: InjectionToken, useValue: '', multi: true },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                BankDetailsSetupService,
                MobileMoneySetupService,
                EditPricelistDetailsFormService,
            ],
            teardown: { destroyAfterEach: false },
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SilFormComponent);
        component = fixture.componentInstance;
        component.store = 'cancel-appointment';
        fixture.detectChanges();
    });

    it('should test getFields method', () => {
        spyOn(component, 'getFields').and.callThrough();
        component.store = 'login';
        component.getFields();
        component.getModel({});

        component.formatMoneyBase(undefined);
        component.refreshFxn();
        const money = component.formatMoneyBase(1000);
        expect(money).toBe('1,000.00');
        component.storedFields = [
            {
                type: 'textarea',
                props: {
                    label: 'Textarea label',
                },
            },
        ];
        component.store = undefined;
        component.service = undefined;
        spyOn(component.cd, 'detectChanges');
        component.getFields();
        expect(component.getFields).toHaveBeenCalled();
    });

    it('should test disableFields method', () => {
        spyOn(component, 'getFields').and.callThrough();
        spyOn(component.formlyServ, 'getServiceFields');
        component.service = true;
        component.store = 'appointmentService';
        spyOn(component, 'setFieldsConfigs');
        component.disabledFields = ['false'];
        component.ngOnInit();
        expect(component.getFields).toHaveBeenCalled();
    });

    it('should test setFieldConfigs method', () => {
        spyOn(component, 'setFieldsConfigs').and.callThrough();
        component.config = 'whiteList';
        (component.self.store = 'cancel-appointment'),
            component.setFieldsConfigs();
        expect(component.setFieldsConfigs).toHaveBeenCalled();
    });

    it('should test ngOnChanges method for model changes', () => {
        spyOn(component, 'ngOnChanges').and.callThrough();
        component.ngOnChanges({
            model: new SimpleChange(null, {}, false),
        });
        expect(component.ngOnChanges).toHaveBeenCalled();
    });

    it('should test ngOnChanges method for model is an empty string', () => {
        spyOn(component, 'ngOnChanges').and.callThrough();
        component.ngOnChanges({
            model: undefined,
        });
        expect(component.ngOnChanges).toHaveBeenCalled();
    });

    it('should test ngOnChanges method', () => {
        spyOn(component, 'ngOnChanges').and.callThrough();
        component.ngOnChanges({
            disableSubmit: new SimpleChange(null, {}, false),
        });
        expect(component.ngOnChanges).toHaveBeenCalled();
    });

    it('should test skip method', () => {
        component.skip();
        expect(component.skip).toBeTruthy();
    });

    it('should test back method', () => {
        component.back();
        expect(component.back).toBeTruthy();
    });

    it('should test cancelForm method', () => {
        component.cancelForm();
        expect(component.cancelForm).toBeTruthy();
    });

    it('should test submitForm method with empty form', () => {
        spyOn(component, 'submitForm').and.callThrough();
        component.resetModel = true;
        component.model = [];
        component.fields = [{ formControl: new UntypedFormControl([{}, {}]) }];
        component.submitForm(component.model, {});
        component.setFormlyConfig();
        component.checkExpressionOn = 'changeDetectionCheck';
        component.setFormlyConfig();
        component.submitFormModel = true;
        component.submitForm(component.model, {});
        expect(component.submitForm).toHaveBeenCalledWith(component.model, {});
    });

    it('should test submitForm method', () => {
        spyOn(component, 'submitForm').and.callThrough();
        const form = {
            value: 'value',
        };
        component.model = undefined;
        component.resetModel = false;
        component.submitForm(component.model, form);
        expect(component.submitForm).toHaveBeenCalledWith(
            component.model,
            form
        );
    });

    it('should test isMultiStepObject method', () => {
        spyOn(component, 'isMultiStepObject').and.callThrough();
        component.isMultiStepObject({
            skip: { name: undefined },
            back: { name: undefined },
        });
        expect(component.isMultiStepObject).toHaveBeenCalled();
    });

    it('should test exportFxn method', () => {
        const model = {
            workflow_state: 'PENDING',
        };

        spyOn(component, 'exportFxn').and.callThrough();
        component.exportFxn(model);
        expect(component.exportFxn).toHaveBeenCalledWith(model);
    });
});
