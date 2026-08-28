export const visitTypes = {
    Inpatient: 'IMP',
    Outpatient: 'AMB',
    Emergency: 'EMER',
    Field: 'FLD',
    HomeHealth: 'HH',
    InpatientAcute: 'ACUTE',
    InpatientNonAcute: 'NONAC',
    ObservationEncounter: 'OBSENC',
    PreAdmission: 'PRENC',
    ShortStay: 'SS',
    Virtual: 'VR',
    Chemotherapy: 'CHEMO',
    Radiotherapy: 'RADIO',
    Surgery: 'SURG',
} as const;

export type VisitTypeKey = keyof typeof visitTypes;
export type VisitTypeCode = (typeof visitTypes)[VisitTypeKey];
export interface VisitTypeModel {
    value: VisitTypeCode;
}
