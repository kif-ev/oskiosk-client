import { Component, OnInit, OnDestroy } from "@angular/core";

import { GlobalInput, KeyCode } from "app/utils";
import { BackendService } from "app/services";
import { User, Identifiable, Product } from "app/models";

@Component({
    selector: 'cash-point',
    templateUrl: '../templates/cash-point.html',
    providers: []
})
export class CashPointComponent extends GlobalInput implements OnInit, OnDestroy{
    identifier_input: string = '';
    user: User;
    wait_identifier: boolean = false;
    wait_checkout: boolean = false;
    alert_barcode_not_found_or_no_user: boolean = false;

    constructor(
        private backend_service: BackendService
    ) {
        super();
    }

    ngOnInit(): void {
        this.startCaptureInput();
    }

    ngOnDestroy(): void {
        this.stopCaptureInput();
    }

    onLiteralInput(literal: string){
        this.identifier_input += literal;
        this.alert_barcode_not_found_or_no_user = false;
    }

    onSpecialKeyInput(keyCode: number): void {
        switch(keyCode){
            case KeyCode.ENTER:
                if (this.identifier_input) this.confirmInput();
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
                    this.alert_barcode_not_found_or_no_user = true;
                }
            );
        this.identifier_input = '';
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
        this.backend_service.deposit(this.user, amount).subscribe(
            transaction => {
                this.user = null;
                this.startCaptureInput();
                this.wait_checkout = false;
            },
            error => console.log(error)
        );
    }

    abort(): void {
        this.user = null;
        this.startCaptureInput();
    }
}