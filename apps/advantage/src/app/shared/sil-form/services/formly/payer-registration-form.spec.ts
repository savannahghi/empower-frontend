import { TestBed, fakeAsync } from '@angular/core/testing';
import { PayerRegistrationService } from './payer-registration-form';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

class SilStoresServiceStub {
    list() {
        return of({
            results: [
                {
                    name: 'Insurance',
                    id: '1234',

                    categories: [
                        {
                            id: '5678',
                            name: 'PAYOR TYPE',
                        },
                    ],
                },
            ],
        });
    }
}

describe('PayerRegistrationForm', () => {
    let service: PayerRegistrationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                PayerRegistrationService,
                { provide: SilStoresService, useClass: SilStoresServiceStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(PayerRegistrationService);
    });

    it('should test fields', fakeAsync(() => {
        const comp = {
            fields: [{}, {}, { props: {} }],
            cd: {
                detectChanges: () => {},
            },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();

        service.fields();
        expect(service.fields).toHaveBeenCalled();
    }));

    it('should test repeat field', () => {
        const comp = {
            model: {},
            fields: [{}, {}, { props: {} }],
            cd: { detectChanges: () => {} },
        };
        service.setComponent(comp);
        spyOn(service, 'fields').and.callThrough();
        const fields = service.fields();

        const nameField = {
            model: {
                name: 'Jubilee',
            },
        };

        const payerTypeField = {
            model: {
                payer_type: 'Insurance',
            },
            props: {},
        };

        const descriptionField = {
            model: {
                description: 'Insurance Org',
            },
        };

        // Test contacts
        const contactField = {
            model: {
                contact_type: 'email',
                contact_value: 'a@a.com',
                role: 'Primary Contact',
            },
            props: {},
            defaultValue: undefined,
        };

        const addressField = {
            model: {
                address: '123 Nairobi',
            },
        };

        const coordinatesField = {
            model: {
                latitude: 12.121212,
                longitude: 36.23423423,
            },
            props: {},
            defaultValue: 'Nairobi',
            formControl: {
                pristine: false,
                touched: true,
            },
        };

        const event = {
            lat: 12.121212,
            lng: 36.23423423,
        };

        fields[0].fieldGroup[0]['expressions']['model.name'](nameField);
        fields[0].fieldGroup[1]['expressions']['model.payer_type'](
            payerTypeField
        );
        fields[0].fieldGroup[1]['expressions']['props.options'](payerTypeField);
        fields[1]['expressions']['model.description'](descriptionField);

        // contact type input
        fields[2].fieldArray.fieldGroup[0]['expressions']['model.contact_type'](
            contactField
        );
        // email input
        fields[2].fieldArray.fieldGroup[1]['expressions']['hide'](contactField);
        fields[2].fieldArray.fieldGroup[1]['expressions'][
            'model.contact_value'
        ](contactField);
        // phone number input
        fields[2].fieldArray.fieldGroup[2]['expressions']['hide'](contactField);
        fields[2].fieldArray.fieldGroup[2]['expressions'][
            'model.contact_value'
        ](contactField);
        fields[2].fieldArray.fieldGroup[3]['expressions']['model.role'](
            contactField
        );
        // identifier type input
        fields[3].fieldArray.fieldGroup[0]['expressions'][
            'model.identifier_type'
        ](contactField);

        fields[4]['expressions']['model.address'](addressField);

        fields[5].props.addMarker(event);

        fields[5]._expressionProperties['model.latitude']['expression']();

        coordinatesField.model['latitude'] = 12.223123;
        fields[6].fieldGroup[0].expressions['model.latitude'](coordinatesField);
        coordinatesField.model['longitude'] = 36.23423423;
        fields[6].fieldGroup[1].expressions['model.longitude'](
            coordinatesField
        );

        expect(service.fields).toHaveBeenCalled();
    });
});
