import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import _ from 'underscore';

import { AddMOHCertService } from './formly/add-MOH-cert-form';
import { AddAdjustmentItemService } from './formly/add-adjustment-item';
import { AppointmentFieldsService } from './formly/add-appointment-form';
import { PatientAttachmentFieldsService } from './formly/add-attachment-form';
import { AddBankDetailsFormService } from './formly/add-bank-details-form';
import { BillItemFieldsService } from './formly/add-bill-item-form';
import { BomComponentService } from './formly/add-bom-component-form';
import { BomOperationService } from './formly/add-bom-operation-form';
import { AddBusinessDetailsFormService } from './formly/add-business-details-form';
import { AddBusinessLicense } from './formly/add-business-license-form';
import { checkinFieldService } from './formly/add-checkin-form';
import { AddCommentsFormFieldsService } from './formly/add-comments-form';
import { AddDepartmentService } from './formly/add-department-form';
import { AddDirectInvoiceItemsFieldsService } from './formly/add-direct-invoice-items-form';
import { AddDirectPaymentFieldsService } from './formly/add-direct-payment';
import { AddExamDiagnosisFormService } from './formly/add-exam-diagnosis-form';
import { AddExamReferralFormService } from './formly/add-exam-referral-form';
import { AddLicensingFormService } from './formly/add-licensing-form';
import { AddMessageTemplateService } from './formly/add-message-template-form';
import { AddNewOwnerService } from './formly/add-new-owner-form';
import { OperatingRegionsService } from './formly/add-operating-regions-form';
import { AddOpposingEntryFormFieldsService } from './formly/add-opposing-entry-form';
import { UpdateOrgBranchCustomerService } from './formly/add-org-branch-customer';
import { PatientAllergyFieldsService } from './formly/add-patient-allergy-form';
import { PatientCompositionFieldsService } from './formly/add-patient-composition-form';
import { PatientDiagnosisFieldsService } from './formly/add-patient-diagnosis-form';
import { AddPatientGeneralExamService } from './formly/add-patient-exam-form';
import { PatientObservationFieldsService } from './formly/add-patient-observation-form';
import { AddPatientPaymentFieldsService } from './formly/add-patient-payment';
import { PatientProblemFieldsService } from './formly/add-patient-problem-form';
import { PatientVitalFieldsService } from './formly/add-patient-vitals-form';
import { AddPaymentMethodService } from './formly/add-payment-method-form';
import { AddPaymentOption } from './formly/add-payment-option-form';
import { AddPaymentRunLineService } from './formly/add-payment-runline-form';
import { AddPhotoFormService } from './formly/add-photo-form';
import { AddPractitionerFormService } from './formly/add-practitioner-form';
import { PriceListFieldsService } from './formly/add-pricelist-form';
import { AddPricelistLocationFormService } from './formly/add-pricelist-location-form';
import { AddProductCategoryFormService } from './formly/add-product-category-form';
import { ProductFieldsService } from './formly/add-product-form';
import { EtimsProductFieldsService } from './formly/add-product-form-etmis';
import { OclProductFieldsService } from './formly/add-product-form-ocl';
import { OclEtimsProductFieldsService } from './formly/add-product-form-ocl-etims';
import { AddQueueService } from './formly/add-queue-form';
import { AddRecipientService } from './formly/add-recipient-form';
import { AddSubtopicFormFieldsService } from './formly/add-subtopic-form';
import { AddSupplierPaymentRunLineFormService } from './formly/add-supplier-payment-runline-form';
import { AddTransferItemFormService } from './formly/add-transfer-item-form';
import { AddUserWorkstationsFormFieldsService } from './formly/add-user-workstation-form';
import { ApproveReconInvoiceLinesService } from './formly/approve-recon-invoice-lines';
import { AssignResponsibilityFormService } from './formly/assign-responsibility-form';
import { BankDetailsSetupService } from './formly/bank-account-setup';
import { BasicDetailsService } from './formly/basic-details-form';
import { ProviderFieldsService } from './formly/basic-provider-form';
import { BillPatientFormFieldsService } from './formly/bill-patient-form';
import { BranchSettingsService } from './formly/branch-settings-form';
import { BulkCancelAppointmentService } from './formly/bulk-cancel-appointments';
import { BusinessDetailsRegistrationService } from './formly/business-details-form';
import { CancelAppointmentService } from './formly/cancel-appointment-form';
import { ClusterOrganisationUnitService } from './formly/cluster-org-unit.form';
import { CreateRefundFieldsService } from './formly/create-refund-form';
import { CreateRequisitionBasicDetailsFieldsService } from './formly/create-requisition-basic-details-form';
import { CreateRequisitionItemsRequestedFieldsService } from './formly/create-requisition-items-requested-form';
import { DeclineInvoiceFormService } from './formly/decline-invoice-form';
import { DirectSalesInvoiceLinesService } from './formly/direct-invoice-lines-form';
import { DiseaseRegistrationService } from './formly/disease-registration-form';
import { EditProfileBasicDetailsFormFieldsService } from './formly/edit-basic-details-form';
import { EditOpposingEntryFieldsService } from './formly/edit-opposing-entry-form';
import { EditPricelistDetailsFormService } from './formly/edit-pricelist-details-form';
import { EditSegmentMessageService } from './formly/edit-segment-message-form';
import { EmployerRegistrationService } from './formly/employer-registration-form';
import { AddLabOrderTestService } from './formly/empower/add-lab-order-test-form';
import { AddLabOrderService } from './formly/empower/add-lab-order.form';
import { AddPostScreeningService } from './formly/empower/add-post-screening-task-form';
import { AddPrescriptionService } from './formly/empower/add-prescription-form';
import { BreastCancerExaminationService } from './formly/empower/breast-cancer-examinations-form';
import { BreastCancerScreeningService } from './formly/empower/breast-cancer-screening-form';
import { CervicalCancerExaminationsService } from './formly/empower/cervical-cancer-examinations-form';
import { CervicalCancerScreeningService } from './formly/empower/cervical-cancer-screening-form';
import { CompletePostScreeningFieldsService } from './formly/empower/complete-post-screening-task-form';
import { DiagnosticDiagnosisService } from './formly/empower/diagnostic-diagnosis-form';
import { DiagnosticSpecimenInformationService } from './formly/empower/diagnostic-specimen-information-form';
import { FacilityOnboardingService } from './formly/empower/facility-onboarding-form';
import { FacilityOwnerService } from './formly/empower/facility-owner-form';
import { ProstateCancerExaminationsService } from './formly/empower/prostate-cancer-examinations-form';
import { ProstateCancerScreeningService } from './formly/empower/prostate-cancer-screening-form';
import { ScreeningFollowUpService } from './formly/empower/screening-followup-form';
import { UnfullfilledTaskPostScreeningService } from './formly/empower/unfulfilled-task-post-screening-form';
import { EnableAutoreconUserService } from './formly/enable-autorecon-user';
import { EnableEtimsUserService } from './formly/enable-etims-user';
import { EtimsInitializeDeviceService } from './formly/etims-initialize-device';
import { FacilityContactFieldsService } from './formly/facility-contact-form';
import { FacilityIdentifierFieldsService } from './formly/facility-identifier-form';
import { FacilityRegistrationService } from './formly/facility-registration-form';
import { FacilityServiceFormService } from './formly/facility-service-form';
import { FilterAppointmentsService } from './formly/filter-appointments-form';
import { ExpiriesFilterFormFieldService } from './formly/filter-expiries-form';
import { FilterReconInvoiceLinesService } from './formly/filter-recon-invoice-lines';
import { FilterReconPaymentsService } from './formly/filter-recon-payments';
import { FilterReconRequestService } from './formly/filter-recon-request-form';
import { FilterReconRequestInvoicesService } from './formly/filter-recon-request-invoices-form';
import { FilterReconinvoicesService } from './formly/filter-reconinvoices-form';
import { FinalizeInvoiceFormService } from './formly/finalize-invoice-form';
import { GuidelinesService } from './formly/guidelines-form';
import { InventoryOperationService } from './formly/inventory-operation-form';
import { InvoicePaymentService } from './formly/invoice-payment-form';
import { MinimalPatientRegistrationFormFieldsService } from './formly/minimal-patient-registration-form';
import { MobileMoneySetupService } from './formly/mobile-money-setup';
import { MsgDeliveryReasonService } from './formly/msg-delivery-reason';
import { MsgLogDetailsService } from './formly/msg-log-details';
import { NewDirectPurchaseOrderFieldsService } from './formly/new-direct-purchase-order-form';
import { NewPaymentMethodFieldsService } from './formly/new-payment-method-form';
import { NewPurchaseOrderFieldsService } from './formly/new-purchase-order-form';
import { NewReconRequestFormService } from './formly/new-recon-request-form';
import { NewReturnOutwardsFieldsService } from './formly/new-return-outwards-form';
import { NewReturnOutwardsRecordFieldsService } from './formly/new-return-outwards-record-form';
import { NewSalesPricelistFieldsService } from './formly/new-sales-pricelist-form';
import { NewSignoffFormService } from './formly/new-signoff-form';
import { NewSupplierFieldsService } from './formly/new-supplier-form';
import { NextofKinRegistrationService } from './formly/next-of-kin-registration-form';
import { MemberInvitationService } from './formly/onboarding-member-invite-form';
import { OrgSettingsService } from './formly/org-settings-form';
import { PatientGuidelinesService } from './formly/patient-guidelines-form';
import { PatientRegistrationService } from './formly/patient-registration-form';
import { LicensingService } from './formly/payer-licensing-form';
import { PayerRegistrationService } from './formly/payer-registration-form';
import { PostNewJournalEntryFormFieldsService } from './formly/post-new-entry-form';
import { PractitionerRegistrationService } from './formly/practitioner-registration-form';
import { ProcessBomOperationService } from './formly/process-bom-operation';
import { ProcessInvoiceService } from './formly/process-invoice';
import { ProcessInvoiceFormService } from './formly/process-invoice-form';
import { RecordAdjustmentFormService } from './formly/record-adjustment-form';
import { RecordBillFormFieldsService } from './formly/record-bill-form';
import { RecordBillItemsFormFieldsService } from './formly/record-bill-items-form';
import { RecordDirectInvoiceFormFieldsService } from './formly/record-direct-invoice-form';
import { RecordGuideSubtopicFormFieldsService } from './formly/record-guide-subtopic.form';
import { RecordGuideTopicFormFieldsService } from './formly/record-guide-topic.form';
import { RecordTransferFormService } from './formly/record-transfer-form';
import { RefundLineService } from './formly/refund-invoice-line';
import { DirectSalesInvoiceService } from './formly/sales-invoice-form';
import { DirectSalesOrderService } from './formly/sales-order-form';
import { DirectSalesOrderLinesService } from './formly/sales-order-lines';
import { SearchFacilityService } from './formly/search-facility-form';
import { BasicProviderFieldsService } from './formly/self-basic-provider-form';
import { SettleBillFormFieldsService } from './formly/settle-bill-form';
import { SetupOrganisationFeatureFormService } from './formly/setup-organisation-feature-form';
import { SetupProviderPayerFormService } from './formly/setup-provider-payer-form';
import { SigningUpService } from './formly/sign-up-form';
import { CreateSupplierPaymentRunFormService } from './formly/supplier-payment-run-form';
import { UnlinkProfileService } from './formly/unlink-profile-form';
import { UpdateOrgBranchBasicDetailsService } from './formly/update-org-branch-basic-details';
import { UpdateOrganisationService } from './formly/update-organisation-form';
import { BusinessDocumentsUploadService } from './formly/upload-business-documents-form';
import { UploadInvoiceAttachmentService } from './formly/upload-invoice-attachment-form';
import { formStores } from './skika-form-stores';
import { SkikaSaveOnChangesService } from './skika-save-onchanges.service';

