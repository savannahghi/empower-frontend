import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { BehaviorSubject, of } from 'rxjs';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { NewReconRequestFormService } from './new-recon-request-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class SilStoresServiceStub {
    list() {
        return of([{ name: 'Reason 1' }, { name: 'Reason 2' }]);
    }

    get() {
        return of({
            id: '123',
        });
    }
}

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getAutoreconSettings() {
        return {
            organisation_slade_code: '123',
        };
    }
    getUser() {
        return {
            bp_type: 'PROVIDER',
        };
    }
    getOrganisationData() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

class PayerAuthorizationStub {
    getOrganisation() {
        return {};
    }
    getWorkstation() {
        return {};
    }
    getAutoreconSettings() {
        return {
            organisation_slade_code: '123',
        };
    }
    getUser() {
        return {
            bp_type: 'PAYER',
        };
    }
    getOrganisationData() {
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
    includes() {
        return true;
    }
    transitionTo() {
        return true;
    }
}

class AuthenticationServiceStub {
    checkSetting(string) {
        return string === 'string';
    }
}

const uIRouterGlobalsStub = {
    params: {
        id: '112',
        workflow_state: '',
    },
};

describe('NewReconRequestFormService', () => {
    let service: NewReconRequestFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(NewReconRequestFormService);
    });

