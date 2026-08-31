import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import {
    NbBadgeModule,
    NbIconModule,
    NbTagModule,
    NbTooltipModule,
} from '@nebular/theme';
import { StatusColorPipe } from '../../../../@theme/pipes/status-color/status-color.pipe';
import { ThemeModule } from '../../../../@theme/theme.module';
import { Cookies } from '../../../../shared/cookies/cookie.service';

@Component({
    selector: 'ngx-service-request-list-item',
    imports: [
        NbBadgeModule,
        DatePipe,
        NbIconModule,
        NbTagModule,
        NbTooltipModule,
        StatusColorPipe,
        ThemeModule,
        TranslatePipe,
    ],
    templateUrl: './service-request-list-item.component.html',
    styleUrl: './service-request-list-item.component.scss',
})
export class ServiceRequestListItemComponent implements OnInit {
    /**
     * Fetches the selected language from cookie storage
     */
    selectedLanguage = this.cookieService.getLanguageCookie();

    constructor(
        private translate: TranslateService,
        private cookieService: Cookies
    ) {
        translate.setFallbackLang('en');
        translate.use(this.selectedLanguage);
    }

    /** Contains service request details*/
    @Input() serviceRequest: any;

    initials: string;

    getInitials(name: string): string {
        return name
            .split(' ') // Split the name into words
            .map(word => word.charAt(0).toUpperCase()) // Get the first letter of each word
            .join('') // Join them together
            .slice(0, 2); // Return only the first two initials
    }

    ngOnInit() {
        this.initials = this.getInitials(this.serviceRequest.patient_name);
    }
}
