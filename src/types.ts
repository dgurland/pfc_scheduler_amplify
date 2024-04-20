export enum DIVISIONS {
    JRG,
    ING,
    SRG,
    HSG,
    JRB,
    INB,
    SRB,
    HSB
}

export enum CREATE_UPDATE {
    CREATE = "create",
    EDIT = "edit",
    TEMPLATE = "template"
}

export enum EVENT_CATEGORY {
    OTHER,
    PIZZA,
    BREAKFAST,
    OVERNIGHT
}

export enum USER_TYPE {
    ADMIN = "admin",
    DIVISION_LEADER = "division-leader"
}

export type Facility = {
    id: string;
    name: string;
}

export type Activity = {
    id: string;
    name: string;
    usage: number;
    facilityId: string;
    facility: Facility;
}

export type ScheduleEntry = {
    id: string;
    date: string;
    activityIds: string[];
    activities: Activity[];
    division: number;
    period: number;
}

export type ScheduleEntryCreationSubmission = {
    date: string;
    activityIds: string[];
    division: number;
    period: number;
}

export type Schedule = {
    date: string;
    id: string;
    entries: ScheduleEntry[];
    periods: number;
}

export type Event = {
    name: string;
    id: string;
    date: string;
    updatedAt: string;
    category: number;
}