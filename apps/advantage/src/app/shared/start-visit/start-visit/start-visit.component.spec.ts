import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartVisitComponent } from './start-visit.component';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../cookies/cookie.service';
import { PatientService } from '../../../features/advantage/patients/patient.service';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';

function mockPipe(name: string): Pipe {
    const metadata: Pipe = {
        name,
    };

    return Pipe(metadata)(
        class MockPipe implements PipeTransform {
            transform() {}
        }
    );
}
class CookieServiceStub {
    getLanguageCookie() {
        return 'en';
    }
    get() {
        return 'en';
    }
}

class TranslateServiceStub {
    setFallbackLang() {
        return 'en.json';
    }
    use() {
        return 'en.json';
    }
}

class PatientServiceStub {
    startVisit() {
        return null;
    }
}

describe('StartVisitComponent', () => {
    let component: StartVisitComponent;
    let fixture: ComponentFixture<StartVisitComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [StartVisitComponent],
            imports: [
                mockPipe('translate'),
                mockPipe('age'),
                mockPipe('titleCase'),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: PatientService, useClass: PatientServiceStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(StartVisitComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should test startVisit successful', () => {
        const date = '2015-01-01T00:00:00';
        spyOn(component, 'togglePastVisit').and.callThrough();
        component.togglePastVisit();
        expect(component.togglePastVisit).toHaveBeenCalled();
        spyOn(component, 'getStartDate').and.callThrough();
        component.getStartDate(date);
        expect(component.getStartDate).toHaveBeenCalled();
        spyOn(component, 'startVisit').and.callThrough();
        component.startVisit();
        expect(component.startVisit).toHaveBeenCalled();
    });

    it('should test getFilteredResponse', () => {
        spyOn(component, 'getFilteredResponse').and.callThrough();
        component.getFilteredResponse({ id: 1, name: 'Dr Ngure' }, 'queue');
        component.getFilteredResponse({ id: 1, name: 'Muthee' }, 'guarantor');
        expect(component.getFilteredResponse).toHaveBeenCalled();
    });

    it('should test getFilteredResponse without guarantor field', () => {
        spyOn(component, 'getFilteredResponse').and.callThrough();
        component.getFilteredResponse({ id: 1, name: 'Dr Ngure' }, 'queue');
        component.getFilteredResponse(undefined, 'guarantor');
        expect(component.getFilteredResponse).toHaveBeenCalled();
    });
});