    it('should test fields and observable functions', () => {
        const comp = {
            model: { option: 'dates' },
            fields: [
                {},
                {},
                {
                    props: {
                        options: [
                            {
                                name: 'DESCRIPTION',
                            },
                            {
                                name: 'Ailment/ Condition Not Covered',
                            },
                        ],
                    },
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };

        expect(service).toBeTruthy();
        service.setComponent(comp);

        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        expect(fields[1].hideExpression(comp.model)).toBeFalse();
        expect(fields[2].hideExpression(comp.model)).toBeFalse();
        expect(fields[4].hideExpression(comp.model)).toBeFalse();
        expect(fields[5].hideExpression(comp.model)).toBeTrue();

        // Change the model's option to 'excel'
        comp.model.option = 'excel';

        expect(fields[1].hideExpression(comp.model)).toBeTrue();
        expect(fields[2].hideExpression(comp.model)).toBeTrue();
        expect(fields[4].hideExpression(comp.model)).toBeTrue();
        expect(fields[5].hideExpression(comp.model)).toBeFalse();

        const field1 = {
            model: {
                start_date: '2023-08-01',
            },
            props: {},
        };
        fields[1]['model.start_date'] = field1;

        const field2 = {
            model: {
                end_date: '2023-12-01',
            },
            props: {},
        };
        fields[2]['model.end_date'] = field2;

        const field = fields[2];
        const controlInvalid = { value: '2023-07-30' };
        const fieldStartDateInvalid = {
            form: {
                get: () => ({ value: '2023-08-01' }),
            },
        };
        const isValidInvalid = field.validators.end_date.expression(
            controlInvalid,
            fieldStartDateInvalid
        );

        expect(isValidInvalid).toBeFalse();

        const controlValid = { value: '2023-08-02' };
        const fieldStartDateValid = {
            form: {
                get: () => ({ value: '2023-08-01' }),
            },
        };
        const isValidValid = field.validators.end_date.expression(
            controlValid,
            fieldStartDateValid
        );

        expect(isValidValid).toBeTrue();

        const model1 = {
            start_date: '2023-08-01',
            end_date: '2023-07-30',
        };

        const templateField = fields[3];
        expect(templateField.type).toBe('template');

        model1.end_date = '2023-07-30';
        const template =
            templateField.expressionProperties['props.template'](model1);

        expect(template).toContain(
            'End date cannot be earlier than start date (2023-08-01).'
        );

        model1.start_date = '2023-08-01';
        model1.end_date = '2024-01-30';
        const template2 =
            templateField.expressionProperties['props.template'](model1);

        expect(template2).toBe('');

        const fieldrejectionreason = {};
        field['model'] = {
            rejection_reason: 'Ailment/ Condition Not Covered',
        };

        const field4 = {
            model: {
                rejection_reason: 'DESCRIPTION',
            },
            props: {},
        };
        fields[4]['model.rejection_reason'] = field4;
        fields[4].hooks.onInit(fieldrejectionreason);

        const field5 = {
            model: {
                option: 'excel',
                model: {
                    file: 'excel.xls',
                    fileEvent: {
                        name: 'excel.xls',
                        lastModified: 1683364292659,
                        size: 103965,
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    },
                },
            },
            props: {},
        };
        fields[5]['model.file'] = field5;

        const fileField = fields.find(f => f.key === 'file');

        const mockFile = new File(['mock content'], 'mockfile.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const model: any = {};

        fileField?.props?.fileEvent(mockFile, model);

        expect(model.fileEvent).toBeDefined();
        expect(model.fileEvent).toEqual(mockFile);

        expect(service.fields).toHaveBeenCalled();
    });

    it('should update rejection reason options and call detectChanges', () => {
        const fieldMock = {
            props: {
                options: [],
            },
        };

        service.component = {
            cd: {
                detectChanges: jasmine.createSpy('detectChanges'),
            },
        };

        service.getRejectionReasons(fieldMock);

        expect(fieldMock.props.options).toEqual([
            { name: 'Reason 1' },
            { name: 'Reason 2' },
        ]);

        expect(service.component.cd.detectChanges).toHaveBeenCalled();
    });
});

describe('NewReconRequestFormService when logged in as a PAYER', () => {
    let service: NewReconRequestFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: PayerAuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(NewReconRequestFormService);
    });

    it('should test fields and observable functions', () => {
        const comp = {
            model: { option: 'dates' },
            fields: [
                {},
                {},
                {
                    props: {
                        options: [
                            {
                                name: 'DESCRIPTION',
                            },
                            {
                                name: 'Ailment/ Condition Not Covered',
                            },
                        ],
                    },
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };

        expect(service).toBeTruthy();
        service.setComponent(comp);

        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        expect(fields[1].hideExpression(comp.model)).toBeFalse();
        expect(fields[2].hideExpression(comp.model)).toBeFalse();
        expect(fields[4].hideExpression(comp.model)).toBeFalse();
        expect(fields[5].hideExpression(comp.model)).toBeTrue();

        // Change the model's option to 'excel'
        comp.model.option = 'excel';

        expect(fields[1].hideExpression(comp.model)).toBeTrue();
        expect(fields[2].hideExpression(comp.model)).toBeTrue();
        expect(fields[4].hideExpression(comp.model)).toBeTrue();
        expect(fields[5].hideExpression(comp.model)).toBeFalse();

        const field1 = {
            model: {
                start_date: '2023-08-01',
            },
            props: {},
        };
        fields[1]['model.start_date'] = field1;

        const field2 = {
            model: {
                end_date: '2023-12-01',
            },
            props: {},
        };
        fields[2]['model.end_date'] = field2;

        const field = fields[2];
        const controlInvalid = { value: '2023-07-30' };
        const fieldStartDateInvalid = {
            form: {
                get: () => ({ value: '2023-08-01' }),
            },
        };
        const isValidInvalid = field.validators.end_date.expression(
            controlInvalid,
            fieldStartDateInvalid
        );

        expect(isValidInvalid).toBeFalse();

        const controlValid = { value: '2023-08-02' };
        const fieldStartDateValid = {
            form: {
                get: () => ({ value: '2023-08-01' }),
            },
        };
        const isValidValid = field.validators.end_date.expression(
            controlValid,
            fieldStartDateValid
        );

        expect(isValidValid).toBeTrue();

        const model1 = {
            start_date: '2023-08-01',
            end_date: '2023-07-30',
        };

        const templateField = fields[3];
        expect(templateField.type).toBe('template');

        model1.end_date = '2023-07-30';
        const template =
            templateField.expressionProperties['props.template'](model1);

        expect(template).toContain(
            'End date cannot be earlier than start date (2023-08-01).'
        );

        model1.start_date = '2023-08-01';
        model1.end_date = '2024-01-30';
        const template2 =
            templateField.expressionProperties['props.template'](model1);

        expect(template2).toBe('');

        const fieldrejectionreason = {};
        field['model'] = {
            rejection_reason: 'Ailment/ Condition Not Covered',
        };

        const field4 = {
            model: {
                rejection_reason: 'DESCRIPTION',
            },
            props: {},
        };
        fields[4]['model.rejection_reason'] = field4;
        fields[4].hooks.onInit(fieldrejectionreason);

        const field5 = {
            model: {
                option: 'excel',
                model: {
                    file: 'excel.xls',
                    fileEvent: {
                        name: 'excel.xls',
                        lastModified: 1683364292659,
                        size: 103965,
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    },
                },
            },
            props: {},
        };
        fields[5]['model.file'] = field5;

        const fileField = fields.find(f => f.key === 'file');

        const mockFile = new File(['mock content'], 'mockfile.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const model: any = {};

        fileField?.props?.fileEvent(mockFile, model);

        expect(model.fileEvent).toBeDefined();
        expect(model.fileEvent).toEqual(mockFile);

        expect(service.fields).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('NewReconRequestFormService with error', () => {
    let service: NewReconRequestFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(NewReconRequestFormService);
    });

    it('should test handleErrorFxn method', () => {
        spyOn(service, 'handleErrorFxn').and.callThrough();
        service.handleErrorFxn({});
        expect(service.handleErrorFxn).toHaveBeenCalled();
    });
});
