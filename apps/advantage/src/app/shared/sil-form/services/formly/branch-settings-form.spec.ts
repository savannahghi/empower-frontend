import { BranchSettingsService } from './branch-settings-form';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { AppConfigService } from '../../../../app-config.service';
import { StateService } from '@uirouter/angular';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class SilStoresServiceStub {
    list() {
        return of({
            results: [{ id: 1 }, { id: 2 }],
        });
    }
}

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
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
        return {
            client_types: ['PROVIDER'],
        };
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
        };
    }
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

describe('BranchSettingsService', () => {
    let service: BranchSettingsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                BranchSettingsService,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                    },
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(BranchSettingsService);
    });

    it('should initialize fields correctly', fakeAsync(() => {
        const comp = {
            model: {},
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
        expect(service).toBeTruthy();
        service.setComponent(comp);

        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        fields[0].expressionProperties['template']({
            description: 'Some description',
        });

        const field1 = {
            model: {
                senderid: {
                    name: 'M-TIBA',
                    sender_type: 'M-TIBA',
                },
            },
            props: {},
        };
        const field = {
            formControl: {
                pristine: true,
            },
            model: {
                value: '12',
            },
        };
        const field2 = {
            formControl: {
                pristine: true,
            },
            model: {
                value: [12],
            },
        };
        fields[1]['model.senderid'] = field1;
        fields[4].expressions['model.value'](field);
        fields[4].expressions['model.value'](field2);
    }));
});
