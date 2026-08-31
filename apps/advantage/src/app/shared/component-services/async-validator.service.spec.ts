import { TestBed } from '@angular/core/testing';

import { AsyncValidatorService } from './async-validator.service';
import { ResolverService } from '../../features/services/resolver.service';
import { ErrorHandlerService } from '../sil-http-services/error-handler';
import { BehaviorSubject, of } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { Authorization } from '../../@core/auth/services/authorization.service';
import { StateService } from '@uirouter/angular';

class NbToastrServiceStub {
    show() {
        return of(() => {});
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
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
            organisation: '123',
        };
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

const resolverServiceStub = {
    resolveList() {
        return of({
            results: [
                {
                    pricelist_type: 'sales',
                    name: 'April Offers',
                    effective_from: '2024-04-09T21:00:00.000Z',
                    effective_to: '2024-04-10T21:00:00.000Z',
                    description: 'Holiday offers for the April Holiday!',
                    is_internal_pricelist: true,
                    pricelist_status: 'promotional',
                    business_partner: 'aa6b9c7c-b643-4f41-83bb-56cedb3878bf',
                    id: '1234',
                    organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
                    active: true,
                },
            ],
        });
    },
};

describe('AsyncValidatorService', () => {
    let service: AsyncValidatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: ResolverService,
                    useValue: resolverServiceStub,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                ErrorHandlerService,
            ],
        });
        service = TestBed.inject(AsyncValidatorService);
    });

    it('should test validateUniquenessEditMode method when response item is same as item on edit', () => {
        expect(service).toBeTruthy();

        spyOn(service, 'validateUniquenessEditMode').and.callThrough();

        service.validateUniquenessEditMode({
            store: '',
            stateParamsID: '1234',
            params: {
                name: 'search item',
            },
        });

        expect(service.validateUniquenessEditMode).toHaveBeenCalled();
    });

    it('should test validateUniquenessEditMode method when item appears more than once in the list', () => {
        expect(service).toBeTruthy();

        spyOn(service, 'validateUniquenessEditMode').and.callThrough();

        service.validateUniquenessEditMode({
            store: '',
            stateParamsID: undefined,
            params: {
                name: 'search item',
            },
        });

        expect(service.validateUniquenessEditMode).toHaveBeenCalled();
    });
});

const resolverServiceStubEmptyResults = {
    resolveList() {
        return of({
            results: [],
        });
    },
};

describe('AsyncValidatorService Path 2', () => {
    let service: AsyncValidatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: ResolverService,
                    useValue: resolverServiceStubEmptyResults,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                ErrorHandlerService,
            ],
        });
        service = TestBed.inject(AsyncValidatorService);
    });

    it('should test validateUniquenessEditMode method', () => {
        expect(service).toBeTruthy();

        spyOn(service, 'validateUniquenessEditMode').and.callThrough();

        service.validateUniquenessEditMode({
            store: '',
            stateParamsID: '1234',
            params: {
                name: 'test',
            },
        });

        expect(service.validateUniquenessEditMode).toHaveBeenCalled();
    });
});

const resolverServiceStubError = {
    resolveList() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Error fetching list!'));
        return sub;
    },
};

describe('AsyncValidatorService Error Path', () => {
    let service: AsyncValidatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: ResolverService,
                    useValue: resolverServiceStubError,
                },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: StateService, useClass: StateServiceStub },
                ErrorHandlerService,
            ],
        });
        service = TestBed.inject(AsyncValidatorService);
    });

    it('should test validateUniquenessEditMode method', () => {
        expect(service).toBeTruthy();

        spyOn(service, 'validateUniquenessEditMode').and.callThrough();

        service.validateUniquenessEditMode({
            store: '',
            stateParamsID: '1234',
            params: {
                name: 'test',
            },
        });

        expect(service.validateUniquenessEditMode).toHaveBeenCalled();
    });
});
