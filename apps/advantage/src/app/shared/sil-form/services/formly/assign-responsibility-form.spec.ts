import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AssignResponsibilityFormService } from './assign-responsibility-form';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';

describe('AssignResponsibilityFormService', () => {
    let service: AssignResponsibilityFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(AssignResponsibilityFormService);
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
                responsibility: 'PAYER',
            },
        };
        fields[0]['model.responsibility'] = field0;
        expect(service.fields).toBeDefined();
    });
});
