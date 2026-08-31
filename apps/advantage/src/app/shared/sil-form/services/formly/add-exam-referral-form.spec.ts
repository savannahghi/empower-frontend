import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../app-config.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AddExamReferralFormService } from './add-exam-referral-form';
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

describe('AddExamReferralFormServiceFieldsForm', () => {
    let service: AddExamReferralFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                AddExamReferralFormService,
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

        service = TestBed.inject(AddExamReferralFormService);
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
            fields: [{ props: {} }, { props: {} }, { props: {} }],
            cd: {
                detectChanges: () => {},
            },
        };
        const fields = service.fields();

        const referralTypeField = {
            model: {
                referral_type: 'OUTBOUND',
            },
            props: {
                model: null,
            },
        };
        fields[1]['expressions']['model.referral_type'](referralTypeField);

        const facilityField = {
            model: {
                facility: {
                    id: '123',
                    organisation_name: 'Test Hospital',
                    phone_number: '1234567890',
                    email_address: 'test@hospital.com',
                    postal_address: 'P.O Box 123',
                    physical_address: '123 Test Street',
                    org_units: [{ id: '123' }],
                },
            },
        };
        fields[2]['expressions']['model.facility'](facilityField);
        fields[2]['expressions']['hide'](facilityField);

        const priorityField = {
            model: {
                priority: 'URGENT',
            },
            props: {
                model: null,
            },
        };
        fields[3]['expressions']['model.priority'](priorityField);

        const descriptionField = {
            model: {
                description: 'Test description',
            },
        };
        fields[4]['expressions']['model.description'](descriptionField);

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
