import { gql } from 'apollo-angular';
// We use the gql tag to parse our query stringinto a query document

/**  mutation CREATE_EPOSIDE_OF_CARE */
const CREATE_EPOSIDE_OF_CARE = gql`
    mutation createEpisodeOfCare($episodeOfCare: EpisodeOfCareInput!) {
        createEpisodeOfCare(episodeOfCare: $episodeOfCare) {
            id
            status
            patientID
        }
    }
`;

/**  mutation PATCH_EPISODE_OF_CARE */
const PATCH_EPISODE_OF_CARE = gql`
    mutation patchEpisodeOfCare(
        $episodeID: String!
        $episodeOfCare: EpisodeOfCareInput!
    ) {
        patchEpisodeOfCare(id: $episodeID, episodeOfCare: $episodeOfCare) {
            id
            status
            patientID
        }
    }
`;

/**  mutation PATCH_ENCOUNTER */
const PATCH_ENCOUNTER = gql`
    mutation patchEncounter(
        $encounterID: String!
        $encounterInput: EncounterInput!
    ) {
        patchEncounter(encounterID: $encounterID, input: $encounterInput) {
            id
            class
            episodeOfCareID
            status
            patientID
        }
    }
`;

/**  mutation START_ENCOUNTER */
const START_ENCOUNTER = gql`
    mutation startEncounter($episodeID: String!) {
        startEncounter(episodeID: $episodeID)
    }
`;

/**  mutation CREATE_CONDITION */
const CREATE_CONDITION = gql`
    mutation createCondition($inputCondition: ConditionInput!) {
        createCondition(input: $inputCondition) {
            id
            status
            name
            code
            category
            onsetDate
            recordedDate
            encounterID
            patientID
        }
    }
`;

/**  mutation CREATE_COMPOSITION */
const CREATE_COMPOSITION = gql`
    mutation createComposition($inputComposition: CompositionInput!) {
        createComposition(input: $inputComposition) {
            id
            status
            type
            category
            text
            patientID
            encounterID
            section {
                title
                code
                author
                text
            }
        }
    }
`;

/** mutation APPEND_NOTE_TO_COMPOSITION */
const APPEND_NOTE_TO_COMPOSITION = gql`
    mutation appendNoteToComposition(
        $compositionID: String!
        $inputComposition: PatchCompositionInput!
    ) {
        appendNoteToComposition(id: $compositionID, input: $inputComposition) {
            id
            status
            type
            category
            text
            patientID
            encounterID
            section {
                title
                code
                author
                text
            }
        }
    }
`;

/**  mutation RECORD_MUAC */
const RECORD_MUAC = gql`
    mutation recordMUAC($inputMUAC: ObservationInput!) {
        recordMUAC(input: $inputMUAC) {
            id
            status
            encounterID
            value
            timeRecorded
        }
    }
`;

/**  mutation RECORD_SYSTOLIC_BLOOD_PRESSURE */
const RECORD_SYSTOLIC_BLOOD_PRESSURE = gql`
    mutation recordBloodPressure(
        $inputSystolicBloodPressure: ObservationInput!
    ) {
        recordBloodPressure(input: $inputSystolicBloodPressure) {
            id
            status
            encounterID
            value
            timeRecorded
        }
    }
`;

/**  mutation RECORD_DIASTOLIC_BLOOD_PRESSURE */
const RECORD_DIASTOLIC_BLOOD_PRESSURE = gql`
    mutation recordDiastolicBloodPressure(
        $inputDiastolicBloodPressure: ObservationInput!
    ) {
        recordDiastolicBloodPressure(input: $inputDiastolicBloodPressure) {
            status
            encounterID
            value
            timeRecorded
        }
    }
`;

/**  mutation RECORD_PULSE_RATE */
const RECORD_PULSE_RATE = gql`
    mutation recordPulseRate($inputPulseRate: ObservationInput!) {
        recordPulseRate(input: $inputPulseRate) {
            id
            status
            encounterID
            value
            note
            timeRecorded
        }
    }
`;

/**  mutation RECORD_PULSE_RATE */
const RECORD_RESPIRATORY_RATE = gql`
    mutation recordRespiratoryRate($inputRespiratoryRate: ObservationInput!) {
        recordRespiratoryRate(input: $inputRespiratoryRate) {
            id
            status
            encounterID
            value
            note
            timeRecorded
        }
    }
`;

/**  mutation RECORD_BMI */
const RECORD_BMI = gql`
    mutation recordBMI($inputBMI: ObservationInput!) {
        recordBMI(input: $inputBMI) {
            id
            status
            encounterID
            value
            note
            timeRecorded
        }
    }
`;

