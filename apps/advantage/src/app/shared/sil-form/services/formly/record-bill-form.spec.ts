import { TestBed } from '@angular/core/testing';
import { RecordBillFormFieldsService } from './record-bill-form';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { SilStoresService } from '../../../../shared/sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AsyncValidatorService } from '../../../../shared/component-services/async-validator.service';
import moment from 'moment';

class SilStoresServiceStub {
    list() {
        return of({
            results: [{ id: 1 }],
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
    getUser() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
            organisation_id: '123',
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
}

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
    }
}

class AuthenticationServiceStub {
    checkSetting(string) {
        return string === 'string';
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

class AsyncValidatorServiceStub {
    validateUniquenessEditMode() {
        return of({});
    }
}

describe('RecordBillFormFieldsService', () => {
    let service: RecordBillFormFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                RecordBillFormFieldsService,
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: AsyncValidatorService,
                    useClass: AsyncValidatorServiceStub,
                },
            ],
        });
        service = TestBed.inject(RecordBillFormFieldsService);
    });

    it('should create service', () => {
        expect(service).toBeTruthy();
    });

    it('should set component and organisationID correctly', () => {
        const componentMock = { model: {} };
        service.setComponent(componentMock);
        expect(service.component).toEqual(componentMock);
        expect(service.organisationID).toBe('123');
    });

    it('should return formly fields', () => {
        const fields = service.fields();
        expect(fields).toBeTruthy();
        expect(fields.length).toBeGreaterThan(0);
    });

    it('should contain supplier field', () => {
        const fields = service.fields();
        const supplierField = fields.find(field => field.key === 'supplier');
        expect(supplierField).toBeTruthy();
        expect(supplierField.props.label).toBe('Supplier');
        expect(supplierField.props.required).toBeTrue();
    });

    it('should contain reference_number field', () => {
        const fields = service.fields();
        const referenceNumberField = fields.find(
            field => field.key === 'reference_number'
        );
        expect(referenceNumberField).toBeTruthy();
        expect(referenceNumberField.props.label).toBe('Reference Number');
        expect(referenceNumberField.props.required).toBeTrue();
    });

    it('should contain bill_date field with correct format', () => {
        const fields = service.fields();
        const billDateField = fields.find(field => field.key === 'bill_date');
        expect(billDateField).toBeTruthy();
        expect(billDateField.props.dateFormat).toBe('DD-MM-YYYY');
        expect(moment().isSameOrAfter(billDateField.props.max)).toBeTrue();
    });

    it('should contain due_date field with correct format', () => {
        const fields = service.fields();
        const dueDateField = fields.find(field => field.key === 'due_date');
        expect(dueDateField).toBeTruthy();
        expect(dueDateField.props.dateFormat).toBe('DD-MM-YYYY');
    });
});
