import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { Product } from "../../models/product";
import { BASE_IMG_URL, BASE_PRODUCTS_URL } from "../../config/config";

@Injectable({
  providedIn: "root"
})
export class ProductsService {
  public productCategoryList;
  public allProducts;
  public searchProduct;
  public selectedCategory;
  public selectedProduct: Product;
  public productsByCategory;
  public numOfProducts: any;
  private baseURL;
  public imgUrl;
  // use at edit-product & home components
  public productFromHome: boolean;

  constructor(private http: HttpClient) {
    this.baseURL = BASE_PRODUCTS_URL;
    this.imgUrl = BASE_IMG_URL;
  }

  // http ------------------------------------------------------------------------------------------
  public setNumOfProducts() {
    this.http.get<any>(`${this.baseURL}num-of-products`).subscribe(data => {
      // console.log(data);
      this.numOfProducts = data.numOfProducts;
    });
  }
  public getProductCategoryList(): Observable<any> {
    return this.http.get(`${this.baseURL + "category-list"}`);
  }
  public saveNewProduct(product: any): Observable<any> {
    let formData: any = new FormData();
    formData.append("productName", product.productName);
    formData.append("productPrice", product.productPrice);
    formData.append("productPicture", product.productPicture);
    formData.append("productCategory", product.productCategory);

    return this.http.post<Object>(
      `${this.baseURL + "add-new-product"}`,
      formData
    );
  }

  public editProduct(product: any): Observable<any> {
    let formData: any = new FormData();
    formData.append("_id", product._id);
    formData.append("productName", product.productName);
    formData.append("productPrice", product.productPrice);
    formData.append("productPicture", product.productPicture);
    formData.append("productCategory", product.productCategory);

    return this.http.put<Object>(`${this.baseURL + "edit-product"}`, formData);
  }
  public getAllProducts(): Observable<any> {
    return this.http.get(`${this.baseURL}all-products`);
  }
  public getProductsByCategory(category): Observable<any> {
    return this.http.get(`${this.baseURL}products/${category}`);
  }
}
