import { PatientAttachmentFieldsService } from './add-attachment-form';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NbToastrService, NbStatusService } from '@nebular/theme';
import { RouterTestingModule } from '@angular/router/testing';
import { Authorization } from '../../../../@core/auth/services/authorization.service';
import { Oauth2Service } from '../../../../@core/auth/services/oauth2.service';
import { DataLayerUtils } from '../../../../@core/auth/services/datalayer.utils.service';
import { AppConfigService } from '../../../../app-config.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class SilStoresServiceStub {
    customUpdate() {
        return of({
            results: [
                {
                    id: 1,
                },
            ],
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

class NbStatusServiceStub {
    isCustomStatus() {}
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

describe('PatientAttachmentFieldsService', () => {
    let service: PatientAttachmentFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                PatientAttachmentFieldsService,
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
                { provide: NbStatusService, useClass: NbStatusServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(PatientAttachmentFieldsService);
    });

    it('should test fields and observable functions', () => {
        const comp = {
            fields: [
                {},
                {},
                {},
                {
                    props: {},
                },
            ],
            secondaryData: {
                document_status: 'REJECTED',
            },
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();
        const event = {
            target: {
                files: [
                    {
                        name: 'RATE CARD - ROLLING CARGO DUBAI UPDATED (2).pdf',
                        lastModified: 1683364292659,
                        size: 103965,
                        type: 'application/pdf',
                        webkitRelativePath: '',
                    },
                ],
            },
        };

        const field = {
            model: {
                data: {
                    name: 'RATE CARD - ROLLING CARGO DUBAI UPDATED (2).pdf',
                    lastModified: 1683364292659,
                    size: 103965,
                    type: 'application/pdf',
                    webkitRelativePath: '',
                },
                fileEvent: {
                    name: 'RATE CARD - ROLLING CARGO DUBAI UPDATED (2).pdf',
                    lastModified: 1683364292659,
                    size: 103965,
                    type: 'application/pdf',
                    webkitRelativePath: '',
                },
                title: 'RATE CARD - ROLLING CARGO DUBAI UPDATED (2).pdf',
            },
        };
        const documentTypeField = {
            model: {
                document_type: 'Prescription',
            },
        };
        const titleField = {
            model: {
                fileEvent: 'Cancer screening',
            },
        };
        const descriptionField = {
            model: {
                description: 'Cancer screening',
            },
        };
        const fileEventField = {
            model: {
                fileEvent: {
                    name: 'RATE CARD - ROLLING CARGO DUBAI UPDATED (2).pdf',
                    lastModified: 1683364292659,
                    size: 103965,
                    type: 'application/pdf',
                    webkitRelativePath: '',
                },
            },
        };
        fields[0].props.fileEvent(event.target.files[0], field.model);
        fields[0].props.addFile({ file: event.target.files[0] });
        fields[0].expressions['model.data'](field);
        fields[1].expressions['model.document_type'](documentTypeField);
        fields[2].expressions['model.title'](titleField);
        fields[3].expressions['model.description'](descriptionField);
        fields[4].expressions['model.fileEvent'](fileEventField);

        // test first branch visit_date
        const field3 = {
            model: {
                visit_date: '2022-12-12-',
            },
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: false,
            },
        };
        fields[5].expressions['model.visit_date'](field3);

        // test second branch visit_date
        const field4 = {
            visit_date: '2022-12-12-',
            props: {},
            formControl: {
                pristine: false,
                markAsPristine: () => {},
                touched: true,
            },
            model: {
                visit_date: '2022-12-12-',
            },
            defaultValue: undefined,
        };
        fields[5].expressions['model.visit_date'](field4);

        // test third branch visit_date
        const model2 = {
            visit_date: '2022-12-12',
            formControl: {
                pristine: false,
                touched: false,
            },
        };
        const field5 = {
            visit_date: '2022-12-12-',
            formControl: {
                pristine: true,
                markAsPristine: () => {},
                touched: true,
            },
            model: model2,
            defaultValue: undefined,
        };
        fields[5].expressions['model.visit_date'](field5);

        expect(service.fields).toHaveBeenCalled();
    });

    it('should test setComponent other branch if file is not rejected', () => {
        const comp = {
            fields: [
                {},
                {},
                {},
                {
                    props: {},
                },
            ],
            secondaryData: {
                document_status: 'PENDING',
            },
            cd: {
                detectChanges: () => {},
            },
        };
        spyOn(service, 'setComponent').and.callThrough();
        service.setComponent(comp);
        expect(service.setComponent).toHaveBeenCalled();
    });
});
