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
    deposit_custom: number;
    withdraw_custom: number;

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
                    //this.flash_messages_service.show('Unkown barcode.', { cssClass: 'alert-danger' });
                }
            );
        this.identifier_input = '';
    }

    processItem(item: Identifiable): void {
        if(item instanceof Product){
            //this.flash_messages_service.show('This is not a user barcode.', { cssClass: 'alert-danger' });
        }
        else if(item instanceof User){
            this.user = item;
            this.stopCaptureInput();
        }
    }

    deposit(amount: number): void {
        if(!amount) {
            //this.flash_messages_service.show('Please specify the transaction amount!', { cssClass: 'alert-warning' });
            return;
        }
        this.wait_checkout = true;
        this.backend_service.deposit(this.user, amount).subscribe(
            transaction => {
                //this.flash_messages_service.show('Transaction created!', { cssClass: 'alert-success' });
                this.wait_checkout = false;
                this.reset();
            },
            error => {
                //this.flash_messages_service.show('Failed to create the transaction!', { cssClass: 'alert-danger' });
                console.log(error);
            }
        );
    }

    abort(): void {
        //this.flash_messages_service.show('Transaction aborted.', { cssClass: 'alert-warning' });
        this.reset();
    }

    reset(): void {
        this.deposit_custom = null;
        this.withdraw_custom = null;
        this.user = null;
        this.startCaptureInput();
    }
}
