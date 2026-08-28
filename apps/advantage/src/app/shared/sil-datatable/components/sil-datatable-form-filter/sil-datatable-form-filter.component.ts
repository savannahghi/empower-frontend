import { Component } from '@angular/core';

/**
 * Component decorator used in templates
 * the selector, style url, and template
 */
@Component({
    selector: 'sil-datatable-form-filter',
    template: `
        <span class="float-right">
            <button nbButton shape="rectangle" size="small" status="info">
                Filter
            </button>
        </span>
    `,
    styleUrls: ['./sil-datatable-form-filter.component.scss'],
    standalone: false,
})

/** Class that is used for form filter toggling */
export class SilDatatableFormFilterComponent {}
