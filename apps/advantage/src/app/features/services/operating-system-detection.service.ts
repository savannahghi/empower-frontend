import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class OperatingSystemDetectionService {
    getCurrentOS(): string {
        const userAgent = navigator.userAgent;

        if (/Windows NT/.test(userAgent)) return 'Windows';
        if (/Android/.test(userAgent)) return 'Android';
        if (/iPhone|iPad|iPod/.test(userAgent)) return 'iOS';
        if (/Mac OS X/.test(userAgent)) {
            return navigator.maxTouchPoints > 1 && !(window as any).MSStream
                ? 'iOS'
                : 'Mac';
        }
        if (/Linux/.test(userAgent)) return 'Linux';

        return 'Unknown OS';
    }

    isCurrentOsSupported(os: string): boolean {
        const supportedOperatingSystems = ['Windows'];
        return supportedOperatingSystems.includes(os);
    }
}
