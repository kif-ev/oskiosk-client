import { BackendService } from "app/services/backend.service";
import { Product, ProductVariant, User, Identifiable, PaymentTransaction, Cart, TransactionItem } from "app/models";

export class LocalBackendService extends BackendService {
    _product_id: number = 1;
    _user_id: number = 1;
    _variant_id: number = 1;
    _transaction_id: number = 1;
    _transaction_item_id: number = 1;
    _latency_simulation = 1000;

    _products = [
        new Product(this._product_id++, 'Club Mate', ['drink']),
        new Product(this._product_id++, 'fritz Cola', ['drink'])
    ];
    _variants = [
        new ProductVariant(this._variant_id++, this._products[0], '1234', 70),
        new ProductVariant(this._variant_id++, this._products[1], '1337', 100)
    ];
    _users = [
        new User(this._user_id++, 'Darth Vader',1000, '8888'),
        new User(this._user_id++, 'Dagobert Duck',99999999, '9999')
    ];
    _transactions = [];

    resolveWithLatency(value): Promise<object> {
        return new Promise(resolve => {
            setTimeout(() => resolve(value), this._latency_simulation);
        });
    }

    getProducts(): Promise<Product[]> {
        return this.resolveWithLatency(this._products);
    }

    getProduct(id: number): Promise<Product> {
        for(let product of this._products){
            if(product.id == id)
                return this.resolveWithLatency(product);;
        }
        return Promise.reject(new Error('Product with specified ID not found.'));
    }

    getUsers(): Promise<User[]> {
        return this.resolveWithLatency(this._users);;
    }

    getUser(id: number): Promise<User> {
        for(let user of this._users){
            if(user.id == id)
                return this.resolveWithLatency(user);;
        }
        return Promise.reject(new Error('User with specified ID not found.'));
    }

    getItemByIdentifier(identifier: string): Promise<Identifiable> {
        for(let variant of this._variants){
            if(variant.identifier == identifier)
                return this.resolveWithLatency(variant);
        }

        for(let user of this._users){
            if(user.identifier == identifier)
                return this.resolveWithLatency(user);
        }

        return Promise.reject(new Error('No item with the specified identifier exists.'));
    }

    payCart(cart: Cart): Promise<PaymentTransaction> {
        if(!cart.user){
            return Promise.reject(new Error('Cannot pay for a cart when no user is specified.'));
        }
        if(cart.isEmpty()){
            return Promise.reject(new Error('Cannot pay for a cart which is empty.'));
        }

        let transaction = new PaymentTransaction(this._transaction_id++, cart.user.id, cart.user.name, -cart.totalSum());

        for(let item of cart.cart_items){
            transaction.transaction_items.push(
                new TransactionItem(this._transaction_item_id++, item.product_variant.product.id, item.product_variant.product.name, item.quantity, item.totalPrice())
            );
        }

        this._transactions.push(transaction);
        cart.user.balance -= cart.totalSum();

        return this.resolveWithLatency(transaction);;

    }

}