import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FlashMessagesService } from "angular2-flash-messages";

import { Product, Identifier, Pricing, Tag } from "app/models";
import { BackendService } from "app/services";

@Component({
    selector: 'product-edit',
    templateUrl: '../templates/product-edit.html',
    providers: []
})
export class ProductEditComponent implements OnInit {

    product: Product;
    wait_save: boolean = false;

    constructor(
        private backend_service: BackendService,
        private flash_messages_service: FlashMessagesService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    addTag(): void {
        this.product.addTag(new Tag(''));
    }

    deleteTag(tag: Tag): void {
        this.product.deleteTag(tag);
    }

    addIdentifier(): void {
        this.product.addIdentifier(new Identifier(''));
    }

    deleteIdentifier(identifier: Identifier): void {
        this.product.deleteIdentifier(identifier);
    }

    addPricing(): void {
        this.product.addPricing(new Pricing(null, 0, 999999));
    }

    deletePricing(pricing: Pricing): void {
        this.product.deletePricing(pricing);
    }

    ngOnInit(): void {
        this.product = new Product(null, null);
        this.route
        .params
        .subscribe(paramMap => {
            let product_id = paramMap['id'];
            if(product_id){
                this.backend_service.getProduct(+product_id)
                .subscribe(
                    product => this.product = product,
                    error => this.flash_messages_service.show('Failed to load product!', { cssClass: 'alert-danger' })
                );
            }
        });
    }

    save(): void {
        this.wait_save = true;
        this.backend_service.saveProduct(this.product)
        .subscribe(
            product => {
                this.flash_messages_service.show('Product saved!', { cssClass: 'alert-success' });
                this.router.navigate(['/products']);
            },
            error => {
                this.flash_messages_service.show('Failed to save product!', { cssClass: 'alert-danger' });
                this.wait_save = false;
                console.log(error);
            }
        );
    }
}