import {
    ChangeDetectionStrategy,
    Component,
    ChangeDetectorRef,
    OnInit,
} from '@angular/core';

@Component({
    selector: 'app-empower-welcome',
    templateUrl: './empower-welcome.component.html',
    styleUrls: ['./empower-welcome.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class EmpowerWelcomeComponent implements OnInit {
    features = [
        {
            icon: 'fas fa-mobile-alt',
            title: 'Mobile & Web Compatible',
            description:
                'Access your patient management system anywhere, anytime with our responsive design optimized for all devices.',
        },
        {
            icon: 'fas fa-user-plus',
            title: 'Patient Registration & Health ID',
            description:
                'Streamlined patient onboarding with unique health ID assignment for seamless tracking and identification.',
        },
        {
            icon: 'fas fa-clock',
            title: 'Patient Timelines',
            description:
                'Comprehensive treatment continuity tracking with detailed patient history and progress monitoring.',
        },
        {
            icon: 'fas fa-graduation-cap',
            title: 'Patient Education',
            description:
                'Automated SMS and email communication for patient education, reminders, and health awareness.',
        },
        {
            icon: 'fas fa-shield-alt',
            title: 'Cancer Risk Assessment',
            description:
                'Advanced screening tools and risk evaluation algorithms for early cancer detection and prevention.',
        },
        {
            icon: 'fas fa-vials',
            title: 'Diagnostic Test Management',
            description:
                'Centralized management of all diagnostic tests, results, and follow-up requirements.',
        },
        {
            icon: 'fas fa-share-alt',
            title: 'Patient Referral System',
            description:
                'Efficient referral management connecting patients with specialists and treatment centers.',
        },
        {
            icon: 'fas fa-calendar-alt',
            title: 'Appointment Management',
            description:
                'Comprehensive scheduling system with automated reminders and calendar integration.',
        },
        {
            icon: 'fas fa-chart-bar',
            title: 'Reports & Dashboards',
            description:
                'Real-time analytics and comprehensive reporting for informed decision-making and insights.',
        },
    ];

    constructor(public cd: ChangeDetectorRef) {}

    ngOnInit(): void {
        setTimeout(() => {
            const welcomeElement = document.querySelector('.welcome-height');
            if (welcomeElement) {
                (welcomeElement as HTMLElement).style.display = 'block';
                (welcomeElement as HTMLElement).style.visibility = 'visible';
                (welcomeElement as HTMLElement).style.opacity = '1';
            }
        }, 500);
    }
}
