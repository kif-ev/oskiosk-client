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
  CashdeskComponent,
  DepositStationComponent,
  NavbarComponent,
  SelfserviceComponent
} from "./components";

// App providers
import { BackendServiceProvider } from "app/providers/backend-service.provider";



@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductEditComponent,
    UserListComponent,
    CashdeskComponent,
    DepositStationComponent,
    SelfserviceComponent,
    NavbarComponent
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
      },
      {
        path: 'deposit',
        component: DepositStationComponent
      },
      {
        path: 'selfservice',
        component: SelfserviceComponent
      }
    ])
  ],
  providers: [BackendServiceProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
