export interface SenderIdModel {
    classification: string;
    sender_type: string;
    active: boolean;
    name: string;
    disabled: {
        status: boolean;
        reason?: string;
    };
    id?: string; // available when record retrieved from db. Will play a role in offline storage.
}