@Injectable()
export class SilFormlyService {
    http: HttpClient;
    onChangeServ: SkikaSaveOnChangesService;
    patientRegisterService: PatientRegistrationService;
    nextofKinRegisterService: NextofKinRegistrationService;
    orgSettingsService: OrgSettingsService;
    branchSettingsService: BranchSettingsService;
    appointmentService: AppointmentFieldsService;
    checkinService: checkinFieldService;
    operatingRegionsService: OperatingRegionsService;
    bulkCancelService: BulkCancelAppointmentService;
    addBillItemService: BillItemFieldsService;
    addPatientPaymentService: AddPatientPaymentFieldsService;
    createRefundService: CreateRefundFieldsService;
    refundLineService: RefundLineService;
    addPatientVitalItemService: PatientVitalFieldsService;
    addPatientProblemItemService: PatientProblemFieldsService;
    addPatientDiagnosisItemService: PatientDiagnosisFieldsService;
    addPatientAttachmentItemService: PatientAttachmentFieldsService;
    addUploadInvoiceAttachmentItemService: UploadInvoiceAttachmentService;
    addPatientAllergyItemService: PatientAllergyFieldsService;
    addPatientCompositionItemService: PatientCompositionFieldsService;
    provService: ProviderFieldsService;
    filterService: FilterAppointmentsService;
    filterInvoicesService: FilterReconinvoicesService;
    filterReconRequestService: FilterReconRequestService;
    filterReconRequestinvoicesService: FilterReconRequestInvoicesService;
    filterReconInvoiceLinesService: FilterReconInvoiceLinesService;
    filterReconPaymentsService: FilterReconPaymentsService;
    approveReconInvoiceLinesService: ApproveReconInvoiceLinesService;
    signUpService: SigningUpService;
    cervicalCancerService: CervicalCancerScreeningService;
    breastCancerService: BreastCancerScreeningService;
    prostateCancerService: ProstateCancerScreeningService;
    breastCancerExamination: BreastCancerExaminationService;
    cervicalCancerExamination: CervicalCancerExaminationsService;
    prostateCancerExamination: ProstateCancerExaminationsService;
    addPrescription: AddPrescriptionService;
    addLabOrderService: AddLabOrderService;
    addRecipient: AddRecipientService;
    facilitySearchService: SearchFacilityService;
    basicInfoService: BasicDetailsService;
    facilityRegisterService: FacilityRegistrationService;
    facilityOnboardingService: FacilityOnboardingService;
    facilityOwnerService: FacilityOwnerService;
    facilityContactService: FacilityContactFieldsService;
    facilityIdentifierService: FacilityIdentifierFieldsService;
    facilityServiceService: FacilityServiceFormService;
    payerRegisterService: PayerRegistrationService;
    employerRegisterService: EmployerRegistrationService;
    licenseService: LicensingService;
    businessDetailsRegisterService: BusinessDetailsRegistrationService;
    cancelService: CancelAppointmentService;
    guidelineRegisterService: GuidelinesService;
    patientGuidelineRegisterService: PatientGuidelinesService;
    diseaseRegisterService: DiseaseRegistrationService;
    practitionerRegisterService: PractitionerRegistrationService;
    priceListItemService: PriceListFieldsService;
    selfProvService: BasicProviderFieldsService;
    productItemService: ProductFieldsService;
    addProductCategoryFormService: AddProductCategoryFormService;
    etimsProductItemService: EtimsProductFieldsService;
    oclProductItemService: OclProductFieldsService;
    oclEtimsProductItemService: OclEtimsProductFieldsService;
    paymentMethodService: AddPaymentMethodService;
    memberInvitationService: MemberInvitationService;
    addMOHCertService: AddMOHCertService;
    addBusinessLicense: AddBusinessLicense;
    addPaymentOption: AddPaymentOption;
    addNewOwnerService: AddNewOwnerService;
    screeningFollowUpService: ScreeningFollowUpService;
    completePostScreeningService: CompletePostScreeningFieldsService;
    addPostScreeningTaskService: AddPostScreeningService;
    taskUnfulfilledPostScreeningService: UnfullfilledTaskPostScreeningService;
    addLabOrderTestService: AddLabOrderTestService;
    addMessageTemplateService: AddMessageTemplateService;
    uploadBusinessDocumentService: BusinessDocumentsUploadService;
    addSalesPricelistFieldsService: NewSalesPricelistFieldsService;
    addPaymentMethodFieldsService: NewPaymentMethodFieldsService;
    addSupplierFieldsService: NewSupplierFieldsService;
    addReturnOutwardsFieldsService: NewReturnOutwardsFieldsService;
    addReturnOutwardsRecordFieldsService: NewReturnOutwardsRecordFieldsService;
    addDirectPurchaseOrderFieldsService: NewDirectPurchaseOrderFieldsService;
    addPurchaseOrderFieldsService: NewPurchaseOrderFieldsService;
    updateOrganisationService: UpdateOrganisationService;
    recordTransferService: RecordTransferFormService;
    recordAdjustmentFormService: RecordAdjustmentFormService;
    addTransferItemService: AddTransferItemFormService;
    updateOrgBranchBasicDetailsService: UpdateOrgBranchBasicDetailsService;
    addAdjustmentItemService: AddAdjustmentItemService;
    inventoryOperationService: InventoryOperationService;
    updateOrgBranchCustomerService: UpdateOrgBranchCustomerService;
    bomComponentService: BomComponentService;
    etimsInitializeDeviceService: EtimsInitializeDeviceService;
    processBomOperationService: ProcessBomOperationService;
    processInvoiceService: ProcessInvoiceService;
    bomOperationService: BomOperationService;
    addDepartmentService: AddDepartmentService;
    msgDeliveryReasonService: MsgDeliveryReasonService;
    bankDetailsSetupService: BankDetailsSetupService;
    mobileMoneySetupService: MobileMoneySetupService;
    addPhotoFormService: AddPhotoFormService;
    addBusinessDetailsFormService: AddBusinessDetailsFormService;
    addBankDetailsFormService: AddBankDetailsFormService;
    addPractitionerFormService: AddPractitionerFormService;
    processInvoiceFormService: ProcessInvoiceFormService;
    finalizeInvoiceFormService: FinalizeInvoiceFormService;
    setupProviderPayerFormService: SetupProviderPayerFormService;
    assignResponsibilityFormService: AssignResponsibilityFormService;
    newSignoffFormService: NewSignoffFormService;
    newReconRequestFormService: NewReconRequestFormService;
    declineInvoiceFormService: DeclineInvoiceFormService;
    addLicensingFormService: AddLicensingFormService;
    directSalesInvoiceService: DirectSalesInvoiceService;
    directSalesInvoiceLinesService: DirectSalesInvoiceLinesService;
    editSegmentMessageService: EditSegmentMessageService;
    clusterOrganisationUnitService: ClusterOrganisationUnitService;
    directSalesOrderService: DirectSalesOrderService;
    directSalesOrderLinesService: DirectSalesOrderLinesService;
    createRequisitionBasicDetailsFieldsService: CreateRequisitionBasicDetailsFieldsService;
    createRequisitionItemsRequestedFieldsService: CreateRequisitionItemsRequestedFieldsService;
    addDirectPaymentFieldsService: AddDirectPaymentFieldsService;
    enableEtimsUserService: EnableEtimsUserService;
    enableAutoreconUserService: EnableAutoreconUserService;
    msgLogDetailsService: MsgLogDetailsService;
    addQueueService: AddQueueService;
    invoicePaymentService: InvoicePaymentService;
    addPaymentRunLineService: AddPaymentRunLineService;
    addRecordDirectInvoiceFieldsService: RecordDirectInvoiceFormFieldsService;
    addDirectInvoiceItemsFieldsService: AddDirectInvoiceItemsFieldsService;
    addCommentsFormFieldsService: AddCommentsFormFieldsService;
    addPatientGeneralExamService: AddPatientGeneralExamService;
    addExamDiagnosisService: AddExamDiagnosisFormService;
    addExamReferralService: AddExamReferralFormService;
    createSupplierPaymentRunFormService: CreateSupplierPaymentRunFormService;
    addSupplierPaymentRunLineFormService: AddSupplierPaymentRunLineFormService;
    recordBillFormFieldsService: RecordBillFormFieldsService;
    recordBillItemsFormFieldsService: RecordBillItemsFormFieldsService;
    recordGuideTopicFormFieldsService: RecordGuideTopicFormFieldsService;
    addExpiriesFilterFieldService: ExpiriesFilterFormFieldService;
    settleBillFormFieldsService: SettleBillFormFieldsService;
    addBillPatientFieldsService: BillPatientFormFieldsService;
    minimalPatientRegistrationService: MinimalPatientRegistrationFormFieldsService;
    public;
    editProfileBasicDetailsService: EditProfileBasicDetailsFormFieldsService;
    postNewJournalEntryService: PostNewJournalEntryFormFieldsService;
    addOpposingEntryService: AddOpposingEntryFormFieldsService;
    editOpposingEntryService: EditOpposingEntryFieldsService;
    addSubtopicFormFieldsService: AddSubtopicFormFieldsService;
    recordGuideSubtopicFormFieldsService: RecordGuideSubtopicFormFieldsService;
    diagnosticSpecimenInformation: DiagnosticSpecimenInformationService;
    diagnosticDiagnosisInformation: DiagnosticDiagnosisService;
    addPricelistLocationForm: AddPricelistLocationFormService;
    editPricelistDetailsForm: EditPricelistDetailsFormService;
    addPatientObservationItemService: PatientObservationFieldsService;
    addUserWorkstationFormService: AddUserWorkstationsFormFieldsService;
    setupOrganisationFeatureFormService: SetupOrganisationFeatureFormService;

