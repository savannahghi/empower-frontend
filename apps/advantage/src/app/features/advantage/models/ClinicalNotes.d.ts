// composition
export interface CompositionNoteInterface {
    text?: string;
    date?: Date;
}

// diagnosis
export interface DiagnosisInterface {
    name?: string;
    status?: string;
    note?: string;
    onsetDate?: Date;
    recordedDate?: Date;
}

// allergy
export interface AllergyInterface {
    name?: string;
    reaction?: ReactionInterface;
}

export interface ReactionInterface {
    severity?: string;
}

// problem
export interface ProblemInterface {
    name?: string;
    note?: string;
    onsetDate?: Date;
    recordedDate?: Date;
}

// observation
export interface ObservationInterface {
    name?: string;
    value?: string;
    status?: string;
    timeRecorded?: string;
    note?: string;
}
