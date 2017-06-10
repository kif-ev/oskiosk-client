import { BackendService } from "./backend.service";
import { Product, Pricing, User, Identifiable, Identifier, PaymentTransaction, Cart, TransactionItem, Tag } from "app/models";
import { Observable } from "rxjs/Observable";

import 'rxjs/add/observable/from';

export class LocalBackendService extends BackendService {
    private _product_id: number = 1;
    private _user_id: number = 1;
    private _pricing_id: number = 1;
    private _transaction_id: number = 1;
    private _transaction_item_id: number = 1;
    _latency_simulation = 1000;

    _products: Product[] = [
        new Product(this._product_id++, 'Club Mate', [new Tag('drink')], [new Identifier('1234')], [new Pricing(this._pricing_id++, 70)]),
        new Product(this._product_id++, 'fritz Cola', [new Tag('drink')], [new Identifier('1337')], [new Pricing(this._pricing_id++, 100)])
    ];
    _users: User[] = [
        new User(this._user_id++, 'Darth Vader',1000, [new Tag('not-a-jedi')], [new Identifier('8888')]),
        new User(this._user_id++, 'Dagobert Duck',99999999, [new Tag('greedy')], [new Identifier('9999')])
    ];
    _transactions = [];

    resolveWithLatencyPromise(value): Promise<object> {
        return new Promise(resolve => {
            setTimeout(() => resolve(value), this._latency_simulation);
        });
    }

    makeObservable(value): Observable<object> {
        return Observable.from(value);
    }

    getProducts(): Observable<Product[]> {
        return this.makeObservable(this._products);
    }

    getProduct(id: number): Observable<Product> {
        for(let product of this._products){
            if(product.id == id)
                return this.makeObservable(product);
        }
        return Observable.throw('Product with specified ID not found.');
    }

    getUsers(): Observable<User[]> {
        return this.makeObservable(this._users);
    }

    getUser(id: number): Observable<User> {
        for(let user of this._users){
            if(user.id == id)
                return this.makeObservable(user);
        }
        return Observable.throw('User with specified ID not found.');
    }

    getItemByIdentifier(identifier: string): Observable<Identifiable> {
        /*
        for(let product of this._products){
            if(product.identifiers.includes(identifier))
                return this.makeObservable(product);
        }

        for(let user of this._users){
            if(user.identifiers.includes(identifier))
                return this.makeObservable(user);
        }
        */

        return Observable.throw('No item with the specified identifier exists.');
    }

    payCart(cart: Cart): Observable<PaymentTransaction> {
        if(!cart.user_id){
            return Observable.throw('Cannot pay for a cart when the user is not specified.');
        }
        if(cart.isEmpty()){
            return Observable.throw('Cannot pay for a cart which is empty.');
        }

        // let transaction = new PaymentTransaction(this._transaction_id++, cart.user_id, cart.user.name, -cart.totalSum());

        for(let item of cart.cart_items){
            // transaction.transaction_items.push(
                // new TransactionItem(this._transaction_item_id++, item.product.id, item.product.name, item.quantity, item.totalPrice())
            //);
        }

        // this._transactions.push(transaction);
        // cart.user.balance -= cart.totalSum();

        // return this.makeObservable(transaction);

    }

}