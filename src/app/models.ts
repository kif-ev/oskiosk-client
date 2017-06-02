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
        return this.product_variant.price / 100;
    }

    totalPrice(): number {
        return this.quantity * this.product_variant.price / 100;
    }
}

export class Cart {
    cart_items: CartItem[];

    constructor(){
        this.cart_items = [];
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