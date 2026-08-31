import { PatientDiagnosisFieldsService } from './add-patient-diagnosis-form';
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
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

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

describe('PatientDiagnosisFieldsService', () => {
    let service: PatientDiagnosisFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                PatientDiagnosisFieldsService,
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
        service = TestBed.inject(PatientDiagnosisFieldsService);
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
        const diagnosisField = {
            model: {
                notes: 'Pneumonia',
            },
        };
        fields[0].expressions['model.diagnosis'](diagnosisField);
        const notesField = {
            model: {
                notes: 'Cancer screening',
            },
        };
        fields[3].expressions['model.note'](notesField);
        const model2 = {
            onset_date: '2022-12-12',
            formControl: {
                pristine: false,
                touched: false,
            },
        };

        // test first branch onset_date
        const field2 = {
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
        fields[1].expressions['model.onset_date'](field2);

        // test second branch onset_date
        const field4 = {
            onset_date: '2022-12-12',
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            model: {
                onset_date: '2022-12-12',
            },
            defaultValue: undefined,
        };
        fields[1].expressions['model.onset_date'](field4);

        // test third branch onset_date
        const field5 = {
            onset_date: '2022-12-12',
            formControl: {
                pristine: true,
                markAsPristine: () => {},
                touched: true,
            },
            model: model2,
            defaultValue: undefined,
        };
        fields[1].expressions['model.onset_date'](field5);

        const severityField = {
            model: {
                severity: 'mild',
            },
        };
        fields[2].fieldGroup[0].expressions['model.severity'](severityField);

        const statusField = {
            model: {
                status: 'active',
            },
        };
        fields[2].fieldGroup[1].expressions['model.status'](statusField);
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
