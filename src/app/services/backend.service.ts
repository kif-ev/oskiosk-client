import { Product, User, Identifiable, Cart, PaymentTransaction } from "../models";

export class BackendService{
    getProducts(): Promise<Product[]> {
        throw Error('Not implemented.');
    }
    
    getProduct(id: number): Promise<Product> {
        throw Error('Not implemented.');
    }
    
    getUsers(): Promise<User[]> {
        throw Error('Not implemented.');
    }
    
    getUser(id: number): Promise<User> {
        throw Error('Not implemented.');
    }
    
    getItemByIdentifier(identifier: string): Promise<Identifiable> {
        throw Error('Not implemented.');
    }
    
    payCart(cart: Cart): Promise<PaymentTransaction> {
        throw Error('Not implemented.');
    }
}
