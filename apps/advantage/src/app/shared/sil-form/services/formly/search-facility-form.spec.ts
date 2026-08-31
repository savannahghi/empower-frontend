import { provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../app-config.service';
import { UnlinkProfileService } from './unlink-profile-form';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { SearchFacilityService } from './search-facility-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: '1',
                    name: 'Test 1',
                },
                {
                    id: '2',
                    name: 'Test 2',
                },
                {
                    id: '3',
                    name: 'Test 3',
                },
            ],
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
        };
    }
}

describe('SearchFacilityForm', () => {
    let service: SearchFacilityService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                UnlinkProfileService,
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

        service = TestBed.inject(SearchFacilityService);
    });

    it('should test field: facility search', fakeAsync(() => {
        const comp = {
            fields: [
                {
                    props: {
                        label: 'Facility Search',
                        required: true,
                    },
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        service.fields();
        expect(service.fields).toHaveBeenCalled();

        // searchFxn: schedule
        tick(2000);

        service.switchMapBusinessPartnerFunction('Savannah');
        service.switchMapAvailableCountriesFunction();
        service.tapFunction();
        service.responseFunction({ results: [] });
        service.tapLoading();
        service.catchErrorFunction();
    }));

    it('should test field: country name', fakeAsync(() => {
        const comp = {
            model: {
                country_name: 'KENYA',
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

        const field = {
            model: {
                county_name: 'KENYA',
                provider: {
                    name: 'Savannah',
                },
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: undefined,
        };
        tick(2000);
        fields[0].fieldGroup[0]['expressions']['model.country'](field);
        tick(2000);
        service.switchMapBusinessPartnerFunction('Savannah');
        service.switchMapAvailableCountriesFunction();
        service.tapFunction();
        service.responseFunction({ results: [] });
        service.tapLoading();
        service.catchErrorFunction();
        expect(service.fields).toHaveBeenCalled();
    }));
});

class SilStoresServiceStubError {
    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('SignUpForm: error', () => {
    let service: SearchFacilityService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                UnlinkProfileService,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                    },
                },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        service = TestBed.inject(SearchFacilityService);
    });

    it('should test field: facility name', fakeAsync(() => {
        const comp = {
            fields: [
                {
                    props: {
                        label: 'Facility Name',
                        required: true,
                    },
                },
            ],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        service.fields();

        /**
         * switchMapFunction
         */
        service.switchMapBusinessPartnerFunction(undefined);
        service.switchMapAvailableCountriesFunction();
        service.tapFunction();
        service.responseFunction({ results: [] });
        service.tapLoading();
        service.catchErrorFunction();
        expect(service.fields).toHaveBeenCalled();
    }));
});
