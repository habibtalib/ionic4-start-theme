import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EnvService } from "../../services/env.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {

  inboxs: any;

  constructor(private authService: AuthService, private env: EnvService, private http: HttpClient, ) { }

  ngOnInit() {
    this.getMessages()
  }

  getMessages() {
    this.authService.getToken().then(() => {
      const headers = new HttpHeaders({
        Authorization: this.authService.token["token_type"] + " " + this.authService.token["access_token"],
        Accept: "application/json"
      });
      this.http
        .get(this.env.API_URL + "messages", {
          headers: headers
        })
        .subscribe(
          data => {
            this.inboxs = data["messages"];
            console.log(this.inboxs)
          },
          error => {
            console.log(error);
          }
        );
    });
  }

}
