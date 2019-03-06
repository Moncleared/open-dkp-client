export class PlayerSummaryModel {
    public CharacterName: string;
    public CharacterClass: string;
    public CharacterRank: string;
    public CharacterStatus: string;

    public CurrentDKP: number;

    public AttendedTicks_30: number;
    public AttendedTicks_60: number;
    public AttendedTicks_90: number;
    public AttendedTicks_Life: number;

    public TotalTicks_30: number;
    public TotalTicks_60: number;
    public TotalTicks_90: number;
    public TotalTicks_Life: number;

    public Calculated_30: number;
    public Calculated_60: number;
    public Calculated_90: number;
    public Calculated_Life: number;    
}