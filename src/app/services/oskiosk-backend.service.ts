import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { deserialize, deserializeArray, serialize } from "class-transformer";

import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { Product, User, Identifiable, Cart, PaymentTransaction, Transaction } from "app/models";
import { BackendService } from "./backend.service";

export class OskioskBackendService extends BackendService{

    private activeRequestCount: number = 0;
    private requestActive: BehaviorSubject<boolean> = new BehaviorSubject(false);
    
    constructor(private http: Http, private api_url: string, private api_token: string){
        super();
    }

    private onRequestStart() {
        this.activeRequestCount++;
        this.requestActive.next(true);
        console.log(this.activeRequestCount)
    }

    private onRequestEnd() {
        this.activeRequestCount--;
        if(this.activeRequestCount == 0) {
            this.requestActive.next(false);
        }
        console.log(this.activeRequestCount)
    }
    
    private getDefaultRequestOptions(): RequestOptions {
        let headers = new Headers({
            'Authorization': 'Bearer ' + this.api_token,
            'Content-Type': 'application/json'
        });
        return new RequestOptions({ headers: headers });
    }

    private httpGet(url: string): Observable<Response> {
        this.onRequestStart();
        return this.http.get(this.api_url + url, this.getDefaultRequestOptions())
            .finally(() => this.onRequestEnd());
    }

    private httpPost(url: string, data: string): Observable<Response> {
        this.onRequestStart();
        return this.http.post(this.api_url + url, data, this.getDefaultRequestOptions())
            .finally(() => this.onRequestEnd());
    }

    private httpPatch(url: string, data: string): Observable<Response> {
        this.onRequestStart();
        return this.http.patch(this.api_url + url, data, this.getDefaultRequestOptions())
            .finally(() => this.onRequestEnd());
    }

    private handleError (error: Response | any) {
        console.log(error);
        return Observable.throw('Error!');
    }

    private handleIdentifierResponse(res: Response) {
        let json = res.json();
        if(json['type'] == 'user'){
            return deserializeArray(User, res.text());
        }
        else if(json['type'] == 'product'){
            return deserializeArray(Product, res.text());
        }
    }

    getRequestActive(): BehaviorSubject<boolean> {
        return this.requestActive;
    }

    getProducts(): Observable<Product[]> {
        return this.httpGet('/products.json')
        .map((res: Response) => { return deserializeArray(Product, res.text()); })
        .catch(this.handleError);
    }
    
    getProduct(id: number): Observable<Product> {
        return this.httpGet('/products/' + id + '.json')
        .map((res: Response) => { return deserialize(Product, res.text()); })
        .catch(this.handleError);
    }
    
    getUsers(): Observable<User[]> {
        return this.httpGet('/users.json')
        .map((res: Response) => { return deserializeArray(User, res.text()); })
        .catch(this.handleError);
    }
    
    getUser(id: number): Observable<User> {
        return this.httpGet('/users/' + id + '.json')
        .map((res: Response) => { return deserialize(User, res.text()); })
        .catch(this.handleError);
    }
    
    getItemByIdentifier(identifier: string): Observable<Identifiable> {
        return this.httpGet('/identifiers/' + identifier + '.json')
        .map(this.handleIdentifierResponse)
        .catch(this.handleError);
    }
    
    payCart(cart: Cart): Observable<PaymentTransaction> {
        return this.httpPost('/carts/' + cart.id + '/pay.json', JSON.stringify({'lock_version': cart.lock_version}))
        .map((res: Response) => { return deserialize(PaymentTransaction, res.text()); })
        .catch(this.handleError);
    }

    private patchProduct(product: Product): Observable<Response> {
        return this.httpPatch('/products/' + product.id + '.json', serialize(product));
    }

    private postProduct(product: Product): Observable<Response> {
        return this.httpPost('/products', serialize(product));
    }

    saveProduct(product: Product): Observable<Product> {
        let observable: Observable<Response>;
        if(product.id){
            observable = this.patchProduct(product);
        }
        else {
            observable = this.postProduct(product);
        }
        return observable
        .map((res: Response) => { return deserialize(Product, res.text()); })
        .catch(this.handleError);
    }

    private patchUser(user: User): Observable<Response> {
        return this.httpPatch('/users/' + user.id + '.json', serialize(user));
    }

    private postUser(user: User): Observable<Response> {
        return this.httpPost('/users', serialize(user));
    }

    saveUser(user: User): Observable<User> {
        let observable: Observable<Response>;
        if(user.id){
            observable = this.patchUser(user);
        }
        else {
            observable = this.postUser(user);
        }
        return observable
        .map((res: Response) => { return deserialize(User, res.text()); })
        .catch(this.handleError);
    }

    createOrUpdateCart(cart: Cart): Observable<Cart> {
        let observable: Observable<Response>;
        if(cart.id){
            observable = this.httpPatch('/carts/' + cart.id + '.json', serialize(cart))
        }
        else {
            observable = this.httpPost('/carts.json', serialize(cart))
        }
        return observable
        .map((res: Response) => { return deserialize(Cart, res.text()); })
        .catch(this.handleError);
    }

    deposit(user: User, amount: number): Observable<Transaction> {
        return this.httpPost('/users/' + user.id + '/deposit.json', JSON.stringify({'amount': amount}))
        .map((res: Response) => { return deserialize(Transaction, res.text()); })
        .catch(this.handleError);
    }
}
