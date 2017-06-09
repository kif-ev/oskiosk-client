import { Exclude, Expose, Type } from "class-transformer";

import { Identifier } from "./identifier";

@Exclude()
export abstract class Identifiable{
    @Expose() @Type(() => Identifier) identifiers: Identifier[];
}