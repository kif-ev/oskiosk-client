export abstract class Identifiable {
    identifier: string;
}

export class Product {
    id: number;
    name: string;
    tags: string[];

    constructor(id: number, name: string, tags: string[] = []){
        this.id = id;
        this.name = name;
        this.tags = tags;
    }
}

export class ProductVariant extends Identifiable {
    id: number;
    price: number;
    optional_name: string;
    product: Product;

    constructor(id: number, product: Product, identifier: string = null, price: number = 0, optional_name=null){
        super();
        this.id = id;
        this.product = product;
        this.identifier = identifier;
        this.price = price;
        this.optional_name = optional_name;
    }

    getName(): string {
        if(this.optional_name){
            return this.product.name + ' ' + this.optional_name;
        }
        else {
            return this.product.name;
        }
    }
}

export class User extends Identifiable {
    id: number;
    name: string;
    balance: number;

    constructor(id: number, name: string, balance: number = 0, identifier: string = ''){
        super();
        this.id = id;
        this.name = name;
        this.balance = balance;
        this.identifier = identifier;
    }
}

export class CartItem {
    product_variant: ProductVariant;
    quantity: number;

    constructor(product_variant: ProductVariant, quantity: number){
        this.product_variant = product_variant;
        this.quantity = quantity;
    }

    unitPrice(): number {
        return this.product_variant.price;
    }

    totalPrice(): number {
        return this.quantity * this.product_variant.price;
    }
}

export class Cart {
    cart_items: CartItem[];
    user: User;

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

    addToCart(product_variant: ProductVariant, quantity: number = 1): void {
        for(let item of this.cart_items){
            if(item.product_variant.id == product_variant.id){
                item.quantity += quantity;
                return;
            }
        }
        this.cart_items.push(new CartItem(product_variant, quantity));
    }

    removeFromCart(product_variant: ProductVariant, quantity: number = 1): void {
        for(let item of this.cart_items){
            if(item.product_variant.id == product_variant.id){
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

export class Transaction {
    id: number;
    user_id: number;
    user_name: string;
    amount: number;
    created: Date;

    constructor(id: number, user_id: number, user_name: string, amount: number, created: Date = new Date()) {
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