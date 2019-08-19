import { Component } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  ModalController } from '@ionic/angular';

// Modals
// import { SearchFilterPage } from '../../pages/modal/search-filter/search-filter.page';
import { ImagePage } from './../modal/image/image.page';
// Call notifications test by Popover and Custom Component.
// import { NotificationsComponent } from './../../components/notifications/notifications.component';
import { RegisterPage } from '../register/register.page';
import { LoginPage } from '../login/login.page';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from "../../services/cart.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EnvService } from "../../services/env.service";

@Component({
  selector: "app-home-results",
  templateUrl: "./home-results.page.html",
  styleUrls: ["./home-results.page.scss"]
})
export class HomeResultsPage {
  searchKey = "";
  yourLocation = "123 Test Street";
  themeCover = "assets/img/ionic4-Start-Theme-cover.jpg";

  mySlideOptions = {
    initialSlide: 1,
    loop: true
  };
  masterStockist = [];
  // masterStockist = [
  //   {
  //     name: "NAZARIAH",
  //     title: "Guru / Master Stokis",
  //     img: "assets/img/nazariah.png",
  //     text:
  //       " Pada mulanya Kak Naza tertarik dengan keunikan MEERACLE dan akhirnya mengguna produk MEERACLE sebagai produk utama untuk mencantikkan kulit. Ternyata produk MEERACLE sangat berkesan dan secara tidak langsung, Kak Naza mengambil keputusan untuk menjadi sebahagian dari team MEERACLE iaitu dropship pada awal Ogos 2016. Sekitar penghujung bulan Ogos 2016, Kak Naza telah menjadi ejen dan sekitar awal Februari 2017, Kak Naza telah menyahut cabaran dengan menjadi Master Stokis yang bermodalkan sehingga 6 angka." +
  //       "Pada pertengahan 2017, Kak Naza menyuarakan hasrat untuk membuka outlet sebagai kemudahan dan keselesaan ejen terutamanya di Melaka. Alhamdulillah, semuanya disambut dengan baik dan mendapat sokongan dari Founder, CEO malah dari COO MEERACLE. Tujuan utama adalah untuk memberi peluang kepada masyarakat setempat untuk menjana pendapatan dengan menyertai kami dalam Team MEERACLE." +
  //       "Cita-cita Kak Naza adalah untuk melahirkan lebih ramai lagi usahawan terutamanya golongan wanita. MEERACLE adalah platform terbaik bagi menceburkan diri dalam bidang perniagaan, lebih lagi trend perniagaan terkini adalah melalui jualan online. Dengan modal yang di dalam kemampuan & pulangan untung yang tinggi. Sekaligus dapat meningkatkan tahap ekonomi disamping memberi nilai dalam kehidupan orang lain." +
  //       "Walaupun Kak Naza seorang yang bekerjaya dan mempunyai 4 orang anak, adalah tidak mustahil untuk menjadi seorang ahli perniagaan MEERACLE yang berjaya seperti yang telah dikecapi sekarang."
  //   },
  //   {
  //     name: "SITI AZLINA",
  //     title: "Suri Rumah / Miss Meeracle 2017 / Master Stokis",
  //     img: "assets/img/sitiazlina.png",
  //     text:
  //       "Kak Lynn dibesarkan dalam keluarga yang memang suka berniaga, dari kecil Kak Lynn selalu tolong mak dan ayah di gerai nasi lemak, sebagai seorang peniaga kecil-kecilan dan juga seorang suri rumah,Kak Lynn selalu mengimpikan pendapatan yang lumayan dan kukuh." +
  //       "Tiada masalah sebenarnya dengan perniagaan kedai makan ni, tapi bagi Kak Lynn, untuk era baru ni kita kena pandang lebih jauh, dunia bisnes sekarang lebih kepada digital, nak dipendekkan cerita, Kak Lynn bermula bisnes dengan MEERACLE ni masa Kak Lynn tengah online di facebook dan Kak Lynn ternampak iklan berkenaan MEERACLE, masa pertama kali je Kak Lynn tengok produk MEERACLE ni je Kak Lynn rasa tertarik, sebab produk MEERACLE ni unik, diperbuat daripada batu permata." +
  //       "Masa tu juga Kak Lynn terus berdaftar jadi ejen MEERACLE, dengan kekuatan produk yang unik dan sokongan perniagaan dari HQ MEERACLE , bermula dari modal yang kecil serendah RM490 ketika itu, Kak Lynn berjaya mengembangkan perniagaan Kak Lynn dengan MEERACLE dan merekodkan hasil jualan yang tinggi, purata sebulan jualan Kak Lynn adalah RM310,000, MEERACLE is the best!" +
  //       "- Mark Twain"
  //   },
  //   {
  //     name: "MASDIANA",
  //     title: "Guru / Master Stokis",
  //     img: "assets/img/masdiana.png",
  //     text:
  //       "  Kak Diana merupakan seorang guru di tadika kemas, Kak Diana mengajar budak-budak yang berumur 5 hingga 6 tahun. Walaupun orang nampak susah tetapi Kak Diana seronok dengan kerja ni. Dalam masa yang sama Kak Diana sentiasa mencari peluang untuk menambah pendapatan keluarga memandangkan keadaan ayah yang kurang sihat dan memerlukan kos rawatan yang tinggi dan Ibu Kak Diana yang sentiasa berada dalam keadaan risau, jadi Kak Diana membuat keputusan untuk mengubah kehidupan kami." +
  //       "Tanpa disangka, dalam masa beberapa bulan sahaja Kak Diana jadi ejen dan kemudian naik taraf dari level ke level yang lebih tinggi. Sampailah sekarang, Kak Diana sudah pun menjadi Master Stokis MEERACLE dalam masa kurang daripada setahun dengan MEERACLE." +
  //       "Syukur kepada Allah, terima kasih pada MEERACLE kerana sentiasa membimbing Kak Diana sampai sekarang, Kak Diana bangga menjadi sebahagian daripada keluarga MEERACLE. Untuk yang baru nak mulakan perniagaan, tolonglah buat dengan bersungguh-sungguh, buat sampai jadi, jangan hanya separuh jalan dan jangan mudah berputus asa. Jadikan BIG WHY kita sebagai satu semangat untuk berjaya. Pesan Kak Diana utamakan Ibu bapa dan bahagiakan mereka sementara mereka masih ada dan mereka pasti akan sentiasa mendoakan kita." +
  //       "Kak Diana terfikir untuk memulakan bisnes online tapi dengan tiada pengalaman tentang bisnes online jadi agak ragu-ragu. Pada masa itu, ramai kawan-kawan yang mencadangkan untuk jual produk MEERACLE, sebab memang kebetulan Kak Diana sendiri pun pakai produk MEERACLE dan ia memang sangat berkesan pada Kak Diana. Jadi Kak Diana nekad untuk memulakan bisnes dengan MEERACLE."
  //   },
  //   {
  //     name: "CHE WAN NORZIRAWATI",
  //     title: "Ahli Perniagaan / Master Stokis",
  //     img: "assets/img/chewan.png",
  //     text:
  //       " Ianya bermula semasa sedang melayari internet, Kak Zira ternampak iklan dan testimoni yang menarik mengenai produk MEERACLE. Dalam hati berkata, tidak salah kalau ingin mencuba. Dalam masa 5 hari, Kak Zira sangat kagum dengan hasilnya ." +
  //       "MEERACLE merupakan salah satu produk yang unik dan luar biasa kerana menggunakan batu permata sebagai bahan asas. Ia juga dipercayai selamat digunakan oleh semua tidak kira lelaki atau wanita" +
  //       "Perniagaan online adalah sesuatu yang sangat luar biasa. Jika anda ingin mengubah hidup anda, jangan tunggu. BERTINDAK SEKARANG!" +
  //       "Ia adalah misi peribadi bagi Kak Zira untuk membina empayar bersama MEERACLE dan meluaskannya ke seluruh dunia dengan merekrut ejen dan stokis yang berkualiti. MEERACLE adalah platform di mana anda boleh fokus dalam menjana pendapatan sampingan. Yang penting, haruslah bekerja keras dan berusaha."
  //   }
  // ];
  cart = [];
  token: any;
  // @ViewChild('mySlider') slider: Slides;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private authService: AuthService,
    private cartService: CartService,
    private http: HttpClient,
    private env: EnvService,
  ) {}

  ionViewWillEnter() {
    this.authService.getToken().then(() => {
      console.log("isLoggedin", this.authService.isLoggedIn);
      if (this.authService.isLoggedIn) {
        this.navCtrl.navigateRoot("/home-results");
      }
    });
    this.menuCtrl.enable(true);
  }

  ngOnInit() {
    this.cart = this.cartService.getCart();
    this.geSlides();
  }

  settings() {
    this.navCtrl.navigateForward("settings");
  }

  async register() {
    const registerModal = await this.modalCtrl.create({
      component: RegisterPage
    });
    return await registerModal.present();
  }

  async login() {
    const loginModal = await this.modalCtrl.create({
      component: LoginPage
    });
    return await loginModal.present();
  }

  geSlides() {
    this.http
      .post(this.env.API_URL + "auth/login", {
        email: "cyberx11@gmail.com",
        password: "tydfhq78"
      })
      .subscribe(
        token => {
          this.token = token["access_token"];
          const headers = new HttpHeaders({
            Authorization: "Bearer " + this.token,
            Accept: "application/json"
          });
          this.http
            .get(this.env.API_URL + "slides", {
              headers: headers
            })
            .subscribe(
              data => {
                console.log(data)
                this.masterStockist = data["slides"];
              },
              error => {
                console.log(error);
              }
            );
        },
        error => {
          console.log("error", error);
        }
      );
  }

  // async alertLocation() {
  //   const changeLocation = await this.alertCtrl.create({
  //     header: "Change Location",
  //     message: "Type your Address.",
  //     inputs: [
  //       {
  //         name: "location",
  //         placeholder: "Enter your new Location",
  //         type: "text"
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: "Cancel",
  //         handler: data => {
  //           console.log("Cancel clicked");
  //         }
  //       },
  //       {
  //         text: "Change",
  //         handler: async data => {
  //           console.log("Change clicked", data);
  //           this.yourLocation = data.location;
  //           const toast = await this.toastCtrl.create({
  //             message: "Location was change successfully",
  //             duration: 3000,
  //             position: "top",
  //             closeButtonText: "OK",
  //             showCloseButton: true
  //           });

  //           toast.present();
  //         }
  //       }
  //     ]
  //   });
  //   changeLocation.present();
  // }

  // async searchFilter() {
  //   const modal = await this.modalCtrl.create({
  //     component: SearchFilterPage
  //   });
  //   return await modal.present();
  // }

  async presentImage(image: any) {
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: image }
    });
    return await modal.present();
  }

  // async notifications(ev: any) {
  //   const popover = await this.popoverCtrl.create({
  //     component: NotificationsComponent,
  //     event: ev,
  //     animated: true,
  //     showBackdrop: true
  //   });
  //   return await popover.present();
  //   this.navCtrl.navigateForward('cart');
  // }

  notifications() {
    this.navCtrl.navigateForward("cart");
  }
}
