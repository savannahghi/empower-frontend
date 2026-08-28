export interface ConditionsInterface {
    node: ConditionsNodeInterface;
}

export interface ConditionsNodeInterface {
    name: string;
    onsetDate: Date;
    reaction: ReactionsInterface;
}

export interface AllergyIntoleranceInterface {
    node: AllergyIntoleranceNodeInterface;
}

export interface AllergyIntoleranceNodeInterface {
    name: string;
    reaction: ReactionsInterface;
}

export interface MedicationsInterface {
    node: MedicationsNodeInterface;
}

export interface MedicationsNodeInterface {
    name: string;
}

export interface ReactionsInterface {
    severity: string;
}
