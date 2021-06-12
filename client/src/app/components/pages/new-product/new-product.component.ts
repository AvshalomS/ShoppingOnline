import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

import { Product } from "../../../models/product";
import { UserService } from "../../../services/users/user.service";
import { ProductsService } from "../../../services/products/products.service";

@Component({
  selector: "app-new-product",
  templateUrl: "./new-product.component.html",
  styleUrls: ["./new-product.component.css"]
})
export class NewProductComponent implements OnInit {
  public newProductForm;
  public categories = [];
  public product = new Product();
  private productPictureLabel = "Add a picture";

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private productsService: ProductsService
  ) {
    this.productsService.getProductCategoryList().subscribe(data => {
      this.productsService.productCategoryList = data;
      this.categories = this.productsService.productCategoryList;
    });
    this.newProductForm = this.formBuilder.group({
      productName: [null],
      productPrice: [null],
      productPicture: [null],
      productCategory: [null, Validators.compose([Validators.required])]
    });
  }
  ngOnInit() {}
  preventNegativePrice() {
    if (this.newProductForm.value.productPrice < 0)
      this.newProductForm.patchValue({
        productPrice: 0
      });
  }
  closeButton() {
    // clean form fields
    this.newProductForm.reset({
      productName: "",
      productPrice: "",
      productCategory: ""
    });
    this.productPictureLabel = "Add a picture";
    // Admin UI
    this.userService.adminNewProduct = false;
    this.userService.adminEditProduct = false;
  }
  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    file
      ? (this.productPictureLabel = file.name)
      : (this.productPictureLabel = "Add a picture");
    this.newProductForm.patchValue({ productPicture: file });
    this.newProductForm.get("productPicture").updateValueAndValidity();
  }
  addProduct() {
    // console.log(this.newProductForm.value);

    this.productsService.saveNewProduct(this.newProductForm.value).subscribe(
      data => {
        // products -------------------------------------------------------------------------------------
        // get all products
        this.productsService.getAllProducts().subscribe(data => {
          this.productsService.allProducts = data;
        });
        // get all products by category (and add img path)
        const category = data.product.productCategory;
        this.productsService.getProductsByCategory(category).subscribe(data => {
          const products = data.map(product => {
            product.productPicture =
              this.productsService.imgUrl + product.productPicture;
            return product;
          });
          this.productsService.productsByCategory = products;

          // category, form & UI ------------------------------------------------------------------------
          // set selected category
          this.productsService.selectedCategory = data[0].productCategory.name;
          // clean form fields
          this.newProductForm.reset({
            productName: "",
            productPrice: "",
            productCategory: ""
          });
          this.productPictureLabel = "Add a picture";
          // Admin UI
          this.userService.adminNewProduct = false;
          this.userService.adminEditProduct = false;
        });
      },
      err => {
        console.log(err);
      }
    );
  }
}
