/**
 * Imports used in the pipe
 */
import { Pipe, PipeTransform } from '@angular/core';
import {
    DomSanitizer,
    SafeHtml,
    SafeStyle,
    SafeScript,
    SafeUrl,
    SafeResourceUrl,
} from '@angular/platform-browser';

/** Pipe decorator that specifies the name of the pipe */
@Pipe({
    name: 'safe',
    standalone: false,
})

/** Definition of the safe pipe class */
export class SkikaSafePipe implements PipeTransform {
    /** definition of the class constructor */
    constructor(protected sanitizer: DomSanitizer) {}

    /** transform method that is given an input to modify */
    public transform(
        value: any,
        type: string
    ): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
        switch (type) {
            case 'html':
                return this.sanitizer.bypassSecurityTrustHtml(value);
            case 'style':
                return this.sanitizer.bypassSecurityTrustStyle(value);
            case 'script':
                return this.sanitizer.bypassSecurityTrustScript(value);
            case 'url':
                return this.sanitizer.bypassSecurityTrustUrl(value);
            case 'resourceUrl':
                return this.sanitizer.bypassSecurityTrustResourceUrl(value);
            default:
        }
    }
}
