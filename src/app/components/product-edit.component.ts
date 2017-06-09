import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";

import { Product, Identifier } from "app/models";
import { BackendService } from "app/services";

import "rxjs/add/operator/switchMap"


@Component({
    selector: 'product-edit',
    templateUrl: '../templates/product-edit.html',
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

    save(): void {
        this.backendService.saveProduct(this.product)
        .subscribe(
            product => {},
            error => console.log(error)
        );
    }
}