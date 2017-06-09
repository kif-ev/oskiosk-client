import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { BackendService } from "./services/backend.service";
import { Product, Pricing, User, Identifiable, Cart, Identifier } from "./models";
import { KeyCode, KeyCodeMap } from "./utils";
import { serialize } from "class-transformer";

@Component({
    selector: 'navbar',
    templateUrl: './templates/navbar.html',
    providers: []
})
export class NavbarComponent{
    items = []; // ToDo: Dynamically populate the navbar
}

@Component({
    selector: 'product-list',
    templateUrl: './templates/product-list.html',
    providers: []
})
export class ProductListComponent implements OnInit{
    products: Product[];
    selectedProduct: Product;

    constructor(private backendService: BackendService) { }

    getProducts(): void {
        this.backendService.getProducts().subscribe(products => this.products = products);
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
    providers: []
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

    addIdentifier(): void {
        this.product.identifiers.push(new Identifier(''));
    }

    ngOnInit(): void {
        this.route.params
        .switchMap((params: Params) => this.backendService.getProduct(+params['id']))
        .subscribe(product => this.product = product);
    }

    goBack(): void {
        this.location.back();
    }

    save(): void {
        this.backendService.saveProduct(this.product)
        .subscribe(
            product => {},
            error => console.log(error)
        );
    }
}

@Component({
    selector: 'user-list',
    templateUrl: './templates/user-list.html',
    providers: []
})
export class UserListComponent implements OnInit{
    users: User[];
    filteredUsers: User[];
    _filter: string = '';

    get filter(): string {
        return this._filter;
    }

    set filter(value: string) {
        console.log(value);
        this._filter = value;
        this.filterUsers();
    }

    constructor(private backendService: BackendService) { }

    filterUsers(): void {
        this.filteredUsers = [];

        for(let user of this.users) {
            if(user.name.toLowerCase().includes(this._filter.toLowerCase())) {
                this.filteredUsers.push(user);
                continue;
            }
            for(let identifier of user.identifiers){
                //if(identifier.toLowerCase().includes(this._filter.toLowerCase())){
                //    this.filteredUsers.push(user);
                //    continue;
                //}
            }
        }
    }

    getUsers(): void {
        this.backendService.getUsers().subscribe(users => { this.users = users; this.filterUsers(); });
    }

    ngOnInit(): void {
        this.getUsers();
    }
}

@Component({
    selector: 'cashdesk',
    templateUrl: './templates/cashdesk.html',
    providers: []
})
export class CashdeskComponent implements OnInit, OnDestroy{
    identifierInput: string = '';
    cart: Cart;
    user: User;
    wait_identifier: boolean = false;
    wait_checkout: boolean = false;
    alert_barcode_not_found: boolean = false;

    constructor(
        private backendService: BackendService
    ) {
        this.cart = new Cart();
    }

    onKeyDownEvent(e: KeyboardEvent): void {
        let literal: string = KeyCodeMap.getLiteral(e.keyCode);
        if(literal){
            this.identifierInput = this.identifierInput.concat(literal);
            this.alert_barcode_not_found = false;
        }
        else if (e.keyCode == KeyCode.ENTER){
            if(this.identifierInput){
                this.confirmInput();
            }
            else {
                this.payCart();
            }
            
        }
        else if (e.keyCode == KeyCode.BACKSPACE){
            this.identifierInput = this.identifierInput.substr(0, this.identifierInput.length - 1)
        }
    }

    confirmInput(): void {
        this.wait_identifier = true;
        this.backendService.getItemByIdentifier(this.identifierInput)
            .subscribe(
                item => {
                    this.wait_identifier = false;
                    this.processItem(item)
                },
                error => {
                    this.wait_identifier = false;
                    this.alert_barcode_not_found = true;
                }
            );
        this.identifierInput = '';
    }

    processItem(item: Identifiable): void {
        if(item instanceof Product){
            this.cart.addToCart(item.name, item.pricings[0]); // hackedyhack ... select proper pricing instead
            this.updateCart();
        }
        else if(item instanceof User){
            this.user = item;
            this.cart.user_id = item.id;
            this.updateCart();
        }
    }

    increaseQuantity(pricing_id: number){
        this.cart.increaseQuantity(pricing_id);
        this.updateCart();
    }

    decreaseQuantity(pricing_id: number){
        this.cart.decreaseQuantity(pricing_id);
        this.updateCart();
    }

    updateCart(): void {
        this.backendService.createOrUpdateCart(this.cart).subscribe(
            cart => this.cart = cart,
            error => console.log(error)
        );
    }

    payCart(): void {
        this.wait_checkout = true;
        this.backendService.payCart(this.cart).subscribe(
            transaction => {
                this.wait_checkout = false;
                this.cart = new Cart();
                this.user = null;
            },
            error => console.log(error)
        );
    }

