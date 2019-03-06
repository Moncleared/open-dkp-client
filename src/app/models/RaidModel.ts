import { PoolModel } from './PoolModel';

export class RaidModel {
    public Name: string;
    public Timestamp: Date;
    public IdRaid: number;
    public Pool: PoolModel;
    public Ticks: any;
    public Items: any;
    public UpdatedBy: string;
    public UpdatedTimestamp: Date;
}