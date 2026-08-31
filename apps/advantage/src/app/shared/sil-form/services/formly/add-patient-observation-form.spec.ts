import { PatientObservationFieldsService } from './add-patient-observation-form';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { RouterTestingModule } from '@angular/router/testing';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { AppConfigService } from '../../../../app-config.service';
import { Pipe, PipeTransform } from '@angular/core';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

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

class SilStoresServiceStub {
    customUpdate() {
        return of({
            results: [],
        });
    }
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

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class AuthenticationServiceStub {
    checkPermission() {
        return false;
    }
}

class AuthorizationConfigStub {
    getUser() {
        const stringified = JSON.stringify({
            business_partner: 1,
            client_types: ['PROVIDER'],
        });
        return stringified;
    }
    getOrganisation() {
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

describe('PatientObservationFieldsService', () => {
    let service: PatientObservationFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                mockPipe('date'),
                PatientObservationFieldsService,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
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
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(PatientObservationFieldsService);
    });
    it('should set component and templateName in setComponent', () => {
        const mockComponent = { secondaryData: 'Test Template' };
        service.setComponent(mockComponent);
        expect(service.component).toBe(mockComponent);
        expect(service.templateName).toBe('Test Template');
    });

    it('fields() expressions should return correct model values', () => {
        service.templateName = 'Observation';
        const fields = service.fields();
        const valueField = fields[0];
        const noteField = fields[1];

        const mockFieldValue = { model: { value: 'abc' } };
        const mockFieldNote = { model: { note: 'xyz' } };

        expect(valueField.expressions['model.value'](mockFieldValue)).toBe(
            'abc'
        );
        expect(noteField.expressions['model.note'](mockFieldNote)).toBe('xyz');
    });
});
