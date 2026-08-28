import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RiskAssessmentComponent } from './risk-assessment.component';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
} from '@angular/core';
import { VisitService } from '../../visit.service';
import { of } from 'rxjs';
import { NbToastrService } from '@nebular/theme';

class NbToastrServiceStub {
    show() {
        return of(() => {});
    }
}

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

const mockLFormsResponse = {
    resourceType: 'QuestionnaireResponse',
    status: 'completed',
    authored: '2024-02-08T08:59:30.086Z',
    item: [
        {
            linkId: '2670125340596',
            text: 'Are you experiencing a discharge from your vagina?',
            answer: [{ valueCoding: { display: 'No' } }],
        },
        {
            linkId: 'symptoms-score',
            text: 'Total Score: Symptoms',
            answer: [{ valueInteger: 0 }],
        },
    ],
};

const mockLForms = {
    Util: {
        addFormToPage: jasmine.createSpy('addFormToPage'),
        getFormFHIRData: jasmine
            .createSpy('getFormFHIRData')
            .and.returnValue(mockLFormsResponse),
    },
};

describe('RiskAssessmentComponent', () => {
    let component: RiskAssessmentComponent;
    let fixture: ComponentFixture<RiskAssessmentComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [RiskAssessmentComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports: [mockPipe('titleCase')],
            providers: [
                { provide: NbToastrService, useClass: NbToastrServiceStub },
                { provide: VisitService, useValue: visitServiceStub },
            ],
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(RiskAssessmentComponent);
                component = fixture.componentInstance;
                (window as any).LForms = mockLForms;
                fixture.detectChanges();
            });
    }));

    it('should test the next() functionality', () => {
        component.cancerType = 'breast';
        component.results = 'Low Risk';
        component.screeningStatus = 'low_risk';
        component.onSummary = true;
        spyOn(component, 'next').and.callThrough();
        component.next();
        expect(component.next).toHaveBeenCalled();
    });

    it('should test the previous() functionality', () => {
        component.cancerType = 'breast';
        component.results = 'Low Risk';
        component.screeningStatus = 'low_risk';
        spyOn(component, 'previous').and.callThrough();
        component.previous();
        expect(component.previous).toHaveBeenCalled();
    });

    it('should test the next() functionality', () => {
        component.cancerType = 'breast';
        component.results = 'Low Risk';
        component.screeningStatus = 'low_risk';
        component.onSummary = false;
        spyOn(component, 'next').and.callThrough();
        component.next();
        expect(component.next).toHaveBeenCalled();
        expect(component.onSummary).toBe(true);
    });

    it('should test the previous() functionality', () => {
        component.cancerType = 'cervical';
        component.results = 'High Risk';
        component.screeningStatus = 'high_risk';
        spyOn(component, 'previous').and.callThrough();
        component.previous();
        expect(component.previous).toHaveBeenCalled();
        expect(component.onSummary).toBe(false);
    });

    it('should test requestNextStep function', () => {
        spyOn(component, 'requestNextStep').and.callThrough();

        component.requestNextStep();
        expect(component.requestNextStep).toHaveBeenCalled();
    });
});