/**  mutation RECORD_OXYGEN_SATURATION */
const RECORD_OXYGEN_SATURATION = gql`
    mutation recordOxygenSaturation($inputOxygenSaturation: ObservationInput!) {
        recordOxygenSaturation(input: $inputOxygenSaturation) {
            id
            status
            encounterID
            value
            note
            timeRecorded
        }
    }
`;

/**  mutation RECORD_VIRAL_LOAD */
const RECORD_VIRAL_LOAD = gql`
    mutation recordViralLoad($inputViralLoad: ObservationInput!) {
        recordViralLoad(input: $inputViralLoad) {
            id
            status
            encounterID
            value
            note
            timeRecorded
        }
    }
`;

/**  mutation RECORD_WEIGHT */
const RECORD_WEIGHT = gql`
    mutation recordWeight($inputWeight: ObservationInput!) {
        recordWeight(input: $inputWeight) {
            id
            status
            encounterID
            value
            note
            timeRecorded
        }
    }
`;

/**  mutation RECORD_HEIGHT */
const RECORD_HEIGHT = gql`
    mutation recordHeight($inputHeight: ObservationInput!) {
        recordHeight(input: $inputHeight) {
            id
            status
            encounterID
            value
            note
            timeRecorded
        }
    }
`;

/**  mutation RECORD_TEMPERATURE */
const RECORD_TEMPERATURE = gql`
    mutation recordTemperature($inputTemperature: ObservationInput!) {
        recordTemperature(input: $inputTemperature) {
            id
            status
            encounterID
            value
            note
            timeRecorded
        }
    }
`;

/**  mutation CREATE_PATIENT */
const CREATE_PATIENT = gql`
    mutation createPatient($createPatientInput: PatientInput!) {
        createPatient(input: $createPatientInput) {
            id
            name
            gender
            birthDate
            phoneNumber
            active
        }
    }
`;

/**  mutation GET_ALLERGY */
const CREATE_ALLERGY_INTOLERANCE = gql`
    mutation createAllergyIntolerance($allergyInput: AllergyInput!) {
        createAllergyIntolerance(input: $allergyInput) {
            id
            code
            name
            system
            terminologySource
            reaction {
                name
                severity
                system
            }
        }
    }
`;

/** mutation PATCH_PATIENT_WEIGHT  */
const PATCH_PATIENT_WEIGHT = gql`
    mutation patchPatientWeight(
        $weightID: String!
        $patchInputWeight: String!
    ) {
        patchPatientWeight(id: $weightID, value: $patchInputWeight) {
            id
            status
            patientID
            encounterID
            name
            value
            timeRecorded
        }
    }
`;

/** mutation PATCH_PATIENT_HEIGHT  */
const PATCH_PATIENT_HEIGHT = gql`
    mutation patchPatientHeight(
        $heightID: String!
        $patchInputHeight: String!
    ) {
        patchPatientHeight(id: $heightID, value: $patchInputHeight) {
            id
            status
            patientID
            encounterID
            name
            value
            timeRecorded
        }
    }
`;

/** mutation PATCH_PATIENT_BMI  */
const PATCH_PATIENT_BMI = gql`
    mutation patchPatientBMI($bmiID: String!, $patchInputBMI: String!) {
        patchPatientBMI(id: $bmiID, value: $patchInputBMI) {
            id
            status
            patientID
            encounterID
            name
            value
            timeRecorded
        }
    }
`;

/** mutation PATCH_PATIENT_TEMPERATURE  */
const PATCH_PATIENT_TEMPERATURE = gql`
    mutation patchPatientTemperature(
        $temperatureID: String!
        $patchInputTemperature: String!
    ) {
        patchPatientTemperature(
            id: $temperatureID
            value: $patchInputTemperature
        ) {
            id
            status
            patientID
            encounterID
            name
            value
            timeRecorded
        }
    }
`;

/** mutation PATCH_PATIENT_DIASTOLIC_BLOOD_PRESSURE  */
const PATCH_PATIENT_DIASTOLIC_BLOOD_PRESSURE = gql`
    mutation patchPatientDiastolicBloodPressure(
        $diastolicBloodPressureID: String!
        $patchInputDiastolicBloodPressure: String!
    ) {
        patchPatientDiastolicBloodPressure(
            id: $diastolicBloodPressureID
            value: $patchInputDiastolicBloodPressure
        ) {
            id
            status
            patientID
            encounterID
            name
            value
            timeRecorded
        }
    }
`;

/** mutation PATCH_PATIENT_SYSTOLIC_BLOOD_PRESSURE  */
const PATCH_PATIENT_SYSTOLIC_BLOOD_PRESSURE = gql`
    mutation patchPatientSystolicBloodPressure(
        $systolicBloodPressureID: String!
        $patchInputSystolicBloodPressure: String!
    ) {
        patchPatientSystolicBloodPressure(
            id: $systolicBloodPressureID
            value: $patchInputSystolicBloodPressure
        ) {
            id
            status
            patientID
            encounterID
            name
            value
            timeRecorded
        }
    }
`;

