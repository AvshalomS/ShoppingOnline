import { Component, OnInit } from "@angular/core";
import { UserService } from "./services/users/user.service";
import { WELCOME_IMG } from "./config/config";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  private icon: string;
  constructor(private userService: UserService) {
    this.icon = WELCOME_IMG;
  }
  ngOnInit() {
    this.userService.getCities().subscribe(data => {
      this.userService.cities = data;
    });
  }
}
