import { Component, OnInit } from "@angular/core";

import { BackendService } from "app/services";
import { Product } from "app/models";

@Component({
    selector: 'product-list',
    templateUrl: '../templates/product-list.html',
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