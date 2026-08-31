import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamRecordComponent } from './exam-record.component';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Cookies } from '../../../../../shared/cookies/cookie.service';
import { of } from 'rxjs';
import { VisitExamService } from '../visit-exam.service';
import { VisitService } from '../../visit.service';

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

const visitServiceStub = {
    visitPatientDataEmitter: of({
        new_price: 18,
        amount: '18',
        product_name: 'Lipid',
        quantity: 1,
        id: 1,
    }),
    visitPatientScreeningDataEmitter: of({
        age: 40,
        gender: 'MALE',
    }),
    pricelistDataEmitter: of({
        name: 'Default pricelist',
        id: 1,
    }),
    currenciesDataEmitter: of({
        results: {
            new_price: 18,
            amount: '18',
            product_name: 'Lipid',
            quantity: 1,
            id: 1,
        },
    }),
    sendToQueue: () => {},
    completeVisit: () => {},
    queuesDataEmitter: of([
        {
            id: 1,
        },
    ]),
    fetchVisit: () => {},
    addToQueue: () => {},
    visit: {
        id: 1,
        service_requests: [
            {
                invoice: {
                    amount_due: 100,
                    amount_paid: 100,
                    invoice_lines: [{ id: 1 }],
                },
            },
        ],
    },
};

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
class VisitExamServiceStub {
    toggleSection() {
        return true;
    }
    patientVitals: [
        {
            id: 'weight';
            name: 'Weight';
            units: 'kg';
            concept: 'WEIGHT';
            vitalReference: '';
        }
    ];
    reviewTemplateSettings: [
        {
            id: 'problem';
            name: 'Problems';
            display: 'Problems';
            isNoteHidden: false;
            selected: true;
        }
    ];
    historyTemplateSettings: [
        {
            id: 'history_of_present_illness';
            name: 'History of present illness';
            display: 'History of present illness';
            compositionNoteTitle: 'History of Present illness Narrative';
            isNoteHidden: false;
            selected: true;
        }
    ];
    examTemplateSettings: [
        {
            id: 'general_systems';
            name: 'General systems';
            display: 'General systems';
            compositionNoteTitle: 'General systems';
            isNoteHidden: false;
            selected: true;
        }
    ];

    treatmentPlanTemplateSettings: [
        {
            id: 'diagnosis';
            name: 'Diagnoses';
            display: 'Diagnoses';
            isNoteHidden: false;
            selected: true;
        }
    ];

    signOffTemplateSettings: [
        {
            id: 'sign_off';
            name: 'Sign off on assessment';
            display: 'Sign off on assessment';
            isNoteHidden: false;
            selected: true;
        }
    ];
}
describe('ExamRecordComponent', () => {
    let component: ExamRecordComponent;
    let fixture: ComponentFixture<ExamRecordComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExamRecordComponent],
            imports: [mockPipe('translate')],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: Cookies, useClass: CookieServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
                { provide: VisitExamService, useClass: VisitExamServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ExamRecordComponent);
        component = fixture.componentInstance;
        component.visit = {
            start: '12/12/2023',
            service_requests: [{ id: '2' }],
        };
        component.templateSettings = [
            {
                id: 'general_systems',
                name: 'General systems',
                display: 'General systems',
                compositionNoteTitle: 'General systems',
                isNoteHidden: false,
                selected: true,
            },
        ];
        fixture.detectChanges();
    });

    it('should test component functions', () => {
        spyOn(component, 'toggleIsHidden').and.callThrough();
        spyOn(component, 'toggleModal').and.callThrough();

        component.toggleIsHidden('treatment');
        component.toggleModal('pulse');
        expect(component).toBeTruthy();
        expect(component.toggleIsHidden).toHaveBeenCalled();
        expect(component.toggleModal).toHaveBeenCalled();
    });

    it('should test requestNextStep function', () => {
        spyOn(component, 'requestNextStep').and.callThrough();

        component.requestNextStep();
        expect(component.requestNextStep).toHaveBeenCalled();
    });

    it('should test requestPreviousStep function', () => {
        spyOn(component, 'requestPreviousStep').and.callThrough();

        component.requestPreviousStep();
        expect(component.requestPreviousStep).toHaveBeenCalled();
    });

    it('should test toggleServicePointModal function', () => {
        spyOn(component, 'toggleServicePointModal').and.callThrough();
        component.toggleServicePointModal();
        component.showServicePointModal = true;
        expect(component.toggleServicePointModal).toHaveBeenCalled();
    });

    it('should test getVisitInfo method', () => {
        spyOn(component, 'getVisitInfo').and.callThrough();
        component.getVisitInfo();
        expect(component.getVisitInfo).toHaveBeenCalled();
    });
});
