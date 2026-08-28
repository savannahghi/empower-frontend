/**
 * List of imports used in the injectable
 */
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SilStoresService } from '../../../sil-http-services/sil_datalayer.service';
import { AuthenticationService } from '../../../../@core/auth/services/authentication.service';

/**
 * Allows service to be injectable into formly component
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Class that defines billing form controls, methods
 */
export class PatientVitalFieldsService {
    /**
     * Observable that loads the products
     */
    products$: Observable<any>;
    /**
     * Subject that checks the product search
     */
    productsInput$ = new Subject<string>();
    /**
     * Used to control loading for search
     */
    loading: boolean = false;
    /**
     * Stores the search term
     */
    term: string;
    /**
     * Stores instance of the form component
     */
    component: any;
    /**
     * Stores the form model data
     */
    model: any;

    /** stores the type of vital opened */
    vitalType: Record<string, boolean>;

    /** store vital reference */
    vitalReference: Record<string, any[]>;

    vitalValue: any;

    /** determines if model is being editted */
    isEditing: boolean;

    /**
     * Imports datalayer for service calls
     * and the error handler for http calls
     */
    constructor(
        public dataLayer: SilStoresService,
        public auth: AuthenticationService
    ) {}

    /**
     * Fields loaded in the formly
     * @returns fields used in the formly component
     */
    fields(): any[] {
        return [
            {
                key: 'pulse',
                type: 'input',
                className: `col-12 col-sm-6 pe-sm-1`,
                hideExpression: !this.checkField('pulse', this.vitalType),
                props: {
                    placeholder: 'Enter BPM(Pulse)',
                    label: 'Pulse(BPM)',
                },
                validators: {
                    pulse: {
                        expression: (control, field) => {
                            const number = parseInt(control.value, 10);
                            if (isNaN(number)) return false;
                            const ifPositive = number >= 10;
                            if (field?.model?.pulse) {
                                return ifPositive && number <= 201;
                            } else {
                                return ifPositive;
                            }
                        },
                    },
                },
                expressions: {
                    'model.pulse': field => {
                        return field?.model?.value;
                    },
                },
            },
            {
                key: 'pulseReference',
                type: '',
                className: `col-12 col-sm-6 pe-sm-1`,
                hideExpression:
                    '!model.pulse || ' +
                    !this.checkField('pulse', this.vitalType),
                expressionProperties: {
                    template: control => {
                        if (!this.vitalReference && !control.pulse) {
                            return;
                        }
                        return this.vitalReference.PULSE_RATE.filter(
                            item =>
                                item.start <= control.pulse &&
                                control.pulse < item.end
                        ).map((pulse: any) => {
                            return `<div class="card ms-5">
                                        <div class="text-center card-body">
                                            <div class="fs-13 card-subtitle fw-bolder mb-2">
                                            <span class="d-block ${this.vitalStatus(
                                                pulse.display
                                            )}"> ${pulse.display}</span>
                                            </div>
                                            <div class="fs-6 fw-semibold">${
                                                pulse.start
                                            } - ${
                                pulse.end
                            } <span class="fs-6 fw-normal">BPM</span></div>
                                        </div>
                                    </div>
                                    `;
                        });
                    },
                },
            },
            {
                key: 's_bp',
                type: 'input',
                hideExpression: !this.checkField('s_bp', this.vitalType),
                className: `col-12 col-sm-6 pe-sm-1`,
                props: {
                    placeholder: 'Enter Systolic Blood Pressure',
                    label: 'Systolic Blood Pressure(mmHg)',
                },
                validators: {
                    s_bp: {
                        expression: (control, field) => {
                            const number = parseInt(control.value, 10);
                            const ifPositive = number > 0;
                            if (field?.model?.s_bp) {
                                return ifPositive && number <= 301;
                            } else {
                                return ifPositive;
                            }
                        },
                    },
                },
                expressions: {
                    'model.s_bp': field => {
                        return field?.model?.value;
                    },
                },
            },
            {
                key: 's_bpReference',
                type: '',
                hideExpression:
                    '!model.s_bp || ' +
                    !this.checkField('s_bp', this.vitalType),
                className: 'col-12 col-sm-6 pe-sm-1',
                expressionProperties: {
                    template: control => {
                        if (!this.vitalReference && !control.s_bp) {
                            return;
                        }
                        return this.vitalReference.SYSTOLIC_BLOOD_PRESSURE.filter(
                            item =>
                                item.start <= control.s_bp &&
                                control.s_bp < item.end
                        ).map(
                            (bp: any) =>
                                `<div class="card ms-5">
                                        <div class="card-body text-center">
                                            <div class="fs-13 card-subtitle fw-bolder mb-2">
                                             <span class="d-block ${this.vitalStatus(
                                                 bp.display
                                             )}"> ${bp.display} </span></div>
                                            <div class="fs-6 fw-semibold">
                                            ${bp.start} - ${
                                    bp.end
                                } <span class="fs-6 fw-normal">mmHg</span>
                                </div>
                                        </div>
                                    </span>
                                    `
                        );
                    },
                },
            },
            {
                key: 'd_bp',
                type: 'input',
                hideExpression: !this.checkField('d_bp', this.vitalType),
                className: `col-12 col-sm-6 pe-sm-1`,
                props: {
                    placeholder: 'Enter Diastolic Blood Pressure',
                    label: 'Diastolic Blood Pressure(mmHg)',
                },
                validators: {
                    d_bp: {
                        expression: (control, field) => {
                            const number = parseInt(control.value, 10);
                            const ifPositive = number > 0;
                            if (field?.model?.d_bp) {
                                return ifPositive && number <= 301;
                            } else {
                                return ifPositive;
                            }
                        },
                    },
                },
                expressions: {
                    'model.d_bp': field => {
                        return field?.model?.value;
                    },
                },
            },
            {
                key: 'd_bpReference',
                type: '',
                hideExpression:
                    '!model.d_bp || ' +
                    !this.checkField('d_bp', this.vitalType),
                className: 'col-12 col-sm-6 pe-sm-1',
                expressionProperties: {
                    template: control => {
                        if (!this.vitalReference && !control.d_bp) {
                            return;
                        }
                        return this.vitalReference.DIASTOLIC_BLOOD_PRESSURE.filter(
                            item =>
                                item.start <= control.d_bp &&
                                control.d_bp < item.end
                        ).map(
                            (bp: any) =>
                                `<div class="card ms-5">
                                        <div class="card-body text-center">
                                            <div class="fs-13 card-subtitle fw-bolder mb-2">
                                             <span class="d-block ${this.vitalStatus(
                                                 bp.display
                                             )}"> ${bp.display} </span></div>
                                            <div class="fs-6 fw-semibold">
                                            ${bp.start} - ${
                                    bp.end
                                } <span class="fs-6 fw-normal">mmHg</span>
                                </div>
                                        </div>
                                    </span>
                                    `
                        );
                    },
                },
            },
            {
                key: 'temperature',
                type: 'input',
                hideExpression: !this.checkField('temperature', this.vitalType),
                className: `col-12 col-sm-6 pe-sm-1`,
                props: {
                    placeholder: 'Enter Temperature',
                    label: 'Temperature (°C)',
                },
                validators: {
                    temperature: {
                        expression: (control, field) => {
                            const number = parseInt(control.value, 10);
                            const ifPositive = number > 0;
                            if (field?.model?.temperature) {
                                return ifPositive && number <= 50.1;
                            } else {
                                return ifPositive;
                            }
                        },
                    },
                },
                expressions: {
                    'model.temperature': field => {
                        return field?.model?.value;
                    },
                },
            },
            {
                key: 'temperatureReference',
                type: '',
                hideExpression:
                    '!model.temperature || ' +
                    !this.checkField('temperature', this.vitalType),
                className: 'col-12 col-sm-6 pe-sm-1',
                expressionProperties: {
                    template: control => {
                        if (!this.vitalReference && !control.temperature) {
                            return;
                        }
                        return this.vitalReference.TEMPERATURE.filter(
                            item =>
                                item.start <= control.temperature &&
                                control.temperature < item.end
                        ).map(
                            (temperature: any) =>
                                `<div class="card ms-5">
                                        <div class="card-body text-center">
                                            <div class="fs-13 card-subtitle fw-bolder mb-2">
                                            <span class="d-block ${this.vitalStatus(
                                                temperature.display
                                            )}"> ${
                                    temperature.display
                                }</span></div>
                                            <div class="fs-6 fw-semibold">${
                                                temperature.start
                                            } - ${
                                    temperature.end
                                } <span class="fs-6 fw-normal">°C</span></div>
                                        </div>
                                    </div>
                                    `
                        );
                    },
                },
            },
            {
                key: 'oxygenSaturation',
                type: 'input',
                hideExpression: !this.checkField(
                    'oxygenSaturation',
                    this.vitalType
                ),
                className: `col-12 col-sm-6 pe-sm-1`,
                props: {
                    placeholder: 'Enter Oxygen Saturation',
                    label: 'Oxygen Saturation (%)',
                },
                validators: {
                    oxygenSaturation: {
                        expression: (control, field) => {
                            const number = parseInt(control.value, 10);
                            const ifPositive = number > 0;
                            if (field?.model?.oxygenSaturation) {
                                return ifPositive && number <= 101;
                            } else {
                                return ifPositive;
                            }
                        },
                    },
                },
                expressions: {
                    'model.oxygenSaturation': field => {
                        return field?.model?.value;
                    },
                },
            },
            {
                key: 'oxygenSaturationReference',
                type: '',
                hideExpression:
                    '!model.oxygenSaturation || ' +
                    !this.checkField('oxygenSaturation', this.vitalType),
                className: 'col-12 col-sm-6 pe-sm-1',
                expressionProperties: {
                    template: control => {
                        if (!this.vitalReference && !control.oxygenSaturation) {
                            return;
                        }
                        return this.vitalReference.SPO2.filter(
                            item =>
                                item.start <= control.oxygenSaturation &&
                                control.oxygenSaturation < item.end
                        ).map(
                            (oxy: any) =>
                                `<div class="card ms-5">
                                        <div class="card-body text-center">
                                            <div class="fs-13 card-subtitle fw-bolder mb-2">
                                            <span class="d-block ${this.vitalStatus(
                                                oxy.display
                                            )}"> ${oxy.display}</span></div>
                                            <div class="fs-6 fw-semibold">${
                                                oxy.start
                                            } - ${
                                    oxy.end
                                } <span class="fs-6 fw-normal">%</span></div>
                                        </div>
                                    </div>
                                    `
                        );
                    },
                },
            },
            {
                key: 'respirationRate',
                type: 'input',
                hideExpression: !this.checkField(
                    'respirationRate',
                    this.vitalType
                ),
                className: `col-12 col-sm-6 pe-sm-1`,
                props: {
                    placeholder: 'Enter Respiration Rate',
                    label: 'Respiration Rate (BPM)',
                },
                validators: {
                    respirationRate: {
                        expression: (control, field) => {
                            const number = parseInt(control.value, 10);
                            const ifPositive = number > 0;
                            if (field?.model?.respirationRate) {
                                return ifPositive && number <= 101;
                            } else {
                                return ifPositive;
                            }
                        },
                    },
                },
                expressions: {
                    'model.respirationRate': field => {
                        return field?.model?.value;
                    },
                },
            },
            {
                key: 'respirationRateReference',
                type: '',
                hideExpression:
                    '!model.respirationRate || ' +
                    !this.checkField('respirationRate', this.vitalType),
                className: 'col-12 col-sm-6 pe-sm-1',
                expressionProperties: {
                    template: control => {
                        if (!this.vitalReference && !control.respirationRate) {
                            return;
                        }
                        return this.vitalReference.RESPIRATION_RATE.filter(
                            item =>
                                item.start <= control.respirationRate &&
                                control.respirationRate < item.end
                        ).map(
                            (resRate: any) =>
                                `<div class="card ms-5">
                                        <div class="card-body text-center">
                                            <div class="fs-13 card-subtitle fw-bolder mb-2">
                                            <span class="d-block ${this.vitalStatus(
                                                resRate.display
                                            )}">${resRate.display}</span></div>
                                            <div class="fs-6 fw-semibold">${
                                                resRate.start
                                            } - ${
                                    resRate.end
                                } <span class=" fs-6 fw-normal">%</span></div>
                                        </div>
                                    </div>
                                    `
                        );
                    },
                },
            },
            {
                key: 'weight',
                type: 'input',
                hideExpression: !this.checkField('weight', this.vitalType),
                className: `col-12 col-sm-6 pe-sm-1`,
                props: {
                    placeholder: 'Enter Weight',
                    label: 'Weight(kg)',
                },
                validators: {
                    weight: {
                        expression: (control, field) => {
                            const number = parseInt(control.value, 10);
                            const ifPositive = number > 0;
                            if (field?.model?.weight) {
                                return ifPositive && number <= 500;
                            } else {
                                return ifPositive;
                            }
                        },
                    },
                },
                expressions: {
                    'model.weight': field => {
                        return field?.model?.value;
                    },
                },
            },
            {
                key: 'height',
                type: 'input',
                hideExpression: !this.checkField('height', this.vitalType),
                className: `col-12 col-sm-6 pe-sm-1`,
                props: {
                    placeholder: 'Enter Height',
                    label: 'Height(cm)',
                },
                validators: {
                    height: {
                        expression: (control, field) => {
                            const number = parseInt(control.value, 10);
                            const ifPositive = number > 0;
                            if (field?.model?.height) {
                                return ifPositive && number <= 300;
                            } else {
                                return ifPositive;
                            }
                        },
                    },
                },
                expressions: {
                    'model.height': field => {
                        return field?.model?.value;
                    },
                },
            },
            {
                key: 'bmi',
                type: 'input',
                hideExpression: !this.checkField('bmi', this.vitalType),
                className: `col-12 col-sm-6 pe-sm-1`,
                props: {
                    placeholder: 'Enter BMI',
                    label: 'BMI (kg/m2)',
                },
                validators: {
                    bmi: {
                        expression: (control: any): boolean => {
                            if (!control.value) return true; // Empty values are valid (not required)
                            const number = parseFloat(control.value);
                            if (isNaN(number)) return false;
                            return number > 0;
                        },
                    },
                },
                expressions: {
                    'model.bmi': field => {
                        return field?.model?.value;
                    },
                },
            },
            {
                key: 'bmiReference',
                type: '',
                hideExpression:
                    '!model.bmi || ' + !this.checkField('bmi', this.vitalType),
                className: 'col-12 col-sm-6 pe-sm-1',
                expressionProperties: {
                    template: (control: any): string => {
                        if (
                            !this.vitalReference ||
                            !control?.bmi ||
                            !this.vitalReference.BMI
                        ) {
                            return '';
                        }
                        const results = this.vitalReference.BMI.filter(
                            item =>
                                item.start <= control.bmi &&
                                control.bmi < item.end
                        ).map(
                            (bmi: any) =>
                                `<div class="card ms-5">
                                        <div class="card-body text-center">
                                            <div class="fs-13 card-subtitle fw-bolder mb-2">
                                            <span class="d-block ${this.vitalStatus(
                                                bmi.display
                                            )}">${bmi.display}</span></div>
                                            <div class="fs-6 fw-semibold">${
                                                bmi.start
                                            }-${
                                    bmi.end
                                } <span class="fs-6 fw-normal">kg/m2</span></div>
                                        </div>
                                    </div>
                                    `
                        );
                        return results.join('');
                    },
                },
            },
            {
                key: 'muac',
                type: 'input',
                hideExpression: !this.checkField('muac', this.vitalType),
                className: `col-12 col-sm-6 pe-sm-1`,
                props: {
                    placeholder: 'Enter MUAC',
                    label: 'Muac(mm)',
                },
                validators: {
                    muac: {
                        expression: (control: any, field: any): boolean => {
                            if (!control.value) return true; // Empty values are valid (not required)
                            const number = parseFloat(control.value);
                            if (isNaN(number)) return false;
                            const ifPositive = number > 0;
                            if (field?.model?.muac) {
                                return ifPositive && number <= 25.2;
                            } else {
                                return ifPositive;
                            }
                        },
                    },
                },
                expressions: {
                    'model.muac': field => {
                        return field?.model?.value;
                    },
                },
            },
            {
                key: 'muacReference',
                type: '',
                hideExpression:
                    '!model.muac || ' +
                    !this.checkField('muac', this.vitalType),
                className: 'col-12 col-sm-6 pe-sm-1',
                expressionProperties: {
                    template: (control: any): string => {
                        if (
                            !this.vitalReference ||
                            !control?.muac ||
                            !this.vitalReference.MUAC
                        ) {
                            return '';
                        }
                        const results = this.vitalReference.MUAC.filter(
                            item =>
                                item.start <= control.muac &&
                                control.muac < item.end
                        ).map(
                            (muac: any) =>
                                `<div class="card ms-5">
                                        <div class="card-body text-center">
                                            <div class="fs-13 card-subtitle fw-bolder mb-2">
                                            <span class="d-block ${this.vitalStatus(
                                                muac.display
                                            )}">${muac.display}</span></div>
                                            <div class="fs-6 fw-semibold">${
                                                muac.start
                                            } - ${
                                    muac.end
                                } <span class=" fs-6 fw-normal">mm</span></div>
                                        </div>
                                    </div>
                                    `
                        );
                        return results.join('');
                    },
                },
            },
            {
                key: 'viralLoad',
                type: 'input',
                hideExpression: !this.checkField('viralLoad', this.vitalType),
                className: `col-12 col-sm-6 pe-sm-1`,
                props: {
                    placeholder: 'Enter Viral Load',
                    label: 'Viral Load',
                },
                validators: {
                    viralLoad: {
                        expression: (control: any): boolean => {
                            if (!control.value) return true; // Empty values are valid (not required)
                            const number = parseFloat(control.value);
                            if (isNaN(number)) return false;
                            return number > 0;
                        },
                    },
                },
                expressions: {
                    'model.viralLoad': field => {
                        return field?.model?.value;
                    },
                },
            },
            {
                key: 'note',
                type: 'textarea',
                className: 'col-12',
                props: {
                    placeholder: 'Add accompanying notes to the vital reading',
                    label: 'Notes',
                },
            },
        ];
    }

