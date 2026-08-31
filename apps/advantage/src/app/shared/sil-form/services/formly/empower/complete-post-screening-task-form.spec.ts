import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CompletePostScreeningFieldsService } from './complete-post-screening-task-form';
import { DataLayerUtils } from '../../../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../../app-config.service';
import { SilStoresService } from '../../../../sil-http-services/sil_datalayer.service';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
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

class AuthorizationStub {
    getOrganisation() {
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

describe('CompletePostScreeningFieldsForm', () => {
    let service: CompletePostScreeningFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                CompletePostScreeningFieldsService,
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

        service = TestBed.inject(CompletePostScreeningFieldsService);
    });

    it('should test fields', () => {
        const comp = {
            model: {
                returned_results_task: 'Patient returned with test results',
                other_reason: 'test',
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
        service.fields();

        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        const field = {
            model: {
                returned_results_task: 'Patient returned with test results',
                other_reason: 'test',
            },
            parent: {
                key: '0',
            },
            props: {},
            defaultValue: undefined,
        };
        fields[0]['expressions']['model.returned_results_task'](field);
        fields[1]['expressions']['model.other_reason'](field);

        expect(service.fields).toHaveBeenCalled();
    });
});
