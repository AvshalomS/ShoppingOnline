import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import * as jsPDF from "jspdf";

import { UserService } from "../../../services/users/user.service";
import { ProductsService } from "../../../services/products/products.service";
import { CartAndOrdersService } from "../../../services/cartAndOrders/cart-and-orders.service";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.css"]
})
export class OrderComponent implements OnInit {
  private orderProcess = true;
  private orderForm;
  private user;
  private moreThen3;
  private dataToPdfExport;

  constructor(
    private cartAndOrdersService: CartAndOrdersService,
    private productsService: ProductsService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.user = this.userService.getUser();
    this.moreThen3 = false;
    this.orderForm = this.formBuilder.group({
      city: [this.user.city, Validators.compose([Validators.required])],
      street: [this.user.street, Validators.compose([Validators.required])],
      shippingDate: [null, Validators.compose([Validators.required])],
      creditCart: [
        1234123412341234,
        Validators.compose([
          Validators.required,
          Validators.pattern("[0-9]{16}$")
          // 1234 1234 1234 1234 invalid    1234123412341234 valid
        ])
      ]
    });
  }

  ngOnInit() {}
  setUserStreet() {
    this.orderForm.patchValue({ street: this.user.street });
    // console.log(this.orderForm.value);
  }
  setUserCity() {
    this.orderForm.patchValue({ city: this.user.city });
  }
  delErrorMessage() {
    this.moreThen3 = false;
  }
  order() {
    const cart = this.cartAndOrdersService.getCart();
    const order = this.orderForm.value;
    this.cartAndOrdersService
      .orderCartAction({ order, cart })
      .subscribe(data => {
        if (data.status === "moreThan3") {
          this.moreThen3 = true;
        } else {
          this.moreThen3 = false;
          // console.log(data);
          this.dataToPdfExport = data.cart;
          this.orderProcess = false;
          this.userService.isUserFinishOrder = true;
        }
      });
  }
  exportHtmlToPDF() {
    let doc = new jsPDF();
    let index = 20;
    // console.log(this.dataToPdfExport);

    doc.text(20, index, `Receipt`);
    index += 10;
    doc.text(
      20,
      index,
      `-------------------------------------------------------------------------------------`
    );
    index += 5;
    doc.text(20, index, `Product name`);
    doc.text(110, index, `Price`);
    doc.text(130, index, `Quantity`);
    doc.text(160, index, `Total`);
    index += 5;
    doc.text(
      20,
      index,
      `-------------------------------------------------------------------------------------`
    );

    this.dataToPdfExport.cartItems.map(item => {
      // console.log(item);
      index += 10;
      if (index % 280 === 0) {
        // Add new page
        doc.addPage();
        index = 20;
        doc.text(
          20,
          index,
          `-------------------------------------------------------------------------------------`
        );
        index += 5;
        doc.text(20, index, `Product name`);
        doc.text(110, index, `Price`);
        doc.text(130, index, `Quantity`);
        doc.text(160, index, `Total`);
        index += 5;
        doc.text(
          20,
          index,
          `-------------------------------------------------------------------------------------`
        );
        index += 10;
      }
      let name = item.productID.productName.slice(0, 30);
      let price = item.productID.productPrice;

      doc.text(20, index, `${name}`);
      doc.text(110, index, `${price}$`);
      doc.text(140, index, `${item.quantity}`);
      doc.text(160, index, `${price * item.quantity}$`);
    });
    index += 10;
    doc.text(
      20,
      index,
      `-------------------------------------------------------------------------------------`
    );
    index += 5;
    doc.text(130, index, `Total Price: ${this.dataToPdfExport.totalPrice}$`);

    // Save the PDF
    doc.save("Receipt.pdf");
  }
  backToWelcome() {
    this.userService.isUserFinishOrder = false;
    this.cartAndOrdersService.chackUserCartStatus(this.user._id);
    this.router.navigate([""]);
  }
}
