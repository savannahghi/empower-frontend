/** walkthrough tour step buttons */
export const STEPS_BUTTONS = {
    /** back  button */
    back: {
        secondary: true,
        text: 'Back',
        type: 'back',
    },
    /** cancel  button */
    cancel: {
        secondary: true,
        text: 'Exit',
        type: 'cancel',
    },
    /** next  button */
    next: {
        text: 'Next',
        type: 'next',
    },
    done: {
        text: 'Done',
        type: 'next',
    },
};

/** tour default settings options */
export const defaultStepOptions: any = {
    classes: 'shepherd-theme-arrows',
    scrollTo: { behavior: 'smooth', block: 'center' },
    modal: false,
    /** shows only the HTML element found on a page */
    showOn(): boolean {
        const element = document.querySelector(this.attachTo.element);
        return Boolean(element);
    },
    /** shows the cancel icon */
    cancelIcon: {
        enabled: true,
    },
};

/** HOME PAGE onboarding steps */
export const homeDetailsSteps: any = [
    /** indicates user service point */
    {
        attachTo: {
            element: '.toggle_theme',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.next],
        id: 'toggle_theme',
        title: `Change Application's Appearance`,
        text: `Changes theme of the application when toggled.`,
    },
    /** indicates user service point */
    {
        attachTo: {
            element: '.user_service_point',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        id: 'user_service_point',
        title: `Service Point`,
        text: `Indicates the service point you're currently operating in.`,
    },
    /** indicates user org name and business partner */
    {
        attachTo: {
            element: '.user_org_business',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        id: 'user_org_business',
        title: `Organization Name`,
        text: `Indicates your organization name and business partner.`,
    },
    /** shows user profile */
    {
        attachTo: {
            element: '.user_profile',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        id: 'user_profile',
        title: `User Profile`,
        text: `Shows a user profile and a logging out option.`,
    },

    /** lists all upcoming appointments */
    {
        attachTo: {
            element: '.upcomingAppointments',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        id: 'upcomingAppointments',
        title: `Upcoming Appointments`,
        text: `Lists all upcoming appointments.`,
    },
    /** shows new appointment */
    {
        attachTo: {
            element: '.newAppointment',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'newAppointment',
        title: `New Appointment`,
        text: `Creates a new appointments.`,
    },
    /** shows patient's details */
    {
        attachTo: {
            element: '.viewAppointment',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        id: 'viewAppointment',
        title: `View Appointment`,
        text: `Views all appointments.`,
    },
    /** shows all patients */
    {
        attachTo: {
            element: '.viewPatients',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'viewPatients',
        title: `View Patients`,
        text: `Views all Patients.`,
    },
    /** shows view clinics button */
    {
        attachTo: {
            element: '.viewClinics',
            on: 'bottom',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.done],
        id: 'viewClinics',
        title: `view Clinics`,
        text: `Views all clinics.`,
    },
];

/**  PATIENTS LIST PAGE onboarding steps */
export const patientsListSteps: any = [
    /** shows register patient button */
    {
        attachTo: {
            element: '.register_patient',
            on: 'right',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.next],
        id: 'register_patient',
        title: `Register Patient`,
        text: `Opens a register patient dialogue, to register a new patient.`,
    },
    /** shows clinic filters options */
    {
        attachTo: {
            element: '.book_appointment',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'book_appointment',
        title: `Book Appointment`,
        text: `This will open a book appointment's page.`,
    },
    /** shows search table input  */
    {
        attachTo: {
            element: '.table_search',
            on: 'right',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'table_search',
        title: `Search  Items on the Table`,
        text: `This shows an input to search items in the table`,
    },
    /** shows table actions options */
    {
        attachTo: {
            element: '.table_actions',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'table_actions',
        title: 'Table Actions',
        text: `Indicates some of the actions that can be performed on the items on the table.`,
    },
    /** shows table pagination */
    {
        attachTo: {
            element: '.table_pagination',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.done],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'table_pagination',
        title: 'Table Pagination',
        text: `Shows pagination actions to load more data if available.`,
    },
];

/**  Biometrics Enrollment steps */
export const biometricsEnrollmentSteps: any = [
    {
        attachTo: {
            element: '.capture-btn',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.next],
        id: 'capture-btn',
        title: `How to Enroll Fingerprints`,
        text: `Click on the Capture button and put the selected finger on the device reader to start the enrollment process.`,
    },
    {
        attachTo: {
            element: '.captured',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.next],
        id: 'captured',
        title: `Captured Fingerprint`,
        text: `This fingerprint has already been enrolled and verified. No further action is needed for this finger. You can proceed to capture other fingers if needed.`,
    },
];

/**  VISITS LIST PAGE onboarding steps */
export const visitsListSteps: any = [
    /** shows table top status filters  */
    {
        attachTo: {
            element: '.table_top_status_filters',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'table_top_status_filters',
        title: `Status Filters`,
        text: `This shows filter options on the patient's list table`,
    },
    /** shows search table input  */
    {
        attachTo: {
            element: '.table_search',
            on: 'right',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'table_search',
        title: `Search  Items on the Table`,
        text: `This shows an input to search items in the table.`,
    },
    /** shows payment method filter row on the table */
    {
        attachTo: {
            element: '.table_status_color',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'table_status_color',
        title: `Payment method`,
        text: `Indicates the payment method used.`,
    },
    /** shows visit status on visit list table */
    {
        attachTo: {
            element: '.table_status',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'table_status',
        title: `Visit Status`,
        text: `Indicates the status of a patient's visit`,
    },
    /** shows table actions options */
    {
        attachTo: {
            element: '.table_actions',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.done],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'table_actions',
        title: 'Table Actions',
        text: `Indicates an action to view a patient's visit`,
    },
];

/** QUEUES LIST PAGE onboarding steps */
export const queueListSteps: any = [
    /** shows table top status filters  */
    {
        attachTo: {
            element: '.queue_pri_filters',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'queue_pri_filters',
        title: `Queue Filters`,
        text: `This shows filter options on the patients' queues.`,
    },
    /** shows patient currently being seen at the queue list  */
    {
        attachTo: {
            element: '.being_seen_now',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        id: 'being_seen_now',
        title: `Patient Currently being served`,
        text: `This shows the patient currently being served.`,
    },
    /** shows table top status filters  */
    {
        attachTo: {
            element: '.table_top_status_filters',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        id: 'table_top_status_filters',
        title: `Status Filters`,
        text: `This shows filter options on the Queue list table.`,
    },
    /** shows search table input  */
    {
        attachTo: {
            element: '.table_search',
            on: 'right',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        id: 'table_search',
        title: `Search  Items on the Table`,
        text: `This shows an input to search items in the table.`,
    },
    /** shows payment method filter row on the table */
    {
        attachTo: {
            element: '.table_status_color',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        id: 'table_status_color',
        title: `Queue Status`,
        text: `Indicates the status of a queue.`,
    },
    /** shows table actions options */
    {
        attachTo: {
            element: '.table_actions',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.done],
        id: 'table_actions',
        title: 'Table Actions',
        text: `Indicates various actions that can be performed on a item in the queue list.`,
    },
];

/**  WORKLIST PAGE onboarding steps */
export const worklistSteps: any = [
    /** shows table top status filters  */
    {
        attachTo: {
            element: '.table_top_status_filters',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'table_top_status_filters',
        title: `Status Filters`,
        text: `This shows filter options on the documents list table`,
    },
    /** shows search table input  */
    {
        attachTo: {
            element: '.table_search',
            on: 'right',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'table_search',
        title: `Search  Items on the Table`,
        text: `This shows an input to search items in the table. You can search by File Number, `,
    },
    /** shows payment method filter row on the table */
    {
        attachTo: {
            element: '.table_status_color',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'table_status_color',
        title: `Document status`,
        text: `Indicates the document status under review.`,
    },
    /** shows table actions options */
    {
        attachTo: {
            element: '.table_actions',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'table_actions',
        title: 'Table Actions',
        text: `Indicates a view action. This can either view or review a patient's document.`,
    },
    /** shows table pagination */
    {
        attachTo: {
            element: '.table_pagination',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.done],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'table_pagination',
        title: 'Table Pagination',
        text: `Shows pagination actions to load more data if available.`,
    },
];

/** CLINIC LIST PAGE onboarding steps */
export const clinicListSteps: any = [
    /** shows setup clinic button  */
    {
        attachTo: {
            element: '.setup_clinic',
            on: 'right',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.next],
        id: 'setup_clinic',
        title: `Setup Clinic`,
        text: `This button open a setup clinic page, to setup a new clinic.`,
    },
    /** shows search table input  */
    {
        attachTo: {
            element: '.table_search',
            on: 'right',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        id: 'table_search',
        title: `Search  Items on the Table`,
        text: `This shows an input to search items in the table.`,
    },
    /** shows payment method filter row on the table */
    {
        attachTo: {
            element: '.table_status_color',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        id: 'table_status_color',
        title: `Queue Status`,
        text: `Indicates the status of a queue.`,
    },
    /** shows table actions options */
    {
        attachTo: {
            element: '.table_actions',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.done],
        id: 'table_actions',
        title: 'Table Actions',
        text: `Indicates an action to view a clinic.`,
    },
];

/** APPOINTMENTS PAGE onboarding steps */
export const appointmentSteps: any = [
    /** shows appointment filters options */
    {
        attachTo: {
            element: '.appointment_filters',
            on: 'right',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.next],
        id: 'appointment_filters',
        title: `Appointment Filters`,
        text: `Shows a variety of appointment filter options.`,
    },
    /** shows appointment calendar */
    {
        attachTo: {
            element: '.appointment_calendar',
            on: 'right',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        id: 'appointment_calendar',
        title: `Appointment Calendar`,
        text: `Shows a calendar to help filter appointments according to dates.`,
    },
    /** shows clinic filters options */
    {
        attachTo: {
            element: '.clinic_filter',
            on: 'right',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'clinic_filter',
        title: `Clinics Filter`,
        text: `Shows a variety of clinic filter options.`,
    },
    /** shows clinic filters options */
    {
        attachTo: {
            element: '.bulk_cancel',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'bulk_cancel',
        title: `Bulk Cancel`,
        text: `This open a dialogue to cancel appointments in bulk on a selected date.`,
    },
    /** shows clinic filters options */
    {
        attachTo: {
            element: '.book_appointment',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'book_appointment',
        title: `Book Appointment`,
        text: `This will open a book appointment's page.`,
    },
    /** shows table top status filters  */
    {
        attachTo: {
            element: '.table_top_status_filters',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'table_top_status_filters',
        title: `Status Filters`,
        text: `This shows filter options on the items' statuses.`,
    },
    /** shows search table input  */
    {
        attachTo: {
            element: '.table_search',
            on: 'right',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'table_search',
        title: `Search  Items on the Table`,
        text: `This shows an input to search items in the table.`,
    },

    /** shows filter button  */
    {
        attachTo: {
            element: '.table_filter',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'table_filter',
        title: `Appointments Filter`,
        text: `This opens a filter appointment's dialogue or right sidebar.`,
    },
    /** shows clear filter button  */
    {
        attachTo: {
            element: '.table_clear_filter',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'table_clear_filter',
        title: `Clear Appointments' Filter`,
        text: `This clears filters applied to the appointments' list.`,
    },
    /** shows appointment status filter row on the table */
    {
        attachTo: {
            element: '.table_status_color',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'table_status_color',
        title: `Appointment Status`,
        text: `Indicates the status of an item in the table.`,
    },
    /** shows table actions options */
    {
        attachTo: {
            element: '.table_actions',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.done],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'table_actions',
        title: 'Table Actions',
        text: `Indicates some of the actions that can be performed on the items on the table.`,
    },
];

/** ADD APPOINTMENT PAGE onboarding steps */
export const addAppointmentSteps: any = [
    /** shows patient's details */
    {
        attachTo: {
            element: '.patient-data',
            on: 'right',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'patient-data',
        title: `Appointment Patient's Details`,
        text: `Displays a patient's personal identification details.`,
    },
    /** shows start visit button */
    {
        attachTo: {
            element: '.start_visit',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'start_visit',
        title: `Start Visit`,
        text: `Starts the appointment patient's visit.`,
    },
    /** shows confirm button */
    {
        attachTo: {
            element: '.confirm',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'confirm',
        title: `Confirm Appointent`,
        text: `Confirm the patient's appointment.`,
    },
    /** shows continue visit button */
    {
        attachTo: {
            element: '.continue_visit',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'continue_visit',
        title: `Continue Visit`,
        text: `This action continues the patient's visit.`,
    },
    /** shows go back button */
    {
        attachTo: {
            element: '.go_back',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'go_back',
        title: `Go Back to previous page`,
        text: `Goes back to the appointments list page.`,
    },
    /** shows appointment specialty */
    {
        attachTo: {
            element: '.appointment_status',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'appointment_status',
        title: `Appointment Status`,
        text: `Indicates the patient's appointment status.`,
    },
    /** shows appointment specialty */
    {
        attachTo: {
            element: '.appointment_speciality',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'appointment_speciality',
        title: `Appointment Speciality`,
        text: `Indicates the appointment's speciality.`,
    },
    /** shows appointment specialty */
    {
        attachTo: {
            element: '.appointment_clinic',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'appointment_clinic',
        title: `Appointment Clinic`,
        text: `Indicates the appointment's clinic.`,
    },
    /** shows appointment specialty */
    {
        attachTo: {
            element: '.appointment_reason',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.done],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'appointment_reason',
        title: `Appointment Reason`,
        text: `Indicates the appointment's reason.`,
    },
];

/** VISIT DETAILS PAGE onboarding steps includes visit details, visit billing components */
export const visitDetailsSteps: any = [
    /** shows patient's details */
    {
        attachTo: {
            element: '.patient-data',
            on: 'right',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'patient-data',
        title: `Patient's Details`,
        text: `Displays a patient's personal identification details.`,
    },
    /** shows complete visit button */
    {
        attachTo: {
            element: '.complete_visit',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'complete_visit',
        title: `Complete Patient's Visit`,
        text: `Completes a patient's visit after patient is completely served.`,
    },
    /** shows view entire visit button */
    {
        attachTo: {
            element: '.view_entire_visit',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'view_entire_visit',
        title: `View Patient's Visit`,
        text: `Views entire patient's visit.`,
    },
    /** shows patients details button */
    {
        attachTo: {
            element: '.patient_details',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'patient_details',
        title: `Patient's Details`,
        text: `View a patient's details including their invoices.`,
    },
    /** shows cancel visit button */
    {
        attachTo: {
            element: '.cancel_visit',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'cancel_visit',
        title: `Cancel Patient's Visit`,
        text: `Cancels a patient's visit.`,
    },
    /** shows payment method */
    {
        attachTo: {
            element: '.payment_method',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'payment_method',
        title: 'Payment Method',
        text: `Payment method used by the patient to pay for services.`,
    },
    /** shows visit status */
    {
        attachTo: {
            element: '.visit_status',
            on: 'right',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'visit_status',
        title: 'Visit Status',
        text: `Indicates the status of the patient's visit.`,
    },
    /** shows total amount bill */
    {
        attachTo: {
            element: '.total_amount_due',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'total_amount_due',
        title: 'Total Amount',
        text: `Patient's total cost for services offered.`,
    },
    /** shows total amount paid bill */
    {
        attachTo: {
            element: '.total_amount_paid',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'total_amount_paid',
        title: 'Amount Paid',
        text: `Patient's amount paid for services offered.`,
    },
    /** shows total balance bill */
    {
        attachTo: {
            element: '.total_balance',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'total_balance',
        title: 'Balance',
        text: `Patient's pending balance for services offered.`,
    },
    /** shows print entire invoice button */
    {
        attachTo: {
            element: '.print_entire-invoice',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'print_entire-invoice',
        title: 'Print Entire Invoice',
        text: `This prints the entire invoice of a patient's visit.`,
    },
    /** sends patient to the next service point */
    {
        attachTo: {
            element: '.service-point-btn',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'service-point-btn',
        title: 'Send to Next Service Point',
        text: `This action sends a patient to the next service point to receive another service.`,
    },
    /** shows service request name */
    {
        attachTo: {
            element: '.service_request_name',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'service_request_name',
        title: 'Service Point Name',
        text: `Name of the service point the patient has received or currently receiving a service`,
    },
    /** shows service request status */
    {
        attachTo: {
            element: '.service_request_status',
            on: 'right',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'service_request_status',
        title: 'Service Request Status',
        text: `Status of a service request the patient is being served in or was served`,
    },

    /** shows go to triage component */
    {
        attachTo: {
            element: '.service_triage',
            on: 'right',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'service_triage',
        title: `Triage (Patient's Vitals)`,
        text: `This button opens triage page to add a patient's vitals, for example blood pressure, height and weight`,
    },

    /** shows print invoice per service request */
    {
        attachTo: {
            element: '.print_invoice',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'print_invoice',
        title: 'Print Receipt',
        text: `Prints invoice for a specific service point.`,
    },
    /** shows add item button */
    {
        attachTo: {
            element: '.add_item',
            on: 'left',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'add_item',
        title: 'Add Item',
        text: `Opens dialogue to add items for billing.`,
    },
    /** shows add payment button */
    {
        attachTo: {
            element: '.add_payment',
            on: 'left-end',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'add_payment',
        title: 'Visit Status',
        text: `Opens dialogue to add payments for billed items.`,
    },
    {
        attachTo: {
            element: '.next_service_action',
            on: 'right',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'next_service_action',
        title: 'Being Served Now/ Add to Queue',
        text: `Indicate whether a patient is being served or waiting to be added to the queue.`,
    },
    {
        attachTo: {
            element: '.send_to_next_service_point',
            on: 'right',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'send_to_next_service_point',
        title: 'Serves a patient',
        text: `Sends a patient to the next service point.`,
    },
    /** shows payment status tag */
    {
        attachTo: {
            element: '.payment_status',
            on: 'right',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'payment_status',
        title: 'Payment Status',
        text: `Indicates patient's bill payment status.`,
    },
    /** shows payment or bill items tag */
    {
        attachTo: {
            element: '.show_payments_or_bill_items',
            on: 'right',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.next],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'show_payments_or_bill_items',
        title: 'Toggle Show Payments or Bill Items',
        text: `Toggles to show payments made or billed items for services offered.`,
    },
    /** shows table actions options */
    {
        attachTo: {
            element: '.table_actions',
            on: 'top',
        },
        buttons: [STEPS_BUTTONS.cancel, STEPS_BUTTONS.back, STEPS_BUTTONS.done],
        classes: 'custom-class-name-1 custom-class-name-2',
        id: 'table_actions',
        title: 'Table Actions',
        text: `Indicates some of the actions that can be performed on the items on the table.`,
    },
];
