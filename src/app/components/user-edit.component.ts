import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FlashMessagesService } from "angular2-flash-messages";

import { User, Tag, Identifier } from "app/models";
import { BackendService } from "app/services";

@Component({
    selector: 'user-edit',
    templateUrl: '../templates/user-edit.html',
    providers: []
})
export class UserEditComponent implements OnInit {

    private user: User;
    private wait_save: boolean = false;

    constructor(
        private backend_service: BackendService,
        private flashMessagesService: FlashMessagesService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    addTag(): void {
        this.user.addTag(new Tag(''));
    }

    deleteTag(tag: Tag): void {
        this.user.deleteTag(tag);
    }

    addIdentifier(): void {
        this.user.addIdentifier(new Identifier(''));
    }

    deleteIdentifier(identifier: Identifier): void {
        this.user.deleteIdentifier(identifier);
    }

    ngOnInit(): void {
        this.user = new User(null, null);
        this.route
        .params
        .subscribe(paramMap => {
            let user_id = paramMap['id'];
            if(user_id){
                this.backend_service.getUser(+user_id)
                .subscribe(
                    user => this.user = user,
                    error => this.flashMessagesService.show('Failed to load user!', { cssClass: 'alert-danger' })
                );
            }
        });
    }

    save(): void {
        this.wait_save = true;
        this.backend_service.saveUser(this.user)
        .subscribe(
            user => {
                this.flashMessagesService.show('User saved!', { cssClass: 'alert-success' });
                this.router.navigate(['/users']);
            },
            error => {
                this.flashMessagesService.show('Failed to save user!', { cssClass: 'alert-danger' });
                this.wait_save = false;
                console.log(error);
            }
        );
    }
}