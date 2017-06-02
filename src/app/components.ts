import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { BackendService } from "./backend";
import { Product, ProductVariant, User, Identifiable, Cart } from "./models";
import { KeyCode, KeyCodeMap } from "./utils";

@Component({
    selector: 'product-list',
    templateUrl: './templates/product-list.html',
    providers: [BackendService]
})
export class ProductListComponent implements OnInit{
    products: Product[];
    selectedProduct: Product;

    constructor(private backendService: BackendService) { }

    getProducts(): void {
        this.backendService.getProducts().then(products => this.products = products);
    }

    onSelect(product: Product): void {
        this.selectedProduct = product;
    }

    ngOnInit(): void {
        this.getProducts();
    }
}

@Component({
    selector: 'product-detail',
    templateUrl: './templates/product-edit.html',
    providers: [BackendService]
})
export class ProductEditComponent implements OnInit{
    product: Product;

    constructor(
        private backendService: BackendService,
        private route: ActivatedRoute,
        private location: Location
    ) { }

    addTag(): void {
        this.product.tags.push('');
    }

    ngOnInit(): void {
        this.route.params
        .switchMap((params: Params) => this.backendService.getProduct(+params['id']))
        .subscribe(product => this.product = product);
    }

    goBack(): void {
        this.location.back();
    }
}

@Component({
    selector: 'user-list',
    templateUrl: './templates/user-list.html',
    providers: [BackendService]
})
export class UserListComponent implements OnInit{
    users: User[];

    constructor(private backendService: BackendService) { }

    getUsers(): void {
        this.backendService.getUsers().then(users => this.users = users);
    }

    ngOnInit(): void {
        this.getUsers();
    }
}

@Component({
    selector: 'cashdesk',
    templateUrl: './templates/cashdesk.html',
    providers: [BackendService]
})
export class CashdeskComponent implements OnInit, OnDestroy{
    identifierInput: string = '';
    cart: Cart;

    constructor(
        private backendService: BackendService
    ) {
        this.cart = new Cart();
    }

    onKeyDownEvent(e: KeyboardEvent): void {
        let literal: string = KeyCodeMap.getLiteral(e.keyCode);
        if(literal){
            this.identifierInput = this.identifierInput.concat(literal);
        }
        else if (e.keyCode == KeyCode.ENTER){
            this.confirmInput();
        }
    }

    confirmInput(): void {
        this.backendService.getItemByIdentifier(this.identifierInput).then(item => this.processItem(item));
        this.identifierInput = '';
    }

    processItem(item: Identifiable): void {
        if(item instanceof ProductVariant){
            this.cart.addToCart(item);
        }
    }

    // Magic fat arrow to keep "this" reference intact
    keyEventProxy = (e: KeyboardEvent): void => {
        this.onKeyDownEvent(e);
    }
   
    ngOnInit(): void {
        document.addEventListener('keydown', this.keyEventProxy, false);
    }

    ngOnDestroy(): void {
        document.removeEventListener('keydown', this.keyEventProxy, false);
    }

}