import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

/**
 * Component decorator
 */
@Component({
    selector: 'sil-form-template',
    styleUrls: ['./sil-form-template.component.scss'],
    template: `
        <div class="form-control-group">
            <div
                [innerHtml]="props.template | safe : 'html'"
                *ngIf="props.template && !props.link"></div>
            <span
                [innerHtml]="props.template | safe : 'html'"
                *ngIf="props.template && props.link">
            </span>
            <a
                class="{{ props.customClass }}"
                *ngIf="props.link"
                [routerLink]="props.link">
                {{ props.linkText }}
            </a>
        </div>
    `,
    standalone: false,
})

/** class component for the form template */
export class SilFormTemplateComponent extends FieldType<FieldTypeConfig> {}
