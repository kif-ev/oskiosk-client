import { Component, OnInit, OnDestroy } from "@angular/core";

import { Cart, User, Identifiable, Product } from "app/models";
import { GlobalInput, KeyCode } from "app/utils";
import { BackendService } from "app/services";

@Component({
    selector: 'sales-point',
    templateUrl: '../templates/sales-point.html',
    providers: []
})
export class SalesPointComponent extends GlobalInput implements OnInit, OnDestroy{
    identifier_input: string = '';
    cart: Cart;
    user: User;
    wait_identifier: boolean = false;
    wait_checkout: boolean = false;
    alert_barcode_not_found: boolean = false;

    constructor(
        private backend_service: BackendService
    ) {
        super();
        this.cart = new Cart();
    }

    ngOnInit(): void {
        this.startCaptureInput();
    }

    ngOnDestroy(): void {
        this.stopCaptureInput();
    }

    onLiteralInput(literal: string): void {
        this.identifier_input += literal;
        this.alert_barcode_not_found = false;
    }

    onSpecialKeyInput(keyCode: number): void {
        switch(keyCode){
            case KeyCode.ENTER:
                this.identifier_input ? this.confirmInput() : this.payCart();
                break;
            case KeyCode.BACKSPACE:
                this.identifier_input = this.identifier_input.slice(0, -1);
                break;
        }
    }

    confirmInput(): void {
        this.wait_identifier = true;
        this.backend_service.getItemByIdentifier(this.identifier_input)
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
        this.identifier_input = '';
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
        this.backend_service.createOrUpdateCart(this.cart).subscribe(
            cart => this.cart = cart,
            error => console.log(error)
        );
    }

    payCart(): void {
        this.wait_checkout = true;
        this.backend_service.payCart(this.cart).subscribe(
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
        this.user = null;
    }
}