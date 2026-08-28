import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-initials-avatar',
    templateUrl: './initials-avatar.component.html',
    styleUrl: './initials-avatar.component.css',
    standalone: false,
})
export class InitialsAvatarComponent implements OnInit {
    @Input() name: string;
    initials: string;

    ngOnInit(): void {
        this.initials = this.getInitials(this.name);
    }
    /**
     * Return the first two Letters of the name parament as initials
     */
    getInitials(name: string): string {
        if (!name) return '';
        const words = name.split(' ');
        const initials =
            words.length >= 2 ? words[0][0] + words[1][0] : words[0][0];
        return initials.toUpperCase();
    }
}
