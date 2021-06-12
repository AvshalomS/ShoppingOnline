import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// import components
import { LoginComponent } from "./components/users/login/login.component";
import { LogoutComponent } from "./components/users/logout/logout.component";
import { RegisterComponent } from "./components/users/register/register.component";

import { WellcomeComponent } from "./components/pages/wellcome/wellcome.component";
import { HomeComponent } from "./components/pages/home/home.component";
import { OrderComponent } from "./components/pages/order/order.component";

import { NotFound404Component } from "./components/pages/not-found404/not-found404.component";

// import guards
import { IsLoginGuard } from "./guards/is-login.guard";
import { IsUserGuard } from "./guards/is-user.guard";

const routes: Routes = [
  { path: "user/login", component: LoginComponent },
  {
    path: "user/logout",
    component: LogoutComponent,
    canActivate: [IsLoginGuard]
  },
  { path: "user/register", component: RegisterComponent },
  { path: "", component: WellcomeComponent },
  { path: "home", component: HomeComponent, canActivate: [IsLoginGuard] },
  { path: "order", component: OrderComponent, canActivate: [IsUserGuard] },
  { path: "**", component: NotFound404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
