import { Product, User, Identifiable, Cart, PaymentTransaction, OskioskModel } from "../models";
import { BackendService } from "app/services/backend.service";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

export class OskioskBackendService extends BackendService{
    
    constructor(private http: Http, private api_url: string, private api_token: string){
        super();
    }
    
    private getDefaultRequestOptions(): RequestOptions {
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.api_token });
        return new RequestOptions({ headers: headers });
    }    

    private httpGet(url: string): Observable<Response> {
        return this.http.get(this.api_url + url, this.getDefaultRequestOptions())
    }

    private handleError (error: Response | any) {
        return Observable.throw('Error!');
    }

    extractProducts(res: Response): Product[] {
        let parsed_products = [];
        let raw_products = res.json();
        
        for(let product of raw_products){
            parsed_products.push(Product.fromOskiosk(product));
        }
        
        return parsed_products;
    }

    extractProduct(res: Response): Product {
        let raw_product = res.json();
        return Product.fromOskiosk(raw_product);
    }
    
    getProducts(): Observable<Product[]> {
        return this.httpGet('/products.json')
        .map(this.extractProducts)
        .catch(this.handleError);
    }
    
    getProduct(id: number): Observable<Product> {
        return this.httpGet('/products/' + id + '.json')
        .map(this.extractProduct)
        .catch(this.handleError);
    }
    
    getUsers(): Observable<User[]> {
        return this.httpGet('/users.json')
        .map((res: Response) => User.fromOskioskMany(res.json()))
        .catch(this.handleError);
    }
    
    getUser(id: number): Observable<User> {
        return this.httpGet('/users/' + id + '.json')
        .map(this.extractUser)
        .catch(this.handleError);
    }
    
    getItemByIdentifier(identifier: string): Observable<Identifiable> {
        throw Error('Not implemented.');
    }
    
    payCart(cart: Cart): Observable<PaymentTransaction> {
        throw Error('Not implemented.');
    }
}