    abort(): void {
        this.cart = new Cart();
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

@Component({
    selector: 'depositstation',
    templateUrl: './templates/deposit-station.html',
    providers: []
})
export class DepositStationComponent implements OnInit, OnDestroy{
    identifierInput: string = '';
    user: User;
    wait_identifier: boolean = false;
    wait_checkout: boolean = false;
    alert_barcode_not_found_or_no_user: boolean = false;

    constructor(
        private backendService: BackendService
    ) {}

    onKeyDownEvent(e: KeyboardEvent): void {
        let literal: string = KeyCodeMap.getLiteral(e.keyCode);
        if(literal){
            this.identifierInput = this.identifierInput.concat(literal);
            this.alert_barcode_not_found_or_no_user = false;
        }
        else if (e.keyCode == KeyCode.ENTER && this.identifierInput){
            this.confirmInput();
        }
        else if (e.keyCode == KeyCode.BACKSPACE){
            this.identifierInput = this.identifierInput.substr(0, this.identifierInput.length - 1)
        }
    }

    confirmInput(): void {
        this.wait_identifier = true;
        this.backendService.getItemByIdentifier(this.identifierInput)
            .subscribe(
                item => {
                    this.wait_identifier = false;
                    this.processItem(item)
                },
                error => {
                    this.wait_identifier = false;
                    this.alert_barcode_not_found_or_no_user = true;
                }
            );
        this.identifierInput = '';
    }

    processItem(item: Identifiable): void {
        if(item instanceof Product){
            this.alert_barcode_not_found_or_no_user = true;
        }
        else if(item instanceof User){
            this.user = item;
            this.stopCaptureInput();
        }
    }

    deposit(amount: number): void {
        this.wait_checkout = true;
        this.backendService.deposit(this.user, amount).subscribe(
            transaction => {
                this.user = null;
                this.startCaptureInput();
                this.wait_checkout = false;
            },
            error => console.log(error)
        );
    }

    // Magic fat arrow to keep "this" reference intact
    keyEventProxy = (e: KeyboardEvent): void => {
        this.onKeyDownEvent(e);
    }
   
    startCaptureInput(): void {
        document.addEventListener('keydown', this.keyEventProxy, false);
    }

    stopCaptureInput(): void {
        document.removeEventListener('keydown', this.keyEventProxy, false);
    }

    ngOnInit(): void {
        this.startCaptureInput();
    }

    ngOnDestroy(): void {
        this.stopCaptureInput();
    }

}

@Component({
    selector: 'selfservice',
    templateUrl: './templates/selfservice.html',
    providers: []
})
export class SelfserviceComponent implements OnInit, OnDestroy{
    identifierInput: string = '';
    cart: Cart;
    user: User;
    wait_identifier: boolean = false;
    wait_checkout: boolean = false;
    alert_barcode_not_found: boolean = false;

    constructor(
        private backendService: BackendService
    ) {
        this.cart = new Cart();
    }

    onKeyDownEvent(e: KeyboardEvent): void {
        let literal: string = KeyCodeMap.getLiteral(e.keyCode);
        if(literal){
            this.identifierInput = this.identifierInput.concat(literal);
            this.alert_barcode_not_found = false;
        }
        else if (e.keyCode == KeyCode.ENTER){
            if(this.identifierInput){
                this.confirmInput();
            }
            else {
                this.payCart();
            }
            
        }
        else if (e.keyCode == KeyCode.BACKSPACE){
            this.identifierInput = this.identifierInput.substr(0, this.identifierInput.length - 1)
        }
    }

    confirmInput(): void {
        this.wait_identifier = true;
        this.backendService.getItemByIdentifier(this.identifierInput)
            .subscribe(
                item => {
                    this.wait_identifier = false;
                    this.processItem(item);
                },
                error => {
                    this.wait_identifier = false;
                    this.alert_barcode_not_found = true;
                }
            );
        this.identifierInput = '';
    }

    processItem(item: Identifiable): void {
        if(item instanceof Product){
            this.cart.addToCart(item.name, item.pricings[0]); // hackedyhack ... select proper pricing instead
            this.updateCart();
        }
        else if(item instanceof User){
            this.user = item;
            this.cart.user_id = item.id;
            this.updateCart();
        }
    }

    increaseQuantity(pricing_id: number){
        this.cart.increaseQuantity(pricing_id);
        this.updateCart();
    }

    decreaseQuantity(pricing_id: number){
        this.cart.decreaseQuantity(pricing_id);
        this.updateCart();
    }

    updateCart(): void {
        this.backendService.createOrUpdateCart(this.cart).subscribe(
            cart => this.cart = cart,
            error => console.log(error)
        );
    }

    payCart(): void {
        this.wait_checkout = true;
        this.backendService.payCart(this.cart).subscribe(
            transaction => {
                this.wait_checkout = false;
                this.cart = new Cart();
                this.user = null;
            },
            error => console.log(error)
        );
    }

    abort(): void {
        this.cart = new Cart();
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