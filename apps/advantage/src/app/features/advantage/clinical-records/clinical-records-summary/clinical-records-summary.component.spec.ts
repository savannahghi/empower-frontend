import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalRecordsSummaryComponent } from './clinical-records-summary.component';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { ClinicalRecordsService } from '../clinical-records.service';
import { MarkdownService } from 'ngx-markdown';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

const silStoresServiceStub = {
    create: () => {
        return of({});
    },
    get: () => {
        return of({});
    },
};

const markDownServiceStub = {
    parse: (text: string) => {
        return text;
    },
};

const mockClinicalNotesSubject = new BehaviorSubject<any[]>([
    { family_history: 'Note 1' },
    { past_medical_surgery_history: 'Note 2' },
]);

const clinicalRecordsServiceStub = {
    clinicalNotes$: mockClinicalNotesSubject.asObservable(),
};

const mockPatientData = {
    clinical_id: '123',
    person: { date_of_birth: '2000-01-01', gender: 'male' },
};

const mockActiveServiceRequest = { id: '123' };

describe('ClinicalRecordsSummaryComponent', () => {
    let component: ClinicalRecordsSummaryComponent;
    let fixture: ComponentFixture<ClinicalRecordsSummaryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            declarations: [ClinicalRecordsSummaryComponent],
            providers: [
                { provide: SilStoresService, useValue: silStoresServiceStub },
                {
                    provide: ClinicalRecordsService,
                    useValue: clinicalRecordsServiceStub,
                },
                { provide: MarkdownService, useValue: markDownServiceStub },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ClinicalRecordsSummaryComponent);
        component = fixture.componentInstance;
        component.patient = mockPatientData;
        component.activeServiceRequest = mockActiveServiceRequest;
        fixture.detectChanges();
    });

    it('should test the summarizeClinicalNotes function on successfull response', () => {
        spyOn(component.dataLayer, 'create').and.returnValue(
            of({ summarization: 'sample summarization markdown' })
        );

        component.summarizeClinicalNotes();

        expect(component.dataLayer.create).toHaveBeenCalled();
    });

    it('should test the summarizeClinicalNotes function on error response', () => {
        spyOn(component.dataLayer, 'create').and.returnValue(
            throwError(() => new Error('Server error'))
        );

        component.summarizeClinicalNotes();

        expect(component.summaryLoading).toBeFalse();
        expect(component.errorResponse).toBeTrue();
    });
});
