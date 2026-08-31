import { provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../app-config.service';
import { UnlinkProfileService } from './unlink-profile-form';
import { SigningUpService } from './sign-up-form';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
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

describe('SignUpForm', () => {
    let service: SigningUpService;

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

        service = TestBed.inject(SigningUpService);
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
        expect(service.fields).toHaveBeenCalled();

        // searchFxn: schedule
        tick(2000);

        service.switchMapFacilityTypesFunction();
        service.tapFunction();
        service.responseFunction({ results: [] });
        service.tapLoading();
        service.catchErrorFunction();
        expect(service.fields).toHaveBeenCalled();
    }));

    it('should add input to the fields', fakeAsync(() => {
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
        const fields = service.fields();

        const field = {
            model: {
                facility_name: 'Savannah',
                email_address: 'savannah@test.com',
                first_name: 'john',
                last_name: 'doe',
                phone_number: '+25472000000',
                password: '@test',
                confirm_password: '@test',
                terms: true,
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

        fields[0].fieldGroup[0]['expressions']['model.facility_name'](field);
        fields[0].fieldGroup[1]['expressions']['model.facility_type'](field);

        fields[1].fieldGroup[0]['expressions']['model.email_address'](field);
        fields[1].fieldGroup[1]['expressions']['model.phone_number'](field);

        fields[2].fieldGroup[0]['expressions']['model.first_name'](field);
        fields[2].fieldGroup[1]['expressions']['model.last_name'](field);

        fields[3].fieldGroup[0]['expressions']['model.password'](field);
        fields[3].fieldGroup[1]['expressions']['model.confirm_password'](field);

        fields[4].expressions['model.terms'](field);

        service.switchMapFacilityTypesFunction();
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
    let service: SigningUpService;

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

        service = TestBed.inject(SigningUpService);
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
        expect(service.fields).toHaveBeenCalled();

        /**
         * switchMapFunction
         */
        service.switchMapFacilityTypesFunction();
        service.tapFunction();
        service.responseFunction({ results: [] });
        service.tapLoading();
        service.catchErrorFunction();
        expect(service.fields).toHaveBeenCalled();
    }));
});
