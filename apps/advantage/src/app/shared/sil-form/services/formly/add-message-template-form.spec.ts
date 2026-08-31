import { TestBed } from '@angular/core/testing';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { AddMessageTemplateService } from './add-message-template-form';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class AuthorizationConfigStub {
    getUser() {
        return {};
    }
}

class AuthenticationServiceStub {
    checkPermission() {
        return false;
    }
}

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

describe('AddMessageTemplateService', () => {
    let service: AddMessageTemplateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                AddMessageTemplateService,
                { provide: Authorization, useClass: AuthorizationConfigStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(AddMessageTemplateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set the component', () => {
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

    it('should return the correct fields', () => {
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const fieldName = {
            model: {
                name: 'First N',
            },
        };
        fields[0].fieldGroup[0].expressions['model.name'](fieldName);

        const msgType = {
            model: {
                message_type: 'SINGULAR',
            },
        };

        fields[0].fieldGroup[1].expressions['model.message_type'](msgType);

        expect(service.fields).toHaveBeenCalled();
    });
});
