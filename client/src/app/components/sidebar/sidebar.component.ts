import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { UserService } from "../../services/users/user.service";
import { CartAndOrdersService } from "../../services/cartAndOrders/cart-and-orders.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router,
    private cartAndOrdersService: CartAndOrdersService
  ) {
    // User UI
    this.userService.isUserShopping = false;
    // Admin UI
    this.userService.adminNewProduct = false;
    this.userService.adminEditProduct = false;
  }
  ngOnInit() {}
  // User ----------------------------------------------------------------------------------------------->
  startShopping() {
    const user: any = this.userService.getUser();
    if (this.cartAndOrdersService.openNewCart) {
      this.cartAndOrdersService.openNewCartAction(user._id).subscribe(data => {
        this.cartAndOrdersService.shoppingCart = data.isInsert;
        this.cartAndOrdersService.openNewCart = false;
        this.router.navigate(["/home"]);
        this.userService.isUserShopping = true;
      });
    } else {
      this.router.navigate(["/home"]);
      this.userService.isUserShopping = true;
    }
  }
  deleteMe(itemPlace) {
    this.cartAndOrdersService.deleteFromCart(itemPlace);
  }
  order() {
    this.userService.isUserShopping = false;
    this.cartAndOrdersService.startShoppingButtonText = "Back to shop";
    this.router.navigate(["/order"]);
  }
  // Admin ---------------------------------------------------------------------------------------------->
  addNewProduct() {
    // Admin UI
    this.userService.adminNewProduct = true;
    this.userService.adminEditProduct = false;
  }
}
