interface DosageInstruction {
    dose_quantity: number;
    dose_unit: string;
    period: string;
    period_unit: string;
    frequency: number;
    duration: string;
    duration_unit: string;
    start_date: string;
    end_date: string;
    condition: string;
    patient_instruction: string;
}

interface SingleDosageInstruction extends DosageInstruction {
    id: string;
    created_by_name: string;
    updated_by_name: string;
    active: boolean;
    route?: string | null;
    additional_instruction: string | null;
    prescription: string;
}

interface BasePrescriptionModel {
    medication_name: string;
    service_request: string;
    patient: string;
}
export interface PrescriptionModel extends BasePrescriptionModel {
    priority: string;
    dosage: Array<DosageInstruction>;
}

export interface SinglePrescriptionModel extends BasePrescriptionModel {
    id: string;
    status: string;
    dosage: Array<SingleDosageInstruction>;
}
