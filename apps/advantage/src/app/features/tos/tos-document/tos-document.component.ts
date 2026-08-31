import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-tos-document',
    templateUrl: './tos-document.component.html',
    styleUrls: ['./tos-document.component.scss'],
    standalone: false,
})
export class TosDocumentComponent implements OnInit {
    constructor() {}
    variant: string;
    ngOnInit() {
        this.variant = environment.variant;
    }
}
