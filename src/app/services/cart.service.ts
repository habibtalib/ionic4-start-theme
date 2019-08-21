import { Injectable } from "@angular/core";
import { TouchSequence } from "selenium-webdriver";

@Injectable({
  providedIn: "root"
})
export class CartService {
  private data = [
  ];

  private cart = [];
  private total = 0;

  constructor() {}

  getProducts() {
    return this.data;
  }

  getCart() {
    return this.cart;
  }

  getTotal() {
    this.cart.forEach(product => {
      this.total += product.count;
    });
    return this.total
  }

  clearCart() {
    this.cart = [];
    this.total = 0;
  }

  removeCart(j, value) {
    // this.cart = this.cart.filter(function (ele) {
    //   return ele != value;
    // });
    this.cart.splice(j,1);
  }

  addProduct(product) {
    let card = null;
    card = this.cart.find(item => item.id === product.id)
    if (card) {
      if (card.count) {
        card.count++
      } else {
        card.count = 1
      }
      var index = this.cart.indexOf(card);
      if (index !== -1) {
        this.cart[index] = card;
      }
    } else {
      product.count = 1;
      this.cart.push(product);
    }
  }
}
