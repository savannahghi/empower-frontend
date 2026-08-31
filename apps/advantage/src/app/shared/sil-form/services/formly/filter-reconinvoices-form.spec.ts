import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FilterReconinvoicesService } from './filter-reconinvoices-form';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { BehaviorSubject, of } from 'rxjs';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { NbToastrService } from '@nebular/theme';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import moment from 'moment';

const uIRouterGlobalsStub = {
    params: {
        id: '112',
        workflow_state: '',
    },
};

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
        return {};
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

interface IField {
    key?: string;
    type?: string;
    className?: string;
    props?: any;
    hideExpression?: (model: any) => void;
}

describe('FilterReconinvoicesService', () => {
    let service: FilterReconinvoicesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(FilterReconinvoicesService);
    });

    it('should test fields', () => {
        const comp = {
            model: { amount_option: '' },
            fields: [
                {},
                {},
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
                {},
                {},
                {},
                {},
                {},
                {},
            ],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields() as IField;

        const field = {};
        field['model'] = {
            rejection_reason: 'Ailment/ Condition Not Covered',
        };

        const field1 = {
            model: {
                end_date: '2024-11-30',
            },
            props: {},
        };
        fields[1]['model.end_date'] = field1;

        const fieldWithStartDate = {
            model: {
                start_date: '2024-06-01',
            },
            props: {},
        };

        const minDate = fields[1].expressions['props.min'](fieldWithStartDate);
        expect(minDate.format('YYYY-MM-DD')).toBe('2024-06-01');

        const fieldWithoutStartDate = { model: {} };
        const minDateFallback = fields[1].expressions['props.min'](
            fieldWithoutStartDate
        );
        expect(minDateFallback.format('YYYY-MM-DD')).toBe(
            moment().add(1, 'days').format('YYYY-MM-DD')
        );

        const templateField = fields[2];
        expect(templateField.type).toBe('template');

        const model1 = {
            start_date: '2024-06-01',
            end_date: '2024-05-01',
        };

        const model2 = {
            start_date: '2024-05-01',
            end_date: '2024-06-01',
        };

        const template1 =
            templateField.expressionProperties['props.template'](model1);
        const template2 =
            templateField.expressionProperties['props.template'](model2);

        expect(template1).toContain('End date must be after start date');
        expect(template2).toBe('');

        const field5 = {
            model: {
                rejection_reason: 'DESCRIPTION',
            },
            props: {},
        };
        fields[5]['model.rejection_reason'] = field5;
        fields[5].hooks.onInit(field);

        comp.model.amount_option = 'exact';

        const field9 = {
            model: {
                unpaid_amount: {},
            },
            props: {},
            hideExpression: jasmine.createSpy(),
        };

        fields[9]['model.unpaid_amount'] = field9;
        comp.model.amount_option = 'exact';

        expect(fields[9].hideExpression(comp.model)).toBeFalse();
        expect(fields[10].hideExpression(comp.model)).toBeTrue();
        expect(fields[11].hideExpression(comp.model)).toBeTrue();

        comp.model.amount_option = 'greater';
        expect(fields[9].hideExpression(comp.model)).toBeTrue();
        expect(fields[10].hideExpression(comp.model)).toBeFalse();
        expect(fields[11].hideExpression(comp.model)).toBeTrue();

        comp.model.amount_option = 'less';
        expect(fields[9].hideExpression(comp.model)).toBeTrue();
        expect(fields[10].hideExpression(comp.model)).toBeTrue();
        expect(fields[11].hideExpression(comp.model)).toBeFalse();

        expect(service.fields).toBeDefined();
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

describe('FilterReconinvoicesService when logged in as a PAYER', () => {
    let service: FilterReconinvoicesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: PayerAuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(FilterReconinvoicesService);
    });

    it('should test fields', () => {
        const comp = {
            model: { amount_option: '' },
            fields: [
                {},
                {},
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
                {},
                {},
                {},
                {},
                {},
                {},
            ],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const field = {};
        field['model'] = {
            rejection_reason: 'Ailment/ Condition Not Covered',
        };

        const field5 = {
            model: {
                rejection_reason: 'DESCRIPTION',
            },
            props: {},
        };
        fields[5]['model.rejection_reason'] = field5;
        fields[5].hooks.onInit(field);

        expect(service.fields).toBeDefined();
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

describe('FilterReconinvoicesService with error', () => {
    let service: FilterReconinvoicesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(FilterReconinvoicesService);
    });

    it('should test handleErrorFxn method', () => {
        spyOn(service, 'handleErrorFxn').and.callThrough();
        service.handleErrorFxn({});
        expect(service.handleErrorFxn).toHaveBeenCalled();
    });
});
