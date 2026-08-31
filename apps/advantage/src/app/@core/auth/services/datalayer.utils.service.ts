import { Injectable } from '@angular/core';

@Injectable()
export class DataLayerUtils {
    SEP = '/';
    FALSY: any[] = [undefined, '', null, this.SEP];
    /*
     *@doc method
     *@name urlJoin
     *
     * @param {...*} urls Url parts to join. The url params should
     * not include query params because it blindly concatenates the
     * arguments using the "/" character
     *
     * @returns {String} The joined URL, including a trailing slash
     *
     * @description
     * Joins url stubs into one url
     */

    urlJoin(...args: any[]): string {
        return args.reduce((memo, arg) => {
            if (this.FALSY.includes(arg)) {
                return memo;
            }

            let char = arg.toString();

            if (!char.endsWith(this.SEP)) {
                char += this.SEP;
            }

            if (char.startsWith(this.SEP) && memo.endsWith(this.SEP)) {
                char = char.substr(1);
            }

            return `${memo}${char}`;
        }, '');
    }

    makeQueryParams(params: Object): string {
        function encodeUriQuery(val: any): any {
            return (
                encodeURIComponent(val)
                    .replace(/%40/gi, '@')
                    .replace(/%3A/gi, ':')
                    .replace(/%24/g, '$')
                    .replace(/%2C/gi, ',')
                    .replace(/%3B/gi, ';')
                    // angular's version had a ternary here
                    .replace(/%20/g, '%20')
            );
        }
        const parts = [];
        Object.keys(params).forEach((key: any) => {
            const value = params[key];
            if (Array.isArray(value)) {
                value.forEach((k: any) => {
                    parts.push(
                        `${encodeUriQuery(key)}${
                            k === true ? '' : `=${encodeUriQuery(k)}`
                        }`
                    );
                });
            } else {
                const extraParam =
                    value === true ? '' : `=${encodeUriQuery(value)}`;
                parts.push(`${encodeUriQuery(key)}${extraParam}`);
            }
        });

        return parts.length ? parts.join('&') : '';
    }
}