    stores: any[] = formStores;
    fieldReference: any;

    constructor(
        _http: HttpClient,
        public providerService: ProviderFieldsService,
        public patientRegistrationService: PatientRegistrationService,
        public selfProviderService: BasicProviderFieldsService,
        public nextofKinRegistrationService: NextofKinRegistrationService,
        public appointmentAddService: AppointmentFieldsService,
        public checkinAddService: checkinFieldService,
        public addOperatingRegionsService: OperatingRegionsService,
        public addBillService: BillItemFieldsService,
        public addPaymentService: AddPatientPaymentFieldsService,
        public refundService: CreateRefundFieldsService,
        public refundlineService: RefundLineService,
        public filterAppointmentService: FilterAppointmentsService,
        public filterReconinvoicesService: FilterReconinvoicesService,
        public filterReconRequest: FilterReconRequestService,
        public filterReconRequestinvoices: FilterReconRequestInvoicesService,
        public filterReconPayments: FilterReconPaymentsService,
        public filterReconInvoiceLines: FilterReconInvoiceLinesService,
        public approveReconInvoiceLines: ApproveReconInvoiceLinesService,
        public cancelAppointmentService: CancelAppointmentService,
        public unlinkProfileService: UnlinkProfileService,
        public guidelineRegistrationService: GuidelinesService,
        public patientGuidelineRegistrationService: PatientGuidelinesService,
        public diseaseRegistrationService: DiseaseRegistrationService,
        public signingUpService: SigningUpService,
        public cervicalCancerScreeningService: CervicalCancerScreeningService,
        public breastCancerScreeningService: BreastCancerScreeningService,
        public breastCancerExaminationService: BreastCancerExaminationService,
        public cervicalCancerExaminationService: CervicalCancerExaminationsService,
        public prostateCancerScreeningService: ProstateCancerScreeningService,
        public prostateCancerExaminationService: ProstateCancerExaminationsService,
        public addPrescriptionService: AddPrescriptionService,
        public addLabOrder: AddLabOrderService,
        public addRecipientService: AddRecipientService,
        public searchFacilityService: SearchFacilityService,
        public basicDetailsService: BasicDetailsService,
        public facilityRegistrationService: FacilityRegistrationService,
        public facilityOnboardingFieldsService: FacilityOnboardingService,
        public facilityOwnerFieldsService: FacilityOwnerService,
        public facilityContactFieldsService: FacilityContactFieldsService,
        public facilityIdentifierFieldsService: FacilityIdentifierFieldsService,
        public facilityServiceFieldsService: FacilityServiceFormService,
        public payerRegistrationService: PayerRegistrationService,
        public employerRegistrationService: EmployerRegistrationService,
        public businessDetailsRegistrationService: BusinessDetailsRegistrationService,
        public licensingService: LicensingService,
        public bulkCancelAppointmentService: BulkCancelAppointmentService,
        public organisationSettingsService: OrgSettingsService,
        public branchingSettingsService: BranchSettingsService,
        public addPatientVitalService: PatientVitalFieldsService,
        public addPatientProblemService: PatientProblemFieldsService,
        public addPatientDiagnosisService: PatientDiagnosisFieldsService,
        public addPatientAttachmentService: PatientAttachmentFieldsService,
        public addUploadInvoiceAttachmentService: UploadInvoiceAttachmentService,
        public addPatientAllergyService: PatientAllergyFieldsService,
        public addPatientCompositionService: PatientCompositionFieldsService,
        public addBusinessDocumentService: BusinessDocumentsUploadService,
        public practitionerRegistrationService: PractitionerRegistrationService,
        public priceListService: PriceListFieldsService,
        public productService: ProductFieldsService,
        public etimsProductService: EtimsProductFieldsService,
        public oclProductService: OclProductFieldsService,
        public oclEtimsProductService: OclEtimsProductFieldsService,
        public paymentService: AddPaymentMethodService,
        public memberOnboardingInvitationService: MemberInvitationService,
        public addMOHCertificateService: AddMOHCertService,
        public businessLicenseService: AddBusinessLicense,
        public addPaymentMethod: AddPaymentOption,
        public addOwner: AddNewOwnerService,
        public screeningFollowUp: ScreeningFollowUpService,
        public completePostScreening: CompletePostScreeningFieldsService,
        public taskUnfulfilledPostScreening: UnfullfilledTaskPostScreeningService,
        public addLabOrderTest: AddLabOrderTestService,
        public addPostScreeningTask: AddPostScreeningService,
        public addMessageTemplate: AddMessageTemplateService,
        public addSalesPricelistService: NewSalesPricelistFieldsService,
        public addPaymentMethodService: NewPaymentMethodFieldsService,
        public addSupplierMethodService: NewSupplierFieldsService,
        public addReturnOutwardsService: NewReturnOutwardsFieldsService,
        public addReturnOutwardsRecordService: NewReturnOutwardsRecordFieldsService,
        public addDirectPurchaseOrderService: NewDirectPurchaseOrderFieldsService,
        public addPurchaseOrderService: NewPurchaseOrderFieldsService,
        public updateOrganisation: UpdateOrganisationService,
        public recordTransferFormService: RecordTransferFormService,
        public recordAdjustmentForm: RecordAdjustmentFormService,
        public addTransferItemFormService: AddTransferItemFormService,
        public updateOrgBranchBasicDetails: UpdateOrgBranchBasicDetailsService,
        public updateOrgBranchCustomer: UpdateOrgBranchCustomerService,
        public addAdjustmentItemFormService: AddAdjustmentItemService,
        public inventoryOperationFormService: InventoryOperationService,
        public addBomComponentService: BomComponentService,
        public etimsInitializeDevice: EtimsInitializeDeviceService,
        public processBomOperation: ProcessBomOperationService,
        public processInvoice: ProcessInvoiceService,
        public addBomOperationService: BomOperationService,
        public addDepartmentFormService: AddDepartmentService,
        public msgDeliveryReasonFormService: MsgDeliveryReasonService,
        public addProductCategoryForm: AddProductCategoryFormService,
        public bankDetailsSetupForm: BankDetailsSetupService,
        public mobileMoneyService: MobileMoneySetupService,
        public addPhotoForm: AddPhotoFormService,
        public addBusinessDetailsForm: AddBusinessDetailsFormService,
        public addBankDetailsForm: AddBankDetailsFormService,
        public addPractitionerForm: AddPractitionerFormService,
        public processInvoiceForm: ProcessInvoiceFormService,
        public finalizeInvoiceForm: FinalizeInvoiceFormService,
        public setupProviderPayerForm: SetupProviderPayerFormService,
        public assignResponsibilityForm: AssignResponsibilityFormService,
        public newSignoffForm: NewSignoffFormService,
        public newReconRequestForm: NewReconRequestFormService,
        public declineInvoiceForm: DeclineInvoiceFormService,
        public addLicensingForm: AddLicensingFormService,
        public salesInvoiceService: DirectSalesInvoiceService,
        public salesInvoiceLinesService: DirectSalesInvoiceLinesService,
        public editMessageService: EditSegmentMessageService,
        public clusterUnitService: ClusterOrganisationUnitService,
        public salesOrderService: DirectSalesOrderService,
        public salesOrderLinesService: DirectSalesOrderLinesService,
        public createRequisitionBasicDetailsFields: CreateRequisitionBasicDetailsFieldsService,
        public createRequisitionItemsRequestedFields: CreateRequisitionItemsRequestedFieldsService,
        public directPaymentFieldsService: AddDirectPaymentFieldsService,
        public etimsUserService: EnableEtimsUserService,
        public enableAutoreconUser: EnableAutoreconUserService,
        public messageLogDetailsFormService: MsgLogDetailsService,
        public addQueue: AddQueueService,
        public postInvoicePaymentService: InvoicePaymentService,
        public postpaymentRunLineService: AddPaymentRunLineService,
        public addRecordDirectInvoiceService: RecordDirectInvoiceFormFieldsService,
        public addDirectInvoiceItemsService: AddDirectInvoiceItemsFieldsService,
        public addCommentsService: AddCommentsFormFieldsService,
        public setupOrganisationFeatureForm: SetupOrganisationFeatureFormService,

        public addPatientGeneralForm: AddPatientGeneralExamService,
        public addExamDiagnosisForm: AddExamDiagnosisFormService,
        public addExamReferralForm: AddExamReferralFormService,
        public createSupplierPaymentRunForm: CreateSupplierPaymentRunFormService,
        public addSupplierPaymentRunLineForm: AddSupplierPaymentRunLineFormService,
        public addRecordBillFormFields: RecordBillFormFieldsService,
        public addBillItemsFormFields: RecordBillItemsFormFieldsService,
        public recordGuideTopicFormFields: RecordGuideTopicFormFieldsService,
        _changesServ: SkikaSaveOnChangesService,
        public filterExpiriesService: ExpiriesFilterFormFieldService,
        public payBillFormFieldsService: SettleBillFormFieldsService,
        public billPatientService: BillPatientFormFieldsService,
        public minimalPatientRegistrationFieldService: MinimalPatientRegistrationFormFieldsService,
        public editProfileBasicDetailsFieldService: EditProfileBasicDetailsFormFieldsService,
        public postNewJournalEntryFieldsService: PostNewJournalEntryFormFieldsService,
        public addOpposingEntryFieldsService: AddOpposingEntryFormFieldsService,
        public editOpposingEntryFieldsService: EditOpposingEntryFieldsService,
        public addSubtopicFormFields: AddSubtopicFormFieldsService,
        public recordGuideSubtopicFormFields: RecordGuideSubtopicFormFieldsService,
        public diagnosticSpecimenInformationService: DiagnosticSpecimenInformationService,
        public diagnosticDiagnosisInformationService: DiagnosticDiagnosisService,
        public addPricelistLocationFieldsService: AddPricelistLocationFormService,
        public editPricelistDetailsFormService: EditPricelistDetailsFormService,
        public addPatientObservationFieldService: PatientObservationFieldsService,
        public addUserWorkstationFieldsService: AddUserWorkstationsFormFieldsService
    ) {
        this.http = _http;
        this.patientRegisterService = patientRegistrationService;
        this.diseaseRegisterService = diseaseRegistrationService;
        this.guidelineRegisterService = guidelineRegistrationService;
        this.patientGuidelineRegisterService =
            patientGuidelineRegistrationService;
        this.nextofKinRegisterService = nextofKinRegistrationService;
        this.provService = providerService;
        this.appointmentService = appointmentAddService;
        this.checkinService = checkinAddService;
        this.operatingRegionsService = addOperatingRegionsService;
        this.addBillItemService = addBillService;
        this.createRefundService = refundService;
        this.filterService = filterAppointmentService;
        this.filterInvoicesService = filterReconinvoicesService;
        this.filterReconRequestService = filterReconRequest;
        this.filterReconRequestinvoicesService = filterReconRequestinvoices;
        this.filterReconPaymentsService = filterReconPayments;
        this.filterReconInvoiceLinesService = filterReconInvoiceLines;
        this.approveReconInvoiceLinesService = approveReconInvoiceLines;
        this.cancelService = cancelAppointmentService;
        this.signUpService = signingUpService;
        this.cervicalCancerService = cervicalCancerScreeningService;
        this.cervicalCancerExamination = cervicalCancerExaminationService;
        this.breastCancerService = breastCancerScreeningService;
        this.breastCancerExamination = breastCancerExaminationService;
        this.prostateCancerService = prostateCancerScreeningService;
        this.prostateCancerExamination = prostateCancerExaminationService;
        this.addPrescription = addPrescriptionService;
        this.addLabOrderService = addLabOrder;
        this.addRecipient = addRecipientService;

        this.facilitySearchService = searchFacilityService;
        this.basicInfoService = basicDetailsService;
        this.facilityRegisterService = facilityRegistrationService;
        this.facilityOnboardingService = facilityOnboardingFieldsService;
        this.facilityOwnerService = facilityOwnerFieldsService;
        this.facilityContactService = facilityContactFieldsService;
        this.facilityIdentifierService = facilityIdentifierFieldsService;
        this.facilityServiceService = facilityServiceFieldsService;
        this.payerRegisterService = payerRegistrationService;
        this.employerRegisterService = employerRegistrationService;
        this.businessDetailsRegisterService =
            businessDetailsRegistrationService;
        this.licenseService = licensingService;
        this.bulkCancelService = bulkCancelAppointmentService;
        this.orgSettingsService = organisationSettingsService;
        this.branchSettingsService = branchingSettingsService;
        this.addPatientVitalItemService = addPatientVitalService;
        this.addPatientProblemItemService = addPatientProblemService;
        this.addPatientDiagnosisItemService = addPatientDiagnosisService;
        this.addPatientAttachmentItemService = addPatientAttachmentService;
        this.addUploadInvoiceAttachmentItemService =
            addUploadInvoiceAttachmentService;
        this.addPatientAllergyItemService = addPatientAllergyService;
        this.addPatientCompositionItemService = addPatientCompositionService;
        this.practitionerRegisterService = practitionerRegistrationService;
        this.priceListItemService = priceListService;
        this.productItemService = productService;
        this.etimsProductItemService = etimsProductService;
        this.oclProductItemService = oclProductService;
        this.oclEtimsProductItemService = oclEtimsProductService;
        this.paymentMethodService = paymentService;
        this.memberInvitationService = memberOnboardingInvitationService;
        this.addMOHCertService = addMOHCertificateService;
        this.addBusinessLicense = businessLicenseService;
        this.addPaymentOption = addPaymentMethod;
        this.addNewOwnerService = addOwner;
        this.screeningFollowUpService = screeningFollowUp;
        this.completePostScreeningService = completePostScreening;
        this.taskUnfulfilledPostScreeningService = taskUnfulfilledPostScreening;
        this.addLabOrderTestService = addLabOrderTest;
        this.addPostScreeningTaskService = addPostScreeningTask;
        this.addMessageTemplateService = addMessageTemplate;
        this.addSalesPricelistFieldsService = addSalesPricelistService;
        this.addPaymentMethodFieldsService = addPaymentMethodService;
        this.addReturnOutwardsFieldsService = addReturnOutwardsService;
        this.addReturnOutwardsRecordFieldsService =
            addReturnOutwardsRecordService;
        this.addDirectPurchaseOrderFieldsService =
            addDirectPurchaseOrderService;
        this.addPurchaseOrderFieldsService = addPurchaseOrderService;
        this.recordTransferService = recordTransferFormService;
        this.recordAdjustmentFormService = recordAdjustmentForm;
        this.addTransferItemService = addTransferItemFormService;
        this.updateOrgBranchBasicDetailsService = updateOrgBranchBasicDetails;
        this.addProductCategoryFormService = addProductCategoryForm;
        this.updateOrgBranchCustomerService = updateOrgBranchCustomer;
        this.addAdjustmentItemService = addAdjustmentItemFormService;
        this.inventoryOperationService = inventoryOperationFormService;
        this.refundLineService = refundlineService;
        this.etimsInitializeDeviceService = etimsInitializeDevice;
        this.addPhotoFormService = addPhotoForm;
        this.addBusinessDetailsFormService = addBusinessDetailsForm;
        this.addBankDetailsFormService = addBankDetailsForm;
        this.addPractitionerFormService = addPractitionerForm;
        this.processInvoiceFormService = processInvoiceForm;
        this.finalizeInvoiceFormService = finalizeInvoiceForm;
        this.setupProviderPayerFormService = setupProviderPayerForm;
        this.assignResponsibilityFormService = assignResponsibilityForm;
        this.newSignoffFormService = newSignoffForm;
        this.newReconRequestFormService = newReconRequestForm;
        this.declineInvoiceFormService = declineInvoiceForm;
        this.addLicensingFormService = addLicensingForm;
        this.createRequisitionBasicDetailsFieldsService =
            createRequisitionBasicDetailsFields;
        this.createRequisitionItemsRequestedFieldsService =
            createRequisitionItemsRequestedFields;
        this.addQueueService = addQueue;
        this.addRecordDirectInvoiceFieldsService =
            this.addRecordDirectInvoiceService;
        this.addDirectInvoiceItemsFieldsService =
            this.addDirectInvoiceItemsService;
        this.addCommentsFormFieldsService = this.addCommentsService;
        this.addDirectInvoiceItemsFieldsService =
            this.addDirectInvoiceItemsService;
        this.addCommentsFormFieldsService = this.addCommentsService;
        this.setupOrganisationFeatureFormService =
            this.setupOrganisationFeatureForm;

        this.onChangeServ = _changesServ;
        this.uploadBusinessDocumentService = addBusinessDocumentService;
        this.updateOrganisationService = updateOrganisation;
        this.bomComponentService = this.addBomComponentService;
        this.processBomOperationService = this.processBomOperation;
        this.processInvoiceService = this.processInvoice;
        this.bomOperationService = this.addBomOperationService;
        this.addSupplierFieldsService = this.addSupplierMethodService;
        this.addDepartmentService = this.addDepartmentFormService;
        this.msgDeliveryReasonService = this.msgDeliveryReasonFormService;
        this.bankDetailsSetupService = this.bankDetailsSetupForm;
        this.mobileMoneySetupService = this.mobileMoneyService;
        this.directSalesInvoiceService = this.salesInvoiceService;
        this.directSalesInvoiceLinesService = this.salesInvoiceLinesService;
        this.editSegmentMessageService = this.editMessageService;
        this.clusterOrganisationUnitService = this.clusterUnitService;
        this.directSalesOrderService = this.salesOrderService;
        this.directSalesOrderLinesService = this.salesOrderLinesService;
        this.addDirectPaymentFieldsService = this.directPaymentFieldsService;
        this.enableEtimsUserService = this.etimsUserService;
        this.enableAutoreconUserService = this.enableAutoreconUser;
        this.msgLogDetailsService = this.messageLogDetailsFormService;
        this.invoicePaymentService = this.postInvoicePaymentService;
        this.addPaymentRunLineService = this.postpaymentRunLineService;
        this.addPatientGeneralExamService = this.addPatientGeneralForm;
        this.addExamDiagnosisService = this.addExamDiagnosisForm;
        this.addExamReferralService = this.addExamReferralForm;
        this.createSupplierPaymentRunFormService =
            this.createSupplierPaymentRunForm;
        this.addSupplierPaymentRunLineFormService =
            this.addSupplierPaymentRunLineForm;
        this.recordBillFormFieldsService = this.addRecordBillFormFields;
        this.recordBillItemsFormFieldsService = this.addBillItemsFormFields;
        this.addExpiriesFilterFieldService = this.filterExpiriesService;
        this.settleBillFormFieldsService = this.payBillFormFieldsService;
        this.recordGuideTopicFormFieldsService =
            this.recordGuideTopicFormFields;
        this.addBillPatientFieldsService = this.billPatientService;
        this.minimalPatientRegistrationService =
            this.minimalPatientRegistrationFieldService;
        this.editProfileBasicDetailsService =
            this.editProfileBasicDetailsFieldService;
        this.postNewJournalEntryService = this.postNewJournalEntryFieldsService;
        this.addOpposingEntryService = this.addOpposingEntryFieldsService;
        this.editOpposingEntryService = this.editOpposingEntryFieldsService;
        this.addSubtopicFormFieldsService = this.addSubtopicFormFields;
        this.recordGuideSubtopicFormFieldsService =
            this.recordGuideSubtopicFormFields;
        this.diagnosticSpecimenInformation =
            diagnosticSpecimenInformationService;
        this.diagnosticDiagnosisInformation =
            diagnosticDiagnosisInformationService;
        this.addPricelistLocationForm = addPricelistLocationFieldsService;
        this.editPricelistDetailsForm = editPricelistDetailsFormService;
        this.addPatientObservationItemService =
            addPatientObservationFieldService;
        this.addUserWorkstationFormService = addUserWorkstationFieldsService;
    }

