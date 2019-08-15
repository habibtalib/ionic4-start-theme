import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class CartService {
  private data = [
  ];

  private cart = [];

  constructor() {}

  getProducts() {
    return this.data;
  }

  getCart() {
    return this.cart;
  }

  addProduct(product) {
    this.cart.push(product);
  }
}
