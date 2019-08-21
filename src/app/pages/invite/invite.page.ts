import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EnvService } from "../../services/env.service";
import { NavController, ToastController } from "@ionic/angular";
import { CartService } from "../../services/cart.service";
import { AuthService } from 'src/app/services/auth.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
})
export class InvitePage implements OnInit {

  user : any;
  public showToolbar: boolean;
  public shownGroup = null;
  public socialShare: Array<any>;

  constructor(public navCtrl: NavController,
    private http: HttpClient,
    private env: EnvService,
    private cartService: CartService,
    private authService: AuthService,
    private socialSharing: SocialSharing,
    public toastCtrl: ToastController,
    private clipboard: Clipboard
    ) {
    this.socialShare = [
      {
        'heading': 'WhatsApp',
        'headerImage': '../../assets/addons3/whatsapp-icon-280x280.png',
        shareData: [
          { 'title': 'Share text', text: 'Please Click this invite link to Register Meeracle App https://app.meeracle.ml/invite/', clickEvent: 'shareText', shareType: 'shareViaWhatsApp' },
        ]
      }
    ]
    }

  ionViewWillEnter() {
    this.showToolbar = true;
    this.authService.getToken().then(() => {
      console.log("isLoggedin", this.authService.isLoggedIn);
      if (!this.authService.isLoggedIn) {
        this.navCtrl.navigateRoot("/");
      }
    });
  }

  async copyClipBoard(text){
    console.log('clipboard', text)
                const toast = await this.toastCtrl.create({
              message: "Invite link Copied",
              duration: 2000,
              position: "bottom",
              closeButtonText: "OK",
              showCloseButton: true
            });

            toast.present();
    this.clipboard.copy(text);
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = true;
    } else {
      this.shownGroup = group;
    }
  };

  isGroupShown(group) {
    return this.shownGroup === group;
  };

  ngOnInit() {
    this.getUser()
    this.toggleGroup(0)
  }

  async shareText(shareData) {
    this.socialSharing[`${shareData.shareType}`](shareData.text, null, null)
      .then((res) => console.log('res', res))
      .catch((e) => console.log('error', e))
  }

  getUser() {
    this.authService.getToken().then(() => {
      const headers = new HttpHeaders({
        Authorization: this.authService.token["token_type"] + " " + this.authService.token["access_token"],
        Accept: "application/json"
      });
      this.http
        .get(this.env.API_URL + "auth/user", {
          headers: headers
        })
        .subscribe(
          data => {
            this.user = data;
          },
          error => {
            console.log(error);
          }
        );
    });
  }

  async sharewithWhatsApp(shareData: any) {
    this.socialSharing.shareViaWhatsApp(shareData.text, shareData.image, shareData.url).then((res) => {
      // Success
      console.log('res', res);
    }).catch((e) => {
      // Error!
      console.log(e)
    });
  }
  

}
