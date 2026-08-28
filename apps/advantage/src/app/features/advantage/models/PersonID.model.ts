export enum IDDocumentTypes {
    alienID = 'alienID',
    militaryID = 'militaryID',
    nationalID = 'nationalID',
    passportID = 'passportID',
    payerID = 'payerID',
    kraPIN = 'kraPIN',
}

export interface PersonIDModel {
    id_document_type: IDDocumentTypes;
    id_value: string;
}
