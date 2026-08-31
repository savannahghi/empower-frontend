import { OperatingRegionsService } from './add-operating-regions-form';
import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../app-config.service';
import { StateService } from '@uirouter/angular';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

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

describe('OperatingRegionsService', () => {
    let service: OperatingRegionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                OperatingRegionsService,
                Oauth2Service,
                AppConfigService,
                { provide: StateService, useClass: StateServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(OperatingRegionsService);
        service.countiesList = [
            {
                name: 'Baringo',
                capital: 'Kabarnet',
                code: 30,
                sub_counties: [
                    'Baringo central',
                    'Baringo north',
                    'Baringo south',
                    'Eldama ravine',
                    'Mogotio',
                    'Tiaty',
                ],
            },
        ];
    });

    it('should initialize fields correctly', fakeAsync(() => {
        const comp = {
            model: {},
            fields: [
                {},
                {},
                {
                    props: {
                        options: [],
                    },
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

        fields[0].hooks.onChanges({});

        class MockGetter {
            get() {
                return {
                    formControl: new FormControl(),
                };
            }
        }
        const mockGetterInstance = new MockGetter();
        const mockField = {
            key: 'county',
            props: {},
            id: '12',
            form: {},
            formControl: new FormControl('county'),
            parent: {
                get: mockGetterInstance.get,
            },
        };
        service.updateSubCounties(mockField);
        const modelSubcounty = 'Nairobi';

        fields[1].expressions['props.disable']({});
        service.getSubCounties(modelSubcounty);
        expect(service.fields).toHaveBeenCalled();
    }));

    it('should test updateSubCounties method with subCounty field', fakeAsync(() => {
        const comp = {
            model: {},
            fields: [
                {},
                {},
                {
                    props: {
                        options: [],
                    },
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

        const mockFormControl = {
            valueChanges: new Subject<any>(),
            value: 'Bomet',
        };

        class MockGetter {
            get() {
                return {
                    props: { options: [] },
                    formControl: {
                        ...mockFormControl,
                        setValue: jasmine.createSpy('setValue'),
                    },
                };
            }
        }
        const mockGetterInstance = new MockGetter();
        const mockField = {
            key: 'county',
            props: {},
            id: '12',
            form: {},
            formControl: new FormControl('county'),
            parent: {
                get: mockGetterInstance.get,
            },
            valueChanges: new Subject<any>(),
            value: 'Bomet',
        };
        mockField.valueChanges.next('testCounty');
        service.updateSubCounties(mockField);

        fields[1].expressions['props.disable']({});
        expect(service.fields).toHaveBeenCalled();
        flush();
    }));
});
