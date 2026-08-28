import { TestBed, fakeAsync } from '@angular/core/testing';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BusinessDocumentsUploadService } from './upload-business-documents-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('BusinessDetailsForm', () => {
    let service: BusinessDocumentsUploadService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                BusinessDocumentsUploadService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(BusinessDocumentsUploadService);
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
        const fields = service.fields();

        const event = {
            target: {
                files: [
                    {
                        name: '',
                        size: 103965,
                        type: '',
                    },
                ],
            },
        };

        const field = {
            model: {
                document: {
                    name: '',
                    size: 103965,
                    type: '',
                },
                fileEvent: {
                    name: '',
                    size: 103965,
                    type: '',
                },
            },
        };

        const titleField = {
            model: {
                title: 'ABC',
            },
        };

        const descriptionField = {
            model: {
                description: 'abc',
            },
        };

        fields[0].props.fileEvent(event.target.files[0], field.model);
        fields[0].expressions['model.document'](field);
        fields[1].expressions['model.title'](titleField);
        fields[2].expressions['model.description'](descriptionField);
        expect(service.fields).toHaveBeenCalled();
    }));
});
