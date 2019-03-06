export class AuditModel {
    public Id: number;
    public CognitoUser: string;
    public Timestamp: Date;
    public Action: string;
    public OldValue: any;
    public NewValue: any;
}