import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { PublicRiskAssessmentComponent } from './public-risk-assessment.component';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { of, throwError } from 'rxjs';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';
import { UIRouter, UIRouterGlobals } from '@uirouter/angular';
import { CommonModule } from '@angular/common';

const silStoresServiceStub = {
    create() {
        return of({});
    },
    list() {
        return of({});
    },
};

const errorHandlerServiceStub = {
    handleError() {},
};

const uIRouterGlobalsStub = {
    params: {
        id: 'someId',
        cancer_type: 'breast',
        encounter_id: '2359',
    },
    current: {
        name: 'risk-assessment.cervical_cancer',
    },
};

class UIRouterStub {
    globals = {
        params$: of({ patient: 1 }),
    };
    stateService = {
        go: () => {},
    };
}

describe('PublicRiskAssessmentComponent', () => {
    let component: PublicRiskAssessmentComponent;
    let fixture: ComponentFixture<PublicRiskAssessmentComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule],
            declarations: [PublicRiskAssessmentComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: SilStoresService, useValue: silStoresServiceStub },
                {
                    provide: ErrorHandlerService,
                    useValue: errorHandlerServiceStub,
                },
                { provide: UIRouterGlobals, useValue: uIRouterGlobalsStub },
                { provide: UIRouter, useClass: UIRouterStub },
            ],
        });

        fixture = TestBed.createComponent(PublicRiskAssessmentComponent);
        component = fixture.componentInstance;
        component.formDef = { id: 'form123' };
        fixture.detectChanges();
    });

    it('should test the ngOninit function', () => {
        spyOn(component, 'fetchQuestionnaires').and.callThrough();
        spyOn(component, 'extractScreeningType').and.callThrough();
        component.ngOnInit();
        expect(component.fetchQuestionnaires).toHaveBeenCalled();
        expect(component.extractScreeningType).toHaveBeenCalledWith(
            uIRouterGlobalsStub.current.name
        );
        expect(component.cancerType).toBeDefined();
        expect(component).toBeTruthy();
    });

    it('should test the fetchQuestionnaires function', () => {
        spyOn(component.dataLayer, 'list').and.callThrough();
        component.fetchQuestionnaires();
        expect(component.dataLayer.list).toHaveBeenCalled();
        expect(component.formloading).toBeFalse();
        expect(component.formDef).toBeDefined();
    });

    it('should test the fetchQuestionnaireResponse on datalayer.list error', () => {
        spyOn(component.dataLayer, 'list').and.returnValue(
            throwError(() => new Error('Server error'))
        );
        spyOn(component['errorHandler'], 'handleError');
        component.fetchQuestionnaires();
        expect(component['errorHandler'].handleError).toHaveBeenCalled();
    });

    it('should test submitQuestionnaireResponse and resolve promise', async () => {
        const mockPayload = {
            question: 'questionnaire quiz',
            answer: 'questionnaire answer',
        };
        spyOn(component.dataLayer, 'create').and.returnValue(
            of({ message: 'success' })
        );
        spyOn(component.nextStepRequested, 'emit').and.callThrough();
        const result = await component.submitQuestionnaireResponse(mockPayload);
        expect(result).toBeDefined();
        expect(component.dataLayer.create).toHaveBeenCalled();
        expect(component.loading).toBeFalse();
        expect(component.submitted).toBeTrue();
        expect(component.nextStepRequested.emit).toHaveBeenCalled();
    });

    it('should reject promise and on submitQuestionnaireResponse datalayer error', async () => {
        const mockPayload = {
            question: 'questionnaire quiz',
            answer: 'questionnaire answer',
        };
        component.submitted = true;
        spyOn(component.dataLayer, 'create').and.returnValue(
            throwError(() => new Error('server error'))
        );
        await expectAsync(
            component.submitQuestionnaireResponse(mockPayload)
        ).toBeRejectedWithError('server error');
        expect(component.loading).toBeFalse();
        expect(component.submitted).toBeFalse();
    });

    it('should test various functions', () => {
        component.submitted = true;
        component.questionnaireResponse = { answer: 'yes' };
        component.retakeAssessment();
        expect(component.submitted).toBeFalse();
        expect(component.questionnaireResponse).toBeNull();

        component.questionnaireResponse = {
            risk_level: 'average risk',
        };
        spyOn(component, 'getBadgeStyle').and.callThrough();
        component.getBadgeStyle();
        expect(component.getBadgeStyle).toHaveBeenCalled();
        expect(component.riskLevel).toBeDefined();

        const response = {
            message: 'success',
        };
        component.onQuestionnaireResponseReceived(response);
        expect(component.questionnaireResponse).toEqual(response);

        component.submitted = false;
        spyOn(component, 'setRiskData').and.callThrough();
        component.onSubmitSuccess(response);
        expect(component.submitted).toBeTrue();
        expect(component.setRiskData).toHaveBeenCalled();

        component.submitted = false;
        component.onSubmitError(response);
        expect(component.submitted).toBeFalse();

        component.questionnaireResponse = {
            risk_level: 'average risk',
        };
        component.setRiskData();
        expect(component.riskLevel).toBeDefined();

        expect(
            component.extractScreeningType('risk-assessment.cervical_cancer')
        ).toBeDefined();

        expect(
            component.extractScreeningType('non-matching-string')
        ).toBeNull();
    });

    it('should test the getCurrentRiskData function', () => {
        /** null case */
        component.cancerType = null;
        expect(component.getCurrentRiskData()).toBeNull();

        component.cancerType = 'breast';
        component.riskLevel = null;
        expect(component.getCurrentRiskData()).toBeNull();

        component.cancerType = 'non-existent-key';
        component.riskLevel = 'average risk';
        expect(component.getCurrentRiskData()).toBeNull();

        component.cancerType = 'breask';
        component.riskLevel = 'average risk';
    });

    it('should test the redirectToExternal function', () => {
        spyOn(window, 'open');

        component.redirectToExternal('www.example.com');
        expect(window.open).toHaveBeenCalled();
    });
});
