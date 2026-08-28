import { Injectable } from '@angular/core';

/**
 * Visit Exam Service that is injected into visit exam component
 */
@Injectable({
    providedIn: 'root',
})
/**
 * Class that creates the visit exam service
 */
export class VisitExamService {
    /**
     * Custom settings to determine what records to display patient review
     */
    reviewTemplateSettings = [
        {
            id: 'problem',
            name: 'Problems',
            display: 'Problems',
            isNoteHidden: false,
            selected: true,
        },
        {
            id: 'allergy',
            name: 'Allergy',
            display: 'Allergy',
            isNoteHidden: false,
            selected: true,
        },
        {
            id: 'vitals',
            name: 'Vitals',
            display: 'Vitals',
            isNoteHidden: false,
            selected: true,
        },
    ];

    /**
     * Custom settings to determine what records to display patient history
     */
    historyTemplateSettings = [
        {
            id: 'chief_complaint',
            name: 'Chief complaint',
            display: 'Chief Complaint',
            compositionNoteTitle: 'Chief complaint - Reported',
            isNoteHidden: false,
            selected: true,
        },
        {
            id: 'history_of_present_illness',
            name: 'History of present illness',
            display: 'History of Present Illness',
            compositionNoteTitle: 'Present illness',
            isNoteHidden: false,
            selected: true,
        },
        {
            id: 'family_history',
            name: 'Family history',
            display: 'Family History',
            compositionNoteTitle: 'History of family member diseases',
            isNoteHidden: false,
            selected: true,
        },
        {
            id: 'social_history',
            name: 'Social history',
            display: 'Social History',
            compositionNoteTitle: 'Social history',
            isNoteHidden: false,
            selected: true,
        },
        {
            id: 'past_medical_surgery_history',
            name: 'Past medical surgery history',
            display: 'Past Medical and Surgery History',
            compositionNoteTitle: 'CMS - past medical - surgical history panel',
            isNoteHidden: false,
            selected: true,
        },
    ];

    /**
     * Custom settings to determine what records to display patient exam
     */
    examTemplateSettings = [
        {
            id: 'general_systems',
            name: 'General systems',
            display: 'General systems',
            compositionNoteTitle: 'General systems',
            isNoteHidden: false,
            selected: true,
        },
        {
            id: 'examination',
            name: 'Examination of systems',
            display: 'Examination of Systems',
            compositionNoteTitle: 'Physical findings narrative',
            isNoteHidden: false,
            selected: true,
        },
    ];

    /**
     * Custom settings to determine what records to display patient visit diagnosis
     */
    treatmentPlanTemplateSettings = [
        {
            id: 'diagnosis',
            name: 'Diagnoses',
            display: 'Diagnoses',
            isNoteHidden: false,
            selected: true,
        },
    ];

    /**
     * Custom settings to determine what records to display patient exam sign off
     */
    signOffTemplateSettings = [
        {
            id: 'sign_off',
            name: 'Sign off on assessment',
            display: 'Sign off on assessment',
            isNoteHidden: false,
            selected: true,
        },
    ];

    /** patients vitals */
    patientVitals: any[] = [
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
    /**
     * Ids of the template sections
     */
    sectionIds = [
        'problem',
        'allergy',
        'vitals',
        'chief_complaint',
        'history_of_present_illness',
        'past_medical_surgery_history',
        'family_history',
        'general_systems',
        'examination',
        'diagnosis',
        'sign_off',
    ];
    /**
     * Toogle function to display or hide clinical components notes
     * @param sectionId selected dropdown section id
     * @param templateSections array of the visible dropdown sections
     * @returns a modified array
     */
    toggleSection(sectionId, cmpt) {
        if (this.sectionIds.includes(sectionId)) {
            cmpt.templateSettings.filter(template => {
                if (template.id === sectionId) {
                    template.isNoteHidden = !template.isNoteHidden;
                }
            });
            return;
        }
    }
}
