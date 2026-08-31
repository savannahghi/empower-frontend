// set-env.ts
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const targetPath = './apps/advantage/src/environments/environment.ts';

const envConfigFile = `export const environment = {
    ACTIONS: {
        RESTRICT: [],
        CHECKERS: ['ActionChecker', 'AuthorizationChecker'],
        PAGECHECKERS: ['PageActions'],
    },
    autoreconUrl: '${process.env.NG_APP_AUTORECON_URL ?? ''}',
    AUTH_SERVER_DOMAIN: '${process.env.NG_APP_AUTHSERVERURL ?? ''}',
    AVAILABLE_HOMEPAGES: ['/features/lending'],
    bp_type: 'PROVIDER',
    CLIENT_ID: '${process.env.NG_APP_CLIENTID ?? ''}',
    crmServerUrl: '${process.env.NG_APP_CRMSERVERURL ?? ''}',
    clinicalServerURL: '${process.env.NG_APP_CLINICALSERVERURL ?? ''}',
    clinicalRestUrl: '${process.env.NG_APP_CLINICALRESTURL ?? ''}',
    commsServerURL: '${process.env.NG_APP_COMMSSERVERURL ?? ''}',
    CUBEJS_API_URL: '${process.env.NG_APP_CUBEJSAPIURL ?? ''}',
    CUBEJS_LOGIN_URL: '${process.env.NG_APP_CUBEJSLOGINURL ?? ''}',
    CUBEJS_API_SECRET: '${process.env.NG_APP_CUBEAPISECRET ?? ''}',
    displayFeature: '${process.env.NG_APP_DISPLAY_FEATURE_IN_TESTING ?? ''}',
    ediServerURL: '${process.env.NG_APP_EDISERVERURL ?? ''}',
    erpServerURL: '${process.env.NG_APP_ERPSERVERURL ?? ''}',
    ERPME: '${process.env.NG_APP_ERPME ?? ''}',
    firebase: {
        apiKey: '${process.env.NG_APP_FIREBASEAPIKEY ?? ''}',
        authDomain: '${process.env.NG_APP_FIREBASEAUTHDOMAIN ?? ''}',
        projectId: '${process.env.NG_APP_FIREBASEPROJECTID ?? ''}',
        storageBucket: '${process.env.NG_APP_FIREBASESTORAGEBUCKET ?? ''}',
        messagingSenderId: '${
            process.env.NG_APP_FIREBASEMESSAGINGSENDERID ?? ''
        }',
        appId: '${process.env.NG_APP_FIREBASEAPPID ?? ''}',
    },
    flagsmithClientSideKey: '${process.env.NG_APP_FLAGSMITHENVIRONMENT ?? ''}',
    flaggingServerUrl: '${process.env.NG_APP_FLAGGINGSERVERURL ?? ''}',
    isServerURL: '${process.env.NG_APP_ISSERVERURL ?? ''}',
    mdaktariUrl: '${process.env.NG_APP_MDAKTARIURL ?? ''}',
    ME: '${process.env.NG_APP_ME ?? ''}',
    onBoardingURL: '${process.env.NG_APP_ONBOARDINGURL ?? ''}',
    production: '${process.env.NG_APP_IS_PRODUCTION ?? ''}',
    SCOPES: ['auth.me.read', 'integration.*', 'erp.*'],
    sentryEnvironment: '${process.env.NG_APP_SENTRYENVIRONMENT ?? ''}',
    sentryDsn: '${process.env.NG_APP_SENTRYDSN ?? ''}',
    serverURL: '${process.env.NG_APP_SERVERURL ?? ''}',
    ssrClientID: '${process.env.NG_APP_CLIENTID_SSR ?? ''}',
    ssrClientSecret: '${process.env.NG_APP_CLIENT_SECRET_SSR ?? ''}',
    surveyURL: '${process.env.NG_APP_SURVEYSERVERURL ?? ''}',
    TIMEOUT: {
      idle: '${process.env.NG_APP_TIMEOUT_IDLE ?? ''}',
      warning: '${process.env.NG_APP_TIMEOUT_WARNING ?? ''}',
    },
    terminologiesAndTariffsUrl: '${
        process.env.NG_APP_TERMINOLOGIES_AND_TARIFFS_SERVER_URL ?? ''
    }',
    variant: '${process.env.NG_APP_VARIANT ?? ''}',
    billingBackend: '${process.env.NG_APP_BILLING_BACKEND_URL ?? ''}',
    authWithKeyCloak: '${process.env.NG_APP_USE_KEYCLOAK ?? ''}',
    oclServerUrl: '${process.env.NG_APP_OCLSERVERURL ?? ''}',
    oclServerToken: '${process.env.NG_APP_OCLSERVERTOKEN ?? ''}',
    biometricsHardwareServerUrl: '${
        process.env.NG_APP_BIOMETRICS_HARDWARE_SERVER_URL ?? ''
    }',
    biometricsHardwareServerStatusCheckTimeoutInMs: '${
        process.env.NG_APP_BIOMETRICS_HARDWARE_STATUS_CHECK_TIMEOUT_IN_MS ?? ''
    }',
    biometricsMidlewareServiceUrl: '${
        process.env.NG_APP_BIOMETRICS_MIDDLEWARE_SERVICE_URL ?? ''
    }',
    fhirServerUrl: '${process.env.NG_APP_FHIR_SERVER_URL ?? ''}',
    supersetServerUrl: '${process.env.NG_APP_SUPERSET_SERVER_URL ?? ''}',
    supersetUsername: '${process.env.NG_APP_SUPERSET_USERNAME ?? ''}',
    supersetPassword: '${process.env.NG_APP_SUPERSET_PASSWORD ?? ''}',
    supersetDashboardUuids: '${
        process.env.NG_APP_SUPERSET_DASHBOARD_UUIDS ?? ''
    }',
    keycloak: {
        authURL: '${process.env.NG_APP_KEYCLOAK_AUTH_URL ?? ''}',
        realm: '${process.env.NG_APP_KEYCLOAK_REALM ?? ''}',
        clientId: '${process.env.NG_APP_KEYCLOAK_CLIENT_ID ?? ''}',
        pkceMethod: '${process.env.NG_APP_KEYCLOAK_PKCE_METHOD ?? ''}',
        redirectUri: '${process.env.NG_APP_KEYCLOAK_REDIRECT_URI ?? ''}',
        logoutRedirectUri: '${
            process.env.NG_APP_KEYCLOAK_POST_LOGOUT_REDIRECT_URI ?? ''
        }',
    },
    posthogKey: '${process.env.NG_APP_POSTHOG_API_KEY ?? ''}',
    posthogHost: '${process.env.NG_APP_POSTHOG_HOST ?? ''}',
    empowerClarityProjectId: '${
        process.env.NG_APP_EMPOWER_CLARITY_PROJECT_ID ?? ''
    }',
    googleMapsApiKey: '${process.env.NG_APP_GOOGLE_MAPS_API_KEY ?? ''}',
    messageGoogleMapKey: '${process.env.NG_APP_MESSAGE_GOOGLE_MAP_KEY ?? ''}',
    jsdKey: '${process.env.NG_APP_JSD_KEY ?? ''}'
}`;

fs.writeFile(targetPath, envConfigFile, function (err) {
    if (err) {
        console.error(err);
    }
});

/** Copy manifest file */
let destinationManifestPath = './apps/advantage/src/manifest.webmanifest';
let sourcePath = `./apps/advantage/src/manifest-variants/manifest.${
    process.env.NG_APP_VARIANT ?? ''
}.json`;

fs.copyFile(sourcePath, destinationManifestPath, err => {
    if (err) {
        console.error('Error copying manifest file:', err);
    } else {
        console.info('Manifest file copied successfully');
    }
});

/** Copy favicon */
destinationManifestPath = './apps/advantage/src/favicon.png';
sourcePath = `./apps/advantage/src/assets/icons/${
    process.env.NG_APP_VARIANT ?? ''
}/favicon.png`;

fs.copyFile(sourcePath, destinationManifestPath, err => {
    if (err) {
        console.error('Error copying favicon file:', err);
    } else {
        console.info('Favicon file copied successfully');
    }
});
