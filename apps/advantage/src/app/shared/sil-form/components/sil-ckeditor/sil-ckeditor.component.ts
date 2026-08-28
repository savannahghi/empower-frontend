import { afterNextRender, Component, OnInit, Output } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
@Component({
    selector: 'app-ckeditor',
    styleUrls: ['./sil-ckeditor.component.scss'],
    template: `
        <div class="form-control-group {{ props.fieldClassName }}">
            <label class="label">
                {{ props.label }}
                <span
                    class="text-danger"
                    *ngIf="props.required"
                    style="font-size:0.85rem;">
                    *
                </span>
            </label>
            <ckeditor
                [editor]="Editor"
                [config]="editorConfig"
                [formControl]="formControl"
                [formlyAttributes]="field">
            </ckeditor>
            <p class="text-dark" style="padding-top:0.5rem;">
                {{ props.helpText }}
            </p>
        </div>
    `,
    standalone: false,
})
/** Constructor for the ckeditor component */
export class SilFormCkEditorComponent
    extends FieldType<FieldTypeConfig>
    implements OnInit
{
    public Editor: any;
    editorConfig = {
        // Your configuration options here, e.g.,
        toolbar: [],
        dataProcessor: false,
    };
    /**
     * Emits event when changes happen
     */
    @Output() events: Event[] = [];

    constructor() {
        super();
        afterNextRender(() => {
            this.loadCkEditor();
        });
    }

    async loadCkEditor() {
        if (typeof window !== 'undefined') {
            const classicEditor = (
                await import('@ckeditor/ckeditor5-build-classic')
            ).default;
            this.Editor = classicEditor;
            this.editorConfig = {
                // Your configuration options here, e.g.,
                toolbar: [],
                dataProcessor: false,
            };
        }
    }

    ngOnInit() {}
}
