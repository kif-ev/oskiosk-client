import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';
import { FlashMessagesModule } from 'angular2-flash-messages';

import { AppComponent } from './app.component';
import { BackendServiceProvider } from "app/providers";
import { 
  ProductListComponent,
  ProductEditComponent,
  UserListComponent,
  UserEditComponent,
  SalesPointComponent,
  CashPointComponent,
  SelfServicePointComponent,
  NavbarComponent,
  HomeComponent
} from "app/components";
import { ConfigService } from "app/services";


@NgModule({
  declarations: [
    AppComponent,
    ProductEditComponent,
    ProductListComponent,
    UserEditComponent,
    UserListComponent,
    SalesPointComponent,
    CashPointComponent,
    SelfServicePointComponent,
    NavbarComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FlashMessagesModule,
    RouterModule.forRoot([
      {
        path: 'products',
        component: ProductListComponent
      },
      {
        path: 'product/new',
        component: ProductEditComponent
      },
      {
        path: 'product/:id',
        component: ProductEditComponent
      },
      {
        path: 'users',
        component: UserListComponent
      },
      {
        path: 'user/new',
        component: UserEditComponent
      },
      {
        path: 'user/:id',
        component: UserEditComponent
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
      },
      {
        path: '**',
        component: HomeComponent
      }
    ])
  ],
  providers: [BackendServiceProvider, ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
