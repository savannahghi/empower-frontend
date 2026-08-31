import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../app-config.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { FacilityServiceFormService } from './facility-service-form';
import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

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
        };
    }
}

const results = [
    {
        uuid: '3200504',
        id: '112141',
        display_name: 'Malaria',
        source: 'ICD10-WHO',
        owner: 'WHO',
    },
];

describe('FacilityServiceFieldsForm', () => {
    let service: FacilityServiceFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                FacilityServiceFormService,
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
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        service = TestBed.inject(FacilityServiceFormService);
    });

    it('should test fields', () => {
        const comp = {
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
            fields: [
                { props: {} },
                { props: {} },
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
        service.fields();
        service.tapFunction();
        service.tapFunctionLoading();
        service.catchErrorFunction();
        service.switchMapConditionFunction('malaria');
        service.switchMapConditionFunction(null);
        service.setComponent(comp);
        service.responseFunction(results);
        expect(service.fields).toHaveBeenCalled();
    });
});
