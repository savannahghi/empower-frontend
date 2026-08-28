import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fileExtension',
    standalone: true,
})
export class FileExtensionPipe implements PipeTransform {
    /**
     * map the provided file types to specific file extensions
     */
    private fileMimeTypeMap: { [key: string]: string } = {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            '.xlsx',
        'application/vnd.ms-excel': '.xls',
    };

    transform(fileMimeType: string): string {
        return this.fileMimeTypeMap[fileMimeType];
    }
}
