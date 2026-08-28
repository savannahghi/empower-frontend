export interface Questionnaire {
    resourceType: string;
    id: string;
    title: string;
    status: string;
    description?: string;
    item: QuestionnaireItem[];
}

export interface QuestionnaireItem {
    linkId: string;
    text: string;
    type: string;
    required?: boolean;
    readOnly?: boolean;
    repeats?: boolean;
    answerOption?: AnswerOption[];
    item?: QuestionnaireItem[];
    enableWhen?: EnableWhen[];
    enableBehavior?: string;
    extension?: Extension[];
    prefix?: string;
}

export interface AnswerOption {
    valueCoding?: {
        display: string;
    };
    extension?: Extension[];
}

export interface EnableWhen {
    question: string;
    operator: string;
    answerCoding?: {
        display: string;
    };
    answerBoolean?: boolean;
}

export interface Extension {
    url: string;
    valueCodeableConcept?: {
        coding: {
            code: string;
            display: string;
            system: string;
        }[];
    };
    valueBoolean?: boolean;
    valueExpression?: any;
    valueDecimal?: number;
}
