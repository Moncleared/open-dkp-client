export class BatchModel {
    constructor(
        public Enabled: boolean = false,
        public MarkActive: boolean = true,
        public MarkInactive: boolean = true,
        public Days: number = 30) {
    }
}