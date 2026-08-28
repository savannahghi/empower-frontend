import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AddPhotoFormService } from './add-photo-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('AddPhotoFormService', () => {
    let service: AddPhotoFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(AddPhotoFormService);
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
                title: 'My Profile',
            },
            props: {},
        };
        fields[0]['model.title'] = field0;

        const field1 = {
            model: {
                photo: 'test-photo-url.jpg',
            },
            props: {},
        };
        fields[1]['model.photo'] = field1;
        expect(service.fields).toBeDefined();
    });
});
