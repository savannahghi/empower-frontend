import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { VisitExamService } from './visit-exam.service';
import { StateService } from '@uirouter/angular';

class StateServiceStub {
    reset() {
        return true;
    }
    go() {
        return true;
    }
    transition() {
        return true;
    }
    transitionTo() {
        return true;
    }
    includes() {
        return true;
    }
}

describe('Visit Exam Service', () => {
    let service: VisitExamService;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                VisitExamService,
                { provide: StateService, useClass: StateServiceStub },
            ],
        });

        service = TestBed.inject(VisitExamService);
        service.sectionIds = [
            'problem',
            'allergy',
            'vitals',
            'chief_complaint',
            'history_of_present_illness',
            'past_medical_surgery_history',
            'family_history',
            'social_history',
            'examination',
            'diagnosis',
            'treatment_plan',
        ];
        service.patientVitals = [
            {
                id: 'weight',
                name: 'Weight',
                units: 'kg',
                concept: 'WEIGHT',
                vitalReference: '',
            },
            {
                id: 'height',
                name: 'Height',
                units: 'cm',
                concept: 'HEIGHT',
                vitalReference: '',
            },
            {
                id: 'bmi',
                name: 'Body Mass Index',
                units: 'kg/m2',
            },
            {
                id: 'pulse',
                name: 'Pulse',
                units: 'BPM',
                concept: 'PULSE_RATE',
                vitalReference: 'PULSE_RATE',
            },
            {
                id: 's_bp',
                name: 'Systolic Blood Pressure',
                units: 'mmHg',
                concept: 'BLOOD_PRESSURE',
                vitalReference: 'SYSTOLIC_BLOOD_PRESSURE',
            },
            {
                id: 'd_bp',
                name: 'Diastolic Blood Pressure',
                units: 'mmHg',
                concept: 'DIASTOLIC_BLOOD_PRESSURE',
                vitalReference: 'DIASTOLIC_BLOOD_PRESSURE',
            },
            {
                id: 'temperature',
                name: 'Temperature',
                units: '°C',
                concept: 'TEMPERATURE',
                vitalReference: 'TEMPERATURE',
            },
            {
                id: 'oxygenSaturation',
                name: 'Oxygen Saturation',
                units: '%',
                concept: 'OXYGEN_SATURATION',
                vitalReference: 'SPO2',
            },
            {
                id: 'respirationRate',
                name: 'Respiration Rate',
                units: '%',
                concept: 'RESPIRATORY_RATE',
                vitalReference: 'RESPIRATION_RATE',
            },
            {
                id: 'muac',
                name: 'Mid-Upper Arm Circumference',
                units: 'mm',
                concept: 'MUAC',
                vitalReference: 'MUAC',
            },
        ];
    }));

    it('should test the toggleSection function when section Id exists', () => {
        const cmpt = {
            templateSettings: [
                {
                    id: 'problem',
                    name: 'Problem',
                    display: 'Problem',
                    isNoteHidden: false,
                    selected: true,
                },
            ],
        };
        spyOn(service, 'toggleSection').and.callThrough();
        service.toggleSection('problem', cmpt);
        expect(service.toggleSection).toHaveBeenCalled();
    });

    it('should test the toggleSection function sectionId does not exist', () => {
        const cmpt = {
            templateSettings: [
                {
                    id: 'general_systems',
                    name: 'General systems',
                    display: 'General systems',
                    compositionNoteTitle: 'General systems',
                    isNoteHidden: false,
                    selected: true,
                },
            ],
        };
        spyOn(service, 'toggleSection').and.callThrough();
        service.toggleSection('problem', cmpt);
        expect(service.toggleSection).toHaveBeenCalled();
    });
});
