import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import {
  NavController,
  AlertController,
  ToastController,
  ActionSheetController,
  Platform,
  LoadingController
} from "@ionic/angular";
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EnvService } from "../../services/env.service";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { Storage } from "@ionic/storage";
import { FilePath } from "@ionic-native/file-path/ngx";
import { File, FileEntry } from "@ionic-native/File/ngx";
import {
  Camera,
  CameraOptions,
  PictureSourceType
} from "@ionic-native/Camera/ngx";

const STORAGE_KEY = "profile";

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {
  user: any;
  images = [];
  formData = new FormData();

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private authService: AuthService,
    public alertCtrl: AlertController,
    private env: EnvService,
    private http: HttpClient,
    private ref: ChangeDetectorRef,
    private actionSheetController: ActionSheetController,
    private storage: Storage,
    private filePath: FilePath,
    private plt: Platform,
    private camera: Camera,
    private file: File,
    private webview: WebView,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.authService.getToken().then(() => {
      const headers = new HttpHeaders({
        Authorization:
          this.authService.token["token_type"] +
          " " +
          this.authService.token["access_token"],
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

  readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      // const formData = new FormData();
      this.formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      this.formData.append("img", imgBlob, file.name);
      this.uploadImageData();
    };
    reader.readAsArrayBuffer(file);
  }

  deleteImage(imgEntry, position) {
    this.images.splice(position, 1);

    this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      let filtered = arr.filter(name => name != imgEntry.name);
      this.storage.set(STORAGE_KEY, JSON.stringify(filtered));

      var correctPath = imgEntry.filePath.substr(
        0,
        imgEntry.filePath.lastIndexOf("/") + 1
      );

      this.file.removeFile(correctPath, imgEntry.name).then(res => {
        this.presentToast("File removed.");
      });
    });
  }

  updateStoredImages(name) {
    this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      if (!arr) {
        let newImages = [name];
        this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
      } else {
        arr.push(name);
        this.storage.set(STORAGE_KEY, JSON.stringify(arr));
      }

      let filePath = this.file.dataDirectory + name;
      let resPath = this.pathForImage(filePath);

      let newEntry = {
        name: name,
        path: resPath,
        filePath: filePath
      };

      this.images = [newEntry, ...this.images];
      this.ref.detectChanges(); // trigger change detection cycle
    });
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 30,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {
      if (
        this.plt.is("android") &&
        sourceType === this.camera.PictureSourceType.PHOTOLIBRARY
      ) {
        this.filePath.resolveNativePath(imagePath).then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf("/") + 1);
          let currentName = imagePath.substring(
            imagePath.lastIndexOf("/") + 1,
            imagePath.lastIndexOf("?")
          );
          this.copyFileToLocalDir(
            correctPath,
            currentName,
            this.createFileName()
          );
        });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf("/") + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf("/") + 1);
        this.copyFileToLocalDir(
          correctPath,
          currentName,
          this.createFileName()
        );
      }
    });
  }

  pathForImage(img) {
    if (img === null) {
      return "";
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file
      .copyFile(namePath, currentName, this.file.dataDirectory, newFileName)
      .then(
        success => {
          this.updateStoredImages(newFileName);
        },
        error => {
          this.presentToast("Error while storing file.");
        }
      );
  }

  startUpload(imgEntry) {
    this.file
      .resolveLocalFilesystemUrl(imgEntry.filePath)
      .then(entry => {
        (<FileEntry>entry).file(file => this.readFile(file));
      })
      .catch(err => {
        this.presentToast("Error while reading file.");
      });
  }

  loadStoredImages() {
    this.storage.get(STORAGE_KEY).then(images => {
      if (images) {
        let arr = JSON.parse(images);
        this.images = [];
        for (let img of arr) {
          let filePath = this.file.dataDirectory + img;
          let resPath = this.pathForImage(filePath);
          this.images.push({ name: img, path: resPath, filePath: filePath });
        }
      }
    });
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: "bottom",
      duration: 3000
    });
    toast.present();
  }

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  async uploadImageData() {
    const loader = await this.loadingCtrl.create({
      duration: 2000
    });
    loader.present();
    this.formData.append("user", JSON.stringify(this.user));
    this.authService.getToken().then(() => {
      const headers = new HttpHeaders({
        Authorization:
          this.authService.token["token_type"] +
          " " +
          this.authService.token["access_token"],
        Accept: "application/json"
      });
      this.http
        .post(this.env.API_URL + "verification/" + this.user.id, this.formData, {
          headers: headers
        })
        .subscribe(
          data => {
            console.log(data);
            
            loader.onWillDismiss().then(async l => {
              const alert = await this.alertCtrl.create({
                header: 'Document Uploaded',
                subHeader: 'You Document being verify',
                message: 'It take up to 3 days to verify, we will notify you once Approved.',
                buttons: [{
                  text: 'OK',
                  handler: () => {
                    this.navCtrl.navigateRoot("/home-results");
                  }
                }]
              });
              await alert.present();
            });
          },
          error => {
            console.log(error);
            loader.present();
            loader.onWillDismiss().then(async l => {
              const alert = await this.alertCtrl.create({
                header: 'Sorry',
                subHeader: 'Upload Failed',
                message: 'Please try again',
                buttons: ['OK']
              });
              await alert.present();
            });
          }
        );
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [
        // {
        //   text: "Load from Library",
        //   handler: () => {
        //     this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        //   }
        // },
        {
          text: "Use Camera",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: "Cancel",
          role: "cancel"
        }
      ]
    });
    await actionSheet.present();
  }

  logout() {
    this.navCtrl.navigateRoot('/');
  }

  async sendData() {
    if (this.images.length > 0) {
      await this.startUpload(this.images[0]);
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Warning',
        subHeader: 'Image not Selected',
        message: 'Please upload Image',
        buttons: ['OK']
      });
      await alert.present();
      // this.uploadImageData();
    }
  }

}
