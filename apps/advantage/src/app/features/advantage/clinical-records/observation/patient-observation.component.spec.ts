import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientObservationComponent } from './patient-observation.component';
import { NbToastrService } from '@nebular/theme';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { ClinicalRecordsService } from '../clinical-records.service';
import { of, throwError } from 'rxjs';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    Pipe,
    PipeTransform,
    SimpleChange,
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

const clinicalRecordsServiceStub = {
    setClinicalNotes: jasmine.createSpy('setClinicalNotes'),
    handleError: jasmine.createSpy('handleError'),
};

describe('PatientObservationComponent', () => {
    let component: PatientObservationComponent;
    let fixture: ComponentFixture<PatientObservationComponent>;
    let toastrServiceSpy: jasmine.SpyObj<NbToastrService>;
    let dataLayerSpy: jasmine.SpyObj<SilStoresService>;

    beforeEach(async () => {
        toastrServiceSpy = jasmine.createSpyObj('NbToastrService', ['show']);
        dataLayerSpy = jasmine.createSpyObj('SilStoresService', [
            'create',
            'list',
        ]);

        await TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            declarations: [PatientObservationComponent],
            imports: [mockPipe('translate')],
            providers: [
                { provide: NbToastrService, useValue: toastrServiceSpy },
                { provide: SilStoresService, useValue: dataLayerSpy },
                {
                    provide: ClinicalRecordsService,
                    useValue: clinicalRecordsServiceStub,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PatientObservationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should call fetchTemplateObservations on ngOnChanges if templateName changes and has id', () => {
        spyOn(component, 'fetchTemplateObservations');
        component.templateName = { id: 'bmi' };
        component.ngOnChanges({
            templateName: new SimpleChange(null, { id: 'bmi' }, false),
        });
        expect(component.fetchTemplateObservations).toHaveBeenCalled();
    });

    it('should not call fetchTemplateObservations on ngOnChanges if templateName is missing', () => {
        spyOn(component, 'fetchTemplateObservations');
        component.templateName = null;
        component.ngOnChanges({
            templateName: new SimpleChange(null, null, false),
        });
        expect(component.fetchTemplateObservations).not.toHaveBeenCalled();
    });

    it('should show toast', () => {
        component.showToast('top-right', 'success', 'Test', 'Context');
        expect(toastrServiceSpy.show).toHaveBeenCalled();
    });

    it('should call dataLayer.create and handle success in addPatientObservationItem', () => {
        component.templateName = { id: 'bmi' };
        component.activeServiceRequest = { encounter_id: 'enc1' };
        spyOn(component, 'fetchTemplateObservations');
        spyOn(component, 'showToast');
        dataLayerSpy.create.and.returnValue(of({}));

        component.addPatientObservationItem({ value: '23', note: 'note' });

        expect(dataLayerSpy.create).toHaveBeenCalled();
        expect(component.loadingResult['bmi']).toBeFalse();
        expect(component.fetchTemplateObservations).toHaveBeenCalled();
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Observation',
            'Added observation'
        );
    });

    it('should call handleError on error in addPatientObservationItem', () => {
        component.templateName = { id: 'bmi' };
        component.activeServiceRequest = { encounter_id: 'enc1' };
        dataLayerSpy.create.and.returnValue(throwError(() => 'error'));

        component.addPatientObservationItem({ value: '23', note: 'note' });

        expect(clinicalRecordsServiceStub.handleError).toHaveBeenCalledWith(
            'error'
        );
        expect(component.loadingResult['bmi']).toBeFalse();
    });

    it('should set patientObservations and observationFormHidden in fetchTemplateObservations (with results)', () => {
        component.templateName = { id: 'bmi' };
        component.patient = { clinical_id: 'p1' };
        component.activeServiceRequest = { encounter_id: 'enc1' };
        const mockRes = { edges: [{ node: { id: 1 } }] };
        dataLayerSpy.list.and.returnValue(of(mockRes));

        component.fetchTemplateObservations();

        expect(component.patientObservations).toEqual([{ id: 1 }]);
        expect(component.observationFormHidden).toBeTrue();
    });

    it('should set observationFormHidden to false if no observations in fetchTemplateObservations', () => {
        component.templateName = { id: 'bmi' };
        component.patient = { clinical_id: 'p1' };
        component.activeServiceRequest = { encounter_id: 'enc1' };
        const mockRes = { edges: [] };
        dataLayerSpy.list.and.returnValue(of(mockRes));

        component.fetchTemplateObservations();

        expect(component.patientObservations).toEqual([]);
        expect(component.observationFormHidden).toBeFalse();
    });

    it('should call handleError and set observationFormHidden to false on error in fetchTemplateObservations', () => {
        component.templateName = { id: 'bmi' };
        component.patient = { clinical_id: 'p1' };
        component.activeServiceRequest = { encounter_id: 'enc1' };
        dataLayerSpy.list.and.returnValue(throwError(() => 'error'));

        component.fetchTemplateObservations();

        expect(clinicalRecordsServiceStub.handleError).toHaveBeenCalledWith(
            'error'
        );
        expect(component.observationFormHidden).toBeFalse();
    });

    it('should toggle showObservationPreviewModal and set selectedObservation and skikaDialogueHeader on togglePreviewObservationModal(event)', () => {
        component.templateName = { name: 'BMI' };
        const event = { id: 1 };
        component.showObservationPreviewModal = false;

        component.togglePreviewObservationModal(event);

        expect(component.showObservationPreviewModal).toBeTrue();
        expect(component.skikaDialogueHeader).toBe('Preview BMI');
    });

    it('should toggle showObservationPreviewModal and reset selectedObservation on togglePreviewObservationModal()', () => {
        component.showObservationPreviewModal = true;
        component.selectedObservation = { id: 1 } as any;

        component.togglePreviewObservationModal();

        expect(component.showObservationPreviewModal).toBeFalse();
        expect(component.selectedObservation).toEqual({});
    });

    it('should toggle observationFormHidden in toggleIsHidden', () => {
        component.observationFormHidden = true;
        component.toggleIsHidden();
        expect(component.observationFormHidden).toBeFalse();
        component.toggleIsHidden();
        expect(component.observationFormHidden).toBeTrue();
    });

    it('should initialize rows, tableHeader, and actions in ngOnInit', () => {
        component.ngOnInit();
        expect(component.rows).toBeDefined();
        expect(component.tableHeader).toBeDefined();
        expect(component.actions).toBeDefined();
        expect(component.actions[0].btnText).toBe('View');
    });

    it('cancelAddObservation should return undefined', () => {
        expect(component.cancelAddObservation()).toBeUndefined();
    });
});
