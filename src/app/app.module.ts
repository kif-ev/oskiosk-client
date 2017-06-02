import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';

// Bootstrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

// App components
import { AppComponent } from './app.component';
import {
  ProductListComponent,
  ProductEditComponent,
  UserListComponent,
  CashdeskComponent
} from "./components";

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductEditComponent,
    UserListComponent,
    CashdeskComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    RouterModule.forRoot([
      {
        path: 'products',
        component: ProductListComponent
      },
      {
        path: 'products/:id',
        component: ProductEditComponent
      },
      {
        path: 'users',
        component: UserListComponent
      },
      {
        path: 'cashdesk',
        component: CashdeskComponent
      }

    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
