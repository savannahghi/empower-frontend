export interface ScreeningOption {
    title: string;
    value: string;
}

/**
 * Breast Cancer Examination Options
 */
export const BREAST_EXAMINATION_OPTIONS: ScreeningOption[] = [
    { title: 'Normal', value: 'Normal' },
    {
        title: 'Benign Findings - Not Suspicious For CA',
        value: 'Benign Findings - Not Suspicious For CA',
    },
    {
        title: 'Discrete Palpable Mass - Suspicious For CA',
        value: 'Discrete Palpable Mass - Suspicious For CA',
    },
    {
        title: 'Blood, Or Serious Nipple Discharge',
        value: 'Blood, Or Serious Nipple Discharge',
    },
    { title: 'Nipple/Areola Scaliness', value: 'Nipple/Areola Scaliness' },
    {
        title: 'Skin Dimpling Or Retraction',
        value: 'Skin Dimpling Or Retraction',
    },
    { title: 'Focal Pain Or Tenderness', value: 'Focal Pain Or Tenderness' },
    { title: 'Nipple Inversion', value: 'Nipple Inversion' },
];

export const MAMMOGRAM_OPTIONS: ScreeningOption[] = [
    { title: 'Incomplete (BIRADS 0)', value: 'Incomplete (BIRADS 0)' },
    { title: 'Negative (BIRADS 1)', value: 'Negative (BIRADS 1)' },
    { title: 'Benign (BIRADS 2)', value: 'Benign (BIRADS 2)' },
    {
        title: 'Probably benign (BIRADS 3)',
        value: 'Probably benign (BIRADS 3)',
    },
    {
        title: 'Suspicious abnormality (BIRADS 4)',
        value: 'Suspicious abnormality (BIRADS 4)',
    },
    {
        title: 'Highly suggestive of malignancy (BIRADS 5)',
        value: 'Highly suggestive of malignancy (BIRADS 5)',
    },
    {
        title: 'Known proven malignancy (BIRADS 6)',
        value: 'Known proven malignancy (BIRADS 6)',
    },
];

export const BIOPSY_OPTIONS: ScreeningOption[] = [
    { title: 'Normal', value: 'Normal' },
    {
        title: 'Benign Findings - Not Suspicious For CA',
        value: 'Benign Findings - Not Suspicious For CA',
    },
    {
        title: 'Discrete Palpable Mass - Suspicious For CA',
        value: 'Discrete Palpable Mass - Suspicious For CA',
    },
    {
        title: 'Blood, Or Serious Nipple Discharge',
        value: 'Blood, Or Serious Nipple Discharge',
    },
    { title: 'Nipple/Areola Scaliness', value: 'Nipple/Areola Scaliness' },
    {
        title: 'Skin Dimpling Or Retraction',
        value: 'Skin Dimpling Or Retraction',
    },
    { title: 'Focal Pain Or Tenderness', value: 'Focal Pain Or Tenderness' },
    { title: 'Nipple Inversion', value: 'Nipple Inversion' },
];

export const ULTRASOUND_OPTIONS: ScreeningOption[] = [
    { title: 'Incomplete (BIRADS 0)', value: 'Incomplete (BIRADS 0)' },
    { title: 'Negative (BIRADS 1)', value: 'Negative (BIRADS 1)' },
    { title: 'Benign (BIRADS 2)', value: 'Benign (BIRADS 2)' },
    {
        title: 'Probably benign (BIRADS 3)',
        value: 'Probably benign (BIRADS 3)',
    },
    {
        title: 'Suspicious abnormality (BIRADS 4)',
        value: 'Suspicious abnormality (BIRADS 4)',
    },
    {
        title: 'Highly suggestive of malignancy (BIRADS 5)',
        value: 'Highly suggestive of malignancy (BIRADS 5)',
    },
    {
        title: 'Known proven malignancy (BIRADS 6)',
        value: 'Known proven malignancy (BIRADS 6)',
    },
];

export const MRI_OPTIONS: ScreeningOption[] = [
    { title: 'Incomplete (BIRADS 0)', value: 'Incomplete (BIRADS 0)' },
    { title: 'Negative (BIRADS 1)', value: 'Negative (BIRADS 1)' },
    { title: 'Benign (BIRADS 2)', value: 'Benign (BIRADS 2)' },
    {
        title: 'Probably benign (BIRADS 3)',
        value: 'Probably benign (BIRADS 3)',
    },
    {
        title: 'Suspicious abnormality (BIRADS 4)',
        value: 'Suspicious abnormality (BIRADS 4)',
    },
    {
        title: 'Highly suggestive of malignancy (BIRADS 5)',
        value: 'Highly suggestive of malignancy (BIRADS 5)',
    },
    {
        title: 'Known proven malignancy (BIRADS 6)',
        value: 'Known proven malignancy (BIRADS 6)',
    },
];

