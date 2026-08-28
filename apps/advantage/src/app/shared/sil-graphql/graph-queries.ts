import { gql } from 'apollo-angular';
// We use the gql tag to parse our query stringinto a query document

/**  query PATIENT_HEALTH_TIMELINE */
const PATIENT_HEALTH_TIMELINE = gql`
    query patientHealthTimeline($healthTimeline: HealthTimelineInput!) {
        patientHealthTimeline(input: $healthTimeline) {
            totalCount
            timeline {
                id
                resourceType
                name
                value
                status
                date
                timeRecorded
                category
            }
        }
    }
`;

/**  query GET_PATIENT_HEIGHT_ENTRIES */
const GET_PATIENT_HEIGHT_ENTRIES = gql`
    query getPatientHeightEntries(
        $patientID: String!
        $encounterID: String
        $pagination: PaginationInput!
    ) {
        getPatientHeightEntries(
            patientID: $patientID
            encounterID: $encounterID
            pagination: $pagination
        ) {
            totalCount
            edges {
                node {
                    id
                    status
                    patientID
                    encounterID
                    name
                    value
                    timeRecorded
                }
            }
        }
    }
`;

/**  query GET_PATIENT_HEIGHT_ENTRIES */
const GET_PATIENT_WEIGHT_ENTRIES = gql`
    query getPatientWeightEntries(
        $patientID: String!
        $encounterID: String
        $pagination: PaginationInput!
    ) {
        getPatientWeightEntries(
            patientID: $patientID
            encounterID: $encounterID
            pagination: $pagination
        ) {
            totalCount
            edges {
                node {
                    id
                    status
                    patientID
                    encounterID
                    name
                    value
                    timeRecorded
                }
            }
        }
    }
`;
/**  query GET_PATIENT_BMI_ENTRIES */
const GET_PATIENT_BMI_ENTRIES = gql`
    query getPatientBMIEntries(
        $patientID: String!
        $encounterID: String
        $pagination: PaginationInput!
    ) {
        getPatientBMIEntries(
            patientID: $patientID
            encounterID: $encounterID
            pagination: $pagination
        ) {
            totalCount
            edges {
                node {
                    id
                    status
                    patientID
                    encounterID
                    name
                    value
                    timeRecorded
                }
            }
        }
    }
`;

/**  query GET_PATIENT_SYSTOLIC_BLOOD_PRESSURE_ENTRIES */
const GET_PATIENT_SYSTOLIC_BLOOD_PRESSURE_ENTRIES = gql`
    query getPatientBloodPressureEntries(
        $patientID: String!
        $encounterID: String
        $pagination: PaginationInput!
    ) {
        getPatientBloodPressureEntries(
            patientID: $patientID
            encounterID: $encounterID
            pagination: $pagination
        ) {
            totalCount
            edges {
                node {
                    id
                    status
                    patientID
                    encounterID
                    name
                    value
                    note
                    timeRecorded
                }
            }
        }
    }
`;

/** query EMPOWER_GET_RISK_LEVEL */
const EMPOWER_GET_RISK_LEVEL = gql`
    query getQuestionnaireResponseRiskLevel(
        $encounterID: String!
        $screeningType: ScreeningTypeEnum!
    ) {
        getQuestionnaireResponseRiskLevel(
            encounterID: $encounterID
            screeningType: $screeningType
        )
    }
`;

/**  query GET_PATIENT_DIASTOLIC_BLOOD_PRESSURE_ENTRIES */
const GET_PATIENT_DIASTOLIC_BLOOD_PRESSURE_ENTRIES = gql`
    query getPatientDiastolicBloodPressureEntries(
        $patientID: String!
        $encounterID: String
        $pagination: PaginationInput!
    ) {
        getPatientDiastolicBloodPressureEntries(
            patientID: $patientID
            encounterID: $encounterID
            pagination: $pagination
        ) {
            totalCount
            edges {
                node {
                    id
                    status
                    patientID
                    encounterID
                    name
                    value
                    note
                    timeRecorded
                }
            }
        }
    }
`;