    getFields(store) {
        let url = _.findWhere(this.stores, { name: store });
        if (url === undefined) {
            url = `assets/formly/${store}.json`;
        } else if (url.url !== undefined) {
            url = url.url;
        }
        return this.http.get<any>(url);
    }

    setComponent(setComponent) {
        if (setComponent.store && !setComponent.store.includes('-')) {
            this[setComponent.store].setComponent(setComponent);
        }
    }

    getServiceFields(store, omit?) {
        return this[store].fields(omit);
    }

    getPassword(cmpt) {
        const validators = {
            fieldMatch: {
                expression: control => control.value === cmpt.model.password,
                message: 'Password does not match',
            },
        };
        const expressionProperties = {
            'props.disabled': () => !cmpt.form.get('password').valid,
        };
        return {
            validators,
            expressionProperties,
            // lifecycle
        };
    }

    setPassword(cmpt) {
        const passConfs = this.getPassword(cmpt);
        const passKeys = _.keys(passConfs);
        _.each(passKeys, aKey => {
            cmpt.fields[3].fieldGroup[1][aKey] = passConfs[aKey];
        });
    }

    changePassword(cmpt) {
        const passConfs = this.getPassword(cmpt);
        const passKeys = _.keys(passConfs);
        _.each(passKeys, k => {
            cmpt.fields[1][k] = passConfs[k];
        });
    }

