import { Component, OnInit, DoCheck } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

import { Product } from "../../../models/product";
import { UserService } from "../../../services/users/user.service";
import { ProductsService } from "../../../services/products/products.service";

@Component({
  selector: "app-edit-product",
  templateUrl: "./edit-product.component.html",
  styleUrls: ["./edit-product.component.css"]
})
export class EditProductComponent implements OnInit, DoCheck {
  public editProductForm;
  public categories = [];
  public product = new Product();
  // User UI
  private productPictureLabel = "Image File (Blank Field - Delete Image)";

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private productsService: ProductsService
  ) {
    this.productsService.getProductCategoryList().subscribe(data => {
      this.productsService.productCategoryList = data;
      this.categories = this.productsService.productCategoryList;
    });
    this.editProductForm = this.formBuilder.group({
      _id: [null],
      productName: [null],
      productPrice: [null],
      productPicture: [null],
      productCategory: [null, Validators.compose([Validators.required])]
    });
  }
  ngOnInit() {}
  ngDoCheck() {
    // Get product from service prosses begin
    if (this.productsService.productFromHome) {
      this.editProductForm.patchValue({
        _id: this.productsService.selectedProduct._id
      });
      this.editProductForm.patchValue({
        productName: this.productsService.selectedProduct.productName
      });
      this.editProductForm.patchValue({
        productPrice: this.productsService.selectedProduct.productPrice
      });
      this.editProductForm.patchValue({
        productCategory: this.productsService.selectedProduct.productCategory
          .name
      });
      // Get product from service prosses end
      this.productsService.productFromHome = false;
      this.productPictureLabel = "Image File (Blank Field - Delete Image)";
    }
  }
  preventNegativePrice() {
    if (this.editProductForm.value.productPrice < 0)
      this.editProductForm.patchValue({
        productPrice: 0
      });
  }
  closeButton() {
    // clean form fields
    this.editProductForm.reset({
      productName: "",
      productPrice: "",
      productCategory: ""
    });
    this.productPictureLabel = "Image File (Blank Field - Delete Image)";
    // Admin UI
    this.userService.adminNewProduct = false;
    this.userService.adminEditProduct = false;
  }
  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.editProductForm.patchValue({ productPicture: file });
    this.editProductForm.get("productPicture").updateValueAndValidity();
    file
      ? (this.productPictureLabel = file.name)
      : (this.productPictureLabel = "Add a picture");
  }

  saveProduct() {
    // console.log(this.editProductForm.value);
    this.productsService.editProduct(this.editProductForm.value).subscribe(
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
          this.editProductForm.reset({
            productName: "",
            productPrice: "",
            productCategory: ""
          });
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
