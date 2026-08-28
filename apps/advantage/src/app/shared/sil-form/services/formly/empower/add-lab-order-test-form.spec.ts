import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DataLayerUtils } from '../../../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../../app-config.service';
import { SilStoresService } from '../../../../sil-http-services/sil_datalayer.service';
import { Authorization } from '../../../../../@core/auth/services/authorization.service';
import { AddLabOrderTestService } from './add-lab-order-test-form';
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

describe('AddLabOrderTestServiceFieldsForm', () => {
    let service: AddLabOrderTestService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                AddLabOrderTestService,
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

        service = TestBed.inject(AddLabOrderTestService);
    });

    it('should create service', () => {
        expect(service).toBeTruthy();
    });

    it('should test fields method', () => {
        const comp = {
            model: {},
            fields: [{}, {}, { props: {} }],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();

        const fields = service.fields();
        expect(fields.length).toBe(3);
        expect(service.fields).toHaveBeenCalled();
    });

    it('should test field expressions', () => {
        const fields = service.fields();
        const field = {
            model: {
                attachment: 'test.pdf',
            },
        };

        const result = fields[1].expressions['model.attachment'](field);
        expect(result).toBe('test.pdf');
    });

    it('should test setComponent with valid secondaryData', () => {
        const mockComponent = {
            secondaryData: {
                selected_test: 'Test 1',
                resultList: [{ title: 'Result 1', value: 'result1' }],
            },
        };

        service.setComponent(mockComponent);

        expect(service.component).toBe(mockComponent);
        expect(service.selectedTest).toBe('Test 1');
        expect(service.resultList).toEqual([
            { title: 'Result 1', value: 'result1' },
        ]);
    });

    it('should test setComponent with undefined secondaryData', () => {
        const mockComponent = {};
        service.setComponent(mockComponent);
        expect(service.component).toBe(mockComponent);
        expect(service.selectedTest).toBeUndefined();
        expect(service.resultList).toEqual([]);
    });

    it('should test resultList in fields', () => {
        service.resultList = [
            { title: 'Test 1', value: 'test1' },
            { title: 'Test 2', value: 'test2' },
        ];

        const fields = service.fields();
        expect(fields[0].props.options).toEqual([...service.resultList]);
    });

    it('should test file handling in addFile function', () => {
        const fields = service.fields();
        const mockModel = { file: 'test-file.pdf' };

        fields[1].props.addFile(mockModel);
        expect(service.model.file).toBe('test-file.pdf');
    });

    it('should test model.file expression', () => {
        const fields = service.fields();
        service.model.file = 'test-file.pdf';

        const result = fields[1].expressions['model.file']();
        expect(result).toBe('test-file.pdf');
    });
});
