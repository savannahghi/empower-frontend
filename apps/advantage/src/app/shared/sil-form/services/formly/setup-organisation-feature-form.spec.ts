import { TestBed } from '@angular/core/testing';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/angular';
import { Authorization } from 'app/@core/auth/services/authorization.service';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { BehaviorSubject, of } from 'rxjs';
import { SetupOrganisationFeatureFormService } from './setup-organisation-feature-form';

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    id: 'f76b314b-35a6-4ee8-bdd8-90081f33deed',
                    created: '2025-07-28T11:15:35.136873+03:00',
                    updated: '2025-07-28T11:15:35.136887+03:00',
                    created_by: '15975a2e-b1fe-4fa9-98fd-9e09dbf2b157',
                    updated_by: '15975a2e-b1fe-4fa9-98fd-9e09dbf2b157',
                    name: 'RECON',
                    active: true,
                    date_activated: '2025-07-28T11:15:35.136641+03:00',
                    date_deactivated: null,
                    organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
                },
            ],
        });
    }
    get() {
        return of({
            id: 1,
        });
    }
}

class AuthorizationStub {
    getOrganisation() {
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

const uIRouterGlobalsStub = {
    params() {
        return { id: 1 };
    },
};

class NbToastrServiceStub {
    show() {
        return {};
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

describe('SetupOrganisationFeatureFormService', () => {
    let service: SetupOrganisationFeatureFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                SetupOrganisationFeatureFormService,
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
        });
        service = TestBed.inject(SetupOrganisationFeatureFormService);
    });

    it('should test fields', () => {
        const comp = {
            fields: [{}, {}, { props: {} }],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const field0 = {
            model: {
                feature: '',
            },
            props: {},
        };
        fields[0]['model.feature'] = field0;

        const featureField = fields.find(f => f.key === 'feature');

        const validControl = { value: 'BIOMETRICS' };
        const invalidControl = { value: 'RECON' };

        service.existingFeatures = [
            {
                id: 'f76b314b-35a6-4ee8-bdd8-90081f33deed',
                created: '2025-07-28T11:15:35.136873+03:00',
                updated: '2025-07-28T11:15:35.136887+03:00',
                created_by: '15975a2e-b1fe-4fa9-98fd-9e09dbf2b157',
                updated_by: '15975a2e-b1fe-4fa9-98fd-9e09dbf2b157',
                name: 'RECON',
                active: true,
                date_activated: '2025-07-28T11:15:35.136641+03:00',
                date_deactivated: null,
                organisation: '18d2cb54-b4dd-4b2c-baad-13df951bfed9',
            },
        ];

        const validator = featureField?.validators?.notDuplicate?.expression;

        expect(validator(validControl)).toBeTrue();
        expect(validator(invalidControl)).toBeFalse();

        fields[0].hooks.onInit();

        const templateField = fields[1];
        expect(templateField.type).toBe('template');

        const model1 = {
            feature: 'RECON',
        };
        const template =
            templateField.expressionProperties['props.template'](model1);
        expect(template).toContain('This feature has already been added');

        const model2 = {
            feature: 'BIOMETRICS',
        };
        const template1 =
            templateField.expressionProperties['props.template'](model2);
        expect(template1).toBe('');

        expect(service.fields).toHaveBeenCalled();
    });

    it('should test the getOrganisationFeatures method', () => {
        spyOn(service, 'getOrganisationFeatures').and.callThrough();
        service.getOrganisationFeatures();
        expect(service.getOrganisationFeatures).toHaveBeenCalled();
    });
});

class SilStoresServiceStubWithNoFeatureStub {
    list() {
        return of([]);
    }
}

describe('SetupOrganisationFeatureFormService when existingFeatures is empty', () => {
    let service: SetupOrganisationFeatureFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                SetupOrganisationFeatureFormService,
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubWithNoFeatureStub,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
        });
        service = TestBed.inject(SetupOrganisationFeatureFormService);
    });

    it('should return empty template when existingFeatures is an empty array', () => {
        const comp = {
            fields: [{}, {}, { props: {} }],
            cd: {
                detectChanges: () => {},
            },
        };

        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const featureField = fields.find(f => f.key === 'feature');

        const validControl = { value: 'BIOMETRICS' };

        service.existingFeatures = [];

        const validator = featureField?.validators?.notDuplicate?.expression;

        expect(validator(validControl)).toBeTrue();

        fields[0].hooks.onInit();

        const templateField = fields[1];
        expect(templateField.type).toBe('template');

        const model1 = {
            feature: 'BIOMETRICS',
        };
        const template =
            templateField.expressionProperties['props.template'](model1);
        expect(template).toBe('');

        expect(service.fields).toHaveBeenCalled();
    });
});

class SilStoresServiceStubError {
    get() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    list() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    create() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    update() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    createNested() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }

    listNested() {
        const sub = new BehaviorSubject('');
        sub.error(new Error('Boom'));
        return sub;
    }
}

describe('SetupOrganisationFeatureFormService with error', () => {
    let service: SetupOrganisationFeatureFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                SetupOrganisationFeatureFormService,
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: StateService, useClass: StateServiceStub },
            ],
        });
        service = TestBed.inject(SetupOrganisationFeatureFormService);
    });

    it('should test handleErrorFxn method', () => {
        spyOn(service, 'handleErrorFxn').and.callThrough();
        service.handleErrorFxn({});

        expect(service.handleErrorFxn).toHaveBeenCalled();
    });
});