/** mutation PATCH_PATIENT_RESPIRATORY_RATE  */
const PATCH_PATIENT_RESPIRATORY_RATE = gql`
    mutation patchPatientRespiratoryRate(
        $respirationRateID: String!
        $patchInputRespirationRate: String!
    ) {
        patchPatientRespiratoryRate(
            id: $respirationRateID
            value: $patchInputRespirationRate
        ) {
            id
            status
            patientID
            encounterID
            name
            value
            timeRecorded
        }
    }
`;

/** mutation PATCH_PATIENT_OXYGEN_SATURATION  */
const PATCH_PATIENT_OXYGEN_SATURATION = gql`
    mutation patchPatientOxygenSaturation(
        $oxygenSaturationID: String!
        $patchInputOxygenSaturation: String!
    ) {
        patchPatientOxygenSaturation(
            id: $oxygenSaturationID
            value: $patchInputOxygenSaturation
        ) {
            id
            status
            patientID
            encounterID
            name
            value
            timeRecorded
        }
    }
`;

/** mutation PATCH_PATIENT_PULSE_RATE  */
const PATCH_PATIENT_PULSE_RATE = gql`
    mutation patchPatientPulseRate(
        $pulseRateID: String!
        $patchInputPulseRate: String!
    ) {
        patchPatientPulseRate(id: $pulseRateID, value: $patchInputPulseRate) {
            id
            status
            patientID
            encounterID
            name
            value
            timeRecorded
        }
    }
`;

/** mutation PATCH_PATIENT_MUAC  */
const PATCH_PATIENT_MUAC = gql`
    mutation patchPatientMuac($muacID: String!, $patchInputMuac: String!) {
        patchPatientMuac(id: $muacID, value: $patchInputMuac) {
            id
            status
            patientID
            encounterID
            name
            value
            timeRecorded
        }
    }
`;

/** mutation PATCH_PATIENT_VIRAL_LOAD  */
const PATCH_PATIENT_VIRAL_LOAD = gql`
    mutation PATCH_PATIENT_VIRAL_LOAD(
        $viralLoadID: String!
        $patchInputViralLoad: String!
    ) {
        patchPatientViralLoad(id: $viralLoadID, value: $patchInputViralLoad) {
            id
            status
            patientID
            encounterID
            name
            value
            timeRecorded
        }
    }
`;

/** mutation RECORD_PAPSMEAR  */
const RECORD_PAPSMEAR = gql`
    mutation recordPapSmear($input: DiagnosticReportInput!) {
        recordPapSmear(input: $input) {
            id
            status
            patientID
            encounterID
            issued
            result {
                id
                name
                value
            }
            result {
                id
                name
                value
            }
            media {
                id
                name
                mediaLink
                signedURL
            }
            conclusion
        }
    }
`;

/** mutation RECORD_COLPOSCOPY  */
const RECORD_COLPOSCOPY = gql`
    mutation recordColposcopy($input: ObservationInput!) {
        recordColposcopy(input: $input) {
            id
            status
            patientID
            encounterID
            name
            value
            timeRecorded
        }
    }
`;

/** mutation RECORD_VIA  */
const RECORD_VIA = gql`
    mutation recordVIA($input: ObservationInput!) {
        recordVIA(input: $input) {
            id
            status
            patientID
            encounterID
            name
            value
            timeRecorded
        }
    }
`;

/** mutation RECORD_HPV  */
const RECORD_HPV = gql`
    mutation recordHPV($input: ObservationInput!) {
        recordHPV(input: $input) {
            id
            status
            patientID
            encounterID
            name
            value
            timeRecorded
        }
    }
`;

/** mutation EMPOWER_FETCH_ENCOUNTER_RESOURCES */
const EMPOWER_FETCH_ENCOUNTER_RESOURCES = gql`
    mutation getEncounterAssociatedResources($encounterID: String!) {
        getEncounterAssociatedResources(encounterID: $encounterID) {
            riskAssessment {
                id
                note {
                    text
                }
                prediction {
                    outcome {
                        coding {
                            code
                            display
                            system
                        }
                    }
                }
            }

            consent {
                id
                status
                provision {
                    type
                }
                patient {
                    id
                    display
                }
            }

            observation {
                id
                value
            }

            encounter {
                id
                status
            }

            tasks {
                id
                encounterID
                task
                description
                status
                workflow
                dueDate
            }
        }
    }
`;

/* mutation RECORD MRI */
const RECORD_MRI = gql`
    mutation recordMRI($input: DiagnosticReportInput!) {
        recordMRI(input: $input) {
            status
            id
            patientID
            conclusion
            encounterID
        }
    }
`;

