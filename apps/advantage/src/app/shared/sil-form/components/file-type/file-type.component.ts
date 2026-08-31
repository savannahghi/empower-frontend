import {
    afterNextRender,
    Component,
    ElementRef,
    Injector,
    ViewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
    selector: 'formly-field-file',
    styleUrls: ['./file-type.component.scss'],
    templateUrl: './file-type.component.html',
    standalone: false,
})
export class FormlyFieldFileComponent extends FieldType<FieldTypeConfig> {
    @ViewChild('fileinput') el: ElementRef;
    selectedFiles: File[];
    ng2ImgMaxService: any;
    placeholderIcon: string =
        '../../../../../../assets/images/blank_preview.png'; // Custom icon path

    /**
     * Constructor for the component class
     * @param sanitizer contains DomSanitizer to prevent XSS bugs
     */
    constructor(public sanitizer: DomSanitizer, private injector: Injector) {
        super();
        afterNextRender(() => {
            this.loadNgImgMaxService();
        });
    }

    async loadNgImgMaxService() {
        if (typeof window !== 'undefined') {
            const {
                Ng2ImgMaxService: ng2ImgMaxService,
                ImgMaxSizeService: imgMaxSizeService,
                ImgMaxPXSizeService: imgMaxPXSizeService,
                ImgExifService: imgExifService,
            } = await import('ng2-img-max');
            const imgMaxSizeServiceInstance =
                this.injector.get(imgMaxSizeService);
            const imgMaxPXSizeServiceInstance =
                this.injector.get(imgMaxPXSizeService);
            const imageExifServiceInstance = this.injector.get(imgExifService);
            this.ng2ImgMaxService = new ng2ImgMaxService(
                imgMaxSizeServiceInstance,
                imgMaxPXSizeServiceInstance,
                imageExifServiceInstance
            );
        }
    }

    /**
     * Method to delete attachment
     * @param index reference to the file
     */
    onDelete(index) {
        this.selectedFiles.splice(index, 1);
        this.formControl.patchValue(this.selectedFiles);
    }

    /**
     * Method to detect changes in the file(s) selected
     * @param event contains event that has the file information
     */
    onChange(event, props, model) {
        // Assert the type of the files to be File[]
        const newFiles: File[] = Array.from(event.target.files) as File[];

        // Append new files to the existing selectedFiles array
        this.selectedFiles = this.selectedFiles
            ? [...this.selectedFiles, ...newFiles]
            : newFiles;

        // Process each new file
        newFiles.forEach(file => {
            if (
                file.type === 'application/pdf' ||
                file.type ===
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type === 'application/vnd.ms-excel' ||
                file.type === 'csv'
            ) {
                props.fileEvent(file, model);
            } else {
                this.ng2ImgMaxService.compressImage(file, 0.5, false).subscribe(
                    result => {
                        const compressedFile = new File([result], result.name, {
                            type: file.type,
                        });
                        this.ng2ImgMaxService
                            .resize([compressedFile], 2400, 2400)
                            .subscribe(
                                res => {
                                    const resizedFile = new File(
                                        [res],
                                        result.name,
                                        { type: file.type }
                                    );
                                    props.fileEvent(resizedFile, model);
                                },
                                error => {
                                    const errorFile = new File(
                                        [error.resizedFile],
                                        error.resizedFile.name,
                                        { type: file.type }
                                    );
                                    props.fileEvent(errorFile, model);
                                }
                            );
                    },
                    error => {
                        const errorFile = new File(
                            [error.resizedFile],
                            error.resizedFile.name,
                            { type: file.type }
                        );
                        props.fileEvent(errorFile, model);
                    }
                );
            }
        });

        // Update the form control value
        this.formControl.patchValue(this.selectedFiles);
    }

    /**
     * Sanitizes image before displaying it on the component
     * @param file contains the file being displayed
     * @returns the file for reference
     */
    getSanitizedImageUrl(file: File) {
        return this.sanitizer.bypassSecurityTrustUrl(
            window.URL.createObjectURL(file)
        );
    }

    /**
     * Checks if a file is an image
     * @param file the file to check
     * @returns true if the file is an image, false otherwise
     */
    isImage(file: File): boolean {
        if (this.props?.addFile) {
            this.props?.addFile({ file: file });
        }
        return file.type.startsWith('image/');
    }
}
