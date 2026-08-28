interface ImportMeta {
    readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
    readonly NG_APP_ENV: string;
    readonly NG_APP_VARIANT: string;
    readonly NG_APP_AUTHSERVERURL: string;
    readonly NG_APP_COMMSSERVERURL: string;
    readonly NG_APP_CLIENTID: string;
    readonly NG_APP_CLINICALSERVERURL: string;
    readonly NG_APP_CUBEJSAPIURL: string;
    readonly NG_APP_CUBEJSLOGINURL: string;
    readonly NG_APP_CUBEAPISECRET: string;
    readonly NG_APP_DISPLAY_FEATURE_IN_TESTING: string;
    readonly NG_APP_EDISERVERURL: string;
    readonly NG_APP_ERPME: string;
    readonly NG_APP_ERPSERVERURL: string;
    readonly NG_APP_FIREBASEAPIKEY: string;
    readonly NG_APP_FIREBASEAUTHDOMAIN: string;
    readonly NG_APP_FIREBASEPROJECTID: string;
    readonly NG_APP_FIREBASESTORAGEBUCKET: string;
    readonly NG_APP_FIREBASEMESSAGINGSENDERID: string;
    readonly NG_APP_FLAGGINGSERVERURL: string;
    readonly NG_APP_FIREBASEAPPID: string;
    readonly NG_APP_ISSERVERURL: string;
    readonly NG_APP_ONBOARDINGURL: string;
    readonly NG_APP_IS_PRODUCTION: string;
    readonly NG_APP_SENTRYENVIRONMENT: string;
    readonly NG_APP_SENTRYDSN: string;
    readonly NG_APP_SERVERURL: string;
    readonly NG_APP_SURVEYSERVERURL: string;
    readonly NG_APP_TIMEOUT_IDLE: string;
    readonly NG_APP_TIMEOUT_WARNING: string;
    readonly NG_APP_ME: string;
    readonly NG_APP_CLINICALRESTURL: string;
    // Add your environment variables below
    // readonly NG_APP_API_URL: string;
    [key: string]: any;
}

/** *******************************************************************/
