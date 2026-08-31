export interface PatientTimelineInterface {
    date?: Date;
    Observation?: DetailsInterface[];
    Exam?: DetailsInterface[];
    Laboratory?: DetailsInterface[];
    Condition?: DetailsInterface[];
    AllergyIntolerance?: DetailsInterface[];
    RiskAssessment?: DetailsInterface[];
}

export interface DetailsInterface {
    name: string;
    value: string;
}
