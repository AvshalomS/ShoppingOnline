import { Component, OnInit } from "@angular/core";

import { CartAndOrdersService } from "../../../services/cartAndOrders/cart-and-orders.service";
import { ProductsService } from "../../../services/products/products.service";
import { WELCOME_IMG } from "../../../config/config";

@Component({
  selector: "app-wellcome",
  templateUrl: "./wellcome.component.html",
  styleUrls: ["./wellcome.component.css"]
})
export class WellcomeComponent implements OnInit {
  title = "Shopping site";
  welcomeImg: string;

  constructor(
    private cartAndOrdersService: CartAndOrdersService,
    private productsService: ProductsService
  ) {
    this.welcomeImg = WELCOME_IMG;
    this.productsService.setNumOfProducts();
    this.cartAndOrdersService.setNumOfOrders();
  }
  ngOnInit() {}
}
