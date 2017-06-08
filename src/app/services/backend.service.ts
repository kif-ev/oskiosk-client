import { Product, User, Identifiable, Cart, PaymentTransaction } from "../models";
import { Observable } from "rxjs/Observable";

export class BackendService{
    getProducts(): Observable<Product[]> {
        throw Error('Not implemented.');
    }
    
    getProduct(id: number): Observable<Product> {
        throw Error('Not implemented.');
    }
    
    getUsers(): Observable<User[]> {
        throw Error('Not implemented.');
    }
    
    getUser(id: number): Observable<User> {
        throw Error('Not implemented.');
    }
    
    getItemByIdentifier(identifier: string): Observable<Identifiable> {
        throw Error('Not implemented.');
    }
    
    payCart(cart: Cart): Observable<PaymentTransaction> {
        throw Error('Not implemented.');
    }
}
