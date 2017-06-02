import { Injectable } from '@angular/core';

import { Identifiable, Product, ProductVariant, User } from "./models";

export interface AbstractBackend{
    getProducts(): Promise<Product[]>;
}

export class LocalTestingBackend implements AbstractBackend{
    _products = [
        new Product(1, 'Club Mate', ['drink']),
        new Product(2, 'fritz Cola', ['drink'])
    ];
    _variants = [
        new ProductVariant(1, this._products[0], '1234', 70),
        new ProductVariant(2, this._products[1], '1337', 100)
    ];
    _users = [
        new User(1, 'Darth Vader',1000, '8888'),
        new User(2, 'Dagobert Duck',99999999, '9999')
    ];

    getProducts(): Promise<Product[]> {
        return Promise.resolve(this._products);
    }

    getProduct(id: number): Promise<Product> {
        for(let product of this._products){
            if(product.id == id)
                return Promise.resolve(product);
        }
        return Promise.reject(new Error('Product with specified ID not found.'));
    }

    getUsers(): Promise<User[]> {
        return Promise.resolve(this._users);
    }

    getUser(id: number): Promise<User> {
        for(let user of this._users){
            if(user.id == id)
                return Promise.resolve(user);
        }
        return Promise.reject(new Error('User with specified ID not found.'));
    }

    getItemByIdentifier(identifier: string): Promise<Identifiable> {

        for(let variant of this._variants){
            if(variant.identifier == identifier)
                return Promise.resolve(variant);
        }

        for(let user of this._users){
            if(user.identifier == identifier)
                return Promise.resolve(user);
        }

        return Promise.reject(new Error('No item with the specified identifier exists.'));
    }

}

@Injectable()
export class BackendService {
    _backend = new LocalTestingBackend();
    
    getProducts(): Promise<Product[]> {
        return this._backend.getProducts();
    }

    getProduct(id: number): Promise<Product> {
        return this._backend.getProduct(id);
    }

    getUsers(): Promise<User[]> {
        return this._backend.getUsers();
    }

    getUser(id: number): Promise<User> {
        return this._backend.getUser(id);
    }

    getItemByIdentifier(identifier: string): Promise<Identifiable> {
        return this._backend.getItemByIdentifier(identifier);
    }
}