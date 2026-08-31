import { AppConfigService } from '../../../app-config.service';
import { Injectable } from '@angular/core';
import { environment as e } from '../../../../environments/environment';

/**
 * Injectable that determines oauth2 configuration for the application
 */
@Injectable()

/**
 * Defines the auth configuration urls
 */
export class AuthUrls {
    domain = e.AUTH_SERVER_DOMAIN;
    token = '/oauth2/token/';
    authorize = '/oauth2/authorize/';
    revoke = '/token/logout/';
    redirect = '/auth/complete';
    silentRedirect = '/token.html';
    userInfo = '/v1/user/me';
    passwordReset = '/v1/request-password-reset/';
    passwordChange = '/v1/reset-password/';
}

/**
 * Class that determines the variables for which authentication is done with the authserver
 */
export class OauthCredz {
    responseType = 'token';
    response_type = 'token';
    grant_type = 'implicit';
    approval_prompt = 'auto';
    clientId = e.CLIENT_ID;
    client_id = e.CLIENT_ID;
    ssrClientID = e.ssrClientID;
    ssrClientSecret = e.ssrClientSecret;
}

/**
 * Class that determines the scopes used in the application
 */
export class OauthScopes {
    scopes: ['auth.me.read', 'integration.*', 'erp.*'];
}

/**
 * Injectable that determines the configuration for authentication in the application.
 *
 */
@Injectable()

/**
 * Oauth2Service class sets the configuration information for use within the app
 */
export class Oauth2Service {
    configs: [
        'domain',
        'token',
        'authorize',
        'revoke',
        'redirect',
        'userInfo',
        'passwordReset',
        'passwordResetConfirm',
        'passwordChange',
        'silentRedirect'
    ];

    /** contains default config array */
    creditConfigs: ['clientId', 'approvalPrompt'];
    /** contains the keys for authserver configuration */
    arrayOfKeys: string[];
    /** object that contains authserver url info */
    authUrls: any = new AuthUrls();
    /** object that contains info such as clientId */
    oauthCredz: OauthCredz = new OauthCredz();
    /** array containing scopes */
    scopes: any = new OauthScopes();
    settings: any;

    constructor(configServ: AppConfigService) {
        this.settingConfigs(configServ.appConfig);
        this.arrayOfKeys = Object.keys(this.authUrls);
    }

    /**
     * Sets the settings, auth domain and client id
     * @param settings
     * @returns
     */
    settingConfigs(settings: object) {
        this.settings = settings;
        this.authUrls.domain = this.settings
            ? this.settings.AUTH_SERVER_DOMAIN
            : this.authUrls.domain;
        this.oauthCredz.clientId = this.settings
            ? this.settings.CLIENT_ID
            : this.oauthCredz.clientId;
        return;
    }

    /**
     * Sets the config variables based on the application environment
     * @param vars
     * @param config
     */
    setStuff(vars: any[], config?: any): void {
        vars.forEach((key: any) => {
            const cfg = config[key];
            if (!config[key]) {
                return;
            }
            this.authUrls[key] = cfg;
        });
    }

    /**
     * sets the authentication urls
     * @param setting
     */
    setAuthUrls(setting?: any): void {
        this.arrayOfKeys = this.configs;
        this.setStuff(this.arrayOfKeys, setting);
    }

    /**
     *  sets the authentication credentials
     * @param setting
     */
    setOAuthCredz(setting?: any): void {
        this.arrayOfKeys = this.creditConfigs;
        this.setStuff(this.arrayOfKeys, setting);
    }

    /**
     * sets the scopes used in the application
     * @param scopes
     */
    setScopes(scopes: string[]): void {
        this.scopes = scopes;
    }
}
