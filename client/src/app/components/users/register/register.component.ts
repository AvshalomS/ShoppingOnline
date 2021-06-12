import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { User } from "../../../models/user";
import { UserService } from "../../../services/users/user.service";

import { FormBuilder, Validators } from "@angular/forms";
import { CustomValidator } from "../../../customValidators/custom-validator";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  public user = new User();
  public currentStep: number;
  public isStep1: boolean;
  public isError: string;

  public step1Form;
  public step2Form;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.currentStep = 1;
    this.isStep1 = true;
    this.isError = "";

    this.step1Form = this.formBuilder.group(
      {
        ID: [null, Validators.compose([Validators.required])],
        mail: [
          null,
          Validators.compose([Validators.required, Validators.email])
        ],
        password: [null, Validators.compose([Validators.required])],
        confirmPassword: [null, Validators.compose([Validators.required])]
      },
      {
        validator: [CustomValidator.passwordMatchValidator]
      }
    );
    this.step2Form = this.formBuilder.group({
      city: [null, Validators.compose([Validators.required])],
      street: [null, Validators.compose([Validators.required])],
      firstName: [null, Validators.compose([Validators.required])],
      lastName: [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.userService.isRegister = true;
    this.userService.getCities().subscribe(data => {
      this.userService.cities = data;
      this.step2Form.patchValue({ city: this.userService.cities[0].name });
    });
  }

  step1(): void {
    sessionStorage.removeItem("token");
    const { ID, mail, password } = this.step1Form.value;
    this.user = { ID, mail, password };

    this.userService.registerStep1(this.user).subscribe(
      () => {
        // data => {
        this.isError = "";
        this.isStep1 = false;
        this.currentStep = 2;
        // console.log("server response: ", data);
      },
      err => {
        this.isStep1 = true;
        this.isError = err.error;
      }
    );
  }
  step2(): void {
    const { city, street, firstName, lastName } = this.step2Form.value;
    this.user = { ...this.user, city, street, firstName, lastName };
    this.userService.registerStep2(this.user).subscribe(
      data => {
        this.isError = "";
        alert(data.message);
        this.router.navigate(["/"]);
        this.userService.isRegister = false;
      },
      err => {
        this.isStep1 = false;
        this.isError = err.error;
      }
    );
  }
  login() {
    this.userService.isRegister = false;
  }
}
