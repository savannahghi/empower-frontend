import { provideHttpClientTesting } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { StateService } from '@uirouter/angular';
import { of, throwError } from 'rxjs';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { AppConfigService } from '../../../../app-config.service';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { FilterAppointmentsService } from './filter-appointments-form';
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
    getWorkstation() {
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

class NbToastrServiceStub {
    show() {
        return of(() => {});
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

describe('FilterAppointmentsService', () => {
    let service: FilterAppointmentsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                FilterAppointmentsService,
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
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                { provide: Authorization, useClass: AuthorizationStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(FilterAppointmentsService);
    });

    it('should test fields', fakeAsync(() => {
        const comp = {
            fields: [
                {
                    props: {
                        options: [
                            {
                                title: 'Booked',
                                value: 'BOOKED',
                                helpText:
                                    'The appointment is confirmed to go ahead at the date/times specified.',
                            },
                        ],
                    },
                },
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
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const field = {};
        const item = {};
        const fields = service.fields();

        fields[1].expressions['model.start'](field);

        field['model'] = {
            start: new Date(),
        };

        fields[1].expressions['model.start'](field);

        // searchFxn: schedule
        fields[2].props.searchFn('Ja');
        fields[2].props.searchFn('Jas');
        tick(2000);

        fields[2].hooks.onInit(field, item);

        spyOn(service.dataLayer, 'list').and.returnValue(
            throwError({ status: 404 })
        );
        fields[2].props.searchFn('Jas');
        tick(2000);
        expect(service.fields).toHaveBeenCalled();
    }));
});
