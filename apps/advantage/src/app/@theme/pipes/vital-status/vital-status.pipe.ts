import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe used to return colour intention based on status of a visit/appointment
 */
@Pipe({
    name: 'vitalStatus',
    standalone: false,
})
export class VitalStatusPipe implements PipeTransform {
    transform(value: any) {
        if (
            value === 'Very Low' ||
            value === 'Very High' ||
            value === 'Severe Acute Malnutrition' ||
            value === 'Severe Thinness' ||
            value === 'Critical' ||
            value === 'Hypertensive Crisis' ||
            value === 'Grade 1 Hypertension' ||
            value === 'Grade 2 Hypertension' ||
            value === 'Grade 3 Hypertension' ||
            value === 'Obese Class III'
        ) {
            return '#e10000';
        } else if (
            value === 'High' ||
            value === 'Low' ||
            value === 'Elevated' ||
            value === 'Decreased' ||
            value === 'Decreated' ||
            value === 'Overweight' ||
            value === 'High BP Stage 1' ||
            value === 'High BP Stage 2' ||
            value === 'Moderate Acute Malnutrition' ||
            value === 'Growth Promotion and Monitoring' ||
            value === 'Moderate Thinness' ||
            value === 'Mild Thinness' ||
            value === 'Obese Class I' ||
            value === 'Obese Class II'
        ) {
            return '#ea9326';
        } else if (value === undefined) {
            return '';
        } else {
            return 'green';
        }
    }
}
