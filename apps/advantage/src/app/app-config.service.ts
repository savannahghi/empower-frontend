import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Injectable used to load application configuration
 * from /appConfig.json. Same thing done by environment.ts
 */
@Injectable()
/**
 * Class used to define the application configuration service
 */
export class AppConfigService {
    appConfig;
    constructor(private readonly http: HttpClient) {}
    loadAppConfig = () =>
        this.http
            .get('assets/data/appConfig.json')
            .toPromise()
            .then(data => {
                this.appConfig = data;
            });
    getConfig() {
        return this.appConfig;
    }
}

/**
 * initializes the application's config
 * @param appConfig
 * @returns
 */
export function appInitializeFn(appConfig: AppConfigService) {
    return () => appConfig.loadAppConfig();
}