    setLocation(field, cmpt) {
        if (field.key === 'location') {
            _.each(field.value, point => {
                cmpt.model.location_lattitude = point.location_lattitude;
                cmpt.model.location_longitude = point.location_longitude;
            });
        }
    }

    setOnChangeVal(field, cmpt, event) {
        if (field.key === 'dob') {
            cmpt.model.dob = event;
            return event;
        } else {
            return cmpt.model[field.key];
        }
    }

    onChanges(cmpt) {
        const onChanges = {
            change: (field, $event) => {
                this.setLocation(field, cmpt);
                const newVal = {
                    key: field.key,
                    value: this.setOnChangeVal(field, cmpt, $event),
                    form_validity: cmpt.form.valid,
                    model: cmpt.model,
                };
                this.onChangeServ.setNewValue(newVal);
                if (cmpt.resetModel) {
                    field.formControl.setValue(null);
                    field.formControl.status = 'VALID';
                }
            },
        };
        return {
            onChanges,
        };
    }

    whiteList(field) {
        return field.key !== 'location' && field.key !== 'dob';
    }

    setOnchangesWatch(cmpt) {
        _.each(cmpt.fields, field => {
            if (_.has(field, 'props') && this.whiteList(field)) {
                field.props.change = this.onChanges(cmpt).onChanges.change;
            } else if (_.has(field, 'fieldGroup')) {
                _.each(field.fieldGroup, field_ => {
                    field_.props.change = this.onChanges(cmpt).onChanges.change;
                });
            } else if (field.key === 'dob') {
                field.props.dateChange = this.onChanges(cmpt).onChanges.change;
            }
        });
    }
}
