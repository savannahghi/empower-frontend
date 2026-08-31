import { ErrorHandler, Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { SilStoresService } from './sil_datalayer.service';
import packageJson from '../../../../../../package.json';
import { Authorization } from '../../@core/auth/services/authorization.service';
import { environment } from '../../../environments/environment';
import * as Sentry from '@sentry/angular';
import _ from 'underscore';
import { HttpErrorResponse } from '@angular/common/http';
import { StateService } from '@uirouter/angular';

@Injectable({
    providedIn: 'root',
})
export class ErrorHandlerService implements ErrorHandler {
    /**
     * Object that stores the user data from authserver
     */
    user: Object;
    /**
     * Object that stores the user data from emr server
     */
    orgUser: Object;
    /**
     * Object that stores the reference to the component using the errorFxn method.
     * This is give the component a reference to the error
     */
    component: Object;
    /**
     * Reference to the authorization service that has user details
     */
    authConfig: any;
    /**
     * Reference to the datalayer service
     */
    dataLayer: SilStoresService;

    constructor(
        private toastrService: NbToastrService,
        public _authConfig: Authorization,
        public $state: StateService
    ) {
        this.authConfig = _authConfig;
        /**
         * Check if the user is null because the user might not have been set
         * This is important for Sentry
         */
        this.user = this.authConfig.getUser();
        this.user = this.user === null ? {} : this.user;
        /**
         * Check if the orgUser is null because the user might not have been set
         * This is important for Sentry
         */
        this.orgUser = this.authConfig.getOrganisation();
        this.orgUser = this.orgUser === null ? {} : this.orgUser;

        this.setupSentry();
    }

    setupSentry() {
        const sentryEnvironments = ['uat', 'production'];
        if (sentryEnvironments.includes(environment.sentryEnvironment)) {
            Sentry.init({
                dsn: environment.sentryDsn,
                environment: environment.sentryEnvironment,
                release: 'advantage-frontend@' + packageJson.version,
                debug: environment.production === 'true',
                initialScope: {
                    user: {
                        id: this.user['guid'],
                        username: this.orgUser['full_name'],
                        email: this.user['email'],
                    },
                },
                integrations: [],
                tracesSampleRate: 1.0,
                tracePropagationTargets: [
                    'localhost',
                    /^https:\/\/advantage.slade360\.com/,
                    /^https:\/\/uat-emr.advantage.slade360\.com/,
                    /^https:\/\/review-advantage\.web\.app/,
                    /^https:\/\/review-empower\.web\.app/,
                    /^https:\/\/uat.empower\.savannahghi\.org/,
                    /^https:\/\/staging-empower\.web\.app/,
                    /^https:\/\/prod-empower\.web\.app/,
                ],
            });
        }
    }

    setupComponent(component) {
        this.component = component;
    }

    toastErrorTime = 15000;
    toastTime = 7000;

    errMap(errObj) {
        const errArray = [];
        const keys = _.keys(errObj);
        _.each(keys, key => {
            const obj: any = {};
            obj.key = key;
            obj.value = errObj[key];
            errArray.push(obj);
        });
        return errArray;
    }

    processError(err) {
        const msg = 'Error';
        const context = err.value;
        this.showErrorToast('bottom-right', 'danger', msg, context);
    }

    /**
     * Function used to check for a specific clinical error message
     * @param errorList error object
     * @returns boolean indicating whether the message exists
     */
    containsInvalidAccessTokenError(errorList) {
        return errorList.some(
            errorItem =>
                errorItem.error === 'the supplied access token is invalid'
        );
    }

    errorFxn(err, cmpt, server?) {
        // Try to unwrap zone.js error.
        // https://github.com/angular/angular/blob/master/packages/core/src/util/errors.ts
        if (err && err.ngOriginalError) {
            err = err.ngOriginalError;
        }

        if (server === 'clinical') {
            if (
                [err.networkError?.status, err?.status].includes(401) &&
                ((err?.networkError?.error &&
                    this.containsInvalidAccessTokenError(
                        err.networkError.error
                    )) ||
                    (err?.error &&
                        this.containsInvalidAccessTokenError(err.error)))
            ) {
                this.$state.go(
                    'auth.login',
                    { is_expired: true },
                    { reload: true }
                );
            }

            // Handle Unprocessable Content error code 422
            if (err.networkError?.status === 422) {
                const errorObj = err.networkError?.error?.errors[0];
                this.showErrorToast(
                    'bottom-right',
                    'danger',
                    'Error',
                    errorObj?.path?.join(' ') + ' ' + errorObj?.message
                );
            }

            if (typeof err === 'string' || err instanceof Error) {
                this.showErrorToast('bottom-right', 'danger', 'Error', err);
            }
        }

        // We can handle messages and Error objects directly.
        if (typeof err === 'string' || err instanceof Error) {
            return err;
        }

        if (environment.sentryEnvironment !== 'production') {
            console.error(err);
        }

        if (
            !_.isUndefined(err) &&
            !_.isUndefined(err.status) &&
            err.status < 500
        ) {
            cmpt.error = err?.error;
            const arrErrors = this.errMap(cmpt.error);
            cmpt.errors = _.clone(arrErrors);
            arrErrors.forEach(error => {
                this.processError(error);
            });
            return err.error;
        }

        // If it's http module error, extract as much information from it as we can.
        if (err instanceof HttpErrorResponse) {
            // The `error` property of http exception can be either an `Error` object, which we can use directly...
            if (err.error instanceof Error) {
                return err.error;
            }

            // ... or an`ErrorEvent`, which can provide us with the message but no stack...
            if (err.error instanceof ErrorEvent) {
                return err.error.message;
            }

            // ...or the request body itself, which we can use as a message instead.
            if (typeof err.error === 'string') {
                const errorValue = `Status: ${err.status}. An unexpected error occurred. Please try again.`;
                return this.processError({ value: errorValue });
            }

            if (err.error.constructor === Object) {
                cmpt.error = err.error;
                const arrErrors = this.errMap(cmpt.error);
                cmpt.errors = _.clone(arrErrors);
                arrErrors.forEach(error => {
                    this.processError(error);
                });
            }

            // If we don't have any detailed information, fallback to the request message itself.
            return err.message;
        }

        // Skip if there's no error, and let user decide what to do with it.
        return null;
    }

    showErrorToast(position, status, title, context) {
        const duration = this.toastErrorTime;
        const preventDuplicates = true;
        this.toastrService.show(`${context}`, title, {
            position,
            status,
            duration,
            preventDuplicates,
        });
    }

    handleError(error, cmpt?, server?) {
        this.errorFxn(error, cmpt, server);
    }
}
