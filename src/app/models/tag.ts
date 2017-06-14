export class Tag {
    name: string;
    occurrences: number;

    constructor(name: string){
        this.name = name;
    }

    getPlain(){
        return this.name;
    }
};