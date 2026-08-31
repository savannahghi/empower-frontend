import { environment } from '../../../environments/environment';

/** defines the apis used in the application */

/**
 * /api/erp/api/
 * Uses ERP proxy view to make calls to ERP
 */

export const stores = [
    {
        name: 'graphql',
        url: '/graphql/',
    },
    {
        name: 'currencys',
        url: '/api/erp/api/common/currencys/',
    },
    {
        name: 'paymentsterms',
        url: '/api/setup/',
    },
    {
        name: 'providers',
        url: '/api/erp/api/claims_discounting/providers/',
    },
    {
        name: 'searchProviders',
        url: '/api/erp/api/claims_discounting/search_providers/',
    },
    {
        name: 'createProvider',
        url: '/api/erp/api/claims_discounting/create_provider/',
    },
    {
        name: 'adv-invoices',
        url: '/api/billing/invoices/',
    },
    {
        name: 'invoices',
        url: '/api/erp/api/claims_discounting/invoices/',
    },
    {
        name: 'ediInvoices',
        url: '/api/erp/api/claims_discounting/edi_invoices/',
    },
    {
        name: 'getLoanInstallments',
        url: '/api/claims_discounting/providers/get_loan_installments/',
    },
    {
        name: 'organisations',
        url: '/api/common/organisations/',
    },
    {
        name: 'erp-organisations',
        url: '/api/erp/api/common/organisations/',
    },
    {
        name: 'organisation-logos',
        url: '/api/common/organisation_logos/',
        server: environment.erpServerURL,
    },
    {
        name: 'erp-provider',
        url: '/api/erp/api/claims_discounting/create_provider/',
    },
    {
        name: 'onboard-provider',
        url: '/api/erp/api/claims_discounting/create_provider/onboard_provider/',
    },
    {
        name: 'erp-organisation-setup',
        url: '/api/erp/api/common/organisations/setup_organisation/',
    },
    {
        name: 'erp-organisation-update',
        url: '/api/erp/api/common/organisations/updateorganisation/',
    },
    {
        name: 'next-step-onboarding',
        url: '/api/erp/api/claims_discounting/create_provider/update_next_step/',
    },
    {
        name: 'edi-surveys',
        url: '/engagement/survey/',
        server: environment.surveyURL,
    },
    {
        name: 'edibps',
        url: '/business_partners/business_partners/',
        server: environment.ediServerURL,
    },
    {
        name: 'network-identifiers',
        url: '/api/erp/api/business_partners/network_identifiers/',
    },
    {
        name: 'isbps',
        url: '/business_partners/',
    },
    {
        name: 'onboarding',
        url: '/api/claims_discounting/providers/',
    },
    {
        name: 'kycdocuments',
        url: '/api/claims_discounting/upload_kyc_documents/',
    },
    {
        name: 'person-relationship',
        url: '/api/common/related_persons/',
    },
    {
        name: 'patients',
        url: '/api/patients/patients/',
    },
    {
        name: 'patients_search',
        url: '/api/patients/patients/person_search/',
    },
    {
        name: 'patient-documents',
        url: '/api/patients/patient_documents/',
    },
    {
        name: 'schedules',
        url: '/api/scheduling/schedules/',
    },
    {
        name: 'slots',
        url: '/api/scheduling/slots/',
    },
    {
        name: 'visits',
        url: '/api/visits/visits/',
    },
    {
        name: 'visits-invoice',
        url: '/api/visits/visits/visit_id/?invoice_number=',
    },
    {
        name: 'queues',
        url: '/api/visits/queues/',
    },
    {
        name: 'service-requests',
        url: '/api/visits/service_requests/',
    },
    {
        name: 'survey-responses',
        url: '/api/visits/survey_responses/',
    },
    {
        name: 'survey-form',
        url: '/api/visits/survey_responses/form',
    },
    {
        name: 'appointments',
        url: '/api/scheduling/appointments/',
    },
    {
        name: 'sync-notices',
        url: '/api/erp/api/etims/etims_notices/fetch_etims_notices/',
    },
    {
        name: 'notices',
        url: '/api/erp/api/etims/etims_notices/',
    },
    {
        name: 'groups',
        url: '/api/notifications/groups/',
    },
    {
        name: 'group-members',
        url: '/api/notifications/group_members/',
    },
    {
        name: 'sms',
        url: '/api/notifications/send_sms/',
    },
    {
        name: 'generate_sms_log_report',
        url: '/api/notifications/sms/generate_sms_log_report/',
    },
    {
        name: 'sms_log_report',
        url: '/api/notifications/sms_log_report/',
    },
    {
        name: 'send-sms',
        url: '/api/segments/segment-message/send_sms/',
    },
    {
        name: 'variables',
        url: '/api/segments/template/variables/',
    },
    {
        name: 'segment-filters',
        url: '/api/segments/filters/',
    },
    {
        name: 'sender-ids',
        url: '/api/notifications/sender_ids/',
    },
    {
        name: 'branch-settings',
        url: '/api/settings/branch_settings/',
    },
    {
        name: 'credit-notes',
        url: '/api/erp/api/sales/salescreditnotes/',
    },
    {
        name: 'settings',
        url: '/api/settings/org_settings/',
    },
    {
        name: 'products',
        url: '/api/erp/api/products/products/',
    },
    {
        name: 'ocl-concepts',
        url: '/api/common/ocl_concepts/',
    },
    {
        name: 'pricelists',
        url: '/api/erp/api/products/pricelists/',
    },
    {
        name: 'pricelist-uploads',
        url: '/api/erp/api/products/pricelist_upload/',
    },
    {
        name: 'org-units',
        url: '/api/erp/api/branches/org_units/',
    },
    {
        name: 'suppliers',
        url: '/api/erp/api/business_partners/suppliers/',
    },
    {
        name: 'pricingtablelines',
        url: '/api/erp/api/billing/pricing_table_lines/',
    },
    {
        name: 'price-list-products',
        url: '/api/erp/api/products/pricelist_products/',
    },
    {
        name: 'chargemaster-products',
        url: '/api/erp/api/charge_master/entries/',
    },
    {
        name: 'chargemaster-bps',
        url: '/api/erp/api/charge_master/business_partners/',
    },
    {
        name: 'product-categories',
        url: '/api/erp/api/products/categories/',
    },
    {
        name: 'multiple-invoice-payments',
        url: '/api/billing/invoices/record_multiple_payments/',
    },
    {
        name: 'taxes',
        url: '/api/erp/api/products/taxes/',
    },
    {
        name: 'item-classifications',
        url: '/api/erp/api/etims/item_classifications/',
    },
    {
        name: 'fetch-item-classifications',
        url: '/api/erp/api/etims/item_classifications/fetch_item_classifications/',
    },
    {
        name: 'post-products',
        url: '/api/erp/api/products/products/send_products_to_etims/',
    },
    {
        name: 'unit-measure',
        url: '/api/erp/api/products/quantity_units/',
    },
    {
        name: 'fetch-unit-measure',
        url: '/api/erp/api/products/quantity_units/sync_quantity_units/',
    },
    {
        name: 'sales-taxes',
        url: '/api/erp/api/products/sales_taxes/',
    },
    {
        name: 'check-sms-balance',
        url: '/api/segments/segment-message/check_sms_balance/',
    },
    {
        name: 'purchases-taxes',
        url: '/api/erp/api/products/purchases_taxes/',
    },
    {
        name: 'tax-categories',
        url: '/api/erp/api/products/tax_categories/',
    },
    {
        name: 'sync-etims-taxes',
        url: '/api/erp/api/products/taxes/sync_etims_taxes/',
    },
    {
        name: 'products-uom',
        url: '/api/erp/api/products/uom/',
    },
    {
        name: 'sales-invoices',
        url: '/api/erp/api/sales/salesinvoices/',
    },
    {
        name: 'customer-payment-runs',
        url: '/api/erp/api/payments/customerpaymentruns/',
    },
    {
        name: 'customer-payment-runlines',
        url: '/api/erp/api/payments/customerpaymentrunlines/',
    },
    {
        name: 'accounts',
        url: '/api/erp/api/financial_accounts/accounts/',
    },
    {
        name: 'account-entries',
        url: '/api/erp/api/financial_accounts/accountentrys/',
    },
    {
        name: 'customers',
        url: '/api/erp/api/business_partners/customers/',
    },
    {
        name: 'business-partner-types',
        url: '/api/erp/api/business_partners/customers/partners/',
    },
    {
        name: 'schemes',
        url: '/api/erp/api/business_partners/schemes/',
    },
    {
        name: 'networks',
        url: '/api/erp/api/business_partners/networks/',
    },
    {
        name: 'sales-invoice-lines',
        url: '/api/erp/api/sales/salesinvoicelines/',
    },
    {
        name: 'sales-orders',
        url: '/api/erp/api/sales/salesorders/',
    },
    {
        name: 'sales-order-lines',
        url: '/api/erp/api/sales/salesorderlines/',
    },
    {
        name: 'sales-order-attachments',
        url: '/api/erp/api/sales/salesorderattachments/',
    },
    {
        name: 'price-list-search',
        url: '/api/erp/api/products/products/search/',
    },
    {
        name: 'cm-bps',
        url: '/api/erp/api/charge_master/business_partners/',
    },
    {
        name: 'inventory-transfers',
        url: '/api/erp/api/inventory/inventoryoperation/',
    },
    {
        name: 'inventory-operation-types',
        url: '/api/erp/api/inventory/inventoryoperationtype/',
    },
    {
        name: 'inventory-adjustments',
        url: '/api/erp/api/inventory/inventoryadjustment/',
    },
    {
        name: 'create-adjustment',
        url: '/api/erp/api/inventory/inventoryadjustment/create_adjustment/',
    },
    {
        name: 'billable-items',
        url: '/api/billing/billable_items/',
    },
    {
        name: 'invoice-transactions',
        url: '/api/billing/invoices/',
    },
    {
        name: 'refunds',
        url: '/api/billing/refunds/',
    },
    {
        name: 'sales-invoice-refund',
        url: '/api/billing/refunds/?sales_invoice_id=',
    },
    {
        name: 'refund-lines',
        url: '/api/billing/refund_lines/',
    },
    {
        name: 'wallets',
        url: '/api/billing/wallets',
    },
    {
        name: 'consent',
        url: '/api/common/consent/',
    },
    {
        name: 'invoice-lines',
        url: '/api/erp/api/sales/salesinvoicelines/',
    },
    {
        name: 'credit-notes',
        url: '/api/erp/api/sales/salescreditnotes/',
    },
    {
        name: 'payment-methods',
        url: '/api/erp/api/financial_accounts/paymentmethods/',
    },
    {
        name: 'account-payment-methods',
        url: '/api/erp/api/financial_accounts/accounts/',
    },
    {
        name: 'payment-receipts',
        url: '/api/erp/api/payments/paymentreceipts/',
    },
    {
        name: 'return-outwards',
        url: '/api/erp/api/purchases/returnoutwards/',
    },
    {
        name: 'return-outwardlines',
        url: '/api/erp/api/purchases/returnoutwardlines/',
    },
    {
        name: 'customer-invoice-payments',
        url: '/api/erp/api/payments/customerinvoicepayments/',
    },
    {
        name: 'clusters',
        url: '/api/erp/api/branches/clusters/',
    },
    {
        name: 'cluster-logos',
        url: '/api/common/cluster_logos/',
        server: environment.erpServerURL,
    },
    {
        name: 'tax-offices',
        url: '/api/erp/api/etims/tax_offices/',
    },
    {
        name: 'branches',
        url: '/api/erp/api/branches/branches/',
    },
    {
        name: 'branches-etims-sync',
        url: '/api/erp/api/branches/branches/fetch_etims_organisation_branches/',
    },
    {
        name: 'organisation-features',
        url: '/api/common/organisation_features/',
    },
    {
        name: 'etims-initialize-device',
        url: '/api/erp/api/branches/branches/initialize_etims_device/',
    },
    {
        name: 'departments',
        url: '/api/erp/api/branches/departments/',
    },
    {
        name: 'workstations',
        url: '/api/erp/api/branches/workstations/',
    },
    {
        name: 'workstations-types',
        url: '/api/erp/api/branches/workstations/workstation_types_map/',
    },
    {
        name: 'workstation-users',
        url: '/api/erp/api/branches/workstationusers/',
    },
    {
        name: 'specialties',
        url: '/api/scheduling/schedules/specialties/',
    },
    {
        name: 'operating-regions',
        url: '/api/common/operating_regions/',
    },
    {
        name: 'userProfile',
        url: '/me',
    },
    {
        name: 'users',
        url: '/api/common/user_profiles/',
    },
    {
        name: 'erp-users',
        url: '/api/erp/api/common/user_profiles/',
    },
    {
        name: 'persons',
        url: '/api/common/persons/',
    },
    {
        name: 'auth-adv-users',
        url: '/api/auth/users/',
    },
    {
        name: 'erp-departments',
        url: '/api/erp/api/branches/departments/',
    },
    // perms, roles
    {
        name: 'auth-erp-users',
        url: '/api/common/users/',
    },
    {
        name: 'organization-members',
        url: '/api/v1/organization/',
        server: environment.billingBackend, // Hermes backend
    },
    {
        name: 'hermes-roles',
        url: '/api/common/realm_roles/',
    },
    {
        name: 'user-details',
        url: '/api/v1/user/',
        server: environment.billingBackend,
    },
    {
        name: 'erp-permissions',
        url: '/api/erp/api/auth/permissions/',
    },
    {
        name: 'erp-role-permissions',
        url: '/api/erp/api/auth/role_permissions/',
    },
    {
        name: 'erp-roles',
        url: '/api/common/realm_roles/',
    },
    {
        name: 'clinical',
        server: environment.clinicalServerURL,
    },
    {
        name: 'treatment-enrollment',
        url: '/api/v1/condition/treatment-enrollment',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'block-calendar',
        url: '/api/scheduling/schedules/',
    },
    {
        name: 'questionnaires',
        url: '/api/v1/questionnaires',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'questionnaire-response',
        url: '/api/v1/questionnaire-response',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'referral-report',
        url: '/api/v1/referral-report',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'screening-report',
        url: '/api/v1/screening-report',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'screening-tasks',
        url: '/api/v1/tasks',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'crm-persons',
        url: '/v1/identities/persons/',
        server: environment.crmServerUrl,
    },
    {
        name: 'profiles',
        url: '/v1/identities/profiles/',
        server: environment.crmServerUrl,
    },
    {
        name: 'identifiers',
        url: '/v1/identities/identifiers/',
        server: environment.crmServerUrl,
    },
    {
        name: 'schemes-identifiers',
        url: '/api/erp/api/business_partners/scheme_identifiers/',
    },
    {
        name: 'contacts',
        url: '/v1/identities/contacts/',
        server: environment.crmServerUrl,
    },
    {
        name: 'reviews',
        url: '/v1/identities/reviews/',
        server: environment.crmServerUrl,
    },
    {
        name: 'profile-matches',
        url: '/v1/identities/profile-matches/',
        server: environment.crmServerUrl,
    },
    {
        name: 'filters',
        url: '/v1/identities/reviews/filters/',
        server: environment.crmServerUrl,
    },
    {
        name: 'filter-groups',
        url: '/api/segments/filter-groups/',
    },
    {
        name: 'filter-group-filters',
        url: '/api/segments/filter-group-filters/',
    },
    {
        name: 'facility-onboarding',
        url: '/api/common/onboarding/facility_registration/',
    },
    {
        name: 'facilities',
        url: '/v1/facilities/facilities/',
        server: environment.crmServerUrl,
    },
    {
        name: 'facilities-contacts',
        url: '/v1/facilities/contacts/',
        server: environment.crmServerUrl,
    },
    {
        name: 'facilities-identifiers',
        url: '/v1/facilities/identifiers/',
        server: environment.crmServerUrl,
    },
    {
        name: 'facilities-services',
        url: '/v1/facilities/services/',
        server: environment.crmServerUrl,
    },
    {
        name: 'facilities-owners',
        url: '/v1/facilities/owners/',
        server: environment.crmServerUrl,
    },
    {
        name: 'facility-owners',
        url: '/v1/facilities/facility-owners/',
        server: environment.crmServerUrl,
    },
    {
        name: 'facilities-documents',
        url: '/v1/facilities/kyb-documents/',
        server: environment.crmServerUrl,
    },
    {
        name: 'facilities-business-details',
        url: '/v1/facilities/business_details/',
        server: environment.crmServerUrl,
    },
    {
        name: 'facilities-bank-details',
        url: '/v1/facilities/bank-details/',
        server: environment.crmServerUrl,
    },
    {
        name: 'crm-practitioners',
        url: '/v1/practitioners/practitioners/',
        server: environment.crmServerUrl,
    },
    {
        name: 'diagnosis',
        url: '/',
        server: 'https://api.openconceptlab.org/concepts',
    },
    {
        name: 'biometrics-hardware-status',
        url: '/status',
        server: environment.biometricsMidlewareServiceUrl,
    },
    {
        name: 'enroll-fingerprint',
        url: '/enroll/fingerprint',
        server: environment.biometricsMidlewareServiceUrl,
    },
    {
        name: 'fetch-enrolled-fingerprints',
        url: '/fetch-enrolled',
        server: environment.biometricsMidlewareServiceUrl,
    },
    {
        name: 'verify-enrolled-fingerprint',
        url: '/verify-enrolled',
        server: environment.biometricsMidlewareServiceUrl,
    },
    {
        name: 'verify-fingerprint',
        url: '/verify/fingerprint',
        server: environment.biometricsMidlewareServiceUrl,
    },
    {
        name: 'exam-diagnosis',
        url: '/api/visits/diagnosis/',
    },
    {
        name: 'ocl-diagnoses',
        url: '/orgs/WHO/sources/ICD-11/concepts/',
        server: environment.oclServerUrl,
    },
    {
        name: 'exam-lab-orders',
        url: '/api/lab_orders/lab_orders/',
    },
    {
        name: 'guidelines',
        url: '/v1/corpus/guidelines/',
        server: environment.mdaktariUrl,
    },
    {
        name: 'patient-guidelines',
        url: '/v1/corpus/patient-guidelines/',
        server: environment.mdaktariUrl,
    },
    {
        name: 'diseases',
        url: '/v1/corpus/diseases/',
        server: environment.mdaktariUrl,
    },
    {
        name: 'diseases-areas',
        url: '/v1/corpus/disease-areas/',
        server: environment.mdaktariUrl,
    },
    {
        name: 'prompts',
        url: '/v1/common/prompts/',
        server: environment.mdaktariUrl,
    },
    {
        name: 'chats',
        url: '/v1/conversations/chats/',
        server: environment.mdaktariUrl,
    },
    {
        name: 'messages',
        url: '/v1/conversations/messages/',
        server: environment.mdaktariUrl,
    },
    {
        name: 'message-ratings',
        url: '/v1/conversations/messages-ratings/',
        server: environment.mdaktariUrl,
    },
    {
        name: 'regenerate',
        url: '/v1/conversations/messages/',
        server: environment.mdaktariUrl,
    },
    {
        name: 'summarize-clinical-notes',
        url: '/v1/clinicians/notes/summarize/',
        server: environment.mdaktariUrl,
    },
    {
        name: 'practitioners',
        url: '/api/practitioners/practitioners/',
    },
    {
        name: 'patient-fields',
        url: '/api/patients/patients/file_upload_fields/',
    },
    {
        name: 'patient-list-uploads',
        url: '/api/patients/patient_list_uploads/',
    },
    {
        name: 'process-patient-file-upload',
        url: '/api/patients/patients/process_file_upload/',
    },
    {
        name: 'clinical-sync',
        url: '/api/patients/patients/sync_patient_to_clinical/',
    },
    {
        name: 'patient-covers',
        url: '/api/patients/patientcovers/',
    },
    {
        name: 'bp-search',
        url: '/api/common/onboarding/provider_search/',
    },
    {
        name: 'available-countries',
        url: '/api/common/onboarding/available_countries/',
    },
    {
        name: 'organisation-check',
        url: '/api/common/onboarding/organisation_check/',
    },
    {
        name: 'register-facility',
        url: '/api/common/onboarding/registration/',
    },
    {
        name: 'comms-sms',
        url: '/v1/sms/sms/',
        server: environment.commsServerURL,
    },
    {
        name: 'comms-bulk',
        url: '/v1/sms/bulk/',
        server: environment.commsServerURL,
    },
    {
        name: 'comms-bulk-senders',
        url: '/v1/sms/bulksms_senders/',
        server: environment.commsServerURL,
    },
    {
        name: 'comms-bulk-senders',
        url: '/v1/sms/bulksms_senders/',
        server: environment.commsServerURL,
    },
    {
        name: 'care-journeys',
        url: '/api/segments/journey/',
    },
    {
        name: 'care-journey-members',
        url: '/api/segments/journey-member/',
    },
    {
        name: 'care-journey-segments',
        url: '/api/segments/journey-segment/',
    },
    {
        name: 'add-segment-to-journey',
        url: '/api/segments/journey/add_segment/',
    },
    {
        name: 'care-journey-attributes',
        url: '/api/segments/journey-attributes/',
    },
    {
        name: 'segment-templates',
        url: '/api/segments/template/',
    },
    {
        name: 'segments',
        url: '/api/segments/segment/',
    },
    {
        name: 'segment-messages',
        url: '/api/segments/segment-message/',
    },
    {
        name: 'preview-message',
        url: '/api/segments/segment-message/preview/',
    },
    {
        name: 'segment-upload-members',
        url: '/api/segments/uploads/',
    },
    {
        name: 'segment-message-deliveries',
        url: '/api/segments/segment-message-delivery/',
    },
    {
        name: 'segment-message-metrics',
        url: '/api/segments/segment-message-delivery/consolidated_delivery_metrics/',
    },
    {
        name: 'segment-retry-failed-messages',
        url: '/api/segments/segment-message-delivery/retry_failed_segment_messages/',
    },
    {
        name: 'patient-segments',
        url: '/api/segments/segment-member/',
    },
    {
        name: 'segment-uploads',
        url: '/api/segments/segment-upload/',
    },
    {
        name: 'segment-reports-download',
        url: '/api/segments/segment-message-delivery/generate_delivery_metrics_report/',
    },
    {
        name: 'care-journeys',
        url: '/api/care-journeys/care-journeys/',
    },

    {
        name: 'bp-identifiers',
        url: '/api/business_partners/bp_identifiers/',
    },
    {
        name: 'patient-follow-ups',
        url: '/api/v1/task',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'upload',
        url: '/api/v1/media',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'screenings',
        url: '/api/v1/risk-assessment',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'lab-orders',
        url: '/api/v1/lab-orders',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'referrals',
        url: '/api/v1/referral-details',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'kyb-documents',
        url: '/v1/facilities/kyb-documents/',
        server: environment.crmServerUrl,
    },
    {
        name: 'business-details',
        url: '/v1/facilities/business_details/',
        server: environment.crmServerUrl,
    },
    {
        name: 'bank-details',
        url: '/v1/facilities/bank-details/',
        server: environment.crmServerUrl,
    },
    {
        name: 'category-elements',
        url: '/v1/facilities/category-elements/',
        server: environment.crmServerUrl,
    },
    {
        name: 'erp-me',
        url: '/api/erp/me/',
    },
    {
        name: 'autorecon-me',
        url: '/api/recon/profile/',
    },
    {
        name: 'tax-offices',
        url: '/api/erp/api/etims/tax_offices/',
    },
    {
        name: 'sync-tax-offices',
        url: '/api/erp/api/etims/tax_offices/fetch_tax_offices/',
    },
    {
        name: 'packaging-units',
        url: '/api/erp/api/products/packaging_units/',
    },
    {
        name: 'sync-packaging-units',
        url: '/api/erp/api/products/packaging_units/sync_packaging_units/',
    },
    {
        name: 'inventory',
        url: '/api/erp/api/inventory/stockquantity/',
    },
    {
        name: 'inventory-recipient-alerts',
        url: '/api/erp/api/inventory/inventoryrecipientalerts/',
    },
    {
        name: 'purchase-invoices',
        url: '/api/erp/api/purchases/purchasesinvoices/',
    },
    {
        name: 'purchase-invoices-notes',
        url: 'api/erp/api/purchases/purchasesinvoicenotes/',
    },
    {
        name: 'purchase-invoicelines',
        url: '/api/erp/api/purchases/purchasesinvoicelines/',
    },
    {
        name: 'inventory-operations',
        url: '/api/erp/api/inventory/inventoryoperation/',
    },
    {
        name: 'inventory-operation-type',
        url: '/api/erp/api/inventory/inventoryoperation/create_inventory_transfer/',
    },
    {
        name: 'inventory-locations',
        url: '/api/erp/api/inventory/inventorylocation/',
    },
    {
        name: 'inventory-operation-line',
        url: '/api/erp/api/inventory/inventoryoperationline/',
    },
    {
        name: 'inventory-adjustment-line',
        url: '/api/erp/api/inventory/inventoryadjustmentline/',
    },
    {
        name: 'etims-purchases',
        url: '/api/erp/api/etims/purchases/',
    },
    {
        name: 'etims-purchases-invoicelines',
        url: '/api/erp/api/etims/purchasesitems/',
    },
    {
        name: 'sync-etims-purchases',
        url: '/api/erp/api/etims/purchases/fetch_purchases_from_etims/',
    },
    {
        name: 'requisitions',
        url: '/api/erp/api/purchases/requisitions/',
    },
    {
        name: 'requisitions-lines',
        url: '/api/erp/api/purchases/requisitionlines/',
    },
    {
        name: 'requisition-attachments',
        url: '/api/purchases/requisitionattachments/',
        server: environment.erpServerURL,
    },
    {
        name: 'price-list-erp',
        url: '/api/products/pricelists/',
        server: environment.erpServerURL,
    },
    {
        name: 'adjustments-erp',
        url: '/api/inventory/inventoryadjustment/',
        server: environment.erpServerURL,
    },
    {
        name: 'branches-stores',
        url: '/api/erp/api/branches/stores/',
    },
    {
        name: 'password-reset',
        url: '/api/common/users/reset_password/',
    },
    {
        name: 'password-change',
        url: '/password_change/',
        server: environment.AUTH_SERVER_DOMAIN,
    },
    {
        name: 'confirm-password-reset',
        url: '/accounts/password/reset/confirm/',
        server: environment.AUTH_SERVER_DOMAIN,
    },
    {
        name: 'sync-imports',
        url: '/api/erp/api/etims/etims_imports/fetch_etims_imports/',
    },
    {
        name: 'imports',
        url: '/api/erp/api/etims/etims_imports/',
    },
    {
        name: 'purchase-orders',
        url: '/api/erp/api/purchases/purchasesorders/',
    },
    {
        name: 'purchases-orderlines',
        url: '/api/erp/api/purchases/purchasesorderlines/',
    },
    {
        name: 'bill-of-material',
        url: '/api/erp/api/products/boms/',
    },
    {
        name: 'bill-of-material-items',
        url: '/api/erp/api/products/bom_components/',
    },
    {
        name: 'bom-operations',
        url: '/api/erp/api/inventory/assembly_operations/',
    },
    {
        name: 'fetch-etims-stock-items',
        url: '/api/erp/api/inventory/inventoryoperation/fetch_etims_stock_items/',
    },
    {
        name: 'bulk-stock-uploads',
        url: '/api/erp/api/inventory/bulkstockuploads/',
    },
    {
        name: 'fetch-etims-products',
        url: '/api/erp/api/products/products/fetch_etims_products/',
    },
    {
        name: 'recon-business-partners',
        url: '/api/recon/api/business_partners/business_partners/',
    },
    {
        name: 'recon-organisations',
        url: '/api/recon/api/common/organisations/',
    },
    {
        name: 'recon-request',
        url: '/api/recon/api/recon_request/recon_request/',
    },
    {
        name: 'recon-request-excel-uploads',
        url: '/api/recon/api/uploads/uploads/',
    },
    {
        name: 'recon-request-missing-invoices',
        url: '/api/recon/api/recon_request/recon_request_invoice/',
    },
    {
        name: 'recon-invoice-summary',
        url: '/api/recon/api/invoice_summary/invoice_summary/',
    },
    {
        name: 'recon-batch-approve-invoices',
        url: '/api/recon/api/invoice_summary/invoice_summary/batch_approve/',
    },
    {
        name: 'recon-assign-responsibility',
        url: '/api/recon/api/invoice_summary/invoice_summary/assign_responsibility/',
    },
    {
        name: 'recon-invoice-rejection_reasons',
        url: '/api/recon/api/invoice_summary/rejection_reason/',
    },
    {
        name: 'recon-payment-summary',
        url: '/api/recon/api/payments/payments/',
    },
    {
        name: 'recon-invoice-line-adjudication-history',
        url: '/api/recon/api/invoice_summary/invoice_summary_line_adjudication_log',
    },
    {
        name: 'recon-invoice-payment',
        url: '/api/recon/api/payments/invoice_payment/',
    },
    {
        name: 'recon-uploads',
        url: '/api/recon/api/uploads/uploads/',
    },
    {
        name: 'recon-invoice-summary-attachment',
        url: '/api/recon/api/invoice_summary/invoice_summary_attachment/',
    },
    {
        name: 'recon-invoiceline',
        url: '/api/recon/api/invoice_summary/invoice_summary_line/',
    },
    {
        name: 'recon-export-invoiceline',
        url: '/api/recon/api/invoice_summary/invoice_summary_line/export/',
    },
    {
        name: 'autorecon-profile',
        url: '/api/recon/me',
    },
    {
        name: 'recon-notifications',
        url: '/api/recon/api/notifications/notifications/',
    },
    {
        name: 'autorecon-signoff',
        url: '/api/recon/api/signoff/signoff/',
    },
    {
        name: 'autorecon-export-all',
        url: '/api/recon/api/invoice_summary/invoice_summary/export/',
    },
    {
        name: 'export-recon-request',
        url: '/api/recon/api/recon_request/recon_request/export/',
    },
    {
        name: 'autorecon-export-payments',
        url: '/api/recon/api/payments/payments/export/',
    },
    {
        name: 'recon-new-business-partner',
        url: '/api/recon/api/charge_master/business_partners/',
    },
    {
        name: 'recon-assign-responsibility-invoiceline',
        url: '/api/recon/api/invoice_summary/invoice_summary_line/assign_responsibility/',
    },
    {
        name: 'recon-confirm-responsibility-invoiceline',
        url: '/api/recon/api/invoice_summary/invoice_summary_line/confirm_responsibility/',
    },
    {
        name: 'recon-bulk-approve-invoiceline',
        url: '/api/recon/api/invoice_summary/invoice_summary_line/bulk_approve_lines/',
    },
    {
        name: 'bank-details-erp',
        url: '/api/erp/api/financial_accounts/bankdetails/',
    },
    {
        name: 'mobile-money-details-erp',
        url: '/api/erp/api/financial_accounts/mobilemoneydetails/',
    },
    {
        name: 'message-logs',
        url: '/api/notifications/sms/',
    },
    {
        name: 'ussd-sessions',
        url: '/api/notifications/ussd_sessions/',
    },
    {
        name: 'prescriptions',
        url: '/api/prescriptions/prescriptions/',
    },
    {
        name: 'supplier-payment-runs',
        url: '/api/erp/api/payments/supplierpaymentruns/',
    },
    {
        name: 'supplier-payment-runs-lines',
        url: '/api/erp/api/payments/supplierpaymentrunlines/',
    },
    {
        name: 'bills',
        url: '/api/erp/api/billing/bills/',
    },
    {
        name: 'bill-items',
        url: '/api/erp/api/billing/billitems/',
    },
    {
        name: 'stocktracking',
        url: '/api/erp/api/inventory/stocktracking/get_products_about_to_expire/',
    },
    {
        name: 'sales-creditnote-lines',
        url: '/api/erp/api/sales/salescreditnotes/',
    },
    {
        name: 'billpayments',
        url: '/api/erp/api/payments/billpayments/',
    },
    {
        name: 'journalentries',
        url: '/api/erp/api/journals/journalentry/',
    },
    {
        name: 'journalentrylines',
        url: '/api/erp/api/journals/journalentryline/',
    },
    {
        name: 'accounts',
        url: '/api/erp/api/financial_accounts/accounts/',
    },
    {
        name: 'userguides',
        url: '/api/cms/topics/',
    },
    {
        name: 'diagnostic-report',
        url: '/api/v1/diagnostic-report',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'medication-request',
        url: '/api/v1/medication/prescription',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'diagnosis-information',
        url: '/api/v1/condition/oncology-diagnosis',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'condition-list',
        url: '/api/v1/condition',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'plan-definition',
        url: '/api/v1/plan-definition',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'careplan',
        url: '/api/v1/care-plan',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'clinical-task',
        url: '/api/v1/task/',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'observations',
        url: '/api/v1/observations',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'clinical-patient',
        url: '/api/v1/patient/',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'condition',
        url: '/api/v1/condition',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'compositions',
        url: '/api/v1/compositions',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'superset-auth',
        url: '/api/v1/security/login',
        server: environment.supersetServerUrl,
    },
    {
        name: 'superset-guest-token',
        url: '/api/v1/security/guest_token/',
        server: environment.supersetServerUrl,
    },
    {
        name: 'refer-patient',
        url: '/api/v1/refer',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'public-questionnaire-response',
        url: '/api/questionnaire',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'end-screening',
        url: '/api/v1/encounter/end-screening/',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'tests',
        url: '/api/v1/tests',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'empower-consent',
        url: '/api/v1/consent',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'allergyintolerance',
        url: '/api/v1/allergyintolerance',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'allergyintolerance-search',
        url: '/api/v1/allergyintolerance/search',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'referral-form',
        url: '/api/v1/referral-form',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'associated-resources',
        url: '/api/v1/encounter/',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'test-results',
        url: '/api/v1/test-results',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'patient-appointment',
        url: '/api/v1/appointment',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'questionnaire-response',
        url: '/api/v1/questionnaire-response',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'patient-referral',
        url: '/api/v1/referral',
        server: environment.clinicalRestUrl,
    },
    {
        name: 'organization-members',
        url: '/api/v1/organization/:id/members',
        server: environment.billingBackend,
    },
    {
        name: 'hermes-roles',
        url: '/api/common/realm_roles/',
    },
    {
        name: 'assign-roles',
        url: '/api/common/realm_roles/',
    },
    {
        name: 'user-details-hermes',
        url: '/api/v1/user/',
        server: environment.billingBackend,
    },
    {
        name: 'hermes-roles-view',
        url: '/api/common/realm_roles/',
    },
    {
        name: 'adv-payment',
        url: '/api/billing/payments/',
    },
];