/* mutation RECORD MAMMOGRAPHY */
const RECORD_MAMMOGRAPHY = gql`
    mutation recordMammographyResult($input: DiagnosticReportInput!) {
        recordMammographyResult(input: $input) {
            status
            id
            patientID
            conclusion
            encounterID
        }
    }
`;

/* mutation RECORD ULRASOUND */
const RECORD_ULTRASOUND = gql`
    mutation recordUltrasound($input: DiagnosticReportInput!) {
        recordUltrasound(input: $input) {
            status
            id
            patientID
            conclusion
            encounterID
        }
    }
`;

/* mutation RECORD CBE */
const RECORD_CBE = gql`
    mutation recordCBE($input: DiagnosticReportInput!) {
        recordCBE(input: $input) {
            status
            id
            patientID
            conclusion
            encounterID
        }
    }
`;

/* mutation RECORD_BIOPSY */
const RECORD_BIOPSY = gql`
    mutation recordBiopsy($input: DiagnosticReportInput!) {
        recordBiopsy(input: $input) {
            status
            id
            patientID
            conclusion
            encounterID
        }
    }
`;

/* mutation RECORD_RECORD IMMUNOHISTOCHEMISTRY */
const RECORD_IMMUNOHISTOCHEMISTRY = gql`
    mutation recordImmunoHistoChemistry($input: ObservationInput!) {
        recordImmunoHistoChemistry(input: $input) {
            id
            status
            patientID
            encounterID
            name
            value
            timeRecorded
        }
    }
`;

/* mutation RECORD_IMMUNO_HISTO_CHEMISTRY */
const RECORD_POST_COITAL_BLEEDING = gql`
    mutation recordPostCoitalBleeding($input: ObservationInput!) {
        recordPostCoitalBleeding(input: $input) {
            id
            status
            patientID
            encounterID
            name
            value
            timeRecorded
        }
    }
`;

/* mutation EMPOWER_CREATE_REFERRAL */
const EMPOWER_CREATE_REFERRAL = gql`
    mutation createReferral($input: CreateReferralInput!) {
        createReferral(input: $input) {
            id
            subject {
                display
                id
            }
            encounter {
                id
                reference
            }
            status
            intent
            priority
        }
    }
`;

/* mutation RECORD CBE */
const RECORD_PSA = gql`
    mutation recordPSA($input: PSAInput!) {
        recordPSA(input: $input) {
            id
            status
            patientID
            encounterID
            conclusion
        }
    }
`;

export const mutations = {
    PATCH_EPISODE_OF_CARE,
    CREATE_EPOSIDE_OF_CARE,
    PATCH_ENCOUNTER,
    START_ENCOUNTER,
    CREATE_PATIENT,
    CREATE_CONDITION,
    CREATE_COMPOSITION,
    APPEND_NOTE_TO_COMPOSITION,
    RECORD_MUAC,
    RECORD_SYSTOLIC_BLOOD_PRESSURE,
    RECORD_DIASTOLIC_BLOOD_PRESSURE,
    RECORD_PULSE_RATE,
    RECORD_RESPIRATORY_RATE,
    RECORD_BMI,
    RECORD_OXYGEN_SATURATION,
    RECORD_VIRAL_LOAD,
    RECORD_WEIGHT,
    RECORD_HEIGHT,
    RECORD_TEMPERATURE,
    CREATE_ALLERGY_INTOLERANCE,
    PATCH_PATIENT_WEIGHT,
    PATCH_PATIENT_HEIGHT,
    PATCH_PATIENT_BMI,
    PATCH_PATIENT_TEMPERATURE,
    PATCH_PATIENT_DIASTOLIC_BLOOD_PRESSURE,
    PATCH_PATIENT_SYSTOLIC_BLOOD_PRESSURE,
    PATCH_PATIENT_RESPIRATORY_RATE,
    PATCH_PATIENT_OXYGEN_SATURATION,
    PATCH_PATIENT_PULSE_RATE,
    PATCH_PATIENT_MUAC,
    PATCH_PATIENT_VIRAL_LOAD,
    RECORD_PAPSMEAR,
    RECORD_COLPOSCOPY,
    RECORD_VIA,
    RECORD_HPV,
    RECORD_MRI,
    RECORD_MAMMOGRAPHY,
    RECORD_CBE,
    RECORD_BIOPSY,
    RECORD_ULTRASOUND,
    EMPOWER_FETCH_ENCOUNTER_RESOURCES,
    RECORD_IMMUNOHISTOCHEMISTRY,
    RECORD_POST_COITAL_BLEEDING,
    EMPOWER_CREATE_REFERRAL,
    RECORD_PSA,
};
