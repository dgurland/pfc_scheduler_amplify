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