export interface Subtopic {
    id: string;
    title: string;
    parent: string | null;
    url: string | null;
}

export interface Topic {
    id?: string;
    created_by_name?: string;
    updated_by_name?: string;
    subtopics?: Subtopic[];
    workstation_id?: string;
    department_id?: string;
    branch_id?: string;
    cluster_id?: string;
    active?: boolean;
    created?: string;
    created_by?: string;
    updated?: string;
    updated_by?: string;
    title: string;
    url?: string | null;
    permission?: string | null;
    organisation?: string;
    parent?: string | null;
    description?: string;
}
