import { Injectable } from '@angular/core';
import { Authorization } from './authorization.service';

import moment from 'moment';
import _ from 'underscore';

@Injectable()
export class AuthenticationService {
    constructor(public authConfig: Authorization) {}

    getUser(): Object {
        const user = this.authConfig.getUser();
        return user;
    }

    getToken(): Object {
        const token = this.authConfig.getToken();
        return token;
    }

    /**
     * @name checkPermission
     * @param {String} perms
     * Contains the permissions required by a view or an element
     *
     * @throws {Error} If permissions has both an AND and OR splitters
     * @returns {Boolean} true if user has the required permissions or false otherwise
     * @description
     * Splits the permissions string based on the presence of AND or OR
     * spliters.
     *
     * For an AND permission definition the permissions param should
     * contain **:** e.g. `permission1:permission2`. A user must have all the
     * required permissions to succefully pass the test.
     *
     * For OR permission definition the permissions param should contain **;**
     * e.g. `permission1;permission2`. A user is only required to have at least one
     * permission to pass the test.
     *
     * **NOTE:** With OR only one permission checker is required to return `true`.
     * If this happens then the remaining ones are ignored.
     *
     */

    checkPermission = (perms): any => {
        const AND = ':';
        const OR = ';';
        const user = this.authConfig.getUser();
        const userPerms = user && user.permissions ? user.permissions : [];

        let useOr = false;
        let listPerms = [perms];

        if (perms.indexOf(AND) !== -1 && perms.indexOf(OR) !== -1) {
            throw Error('You can only use one type of action splitter');
        }

        /**
         * Check if the splitter is using AND for splitting
         */
        if (perms.indexOf(AND) !== -1) {
            listPerms = perms.split(AND);
        }

        /**
         * Check if the splitter is using OR for splitting
         */
        if (perms.indexOf(OR) !== -1) {
            listPerms = perms.split(OR);
            useOr = true;
        }

        for (let i = 0; i < listPerms.length; i++) {
            const acts = listPerms;
            let res = true;

            /**
             * Check permission exists in user's permissions
             */
            if (!userPerms.includes(acts[i])) {
                res = false;
            }

            /**
             * This is an OR check. Where if any checker passes a user is
             * allowed access
             **/
            if (res && useOr) {
                return true;
            }

            /**
             * This is specific to AND. There is no need to move to another
             * checker if one already has failed
             **/
            if (!(res || useOr)) {
                return false;
            }
        }
        return useOr ? false : true;
    };

    /** Checks if provided roles existing in the list of user roles from logged in user */
    checkRoles = (roles): any => {
        const user = this.authConfig.getUser();
        const userRoles = user && user.roles ? user.roles : [];

        const hasRoles = roles.every(item => userRoles.includes(item));

        return hasRoles;
    };

    /** CheckSetting */
    checkSetting = (setting): any => {
        const settings = this.authConfig.getOrgSettings();
        const sett = _.findWhere(settings, { name: setting });
        return sett.value;
    };

    isAuthenticated(): boolean {
        // get token object
        const user = this.getUser();
        const hasToken = this.getToken();
        if (!_.isNull(user) && !_.isNull(hasToken)) {
            const now = moment();
            const expiresAt = 'expires_at';
            const isExpired = now.isAfter(moment(hasToken[expiresAt]));
            return !isExpired;
        } else {
            return false;
        }
    }
}
