import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserService } from "../../../services/users/user.service";
import { CartAndOrdersService } from "../../../services/cartAndOrders/cart-and-orders.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  public loginForm;
  constructor(
    private userService: UserService,
    private cartAndOrdersService: CartAndOrdersService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      mail: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {}
  login() {
    sessionStorage.removeItem("token");

    const user = this.loginForm.value;
    // console.log(user);
    this.userService.login(user).subscribe(
      data => {
        // console.log(data);
        const { user, token } = data;

        this.userService.setUser(user);
        // Save token
        sessionStorage.setItem("token", token);
        this.userService.setUserName();
        this.userService.setRole(user.role);

        if (this.userService.getRole() === "user") {
          this.cartAndOrdersService.chackUserCartStatus(user._id);
          this.router.navigate(["/"]);
        }
        this.userService.isLogin = true;
        if (this.userService.getRole() === "Admin")
          this.router.navigate(["/home"]);
      },
      err => {
        console.log(err);
      }
    );
  }
}
