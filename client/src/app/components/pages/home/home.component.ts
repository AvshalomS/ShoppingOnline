import { Component, OnInit } from "@angular/core";
import { CartAndOrdersService } from "../../../services/cartAndOrders/cart-and-orders.service";
import { ProductsService } from "../../../services/products/products.service";
import { UserService } from "../../../services/users/user.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  public _opened: boolean = false;
  public editOrSelect: string = "";
  // Add product to cart - Modal
  private showModal: boolean;
  private content: string;
  private title: string;
  private quantity: string;
  private cartItem;

  constructor(
    private productsService: ProductsService,
    private userService: UserService,
    private cartAndOrdersService: CartAndOrdersService
  ) {}

  ngOnInit() {
    this.productsService.getProductCategoryList().subscribe(data => {
      this.productsService.productCategoryList = data;

      this.productsService.selectedCategory = this.productsService.productCategoryList[0].name;
      this.getProductsByCategory(
        this.productsService.productCategoryList[0]._id
      );
    });
    this.getAllProducts();
    if (this.userService.getRole() === "Admin") this.editOrSelect = "Edit";
    if (this.userService.getRole() === "user") {
      this.editOrSelect = "Buy";
    }
  }
  // Side bar & products categories ----------------------------------------------------------------
  public _toggleSidebar() {
    this._opened = !this._opened;
  }
  isSelectedCategory(category) {
    return this.productsService.selectedCategory === category;
  }
  selectCategory(category) {
    this.productsService.selectedCategory = category.name;
    this.getProductsByCategory(category._id);
  }
  // Get products ----------------------------------------------------------------------------------
  getAllProducts() {
    this.productsService.getAllProducts().subscribe(data => {
      this.productsService.allProducts = data;
    });
  }
  getProductsByCategory(category) {
    this.productsService.getProductsByCategory(category).subscribe(data => {
      const products = data.map(product => {
        product.productPicture =
          this.productsService.imgUrl + product.productPicture;
        return product;
      });
      this.productsService.productsByCategory = products;
    });
  }
  selectProduct(product) {
    const { _id, productName, productPrice } = product;

    if (this.userService.getRole() === "user") {
      this.showModal = true; // Show Modal
      this.title = productName; // Modal title
      this.content = productPrice; // Product price
      this.cartItem = { productID: _id };
    }
    if (this.userService.getRole() === "Admin") {
      // Use at edit component
      this.productsService.selectedProduct = product;
      this.productsService.productFromHome = true;

      // Admin UI
      this.userService.adminNewProduct = false;
      this.userService.adminEditProduct = true;
    }
  }
  // Modal -----------------------------------------------------------------------------------------
  //Bootstrap Modal Open event
  show() {
    this.showModal = true; // Show-Hide Modal Check
    this.content = "This is content!!"; // Dynamic Data
    this.title = "This is title!!"; // Dynamic Data
  }
  // Add item to cart
  addToCart() {
    const quantity = Number(this.quantity);

    if (quantity > 0) {
      const cart: any = this.cartAndOrdersService.getCart();

      this.cartAndOrdersService.addToCart({
        productID: this.cartItem.productID,
        quantity,
        shoppingCartID: cart._id
      });
    }
    this.quantity = null;
    this.showModal = false;
  }
  //Bootstrap Modal Close event
  hide() {
    this.showModal = false;
    this.quantity = null;
  }
}
