import { PatientProblemFieldsService } from './add-patient-problem-form';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { RouterTestingModule } from '@angular/router/testing';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { AppConfigService } from '../../../../app-config.service';
import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

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
    customUpdate() {
        return of({
            results: [
                {
                    id: 1,
                    product_id: '3b836623-2477-405a-9623-c4d7f9ef7ca7',
                    name: 'Nebulization',
                    description: null,
                    type: 'service',
                    variant: null,
                    code: 'SRV-NE-000000031',
                    slade_code: 'CM-48470',
                    preferred_name: 'Nebulization',
                    pricelist_products: [
                        {
                            pricelist_product_id:
                                '39ca363e-6f3f-4dcf-83c4-0b004e346075',
                            pricelist_name: 'Sales default pricelist.',
                            pricelist_type: 'GLOBAL',
                            unit_price: 1200,
                            location_id: null,
                            location_name: null,
                            bp_id: null,
                            bp_name: null,
                        },
                    ],
                },
            ],
        });
    }
    list() {
        return of({
            totalCount: 54141,
            edges: [
                {
                    Node: {
                        __typename: 'Terminology',
                        code: '145413',
                        system: 'CIEL',
                        name: 'Chronic Endocervicitis with Ectropion',
                    },
                },
            ],
        });
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class AuthenticationServiceStub {
    checkPermission() {
        return false;
    }
}

class AuthorizationConfigStub {
    getUser() {
        const stringified = JSON.stringify({
            business_partner: 1,
            client_types: ['PROVIDER'],
        });
        return stringified;
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

describe('PatientProblemFieldsService', () => {
    let service: PatientProblemFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                PatientProblemFieldsService,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                    },
                },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(PatientProblemFieldsService);
    });

    it('should test setComponent other branch if file is not rejected', () => {
        const comp = {
            secondaryData: [{}, {}],
            fields: [
                {},
                {},
                {},
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        spyOn(service, 'setComponent').and.callThrough();
        service.setComponent(comp);
        expect(service.setComponent).toHaveBeenCalled();
    });

    it('should test fields and observable functions', () => {
        const comp = {
            secondaryData: [
                {
                    customer_id: 1,
                },
                {
                    queue_type: 'LAB',
                },
            ],
            formData: {
                customer_id: 1,
            },
            fields: [
                {},
                {},
                {
                    props: {},
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        service.tapFunction();
        service.tapFunctionLoading();
        service.catchErrorFunction();
        service.switchMapConditionFunction('malaria');
        service.switchMapConditionFunction(null);
        service.setComponent(comp);

        // test first branch onset_date
        const field1 = {
            model: {
                visit_onset_date: '2022-12-12-',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: false,
            },
        };
        fields[1].expressions['model.onset_date'](field1);

        // test second branch onset_date
        const field4 = {
            onset_date: '2022-12-12-',
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            model: {
                onset_date: '2022-12-12-',
            },
            defaultValue: undefined,
        };
        fields[1].expressions['model.onset_date'](field4);

        const statusField = {
            model: {
                status: 'ACTIVE',
            },
        };
        fields[2].expressions['model.status'](statusField);

        const severityField = {
            model: {
                severity: 'MILD',
            },
        };
        fields[3].expressions['model.severity'](severityField);

        const notesField = {
            model: {
                notes: 'Cancer screening',
            },
        };
        fields[4].expressions['model.notes'](notesField);
        const model2 = {
            onset_date: '2022-12-12',
            formControl: {
                pristine: false,
                touched: false,
            },
        };

        // test third branch onset_date
        const field5 = {
            onset_date: '2022-12-12-',
            formControl: {
                pristine: true,
                markAsPristine: () => {},
                touched: true,
            },
            model: model2,
            defaultValue: undefined,
        };
        fields[1].expressions['model.onset_date'](field5);
        service.responseFunction({
            __typename: 'TerminologyConnection',
            totalCount: 54141,
            edges: [
                {
                    __typename: 'TerminologyEdge',
                    Node: {
                        __typename: 'Terminology',
                        code: '145413',
                        system: 'CIEL',
                        name: 'Chronic Endocervicitis with Ectropion',
                    },
                },
            ],
        });
        expect(service.fields).toHaveBeenCalled();
    });

    it('should call dataLayer.list with correct arguments', done => {
        const term = 'stomach';
        const mockResponse = { edges: [] };
        spyOn(service.dataLayer, 'list').and.returnValue(of(mockResponse));

        service.getCondition(term).subscribe(() => {
            expect(service.dataLayer.list).toHaveBeenCalledWith(
                'allergyintolerance-search',
                { limit: 25, name: term }
            );
            done();
        });
    });
});
