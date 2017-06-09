import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';

import { AppComponent } from './app.component';
import { BackendServiceProvider } from "app/providers";
import { 
  ProductListComponent,
  ProductEditComponent,
  UserListComponent,
  SalesPointComponent,
  CashPointComponent,
  SelfServicePointComponent,
  NavbarComponent
} from "app/components";


@NgModule({
  declarations: [
    AppComponent,
    ProductEditComponent,
    ProductListComponent,
    UserListComponent,
    SalesPointComponent,
    CashPointComponent,
    SelfServicePointComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
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
        path: 'sales-point',
        component: SalesPointComponent
      },
      {
        path: 'cash-point',
        component: CashPointComponent
      },
      {
        path: 'self-service-point',
        component: SelfServicePointComponent
      }
    ])
  ],
  providers: [BackendServiceProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
