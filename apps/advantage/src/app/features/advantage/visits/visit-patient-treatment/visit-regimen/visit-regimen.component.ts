import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    Input,
    OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    NbSelectModule,
    NbIconModule,
    NbCardModule,
    NbButtonModule,
} from '@nebular/theme';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
    selector: 'ngx-visit-regimen',
    imports: [
        CommonModule,
        FormsModule,
        NbCardModule,
        NbSelectModule,
        NbIconModule,
        NbButtonModule,
        NgxSkeletonLoaderModule,
    ],
    templateUrl: './visit-regimen.component.html',
    styleUrl: './visit-regimen.component.scss',
})
export class VisitRegimenComponent implements OnInit, OnChanges {
    regimenTypes: any[] = [];
    selectedRegimenType: any = null;
    selectedCycle: any = null;
    medicationDays: any[] = [];
    cyclesForSelectedRegimen: any[] = [];
    selectedMedicationDay: any = null;
    cycleSelectedFlag: boolean = false;

    @Input() isChild: boolean = false;
    @Input() cancerType: string | null = null;
    @Input() patientId: string | null = null;
    @Input() encounterId: string | null = null;
    @Input() planDefinitionData: any[] = [];

    @Output() customFxn = new EventEmitter<void>();
    @Output() medicationDaySelected = new EventEmitter<any>();
    @Output() regimenSelected = new EventEmitter<any>();

    ngOnInit() {
        if (this.planDefinitionData && this.planDefinitionData.length > 0) {
            this.regimenTypes = this.planDefinitionData;
        }
    }

    /**
     * Updates regimen types when plan definition data changes
     * @param changes SimpleChanges object containing changes
     */
    ngOnChanges(changes: any) {
        if (
            changes.planDefinitionData &&
            changes.planDefinitionData.currentValue
        ) {
            this.regimenTypes = changes.planDefinitionData.currentValue;
        }
    }

    onRegimenTypeChange() {
        this.selectedCycle = null;
        this.medicationDays = [];
        this.selectedMedicationDay = null;

        if (this.selectedRegimenType && this.selectedRegimenType.action) {
            this.cyclesForSelectedRegimen = this.selectedRegimenType.action;
            this.regimenSelected.emit(this.selectedRegimenType);
        } else {
            this.cyclesForSelectedRegimen = [];
        }
    }

    onCycleChange() {
        this.selectedMedicationDay = null;
        this.medicationDays = [];

        if (this.selectedCycle && this.selectedCycle.action) {
            this.medicationDays = this.selectedCycle.action;
            this.cycleSelectedFlag = true;
        } else {
            this.cycleSelectedFlag = false;
        }
    }

    /**
     * Converts the period unit code to a human-readable string
     * @param periodUnit The period unit code from the API
     * @returns A human-readable period unit string
     */
    getCyclePeriodUnit(periodUnit: string | undefined): string {
        if (!periodUnit) return '';

        const unitMap = {
            d: 'day(s)',
            wk: 'week(s)',
            mo: 'month(s)',
            a: 'year(s)',
        };

        return unitMap[periodUnit] || periodUnit;
    }

    /**
     * Calculates the total duration of the treatment cycle
     * @param cycle The cycle information object
     * @returns A human-readable string representing the total duration
     */
    calculateTotalDuration(cycle: any): string {
        if (!cycle?.timingTiming?.repeat) return 'Not available';

        const repeat = cycle.timingTiming.repeat;
        const count = repeat.count || 0;
        const period = repeat.period || 0;
        const periodUnit = this.getCyclePeriodUnit(repeat.periodUnit);

        if (count && period) {
            const totalPeriod = count * period;
            return `${totalPeriod} ${periodUnit}`;
        }

        return 'Not available';
    }

    onSelectMedicationDay(day: any) {
        this.selectedMedicationDay = day;
        this.medicationDaySelected.emit(day);
    }
}
