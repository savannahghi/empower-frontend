import { NotLoadedInvoicesRemarksPipe } from './not-loaded-invoices-remarks.pipe';

describe('NotLoadedInvoicesRemarksPipe', () => {
    it('should return not_loaded_remarks if it exists', () => {
        const pipe = new NotLoadedInvoicesRemarksPipe();

        const input = {
            not_loaded_remarks: 'Some remark',
            workflow_state: 'NOT_LOADED',
            identifiers: { edi: { workflow_state: 'NOT_LOADED' } },
        };
        expect(pipe.transform(input)).toBe('Some remark');
    });

    it('should return identifiers.edi.workflow_state with spaces if not_loaded_remarks is missing and workflow_state is NOT_LOADED', () => {
        const pipe = new NotLoadedInvoicesRemarksPipe();

        const input = {
            workflow_state: 'NOT_LOADED',
            identifiers: { edi: { workflow_state: 'NOT_LOADED_TEST' } },
        };
        expect(pipe.transform(input)).toBe('NOT LOADED TEST');
    });

    it('should return "_" if value is null', () => {
        const pipe = new NotLoadedInvoicesRemarksPipe();
        expect(pipe.transform(null)).toBe('_');
    });

    it('should return "_" if value is undefined', () => {
        const pipe = new NotLoadedInvoicesRemarksPipe();
        expect(pipe.transform(undefined)).toBe('_');
    });

    it('should return "_" if not_loaded_remarks is missing, workflow_state is "NOT_LOADED", but identifiers.edi.workflow_state is missing', () => {
        const pipe = new NotLoadedInvoicesRemarksPipe();
        const input = {
            workflow_state: 'NOT_LOADED',
            identifiers: {},
        };
        expect(pipe.transform(input)).toBe('_');
    });
});
