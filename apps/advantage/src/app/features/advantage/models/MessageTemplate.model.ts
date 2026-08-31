export interface MessageTemplateModel {
    id: string;
    name: string;
    template: string;
    message_type: string;
    parent: string | null;
    status?: string;
    has_sequence: boolean;
    template_en?: string;
    template_fr?: any;
    template_sw?: string;
}

export interface MessageInterface {
    id: string;
    name: string;
    label: any;
    ussd_enabled: any;
    description: string;
    attributes: any;
    status: string;
    created: string;
    member_count: number;
    welcome_message_template: MessageTemplateModel;
    send_welcome_message_notification: boolean;
    filter_execution_status: any;
    firstMessage?: any;
}
