import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { Oauth2Service } from '../oauth2.service';
import { AppConfigService } from '../../../../app-config.service';

const providerArray = [HttpHandler, HttpClient];

describe('Config service', () => {
    let configService: Oauth2Service;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Oauth2Service, AppConfigService, [...providerArray]],
        });
        configService = TestBed.inject(Oauth2Service);
    });
    it('Service should be created', () => {
        configService.settings = {
            AUTH_SERVER_DOMAIN: 'http://localhost:9000',
        };
        expect(configService.settings.AUTH_SERVER_DOMAIN).toBeDefined();
        expect(configService).toBeTruthy();
    });
    it('Should test set scope function', () => {
        const stringArr: any[] = ['domain', 'key', 'revoke'];
        // const settingObj = {};
        const oauthCredz = {
            responseType: 'token',
            response_type: 'token',
            clientId: 'id',
            client_id: 'id',
            grant_type: 'implicit',
            approval_prompt: 'auto',
            ssrClientID: 'id',
            ssrClientSecret: 'id',
        };
        configService.authUrls = {
            domain: 'http://localhost:9000',
            token: '/oauth2/token/',
            authorize: '/oauth2/authorize/',
            revoke: '/tokenlogout/',
            redirect: '/auth/complete',
            silentRedirect: '/token.html',
        };
        configService.configs = [
            'domain',
            'token',
            'authorize',
            'revoke',
            'redirect',
            'userInfo',
            'passwordReset',
            'passwordResetConfirm',
            'passwordChange',
            'silentRedirect',
        ];
        configService.oauthCredz = oauthCredz;
        configService.arrayOfKeys = ['domain', 'key', 'revoke'];
        configService.setScopes(stringArr);

        configService.setStuff(stringArr, configService.authUrls);
        expect(configService.scopes).toEqual(['domain', 'key', 'revoke']);
    });
    it('Should test setAuthUrls function', () => {
        const confObj = {
            AUTH_SERVER_DOMAIN: 'http://localhost:9000',
            SCOPES: ['some', 'more'],
        };
        const oauthCredz = {
            responseType: 'token',
            clientId: 'id',
            grantType: 'implicit',
            approvalPrompt: 'auto',
            ssrClientID: 'id',
            ssrClientSecret: 'id',
        };
        const settingObj = { ...oauthCredz };
        configService.configs = [
            'domain',
            'token',
            'authorize',
            'revoke',
            'redirect',
            'userInfo',
            'passwordReset',
            'passwordResetConfirm',
            'passwordChange',
            'silentRedirect',
        ];
        configService.creditConfigs = ['clientId', 'approvalPrompt'];
        configService.setAuthUrls(settingObj);
        configService.setOAuthCredz(settingObj);
        configService.settingConfigs(confObj);
        expect(configService).toBeDefined();
    });
});
