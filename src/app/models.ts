import { Type, Exclude, Expose, Transform } from "class-transformer";

@Exclude()
export class Identifier {
    @Expose() code: string;

    constructor(code: string) {
        this.code = code;
    }
}

@Exclude()
export abstract class Identifiable{
    @Expose() @Type(() => Identifier) identifiers: Identifier[];
}

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

@Exclude()
export class CartItem {
    @Expose({ toClassOnly: true }) product_name: string;
    @Expose() pricing_id: number;
    @Expose() quantity: number;
    @Expose({ toClassOnly: true }) unit_price: number;

    constructor(product_name: string, pricing_id: number, quantity: number, unit_price: number){
        this.product_name = product_name;
        this.pricing_id = pricing_id;
        this.quantity = quantity;
        this.unit_price = unit_price;
    }

    totalPrice(): number {
        return this.quantity * this.unit_price;
    }
}

@Exclude()
export class Cart{
    @Expose() id: number;
    @Expose() @Type(() => CartItem) cart_items: CartItem[];
    @Expose() user_id: number;
    @Expose() lock_version: number;

    constructor(){
        this.cart_items = [];
    }

    isEmpty(): boolean {
        return this.cart_items.length == 0;
    }

    totalSum(): number {
        let sum = 0;
        for(let item of this.cart_items){
            sum += item.totalPrice();
        }
        return sum;
    }

    addToCart(product_name: string, pricing: Pricing, quantity: number = 1): void {
        for(let item of this.cart_items){
            if(item.pricing_id == pricing.id){
                item.quantity += quantity;
                return;
            }
        }
        this.cart_items.push(new CartItem(product_name, pricing.id, quantity, pricing.price));
    }

     private modifyQuantity(pricing_id: number, quantity: number): void {
        for(let item of this.cart_items){
            if(item.pricing_id == pricing_id){
                item.quantity += quantity;
                if(item.quantity <= 0){
                    this.cart_items.splice(this.cart_items.indexOf(item),1);
                }
                return;
            }
        }
    }

    increaseQuantity(pricing_id: number, quantity: number = 1){
        this.modifyQuantity(pricing_id, quantity)
    }

    decreaseQuantity(pricing_id: number, quantity: number = 1){
        this.modifyQuantity(pricing_id, -quantity)
    }
}

export class TransactionItem {
    @Expose() id: number;
    @Expose() product_id: number;
    @Expose() name: string;
    @Expose() quantity: number;
    @Expose() price: number;

    constructor(id: number, product_id: number, name: string, quantity: number, price: number){
        this.id = id;
        this.product_id = product_id;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
    }
}

@Exclude()
export class Transaction{
    @Expose() id: number;
    @Expose() user_id: number;
    @Expose() user_name: string;
    @Expose() amount: number;
    @Expose() created_at: Date;

    constructor(id: number, user_id: number, user_name: string, amount: number, created_at: Date = new Date()) {
        this.id = id;
        this.user_id = user_id;
        this.user_name = user_name;
        this.amount = amount;
        this.created_at = created_at;
    }
}

@Exclude()
export class PaymentTransaction extends Transaction {
    @Expose() @Type(() => TransactionItem) transaction_items: TransactionItem[];

    constructor(id: number, user_id: number, user_name: string, amount: number, created_at: Date = new Date(), transaction_items: TransactionItem[] = []) {
        super(id, user_id, user_name, amount, created_at);
        this.transaction_items = transaction_items;
    }
}