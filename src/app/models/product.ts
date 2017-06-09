import { Exclude, Expose, Type } from "class-transformer";

import { Pricing} from "./pricing";
import { Identifier } from "./identifier";
import { Identifiable } from "./identifiable";

@Exclude()
export class Product extends Identifiable {
    @Expose() id: number;
    @Expose() name: string;
    @Expose() tags: string[];
    @Expose() @Type(() => Pricing) pricings: Pricing[];

    constructor(id: number, name: string, tags: string[] = [], identifiers: Identifier[] = [], pricings: Pricing[] = []){
        super();
        this.id = id;
        this.name = name;
        this.tags = tags;
        this.identifiers = identifiers;
        this.pricings = pricings;
    }
}