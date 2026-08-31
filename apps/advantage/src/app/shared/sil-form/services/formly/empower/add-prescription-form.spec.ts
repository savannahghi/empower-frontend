import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../../app-config.service';
import { SilStoresService } from '../../../../sil-http-services/sil_datalayer.service';
import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import { CurrencyPipe } from '@angular/common';
import { AddPrescriptionService } from './add-prescription-form';
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

describe('AddPrescriptionService', () => {
    let service: AddPrescriptionService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                AddPrescriptionService,
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

        service = TestBed.inject(AddPrescriptionService);
    });

    it('should test fields', () => {
        const comp = {
            fields: [{}, {}, {}],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        service.fields();
        expect(service.fields).toHaveBeenCalled();
    });

    it('should test fields and have values', () => {
        const response = {
            results: [
                {
                    id: '112141',
                    name: 'Paracetamol',
                    preferred_name: 'Paracetamol',
                    code: '343421w',
                    product_type: 'product',
                },
            ],
        };
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
        service.fields();
        service.getProducts();
        service.tapFunction();
        service.tapLoading();
        service.switchMapProductFunction('Paracetamol');
        service.catchErrorFunction();
        service.setComponent(comp);
        service.productsResponseFunction(response);
        expect(service.fields).toHaveBeenCalled();
        const fields = service.fields();

        const field = {
            model: {
                medication: 'Amoxicillin',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: '',
        };

        fields[0]['expressions']['model.medication'](field);
        fields[2]['expressions']['model.dose_unit'](field);
        fields[4]['expressions']['model.period_unit'](field);
        fields[6]['expressions']['model.duration_unit'](field);
        fields[7]['expressions']['model.calculated'](field);
        const fieldNoDoseQty = {
            model: {
                dose_quantity: '1',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: '',
        };
        fields[7]['expressions']['model.calculated'](fieldNoDoseQty);
        const fieldWithValues = {
            model: {
                medication: 'Amoxicillin',
                duration: 1,
                period_unit: 'h',
                dose_quantity: 1,
            },
        };
        fields[7]['expressions']['model.calculated'](fieldWithValues);
        fields[9]['expressions']['model.end_date'](field);
        const fieldWithHourValues = {
            model: {
                medication: 'Amoxicillin',
                duration: 1,
                duration_unit: 'd',
                start_date: moment(),
                dose_quantity: 1,
            },
        };
        fields[9]['expressions']['model.end_date'](fieldWithHourValues);
        fields[10]['expressions']['model.condition'](field);
        fields[11]['expressions']['model.patient_instruction'](field);
        expect(service.fields).toHaveBeenCalled();
    });
});
