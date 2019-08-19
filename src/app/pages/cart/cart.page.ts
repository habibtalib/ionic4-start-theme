import { Component, OnInit } from '@angular/core';
import { CartService } from "../../services/cart.service";
import {
  NavController,
} from "@ionic/angular";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.page.html",
  styleUrls: ["./cart.page.scss"]
})
export class CartPage implements OnInit {
  selectedItems = [];
  qty = [];
  baseProducts: any = [];
  code = "";
  show = true;
  // data: Array<Cart> = [];
  cartData: any = [];
  sum: number = 0;
  userId: any;

  total = 0;

  constructor(private cartService: CartService, public navCtrl: NavController) {
    for (let i = 1; i <= 100; i++) {
      this.qty.push(i);
    }
  }

  ngOnInit() {
    let items = this.cartService.getCart();
    let selected = {};
    for (let obj of items) {
      console.log(obj);
      if (selected[obj.id]) {
        selected[obj.id].count++;
      } else {
        selected[obj.id] = { ...obj, count: 1 };
      }
    }
    this.selectedItems = Object.keys(selected).map(key => selected[key]);
    this.total = this.selectedItems.reduce(
      (a, b) => a + b.count * b.role_price.price,
      0
    );
  }

  calculatePrice() {
    this.sum = 0;
    let temp = 0;
    this.baseProducts.forEach(product => {
      temp = product.price * product.quantity;
      this.sum += temp;
    });
    return this.sum;
  }

  changeQuantity(item){
    console.log(item)
  }

  checkout() {
    this.navCtrl.navigateRoot("/home-results");
  }

  browse() {
    this.navCtrl.navigateRoot("/products");
  }
}
