export class UserRequest {
    public static TYPE_CHARACTER_ASSIGN: number = 1;
    public static TYPE_CHARACTER_UPDATE: number = 2;
    public static TYPE_RAIDTICK: number = 3;

    public static STATUS_PENDING: number = 0;
    public static STATUS_DENIED: number = 1;
    public static STATUS_APPROVED: number = 2;

    public Id: number;
    public Requestor: string;
    public RequestType: number;
    public RequestStatus: number;
    public RequestDetails: string;
    public RequestTimestamp: Date;
    public RequestApprover: string;
    public ReviewedTimestamp: Date;
}

export enum RequestType {
    "Character Assign" = 1,
    "Character Update" = 2,
    "Raid Tick" = 3
}

export enum RequestStatus {
    "PENDING" = 0,
    "DENIED" = 1,
    "APPROVED" = 2
}