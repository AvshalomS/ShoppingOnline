import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BASE_CART_AND_ORDERS_URL, BASE_IMG_URL } from "../../config/config";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CartAndOrdersService {
  // shoppingCart and baseURL
  public shoppingCart: Object;
  private baseURL = BASE_CART_AND_ORDERS_URL;
  // User interface (UI)
  public startShoppingButtonText: string;
  public wellcomeMessage: string;
  public openCartMessage: string;
  public cartDate: Date;
  public openNewCart: boolean;
  public numOfOrders: any;

  constructor(private http: HttpClient) {
    this.shoppingCart = {};
    // UI
    this.startShoppingButtonText = null;
    this.wellcomeMessage = null;
    this.openNewCart = false;
    this.openCartMessage = null;
    this.cartDate = null;
  }
  public openNewCartAction(id): Observable<any> {
    return this.http.post(`${this.baseURL + "open-new-cart"}`, { id });
  }

  public chackUserCartStatus(id) {
    this.http
      .post<any>(`${this.baseURL + "get-user-cart"}`, { id })
      .subscribe(data => {
        const cart = data.userCart;
        if (!cart) {
          this.openNewCart = true;
          this.wellcomeMessage = "Welcome to your first purchase !!!";
          this.openCartMessage = null;
          this.startShoppingButtonText = "Start Shopping";
          this.cartDate = null;
        } else {
          // console.log(cart);
          this.cartDate = cart.date;
          this.http
            .post<any>(`${this.baseURL}check-if-cart-is-ordered`, {
              id: cart._id
            })
            .subscribe(data => {
              // console.log(data);
              if (data.cartIsOrderd) {
                this.openNewCart = true;
                this.wellcomeMessage = "Your last purchase was on";
                this.openCartMessage = null;
                this.startShoppingButtonText = "Start Shopping";
              } else {
                this.openNewCart = false;
                cart.cartItems.map(product => {
                  product.productID.productPicture =
                    BASE_IMG_URL + product.productID.productPicture;
                  return product;
                });
                this.shoppingCart = cart;
                // console.log(this.shoppingCart);
                this.wellcomeMessage = "You have open cart from";
                this.openCartMessage = `Current price: ${cart.totalPrice}$`;
                this.startShoppingButtonText = "Resume Shopping";
              }
            });
        }
      });
  }

  public getCart() {
    return this.shoppingCart;
  }
  private getCartId() {
    let id: any = this.shoppingCart;
    return id._id;
  }
  public getCartByCartID(cartId) {
    this.http.get<any>(`${this.baseURL}get-cart/${cartId}`).subscribe(data => {
      // console.log(data);
      data.cart.cartItems.map(product => {
        product.productID.productPicture =
          BASE_IMG_URL + product.productID.productPicture;
        return product;
      });
      this.shoppingCart = data.cart;
    });
  }
  public addToCart(item) {
    this.http
      .post<any>(`${this.baseURL + "add-item-to-cart"}`, item)
      .subscribe(data => {
        data.cart.cartItems.map(product => {
          product.productID.productPicture =
            BASE_IMG_URL + product.productID.productPicture;
          return product;
        });
        this.shoppingCart = data.cart;
        // console.log(this.shoppingCart);
      });
  }

  public deleteFromCart(itemPlace) {
    const item = { place: itemPlace, cartId: this.getCartId() };
    this.http
      .request<any>("delete", `${this.baseURL}delete-from-cart`, {
        body: { item }
      })
      .subscribe(data => {
        if (data.status === "OK") {
          this.getCartByCartID(this.getCartId());
        }
      });
  }
  public orderCartAction(userOrderData): Observable<any> {
    return this.http.post(`${this.baseURL}order-the-cart`, userOrderData);
  }
  public setNumOfOrders() {
    this.http.get<any>(`${this.baseURL}num-of-orders`).subscribe(data => {
      this.numOfOrders = data.numOfOrders;
    });
  }
}
