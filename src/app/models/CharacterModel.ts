//Note to self - For two-way binding to work, properties must be PUBLIC...
export class CharacterModel {
    constructor(
        public Name: string,
        public Rank: string,
        public Class: string,
        public Level: number,
        public Race ? : string,
        public Gender ? : string,
        public Guild ? : string,
        public IdCharacter ? : number,
        public IdAssociated ? : number,
        public Active ? : boolean,
        public MainChange ? : string,
        public SummaryModel ? : any
    ) {}
}