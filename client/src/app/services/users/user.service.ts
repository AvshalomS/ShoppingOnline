import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { User } from "../../models/user";
import { BASE_USER_URL } from "../../config/config";

@Injectable({
  providedIn: "root"
})
export class UserService {
  private readonly baseURL: string;

  public isLogin: boolean;
  public isRegister: boolean;
  private role: string;
  private userName: string;
  private user: User;
  // User UI
  public isUserShopping: boolean;
  public isUserFinishOrder: boolean;
  public cities = [];
  // Admin UI
  public adminNewProduct: boolean;
  public adminEditProduct: boolean;

  constructor(private http: HttpClient) {
    this.baseURL = BASE_USER_URL;
    this.userName = "Guest";
    this.isLogin = false;
    this.isRegister = false;
    this.role = "Guest";
    // User UI
    this.isUserShopping = false;
    this.isUserFinishOrder = false;
    // Admin UI
    this.adminNewProduct = false;
    this.adminEditProduct = false;
  }
  public getUserName() {
    return this.userName;
  }
  public setUserName(userName = null) {
    this.userName = this.user.firstName + " " + this.user.lastName;
    if (userName) this.userName = userName;
  }
  public getRole() {
    return this.role;
  }
  public setRole(role) {
    return (this.role = role);
  }
  public getUserId() {
    return this.user.ID;
  }
  public setUser(user: Object) {
    this.user = user;
    // console.log(this.user);
  }
  public getUser() {
    return this.user;
  }
  public getCities(): Observable<any> {
    return this.http.get<any>(this.baseURL + "cities");
  }
  public login(user: Object): Observable<any> {
    return this.http.post<Object>(this.baseURL + "login", user);
  }
  public registerStep1(user: User): Observable<any> {
    return this.http.post<User>(this.baseURL + "registerStep1", user);
  }
  public registerStep2(user: User): Observable<any> {
    return this.http.post<User>(this.baseURL + "registerStep2", user);
  }
}