/**
 * Cervical Cancer Examination Options
 */

// VIA/VILI Examination Options
export const VIA_OPTIONS: ScreeningOption[] = [
    { title: 'Negative', value: 'negative' },
    { title: 'Positive', value: 'positive' },
    { title: 'Suspicious for cancer', value: 'suspicious_for_cancer' },
];

// HPV Examination Options
export const HPV_OPTIONS: ScreeningOption[] = [
    { title: 'Negative', value: 'negative' },
    { title: 'Positive', value: 'positive' },
    { title: 'Suspicious for cancer', value: 'suspicious_for_cancer' },
];

// Pap Smear Test Options
export const PAP_SMEAR_OPTIONS: ScreeningOption[] = [
    { title: 'Normal', value: 'Normal' },
    { title: 'ASCUS or greater', value: 'ASCUS or greater' },
];

/**
 * Prostate Cancer Examination Options
 */
export const PSA_OPTIONS: ScreeningOption[] = [
    { title: 'Normal PSA levels (<4ng/ml)', value: 'normal_psa_levels' },
    { title: 'Raised PSA levels', value: 'raised_psa_levels' },
];

/**
 * Universal Mappings
 */

/**
 * Map LOINC codes to their respective result options
 */
export const testResults: { [key: string]: ScreeningOption[] } = {
    // Breast Cancer
    '32422-8': BREAST_EXAMINATION_OPTIONS,
    'LA16046-7': MAMMOGRAM_OPTIONS,
    '52121-1': BIOPSY_OPTIONS,
    '24630-6': ULTRASOUND_OPTIONS,
    '30794-2': MRI_OPTIONS,

    // Cervical Cancer
    '47527-7': VIA_OPTIONS,
    '73959-9': HPV_OPTIONS,
    'LA16047-5': PAP_SMEAR_OPTIONS,

    // Prostate Cancer
    '15325-4': PSA_OPTIONS,
    '906-8': PSA_OPTIONS,
};

/**
 * Map test/examination names to their respective result options
 */
export const TEST_NAME_TO_OPTIONS: { [key: string]: ScreeningOption[] } = {
    // Breast Cancer
    'Physical findings of Breast': BREAST_EXAMINATION_OPTIONS,
    'CBE(Clinical Breast Exam)': BREAST_EXAMINATION_OPTIONS,
    CBE: BREAST_EXAMINATION_OPTIONS,
    Mammogram: MAMMOGRAM_OPTIONS,
    'Biopsy [Interpretation] in Specimen Narrative': BIOPSY_OPTIONS,
    Biopsy: BIOPSY_OPTIONS,
    'US Chest': ULTRASOUND_OPTIONS,
    Ultrasound: ULTRASOUND_OPTIONS,
    'MR Breast': MRI_OPTIONS,
    MRI: MRI_OPTIONS,

    // Cervical Cancer
    VIA: VIA_OPTIONS,
    'VIA/VILI': VIA_OPTIONS,
    'Visual Inspection with Acetic Acid (VIA)': VIA_OPTIONS,
    'Cytology report of Cervical or vaginal smear or scraping Cyto stain.thin prep':
        VIA_OPTIONS,

    // HPV examinations
    'Human papilloma virus 16+18+31+33+35+39+45+51+52+56+58+66 DNA [Presence] in Tissue by Probe':
        HPV_OPTIONS,
    HPV: HPV_OPTIONS,
    'HPV PCR DNA': HPV_OPTIONS,
    'HPV Oncoprotein': HPV_OPTIONS,

    // Pap smear tests
    'Pap smear/cytology': PAP_SMEAR_OPTIONS,
    'Pap smear': PAP_SMEAR_OPTIONS,
    'Pap Smear': PAP_SMEAR_OPTIONS,

    // Prostate Cancer
    'Prostate specific Ag/Prostate volume calculated': PSA_OPTIONS,
    'Prostatic Serum Antigen (PSA) test': PSA_OPTIONS,
    'Prostate Specific Antigen - Serum': PSA_OPTIONS,
    'Prostate Specific Antigen - Whole Blood': PSA_OPTIONS,
    PSA: PSA_OPTIONS,
};
