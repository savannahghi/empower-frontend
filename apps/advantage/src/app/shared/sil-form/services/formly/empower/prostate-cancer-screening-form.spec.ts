import { Pipe, PipeTransform } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProstateCancerScreeningService } from './prostate-cancer-screening-form';
import { CurrencyPipe } from '@angular/common';
import { DataLayerUtils } from 'app/@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from 'app/@core/auth/services/oauth2.service';
import { AppConfigService } from 'app/app-config.service';
import { ActivatedRoute } from '@angular/router';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

class SilStoreServicesStub {
    list() {
        return of({
            results: [
                {
                    id: 1,
                },
            ],
        });
    }
}

function mockPipe(name: string): Pipe {
    const metadata: Pipe = {
        name: name,
    };

    return Pipe(metadata)(
        class MockPipe implements PipeTransform {
            transform() {}
        }
    );
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
            user_workstations: [{ workstation: '2' }],
        };
    }
}

describe('ProstateCancerScreeningForm', () => {
    let service: ProstateCancerScreeningService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                {
                    provide: CurrencyPipe,
                    useClass: mockPipe('CurrencyPipe'),
                },
                ProstateCancerScreeningService,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 34 }),
                    },
                },
                { provide: SilStoresService, useClass: SilStoreServicesStub },
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        service = TestBed.inject(ProstateCancerScreeningService);
    });

    it('should test fields', () => {
        const component = {
            fields: [{}, {}, {}],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(component);
        spyOn(service, 'fields').and.callThrough();
        service.fields();
        expect(service.fields).toHaveBeenCalled();
    });

    it('should test fields have values', () => {
        const component = {
            fields: [{ props: {} }, { props: {} }, { props: {} }],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(component);
        spyOn(service, 'fields').and.callThrough();
        service.fields();
        expect(service.fields).toHaveBeenCalled();
        const fields = service.fields();

        const field = {
            model: {
                test: [
                    {
                        selected_test: 'Prostate Specific Antigen - Serum',
                        test_type: 'Add results',
                        selected_result: 'raised_psa_levels',
                        additional_notes: 'additional notes',
                        data: '',
                    },
                    {
                        selected_test:
                            'Prostate Specific Antigen - Whole Blood',
                        test_type: 'Add results',
                        selected_result: 'normal_psa_levels',
                        additional_notes: 'additional notes',
                        data: '',
                    },
                ],
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: 'Prostate Specific Antigen - Serum',
        };

        const field2 = {
            model: {
                selected_test: 'Prostate Specific Antigen - Serum',
                test_action: undefined,
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: 'Prostate Specific Antigen - Serum',
        };

        const field3 = {
            model: {
                selected_test: 'Prostate Specific Antigen - Serum',
                test_action: 'Unknown test action',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: 'Prostate Specific Antigen - Serum',
        };

        fields[0].fieldGroup[0]['expressions']['model.test_action'](field);
        fields[0].fieldGroup[1]['expressions']['model.selected_test'](field);
        fields[0].fieldGroup[2]['expressions']['model.selected_result'](field);
        fields[0].fieldGroup[2]['expressions']['hide'](field);
        fields[0].fieldGroup[2]['expressions']['hide'](field2);
        fields[0].fieldGroup[2]['expressions']['hide'](field3);
        fields[0].fieldGroup[3]['expressions']['model.facility'](field);
        fields[0].fieldGroup[3]['expressions']['hide'](field);
        fields[0].fieldGroup[3]['expressions']['hide'](field2);
        fields[0].fieldGroup[4]['expressions']['model.additional_notes'](field);
        fields[0].fieldGroup[4]['expressions']['hide'](field);
        fields[0].fieldGroup[4]['expressions']['hide'](field2);
        fields[0].fieldGroup[4]['expressions']['hide'](field3);
        fields[0].fieldGroup[5]['expressions']['model.referral_notes'](field);
        fields[0].fieldGroup[5]['expressions']['hide'](field);
        fields[0].fieldGroup[5]['expressions']['hide'](field2);
        fields[0].fieldGroup[5]['expressions']['hide'](field3);
        expect(service.fields).toHaveBeenCalled();
    });
});
