import { Component } from "@angular/core";

@Component({
    selector: 'navbar',
    templateUrl: '../templates/navbar.html',
    providers: []
})
export class NavbarComponent{
    items = []; // ToDo: Dynamically populate the navbar
}