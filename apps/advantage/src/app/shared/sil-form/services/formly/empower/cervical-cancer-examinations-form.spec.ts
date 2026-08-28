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
import { CurrencyPipe } from '@angular/common';
import { CervicalCancerExaminationsService } from './cervical-cancer-examinations-form';
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

describe('CervicalCancerExaminationsServiceForm', () => {
    let service: CervicalCancerExaminationsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: CurrencyPipe, useClass: mockPipe('currencyPipe') },
                CervicalCancerExaminationsService,
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

        service = TestBed.inject(CervicalCancerExaminationsService);
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
        expect(service.fields).toHaveBeenCalled();
        const fields = service.fields();

        const field = {
            model: {
                selected_test: 'VIA',
                selected_result: 'Negative',
                additional_notes: 'N/A',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: 'VIA',
        };

        fields[0].fieldGroup[0]['expressions']['model.screening_type'](field);
        fields[0].fieldGroup[1]['expressions']['model.selected_test'](field);
        fields[0].fieldGroup[2]['expressions']['model.selected_result'](field);
        fields[0].fieldGroup[3]['expressions']['model.additional_notes'](field);

        expect(service.fields).toHaveBeenCalled();
    });

    it('should test fields if test is VIA', () => {
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
        expect(service.fields).toHaveBeenCalled();
        const fields = service.fields();

        const field = {
            model: {
                selected_test: 'VIA',
                selected_result: 'Negative',
                additional_notes: 'N/A',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: 'VIA',
        };

        fields[0].fieldGroup[1]['expressions']['model.selected_test'](field);

        fields[0].fieldGroup[2]['expressions']['hide'](field);
        fields[0].fieldGroup[3]['expressions']['hide'](field);
        expect(service.fields).toHaveBeenCalled();
    });

    it('should test fields if test is VIA/VILI', () => {
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
        expect(service.fields).toHaveBeenCalled();
        const fields = service.fields();

        const field = {
            model: {
                selected_test: 'VIA/VILI',
                selected_result: 'Negative',
                additional_notes: 'N/A',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            defaultValue: 'VIA',
        };

        fields[0].fieldGroup[1]['expressions']['model.selected_test'](field);

        fields[0].fieldGroup[2]['expressions']['hide'](field);
        fields[0].fieldGroup[3]['expressions']['hide'](field);

        expect(service.fields).toHaveBeenCalled();
    });
});
