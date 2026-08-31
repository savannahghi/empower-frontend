import { TestBed } from '@angular/core/testing';
import { PatientAllergyComponent } from './patient-allergy.component';
import { NbToastrService } from '@nebular/theme';
import { StateService, UIRouterGlobals } from '@uirouter/core';
import { AnalyticsService } from 'app/@core/utils';
import { SilStoresService } from 'app/shared/sil-http-services/sil_datalayer.service';
import { ErrorHandlerService } from 'app/shared/sil-http-services/error-handler';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PatientAllergyComponent', () => {
    let component: PatientAllergyComponent;
    let dataLayer: jasmine.SpyObj<SilStoresService>;

    beforeEach(() => {
        const dataLayerSpy = jasmine.createSpyObj('SilStoresService', [
            'list',
            'create',
        ]);
        const toastrSpy = jasmine.createSpyObj('NbToastrService', ['show']);
        const errorHandlerSpy = jasmine.createSpyObj('ErrorHandlerService', [
            'handleError',
        ]);
        const analyticsSpy = jasmine.createSpyObj('AnalyticsService', [
            'logEvent',
        ]);
        const stateSpy = jasmine.createSpyObj('StateService', ['go']);

        dataLayerSpy.list.and.returnValue(
            of({
                TotalCount: 0,
                Edges: [],
            })
        );
        dataLayerSpy.create.and.returnValue(of({ success: true }));

        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: SilStoresService, useValue: dataLayerSpy },
                { provide: NbToastrService, useValue: toastrSpy },
                { provide: ErrorHandlerService, useValue: errorHandlerSpy },
                { provide: AnalyticsService, useValue: analyticsSpy },
                { provide: StateService, useValue: stateSpy },
                { provide: UIRouterGlobals, useValue: { params: {} } },
                PatientAllergyComponent,
            ],
        });

        component = TestBed.inject(PatientAllergyComponent);
        dataLayer = TestBed.inject(
            SilStoresService
        ) as jasmine.SpyObj<SilStoresService>;

        component.patient = { clinical_id: 1 };
        component.activeServiceRequest = { encounter_id: 1 };

        spyOn(component, 'showToast');
        spyOn(component, 'showToastError');
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should test toggleAllergyFormDrawer method', () => {
        component.showAllergyFormDrawer = false;
        component.toggleAllergyFormDrawer();
        expect(component.showAllergyFormDrawer).toBe(true);
        component.toggleAllergyFormDrawer();
        expect(component.showAllergyFormDrawer).toBe(false);
    });

    it('should test toggleModal method with active service request', () => {
        component.activeServiceRequest = { encounter_id: 1 };
        component.toggleModal({ id: '1', name: 'heading' });
        expect(component.toggleId).toBe('1');
        expect(component.itemHeading).toBe('Add heading');
        expect(component.itemHeadingTwo).toBe('Save heading');
        expect(component.toggle['1']).toBe(true);
    });

    it('should test toggleModal method without active service request', () => {
        component.activeServiceRequest = { encounter_id: undefined };
        component.toggleModal({ id: '1', name: 'heading' });
        expect(component.showToastError).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'Patient is not in an active service point',
            'Serve the patient in order to add their allergy'
        );
    });

    it('should test handleError method', () => {
        component.handleError({ message: 'error message' });
        expect(component.showToastError).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'Error',
            'error message'
        );
        expect(component.loadingResult).toBe(false);
    });

    it('should test handleError method with undefined message', () => {
        component.handleError({});
        expect(component.showToastError).toHaveBeenCalledWith(
            'bottom-right',
            'danger',
            'Error',
            'An error occurred'
        );
        expect(component.loadingResult).toBe(false);
    });

    it('should test addPatientAllergyItem method', () => {
        const model = {
            allergy: {
                system: 'ICD-10-WHO',
                code: 'J10',
                name: 'Common Cold',
            },
            status: 'MILD',
        };
        spyOn(component, 'addPatientAllergy');
        component.addPatientAllergyItem(model);
        expect(component.addPatientAllergy).toHaveBeenCalledWith({
            code: 'J10',
            encounterID: '1',
            patientID: 1,
            terminologySource: 'ICD-10-WHO',
            reaction: {
                severity: 'MILD',
                system: 'ICD-10-WHO',
                code: 'J10',
            },
        });
    });

    it('should test addPatientAllergy method', () => {
        const payload = {
            code: 'J10',
            encounterID: '1',
            patientID: 1,
            terminologySource: 'ICD-10-WHO',
            reaction: {
                severity: 'MILD',
                system: 'ICD-10-WHO',
                code: 'J10',
            },
        };
        spyOn(component, 'handleAddPatientAllergy');
        component.addPatientAllergy(payload);
        expect(dataLayer.create).toHaveBeenCalledWith(
            'allergyintolerance',
            payload
        );
        expect(component.loadingResult).toBe(true);
    });

    it('should test addPatientAllergy method with error', () => {
        const payload = {
            code: 'J10',
            encounterID: '1',
            patientID: 1,
            terminologySource: 'ICD-10-WHO',
            reaction: {
                severity: 'MILD',
                system: 'ICD-10-WHO',
                code: 'J10',
            },
        };
        dataLayer.create.and.returnValue(
            throwError(() => new Error('API error'))
        );
        spyOn(component, 'handleError');
        component.addPatientAllergy(payload);
        expect(component.handleError).toHaveBeenCalled();
    });

    it('should test handleAddPatientAllergy method', () => {
        spyOn(component, 'getResult');
        component.handleAddPatientAllergy();
        expect(component.toggle).toEqual({});
        expect(component.loadingResult).toBe(false);
        expect(component.showAllergyFormDrawer).toBe(false);
        expect(component.getResult).toHaveBeenCalled();
        expect(component.showToast).toHaveBeenCalledWith(
            'bottom-right',
            'success',
            'Successful',
            'Allergy added'
        );
    });

    it('should test togglePreviewAllergyModal method with event', () => {
        const event = { id: 1, name: 'Allergy' };
        component.togglePreviewAllergyModal(event);
        expect(component.selectedAllergy).toEqual(event);
        expect(component.showPreviewAllergyModal).toBe(true);
    });

    it('should test togglePreviewAllergyModal method without event', () => {
        component.togglePreviewAllergyModal();
        expect(component.selectedAllergy).toEqual({});
        expect(component.showPreviewAllergyModal).toBe(true);
    });

    it('should test getResult method with results', () => {
        const mockResponse = {
            TotalCount: 2,
            Edges: [
                {
                    Node: {
                        code: '145413',
                        system: 'CIEL',
                        name: 'Allergy 1',
                        reaction: { severity: 'MILD' },
                    },
                },
                {
                    Node: {
                        code: '145414',
                        system: 'CIEL',
                        name: 'Allergy 2',
                        reaction: { severity: 'SEVERE' },
                    },
                },
            ],
        };
        dataLayer.list.and.returnValue(of(mockResponse));
        component.getResult();
        expect(component.patientAllergiesCount).toBe(2);
        expect(component.patientAllergies.length).toBe(2);
        expect(component.loadingResult).toBe(false);
        expect(dataLayer.list).toHaveBeenCalledWith('allergyintolerance', {
            patient_id: 1,
            encounter_id: 1,
            limit: '5',
        });
    });

    it('should test getResult method with no results', () => {
        const mockResponse = {
            TotalCount: 0,
            Edges: [],
        };
        dataLayer.list.and.returnValue(of(mockResponse));
        component.getResult();
        expect(component.patientAllergies).toEqual([]);
        expect(component.loadingResult).toBe(false);
    });

    it('should test getResult method with error', () => {
        dataLayer.list.and.returnValue(
            throwError(() => new Error('API error'))
        );
        spyOn(component, 'handleError');
        component.getResult();
        expect(component.handleError).toHaveBeenCalled();
    });

    it('should test selectFewerFields method', () => {
        const input = {
            Node: {
                code: '145413',
                name: 'Allergy',
                system: 'CIEL',
                reaction: { severity: 'MILD' },
                extraField: 'should not be included',
            },
        };
        const result = component.selectFewerFields(input);
        expect(result).toEqual({
            code: '145413',
            name: 'Allergy',
            system: 'CIEL',
            reaction: { severity: 'MILD' },
        });
    });

    it('should initialize component properly', () => {
        dataLayer.list.and.returnValue(
            of({
                TotalCount: 0,
                Edges: [],
            })
        );

        component.ngOnInit();

        expect(component.tableHeader.length).toBe(3);
        expect(component.rows.length).toBe(2);
        expect(component.actions.length).toBe(1);
        expect(component.statusFilters.length).toBe(2);
    });

    it('should initialize component without calling getResult when patient has no clinical_id', () => {
        component.patient = {};
        spyOn(component, 'getResult');
        component.ngOnInit();
        expect(component.getResult).not.toHaveBeenCalled();
    });

    it('should initialize component without calling getResult when activeServiceRequest has no encounter_id', () => {
        component.patient = { clinical_id: 1 };
        component.activeServiceRequest = {};
        spyOn(component, 'getResult');
        component.ngOnInit();
        expect(component.getResult).not.toHaveBeenCalled();
    });

    it('should test loadCkEditor method', async () => {
        const mockClassicEditor = { someProperty: 'test' };

        spyOn(component, 'loadCkEditor').and.callFake(async () => {
            component.Editor = mockClassicEditor;
        });

        await component.loadCkEditor();

        expect(component.Editor).toBe(mockClassicEditor);
    });

    it('should call loadCkEditor afterNextRender is triggered in constructor', done => {
        const spy = spyOn(
            PatientAllergyComponent.prototype,
            'loadCkEditor'
        ).and.callThrough();

        setTimeout(() => {
            expect(spy).toHaveBeenCalled();
            done();
        }, 0);
    });

    it('should import CKEditor and assign it to Editor when window is defined', async () => {
        expect(typeof window).not.toBe('undefined');

        await component.loadCkEditor();

        expect(component.Editor).toBeDefined();
    });
});
