import { FileExtensionPipe } from './file-extension.pipe';

describe('FileExtensionPipe', () => {
    let pipe: FileExtensionPipe;

    beforeEach(() => {
        pipe = new FileExtensionPipe();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should transform application/vnd.ms-excel to .xls', () => {
        const result = pipe.transform('application/vnd.ms-excel');
        expect(result).toBe('.xls');
    });

    it('should transform application/vnd.openxmlformats-officedocument.spreadsheetml.sheet to .xlsx', () => {
        const result = pipe.transform(
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        expect(result).toBe('.xlsx');
    });
});
