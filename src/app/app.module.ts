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
  ProductImportComponent,
  UserListComponent,
  UserEditComponent,
  UserImportComponent,
  SalesPointComponent,
  CashPointComponent,
  SelfServicePointComponent,
  NavbarComponent,
  FlashMessageComponent,
  WaitIndicatorComponent,
  HomeComponent
} from "app/components";
import { ConfigService, FlashMessageService } from "app/services";


@NgModule({
  declarations: [
    AppComponent,
    ProductEditComponent,
    ProductListComponent,
    ProductImportComponent,
    UserEditComponent,
    UserListComponent,
    UserImportComponent,
    SalesPointComponent,
    CashPointComponent,
    SelfServicePointComponent,
    NavbarComponent,
    FlashMessageComponent,
    WaitIndicatorComponent,
    HomeComponent
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
        path: 'product/new',
        component: ProductEditComponent
      },
      {
        path: 'product/import',
        component: ProductImportComponent
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
        path: 'user/import',
        component: UserImportComponent
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
  providers: [BackendServiceProvider, ConfigService, FlashMessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