    /** vital status color pipe */
    vitalStatus(value: string): string {
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
            return 'text-danger';
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
            return 'text-warning';
        } else {
            return 'text-success';
        }
    }

    /**
     *  setComponent
     * Sets the component instance from the formly component
     */
    setComponent(component: any): void {
        this.component = component;
        this.vitalType = this.component.secondaryData[0];
        this.vitalReference =
            this.component.secondaryData[1]?.vitals_reference_ranges;
        this.vitalValue = this.component?.secondaryData[2]?.value;
        this.isEditing = this.component?.secondaryData[3]?.isEditing;
    }

    /** check type of dialogue opened to display the only fields needed for the dialogue*/
    checkField = (
        field: string,
        dialogueType: Record<string, boolean>
    ): boolean => {
        if (field === 'pulse' && dialogueType.pulse) {
            return true;
        } else if (field === 's_bp' && dialogueType.s_bp) {
            return true;
        } else if (field === 'd_bp' && dialogueType.d_bp) {
            return true;
        } else if (field === 'temperature' && dialogueType.temperature) {
            return true;
        } else if (
            field === 'oxygenSaturation' &&
            dialogueType.oxygenSaturation
        ) {
            return true;
        } else if (
            field === 'respirationRate' &&
            dialogueType.respirationRate
        ) {
            return true;
        } else if (field === 'weight' && dialogueType.weight) {
            return true;
        } else if (field === 'height' && dialogueType.height) {
            return true;
        } else if (field === 'bmi' && dialogueType.bmi) {
            return true;
        } else if (field === 'muac' && dialogueType.muac) {
            return true;
        } else if (field === 'viralLoad' && dialogueType.viralLoad) {
            return true;
        }
        return false;
    };
}
