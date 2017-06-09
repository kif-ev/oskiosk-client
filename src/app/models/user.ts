import { Identifier } from "./identifier";
import { Identifiable } from "./identifiable";

export class User extends Identifiable {
    id: number;
    name: string;
    balance: number;
    tags: string[];

    constructor(id: number, name: string, balance: number = 0, tags: string[] = [], identifiers: Identifier[] = []){
        super();
        this.id = id;
        this.name = name;
        this.balance = balance;
        this.tags = tags;
        this.identifiers = identifiers;
    }
}