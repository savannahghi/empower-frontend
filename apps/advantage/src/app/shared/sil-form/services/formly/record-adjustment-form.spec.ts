import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { NbToastrService } from '@nebular/theme';
import { StateService, Transition, UIRouterGlobals } from '@uirouter/angular';
import { RecordAdjustmentFormService } from './record-adjustment-form';

class AuthorizationStub {
    getUser() {
        return {
            client_types: ['PROVIDER'],
        };
    }
    getOrganisation() {
        return {};
    }
    getErpOrganisation() {
        return {
            user_workstations: [{ workstation: '1' }],
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
    transitionTo() {
        return true;
    }
    reload() {
        return true;
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

    create() {
        return of({
            id: '4ed62h7281262h1',
        });
    }

    update() {
        return of({
            id: '12',
        });
    }
}

class SilStoresServiceStubError {
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
}

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

class TransitionStub {
    params() {
        return { id: 1 };
    }
}

class AuthenticationServiceStub {
    isAuthenticated() {
        return true;
    }
}

describe('RecordAdjustmentFormService', () => {
    let service: RecordAdjustmentFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                {
                    provide: StateService,
                    useClass: StateServiceStub,
                },
                { provide: Transition, useClass: TransitionStub },
                {
                    provide: SilStoresService,
                    useClass: SilStoresServiceStubError,
                },
                { provide: Authorization, useClass: AuthorizationStub },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceStub,
                },
                { provide: StateService, useClass: StateServiceStub },
                { provide: UIRouterGlobals },
            ],
        });
        service = TestBed.inject(RecordAdjustmentFormService);
    });

    it('should test fields', () => {
        const comp = {
            model: {},
            fields: [{}, {}, { props: {} }],
            cd: {
                detectChanges: () => {},
            },
        };

        expect(service).toBeTruthy();
        service.setComponent(comp);

        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const field0 = {
            model: {
                inventory_reference: '123',
            },
            props: {},
        };
        fields[0]['model.inventory_reference'] = field0;

        const field1 = {
            model: {
                location: 'Source 1',
            },
            props: {},
        };
        fields[1]['model.location'] = field1;
        fields[1].expressions['props.disabled'](field1);

        const field2 = {
            model: {
                reason: 'Faulty',
            },
            props: {},
        };
        fields[2]['model.reason'] = field2;

        const field3 = {
            model: {
                description: 'Description 1',
            },
            props: {},
        };
        fields[3]['model.description'] = field3;

        const field4 = {
            model: {
                description: true,
            },
        };
        fields[4]['model.bulk-upload'] = field4;
    });
});