/**  query GET_PATIENT_PULSE_RATE_ENTRIES */
const GET_PATIENT_PULSE_RATE_ENTRIES = gql`
    query getPatientPulseRateEntries(
        $patientID: String!
        $encounterID: String
        $pagination: PaginationInput!
    ) {
        getPatientPulseRateEntries(
            patientID: $patientID
            encounterID: $encounterID
            pagination: $pagination
        ) {
            totalCount
            edges {
                node {
                    id
                    status
                    patientID
                    encounterID
                    name
                    value
                    note
                    timeRecorded
                }
            }
        }
    }
`;

/**  query GET_PATIENT_RESPIRATORY_RATE_ENTRIES */
const GET_PATIENT_RESPIRATORY_RATE_ENTRIES = gql`
    query getPatientRespiratoryRateEntries(
        $patientID: String!
        $encounterID: String
        $pagination: PaginationInput!
    ) {
        getPatientRespiratoryRateEntries(
            patientID: $patientID
            encounterID: $encounterID
            pagination: $pagination
        ) {
            totalCount
            edges {
                node {
                    id
                    status
                    patientID
                    encounterID
                    name
                    value
                    note
                    timeRecorded
                }
            }
        }
    }
`;

/**  query GET_PATIENT_VIRAL_LOAD */
const GET_PATIENT_VIRAL_LOAD = gql`
    query getPatientViralLoad(
        $patientID: ID!
        $encounterID: String
        $pagination: PaginationInput!
    ) {
        getPatientViralLoad(
            patientID: $patientID
            encounterID: $encounterID
            pagination: $pagination
        ) {
            totalCount
            edges {
                node {
                    id
                    status
                    patientID
                    encounterID
                    name
                    value
                    note
                    timeRecorded
                }
            }
        }
    }
`;

/**  query GET_PATIENT_TEMPERATURE_ENTRIES */
const GET_PATIENT_TEMPERATURE_ENTRIES = gql`
    query getPatientTemperatureEntries(
        $patientID: String!
        $encounterID: String
        $pagination: PaginationInput!
    ) {
        getPatientTemperatureEntries(
            patientID: $patientID
            encounterID: $encounterID
            pagination: $pagination
        ) {
            totalCount
            edges {
                node {
                    id
                    status
                    patientID
                    encounterID
                    name
                    value
                    note
                    timeRecorded
                }
            }
        }
    }
`;

/**  query GET_PATIENT_OXYGEN_SATURATION_ENTRIES */
const GET_PATIENT_OXYGEN_SATURATION_ENTRIES = gql`
    query getPatientOxygenSaturationEntries(
        $patientID: String!
        $encounterID: String
        $pagination: PaginationInput!
    ) {
        getPatientOxygenSaturationEntries(
            patientID: $patientID
            encounterID: $encounterID
            pagination: $pagination
        ) {
            totalCount
            edges {
                node {
                    id
                    status
                    patientID
                    encounterID
                    name
                    value
                    note
                    timeRecorded
                }
            }
        }
    }
`;

/**  query GET_PATIENT_MUAC_ENTRIES */
const GET_PATIENT_MUAC_ENTRIES = gql`
    query getPatientMuacEntries(
        $patientID: String!
        $encounterID: String
        $pagination: PaginationInput!
    ) {
        getPatientMuacEntries(
            patientID: $patientID
            encounterID: $encounterID
            pagination: $pagination
        ) {
            totalCount
            edges {
                node {
                    id
                    status
                    patientID
                    encounterID
                    name
                    value
                    note
                    timeRecorded
                }
            }
        }
    }
`;

/**  query LIST_PATIENT_ENCOUNTERS */
const LIST_PATIENT_ENCOUNTERS = gql`
    query listPatientEncounters(
        $patientID: String!
        $pagination: PaginationInput!
    ) {
        listPatientEncounters(patientID: $patientID, pagination: $pagination) {
            totalCount
            edges {
                node {
                    id
                    class
                    episodeOfCareID
                    status
                    patientID
                }
            }
        }
    }
`;

/**  query GET_EPISODE_OF_CARE */
const GET_EPISODE_OF_CARE = gql`
    query getEpisodeOfCare($episodeID: ID!) {
        getEpisodeOfCare(id: $episodeID) {
            id
            status
            patientID
        }
    }
`;

