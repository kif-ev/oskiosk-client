import { Identifier } from "./identifier";
import { Identifiable } from "./identifiable";
import { Expose, Exclude, Transform } from "class-transformer";
import { Tag, TagTransform, InverseTagTransform } from "./tag";

@Exclude()
export class User extends Identifiable {
    @Expose() id: number;
    @Expose() name: string;
    @Expose() balance: number;
    @Expose() @Transform(value => TagTransform(value), { toClassOnly: true }) @Transform(value => InverseTagTransform(value), { toPlainOnly: true }) tags: Tag[];

    constructor(id: number, name: string, balance: number = 0, tags: Tag[] = [], identifiers: Identifier[] = []){
        super();
        this.id = id;
        this.name = name;
        this.balance = balance;
        this.tags = tags;
        this.identifiers = identifiers;
    }

    addTag(tag: Tag){
        this.tags.push(tag);
    }

    deleteTag(tag: Tag){
        let index = this.tags.indexOf(tag, 0);
        if (index > -1) {
            this.tags.splice(index, 1);
        }
    }
}