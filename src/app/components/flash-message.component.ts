import { Component, Input, OnInit } from "@angular/core";
import { FlashMessage, FlashMessageService } from "app/services"

@Component({
    selector: 'flash-messages',
    templateUrl: '../templates/flash-messages.html',
    providers: []
})
export class FlashMessageComponent implements OnInit{
    flashMessages: FlashMessage[];

    constructor(private flashMessageService: FlashMessageService) {}

    ngOnInit() {
        this.flashMessages = this.flashMessageService.getFlashMessages();
    }
}
