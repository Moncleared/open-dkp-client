export class AdjustmentModel {
    constructor(
        public Character: string,
        public Name: string,
        public Description: string,
        public Value: number,
        public Timestamp ? : string,
        public Id ? : number
    ) {}
}