import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitRegimenComponent } from './visit-regimen.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbSelectModule, NbIconModule, NbThemeModule } from '@nebular/theme';
import { SectionTitleComponent } from '../../../visits/visit-patient-screening/screening-report/section-title/section-title.component';
import {
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
    SimpleChange,
} from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { mockRegimen } from '../mock-regimen';

describe('VisitRegimenComponent', () => {
    let component: VisitRegimenComponent;
    let fixture: ComponentFixture<VisitRegimenComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FormsModule,
                NoopAnimationsModule,
                NbThemeModule.forRoot(),
                NbSelectModule,
                NbIconModule,
                SectionTitleComponent,
                VisitRegimenComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(VisitRegimenComponent);
        component = fixture.componentInstance;
        component.regimenTypes = mockRegimen;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize regimenTypes with mockRegimen data on ngOnInit when no planDefinitionData is provided', () => {
        expect(component.regimenTypes).toEqual(mockRegimen);
        expect(component.regimenTypes.length).toBeGreaterThan(0);
    });

    it('should initialize regimenTypes with planDefinitionData when provided on ngOnInit', () => {
        const testPlanData = [
            { id: 'plan1', name: 'Test Plan 1', action: [] },
            { id: 'plan2', name: 'Test Plan 2', action: [] },
        ];

        const fixture2 = TestBed.createComponent(VisitRegimenComponent);
        const component2 = fixture2.componentInstance;

        component2.planDefinitionData = testPlanData;

        component2.ngOnInit();

        expect(component2.regimenTypes).toEqual(testPlanData);
        expect(component2.regimenTypes.length).toBe(2);
    });

    it('should reset selectedCycle and medicationDays on regimen type change', () => {
        component.selectedRegimenType = mockRegimen[0];
        component.selectedCycle = mockRegimen[0].action[0];
        component.medicationDays = mockRegimen[0].action[0].action;
        component.selectedMedicationDay = mockRegimen[0].action[0].action[0];
        component.onRegimenTypeChange();

        expect(component.selectedCycle).toBeNull();
        expect(component.medicationDays).toEqual([]);
        expect(component.selectedMedicationDay).toBeNull();

        expect(component.cyclesForSelectedRegimen).toEqual(
            mockRegimen[0].action
        );
    });

    it('should update cyclesForSelectedRegimen when a regimen type is selected', () => {
        component.selectedRegimenType = mockRegimen[0];
        component.onRegimenTypeChange();
        expect(component.cyclesForSelectedRegimen).toEqual(
            mockRegimen[0].action
        );
    });

    it('should emit the selected regimen when a regimen type is selected', () => {
        spyOn(component.regimenSelected, 'emit');
        component.selectedRegimenType = mockRegimen[0];
        component.onRegimenTypeChange();
        expect(component.regimenSelected.emit).toHaveBeenCalledWith(
            mockRegimen[0]
        );
    });

    it('should clear cyclesForSelectedRegimen if selectedRegimenType has no action', () => {
        component.selectedRegimenType = {
            ...mockRegimen[0],
            action: undefined,
        };
        component.onRegimenTypeChange();
        expect(component.cyclesForSelectedRegimen).toEqual([]);
    });

    it('should reset medicationDays and selectedMedicationDay when no cycle is selected', () => {
        component.medicationDays = mockRegimen[0].action[0].action;
        component.selectedMedicationDay = mockRegimen[0].action[0].action[0];
        component.selectedCycle = null;
        component.onCycleChange();

        expect(component.medicationDays).toEqual([]);
        expect(component.selectedMedicationDay).toBeNull();
    });

    it('should update medicationDays when a valid cycle is selected and reset selectedMedicationDay', () => {
        component.medicationDays = [];
        component.selectedMedicationDay = mockRegimen[0].action[0].action[0];
        component.selectedCycle = mockRegimen[0].action[0];

        component.onCycleChange();

        expect(component.medicationDays).toEqual(
            mockRegimen[0].action[0].action
        );
        expect(component.selectedMedicationDay).toBeNull();
    });

    it('should reset medicationDays and selectedMedicationDay when cycle has no actions', () => {
        component.medicationDays = mockRegimen[0].action[0].action;
        component.selectedMedicationDay = mockRegimen[0].action[0].action[0];
        component.selectedCycle = {
            ...mockRegimen[0].action[0],
            action: undefined,
        };

        component.onCycleChange();

        expect(component.medicationDays).toEqual([]);
        expect(component.selectedMedicationDay).toBeNull();
    });

    it('should clear medicationDays if selectedCycle has no action', () => {
        component.selectedCycle = {
            ...mockRegimen[0].action[0],
            action: undefined,
        };
        component.onCycleChange();
        expect(component.medicationDays).toEqual([]);
    });

    it('should set selectedMedicationDay when onSelectMedicationDay is called', () => {
        const mockDay = mockRegimen[0].action[0].action[0];
        component.onSelectMedicationDay(mockDay);
        expect(component.selectedMedicationDay).toEqual(mockDay);
    });

    describe('ngOnChanges', () => {
        it('should update regimenTypes when planDefinitionData changes', () => {
            const newPlanDefinitionData = [
                { id: 'plan1', name: 'New Regimen 1', action: [] },
                { id: 'plan2', name: 'New Regimen 2', action: [] },
            ];

            component.ngOnChanges({
                planDefinitionData: new SimpleChange(
                    null,
                    newPlanDefinitionData,
                    true
                ),
            });

            expect(component.regimenTypes).toEqual(newPlanDefinitionData);
        });

        it('should not update regimenTypes when planDefinitionData is undefined', () => {
            component.regimenTypes = mockRegimen;

            component.ngOnChanges({
                planDefinitionData: new SimpleChange(null, undefined, true),
            });

            expect(component.regimenTypes).toEqual(mockRegimen);
        });

        it('should not update regimenTypes when planDefinitionData is null', () => {
            component.regimenTypes = mockRegimen;

            component.ngOnChanges({
                planDefinitionData: new SimpleChange(null, null, true),
            });

            expect(component.regimenTypes).toEqual(mockRegimen);
        });

        it('should not update regimenTypes when changes do not include planDefinitionData', () => {
            component.regimenTypes = mockRegimen;

            component.ngOnChanges({
                otherProperty: new SimpleChange(null, 'some value', true),
            });

            expect(component.regimenTypes).toEqual(mockRegimen);
        });

        it('should handle empty array in planDefinitionData', () => {
            component.regimenTypes = mockRegimen;

            component.ngOnChanges({
                planDefinitionData: new SimpleChange(null, [], true),
            });

            expect(component.regimenTypes).toEqual([]);
        });
    });

    describe('cycle information card functionality', () => {
        it('should set cycleSelectedFlag to false when no cycle is selected', () => {
            component.cycleSelectedFlag = true;
            component.selectedCycle = null;
            component.onCycleChange();

            expect(component.cycleSelectedFlag).toBeFalse();
        });

        it('should convert period unit codes to human-readable strings', () => {
            expect(component.getCyclePeriodUnit('d')).toBe('day(s)');
            expect(component.getCyclePeriodUnit('wk')).toBe('week(s)');
            expect(component.getCyclePeriodUnit('mo')).toBe('month(s)');
            expect(component.getCyclePeriodUnit('a')).toBe('year(s)');
            expect(component.getCyclePeriodUnit('unknown')).toBe('unknown');
            expect(component.getCyclePeriodUnit(undefined)).toBe('');
        });

        it('should calculate total duration correctly', () => {
            const cycleMock = {
                timingTiming: {
                    repeat: {
                        count: 4,
                        frequency: 1,
                        period: 2,
                        periodUnit: 'wk',
                    },
                },
            };

            expect(component.calculateTotalDuration(cycleMock)).toBe(
                '8 week(s)'
            );
        });

        it('should handle missing repeat data in calculateTotalDuration', () => {
            expect(component.calculateTotalDuration({})).toBe('Not available');
            expect(component.calculateTotalDuration({ timingTiming: {} })).toBe(
                'Not available'
            );
        });

        it('should handle missing count or period in calculateTotalDuration', () => {
            const cycleNoCount = {
                timingTiming: {
                    repeat: {
                        period: 2,
                        periodUnit: 'wk',
                    },
                },
            };

            const cycleNoPeriod = {
                timingTiming: {
                    repeat: {
                        count: 4,
                        periodUnit: 'wk',
                    },
                },
            };

            expect(component.calculateTotalDuration(cycleNoCount)).toBe(
                'Not available'
            );
            expect(component.calculateTotalDuration(cycleNoPeriod)).toBe(
                'Not available'
            );
        });
    });
});
