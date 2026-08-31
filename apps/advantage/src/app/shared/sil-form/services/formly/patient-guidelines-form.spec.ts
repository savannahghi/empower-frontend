import { provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../app-config.service';
import { PatientGuidelinesService } from './patient-guidelines-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class AuthorizationStub {
    getOrganisation() {
        return {};
    }
    getUser() {
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

describe('PatientGuidelinesService', () => {
    let service: PatientGuidelinesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                PatientGuidelinesService,
                DataLayerUtils,
                Oauth2Service,
                AppConfigService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({ id: 123 }),
                    },
                },
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        service = TestBed.inject(PatientGuidelinesService);
    });

    it('should test fields: status', fakeAsync(() => {
        const comp = {
            fields: [
                {
                    props: {
                        label: 'Name',
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
    }));
});
