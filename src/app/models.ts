export abstract class OskioskModel{
    static fromOskiosk(obj: object){
        throw new Error('Not implemented.');
    }
}

export abstract class Identifiable extends OskioskModel {
    identifiers: string[];
}

export class Product extends Identifiable {
    id: number;
    name: string;
    tags: string[];
    pricings: Pricing[];

    constructor(id: number, name: string, tags: string[] = [], identifiers: string[] = [], pricings: Pricing[] = []){
        super();
        this.id = id;
        this.name = name;
        this.tags = tags;
        this.identifiers = identifiers;
        this.pricings = pricings;
    }

    static fromOskiosk(product: object){
        let pricings = [];
        for(let pricing of product['pricings']){
            pricings.push(new Pricing(pricing['id'], pricing['price']));
        }
        return new Product(product['id'], product['name'], product['tags'], product['identifiers'], pricings);
    }
}

export class Pricing{
    id: number;
    price: number;

    constructor(id: number, price: number = 0){
        this.id = id;
        this.price = price;
    }
}

export class User extends Identifiable {
    id: number;
    name: string;
    balance: number;
    tags: string[];

    constructor(id: number, name: string, balance: number = 0, tags: string[] = [], identifiers: string[] = []){
        super();
        this.id = id;
        this.name = name;
        this.balance = balance;
        this.tags = tags;
        this.identifiers = identifiers;
    }
}

export class CartItem {
    product: Product;
    pricing: Pricing;
    quantity: number;

    constructor(product: Product, pricing: Pricing, quantity: number){
        this.product = product;
        this.pricing = pricing;
        this.quantity = quantity;
    }

    unitPrice(): number {
        return this.pricing.price;
    }

    totalPrice(): number {
        return this.quantity * this.pricing.price;
    }
}

export class Cart extends OskioskModel {
    cart_items: CartItem[];
    user: User;

    constructor(){
        super();
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

    addToCart(product: Product, pricing: Pricing, quantity: number = 1): void {
        for(let item of this.cart_items){
            if(item.product.id == product.id && item.pricing.id == pricing.id){
                item.quantity += quantity;
                return;
            }
        }
        this.cart_items.push(new CartItem(product, pricing, quantity));
    }

    removeFromCart(product: Product, pricing: Pricing, quantity: number = 1): void {
        for(let item of this.cart_items){
            if(item.product.id == product.id && item.pricing.id == pricing.id){
                item.quantity -= quantity;
                if(item.quantity <= 0){
                    this.cart_items.splice(this.cart_items.indexOf(item),1);
                }
                return;
            }
        }
    }
}

export class TransactionItem {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;

    constructor(id: number, product_id: number, product_name: string, quantity: number, price: number){
        this.id = id;
        this.product_id = product_id;
        this.product_name = product_name;
        this.quantity = quantity;
        this.price = price;
    }
}

export class Transaction extends OskioskModel{
    id: number;
    user_id: number;
    user_name: string;
    amount: number;
    created: Date;

    constructor(id: number, user_id: number, user_name: string, amount: number, created: Date = new Date()) {
        super();
        this.id = id;
        this.user_id = user_id;
        this.user_name = user_name;
        this.amount = amount;
        this.created = created;
    }
}

export class PaymentTransaction extends Transaction {
    transaction_items: TransactionItem[];

    constructor(id: number, user_id: number, user_name: string, amount: number, created: Date = new Date(), transaction_items: TransactionItem[] = []) {
        super(id, user_id, user_name, amount, created);
        this.transaction_items = transaction_items;
    }
}