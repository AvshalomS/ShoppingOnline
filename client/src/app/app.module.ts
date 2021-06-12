import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";

// Components
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/users/login/login.component";
import { LogoutComponent } from "./components/users/logout/logout.component";
import { RegisterComponent } from "./components/users/register/register.component";
import { WellcomeComponent } from "./components/pages/wellcome/wellcome.component";
import { HomeComponent } from "./components/pages/home/home.component";
import { NotFound404Component } from "./components/pages/not-found404/not-found404.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { OrderComponent } from "./components/pages/order/order.component";
import { NewProductComponent } from "./components/pages/new-product/new-product.component";
import { EditProductComponent } from "./components/pages/edit-product/edit-product.component";

// Services
import { UserService } from "./services/users/user.service";
import { ProductsService } from "./services/products/products.service";
import { CartAndOrdersService } from "./services/cartAndOrders/cart-and-orders.service";

// Sidebar
import { SidebarModule } from "ng-sidebar";
import { SidebarComponent } from "./components/sidebar/sidebar.component";

// Interceptor (send token)
import { HttpInterceptorService } from "./services/http-interceptor/http-interceptor.service";

// Search Pipe
import { SearchPipe } from "./pipes/search/search.pipe";

// Guards
import { IsLoginGuard } from "./guards/is-login.guard";
import { IsUserGuard } from "./guards/is-user.guard";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    WellcomeComponent,
    HomeComponent,
    NotFound404Component,
    NavbarComponent,
    SidebarComponent,
    NewProductComponent,
    OrderComponent,
    EditProductComponent,
    SearchPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule.forRoot()
  ],
  providers: [
    UserService,
    ProductsService,
    CartAndOrdersService,
    {
      useClass: HttpInterceptorService,
      provide: HTTP_INTERCEPTORS,
      multi: true
    },
    IsLoginGuard,
    IsUserGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
