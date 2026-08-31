import { TestBed } from '@angular/core/testing';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AddPatientGeneralExamService } from './add-patient-exam-form';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
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

describe('AddPatientGeneralExamService', () => {
    let service: AddPatientGeneralExamService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                AddPatientGeneralExamService,
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(AddPatientGeneralExamService);
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
        service.fields();

        expect(service.fields).toHaveBeenCalled();
    });
});
