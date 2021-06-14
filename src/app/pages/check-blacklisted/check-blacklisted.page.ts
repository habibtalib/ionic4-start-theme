import { Component, OnInit } from '@angular/core';
import { AuthService } from "src/app/services/auth.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EnvService } from "../../services/env.service";
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-check-blacklisted',
  templateUrl: './check-blacklisted.page.html',
  styleUrls: ['./check-blacklisted.page.scss'],
})
export class CheckBlacklistedPage implements OnInit {
  key='';
  users=[];

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private env: EnvService,
  ) { }

  ngOnInit() {
  }

  search() {
    this.users = [];
    console.log(this.key)
    this.authService.getToken().then(() => {
      const headers = new HttpHeaders({
        Authorization:
          this.authService.token["token_type"] +
          " " +
          this.authService.token["access_token"],
        Accept: "application/json",
      });
      this.http
        .get(this.env.API_URL + "blacklisted?key=" + this.key, {
          headers: headers,
        })
        .subscribe(
          data => {
            data["users"].data.forEach((d) => {this.users.push(d)});
            console.log(data);
          },
          (error) => {
            console.log(error);
          }
        );
    });
  }

}
