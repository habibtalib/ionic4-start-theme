import { Component } from '@angular/core';

import { Platform, NavController, MenuController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from 'src/app/services/auth.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { Pages } from './interfaces/pages';
import { error } from '@angular/compiler/src/util';
import { CodePush, InstallMode, SyncStatus } from '@ionic-native/code-push/ngx';

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  public appPages: Array<Pages>;
  user = {
    name: "Habib Talib",
    city: "Kuala Lumpur",
    state: "Malaysia",
    photo: "assets/img/avatar.jpeg"
  };

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    private authService: AuthService,
    private storage: NativeStorage,
    public toastCtrl: ToastController,
    private codePush: CodePush,
  ) {
    this.appPages = [
      {
        title: "Home",
        url: "/home-results",
        direct: "root",
        icon: "home"
      },
      {
        title: "Dashboard",
        url: "/dashboard",
        direct: "forward",
        icon: "clipboard"
      },
      {
        title: "Inbox",
        url: "/inbox",
        direct: "forward",
        icon: "mail"
      },
      {
        title: "Scanner",
        url: "/scanner",
        direct: "forward",
        icon: "qr-scanner"
      },
      {
        title: "Manage Orders",
        url: "/orders",
        direct: "forward",
        icon: "clipboard"
      },
      {
        title: "Products",
        url: "/products",
        direct: "forward",
        icon: "pricetags"
      },
      {
        title: "Merchandise",
        url: "/merchandise",
        direct: "forward",
        icon: "pricetags"
      },
      {
        title: "Genealogy",
        url: "/genealogy",
        direct: "forward",
        icon: "people"
      },
      {
        title: "Invite Members",
        url: "/invite",
        direct: "forward",
        icon: "person-add"
      },
      {
        title: "Purchased History",
        url: "/history",
        direct: "forward",
        icon: "clock"
      },
      {
        title: "Settings",
        url: "/edit-profile",
        direct: "forward",
        icon: "cog"
      }
    ];

    this.initializeApp();
  }

  initializeApp() {
    this.platform
      .ready()
      .then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.checkCodePush(); //Use the plugin always after platform.ready()
      })
      .catch(() => {});
  }

  goToEditProgile() {
    this.navCtrl.navigateForward("edit-profile");
  }

  checkCodePush() {
    this.codePush
      .sync({
        updateDialog: {
          appendReleaseDescription: true,
          descriptionPrefix: "\n\nChange log:\n"
        },
        installMode: InstallMode.IMMEDIATE
      })
      .subscribe(
        data => {
          console.log("CODE PUSH SUCCESSFUL: " + data);
          this.presentToast();
        },
        err => {
          console.log("CODE PUSH ERROR: " + err);
        }
      );

    // const downloadProgress = (progress) => { console.log(`Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`); }
    this.codePush
      .sync({}, this.downloadProgress)
      .subscribe(syncStatus => console.log(syncStatus));
  }

  async downloadProgress(progress) {
    let toast = await this.toastCtrl.create({
      message: `Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`,
      duration: 500,
      position: "bottom"
    });
    toast.present();
  }

  async presentToast() {
    let toast = await this.toastCtrl.create({
      message: "Updated successfully",
      duration: 3000,
      position: "top"
    });

    toast.present();
  }

  logout() {
    this.authService.logout().subscribe(
      data => {
        // this.alertService.presentToast("Logged In");
        console.log("Logged Out", data);
      },
      error => {
        console.log("Logged Out Error ", error);
      }
    );
    this.menuCtrl.enable(false);
    this.navCtrl.navigateRoot("/");
  }
}
