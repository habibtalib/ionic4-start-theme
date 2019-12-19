import { Component, OnInit } from '@angular/core';
import { CartService } from "../../services/cart.service";
import { Storage } from '@ionic/storage';

import {
  NavController,
} from "@ionic/angular";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.page.html",
  styleUrls: ["./cart.page.scss"]
})
export class CartPage implements OnInit {
  selectedItems: any = [];
  qty = [];
  code = "";
  show = true;
  // data: Array<Cart> = [];
  cartData: any = [];
  sum: number = 0;
  userId: any;

  total = 0;
  subtotal = 0;
  postage = 0;
  count = 0;

  constructor(private cartService: CartService, public navCtrl: NavController, private store: Storage) {
    for (let i = 1; i <= 100; i++) {
      this.qty.push(i);
    }
  }

  ngOnInit() {
    let items = this.cartService.getCart();
    console.log("items",items)
    // let selected = {};
    // for (let obj of items) {
    //   if (selected[obj.id]) {
    //     selected[obj.id].count++;
    //   } else {
    //     selected[obj.id] = { ...obj, count: 1 };
    //   }
    // }
    this.selectedItems = Object.keys(items).map(key => items[key]);
    console.log("selectedItems",JSON.stringify(this.selectedItems))
    // this.total = this.selectedItems.reduce(
    //   (a, b) => a + b.count * b.role_price.price,
    //   0
    // );
    this.calculatePrice();
  }

  calculatePrice() {
    this.total = 0;
    this.postage = 0;
    this.subtotal = 0;
    let temp = 0;
    this.count = 0;
    this.selectedItems.forEach(product => {
      this.count += product.count;
      temp = product.role_price.price * product.count;
      this.subtotal += temp;
      this.postage += product.role_price.postage * product.count;
    });
    this.total = this.subtotal + this.postage;
  }

  changeQuantity(item){
    console.log(item)
    this.calculatePrice();
  }

  checkout() {
    this.store.set('cart', this.selectedItems)
    this.store.set('total', this.total)
    this.store.set('postage', this.postage)
    this.navCtrl.navigateForward("/checkout");
  }

  browse() {
    this.navCtrl.navigateRoot("/products");
  }

  remove(j, item) {
    // this.selectedItems = this.selectedItems.filter(function (ele) {
    //   return ele != item;
    // });
    this.selectedItems.splice(j,1);
    this.cartService.removeCart(j, item);
    this.calculatePrice()
  }
}
