import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/users/user.service";
import { ProductsService } from "../../services/products/products.service";
import { CartAndOrdersService } from "../../services/cartAndOrders/cart-and-orders.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  public showSideNav: boolean;
  constructor(
    private userService: UserService,
    private productsService: ProductsService,
    private cartAndOrdersService: CartAndOrdersService
  ) {
    this.showSideNav = false;
  }

  ngOnInit() {
    this.productsService.getProductCategoryList().subscribe(data => {
      this.productsService.productCategoryList = data;

      this.productsService.selectedCategory = this.productsService.productCategoryList[0].name;
    });
  }
  search() {
    this.productsService.selectedCategory = this.productsService.productCategoryList[5].name;
    this.productsService.getAllProducts().subscribe(data => {
      const products = data.map(product => {
        product.productPicture =
          this.productsService.imgUrl + product.productPicture;
        return product;
      });
      this.productsService.productsByCategory = products;
    });
  }

  toggleSidebar() {
    this.showSideNav = !this.showSideNav;
  }
  logout() {
    sessionStorage.removeItem("token");
    this.userService.isRegister = false;
    this.userService.isLogin = false;
    this.userService.setRole("Guest");
    this.userService.setUserName("Guest");
    this.userService.isUserShopping = false;
    this.cartAndOrdersService.wellcomeMessage = null;
  }
}
