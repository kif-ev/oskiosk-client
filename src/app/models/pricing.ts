import { Exclude, Expose } from "class-transformer";

@Exclude()
export class Pricing{
    @Expose() id: number;
    @Expose() price: number;
    @Expose() quantity: number;

    constructor(id: number, price: number = 0, quantity: number = 0){
        this.id = id;
        this.price = price;
        this.quantity = quantity;
    }
}