/**  query GET_ALLERGY */
const GET_ALLERGY = gql`
    query getAllergy($allergyId: ID!) {
        getAllergy(id: $allergyId) {
            id
            code
            name
            terminologySource
            reaction {
                code
                name
                severity
            }
        }
    }
`;

/**  query GET_ALLERGY */
const SEARCH_ALLERGY = gql`
    query searchAllergy($allergyName: String!, $pagination: PaginationInput!) {
        searchAllergy(name: $allergyName, pagination: $pagination) {
            totalCount
            edges {
                node {
                    code
                    system
                    name
                }
            }
        }
    }
`;

/**  query GET_MEDICAL_DATA */
const GET_MEDICAL_DATA = gql`
    query getMedicalData($patientID: String!) {
        getMedicalData(patientID: $patientID) {
            regimen {
                status
                medication {
                    name
                    code
                }
            }
            allergies {
                code
                name
                terminologySource
                reaction {
                    code
                    name
                    severity
                }
            }
            weight {
                status
                name
                value
            }
            bmi {
                status
                name
                value
            }
            viralLoad {
                status
                name
                value
            }
            cd4Count {
                status
                name
                value
            }
        }
    }
`;

/**  query GET_MEDICATION */
const GET_MEDICATION = gql`
    query getMedicalData($patientID: String!) {
        getMedicalData(patientID: $patientID) {
            regimen {
                status
                medication {
                    name
                    code
                }
            }
        }
    }
`;

/**  query GET_QUESTIONNAIRE_RESPONSE_RISK_LEVEL */
const GET_QUESTIONNAIRE_RESPONSE_RISK_LEVEL = gql`
    query getQuestionnaireResponseRiskLevel($questionnaireResponseID: String!) {
        getQuestionnaireResponseRiskLevel(
            questionnaireResponseID: $questionnaireResponseID
        )
    }
`;

/**  query LIST_QUESTIONNAIRES */
const LIST_QUESTIONNAIRES = gql`
    query listQuestionnaires($pagination: PaginationInput!) {
        listQuestionnaires(pagination: $pagination) {
            totalCount
            edges {
                node {
                    id
                    resourceType
                    name
                    title
                    status
                    description
                    purpose
                    item {
                        type
                        linkId
                        text
                        required
                        repeats
                        readOnly
                        item {
                            type
                            linkId
                            text
                            required
                            repeats
                            readOnly
                            answerOption {
                                valueCoding {
                                    display
                                }
                                extension {
                                    url
                                    valueDecimal
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

/**  query LIST_QUESTIONNAIRES */
const GET_QUESTIONNAIRE_RESPONSES = gql`
    query simpleQuestionnaireResponse($questionnaireID: String!) {
        simpleQuestionnaireResponse(questionnaireResponseID: $questionnaireID) {
            group
            questions {
                question
                answer
                childQuestions {
                    question
                    answer
                }
            }
        }
    }
`;

export const queries = {
    PATIENT_HEALTH_TIMELINE,
    GET_PATIENT_HEIGHT_ENTRIES,
    GET_PATIENT_WEIGHT_ENTRIES,
    GET_PATIENT_BMI_ENTRIES,
    GET_PATIENT_SYSTOLIC_BLOOD_PRESSURE_ENTRIES,
    GET_PATIENT_DIASTOLIC_BLOOD_PRESSURE_ENTRIES,
    GET_PATIENT_PULSE_RATE_ENTRIES,
    GET_PATIENT_RESPIRATORY_RATE_ENTRIES,
    GET_PATIENT_TEMPERATURE_ENTRIES,
    GET_PATIENT_OXYGEN_SATURATION_ENTRIES,
    GET_PATIENT_MUAC_ENTRIES,
    GET_PATIENT_VIRAL_LOAD,
    LIST_PATIENT_ENCOUNTERS,
    GET_EPISODE_OF_CARE,
    GET_ALLERGY,
    SEARCH_ALLERGY,
    GET_MEDICAL_DATA,
    GET_MEDICATION,
    GET_QUESTIONNAIRE_RESPONSE_RISK_LEVEL,
    LIST_QUESTIONNAIRES,
    EMPOWER_GET_RISK_LEVEL,
    GET_QUESTIONNAIRE_RESPONSES,
};
