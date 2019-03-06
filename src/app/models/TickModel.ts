export class TickModel {
    constructor(pDescription: string = "", pValue: number = 0, pAttendees: Set < string > = new Set < string > ()) {
        this.Description = pDescription;
        this.Value = pValue;
        this.Attendees = pAttendees;
    }
    public Description: string;
    public Value: number;
    public Attendees: Set < string >;
    public IdTick: number;
}