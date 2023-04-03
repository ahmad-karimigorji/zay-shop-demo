import Menu from "./menu.js";
import Ui from "./ui.js";

export class ProductsApi {
  static getLocalProducts() {
    let saveProducts = localStorage.getItem("Products")
      ? JSON.parse(localStorage.getItem("Products"))
      : [];
    return saveProducts;
  }

  static getOneProductOfProducts(id) {
    let saveProducts = localStorage.getItem("Products")
      ? JSON.parse(localStorage.getItem("Products"))
      : [];
    const product = saveProducts.find((item) => item.id === id);
    return product;
  }

  static saveLocalProducts(products) {
    localStorage.setItem("Products", JSON.stringify(products));
  }
}

export class ShoppingCartApi {
  static getLocalShoppingCart() {
    let saveShoppingCart = localStorage.getItem("ShoppingCart")
      ? JSON.parse(localStorage.getItem("ShoppingCart"))
      : [];
    return saveShoppingCart;
  }

  static getOneProductOfShoppingCart(id) {
    let saveShoppingCart = localStorage.getItem("ShoppingCart")
      ? JSON.parse(localStorage.getItem("ShoppingCart"))
      : [];
    const product = saveShoppingCart.find((item) => item.id === id);
    return product;
  }

  static saveLocalShoppingCart(cart) {
    let saveShoppingCart = this.getLocalShoppingCart();

    const index = saveShoppingCart.findIndex((item) => {
      return item.id === cart.id;
    });

    if (index !== -1) {
      saveShoppingCart.splice(index, 1, cart);
    } else {
      saveShoppingCart.unshift(cart);
    }

    localStorage.setItem("ShoppingCart", JSON.stringify(saveShoppingCart));

    Menu.displayShoppingCart();
    const pathname = window.location.pathname;
    if (pathname === "/buy.html") {
      Ui.displayBuyPage();
    } else if (pathname === "/shopSingle.html") {
      Ui.displaySingleShop();
    }
  }
  static deleteProductOfShoppingCart(id) {
    let saveShoppingCart = this.getLocalShoppingCart();
    const filteredProducts = saveShoppingCart.filter((item) => item.id !== id);

    localStorage.setItem("ShoppingCart", JSON.stringify(filteredProducts));

    Menu.displayShoppingCart();
    const pathname = window.location.pathname;
    if (pathname === "/buy.html") {
      Ui.displayBuyPage();
    } else if (pathname === "/shopSingle.html") {
      Ui.displaySingleShop();
    }
  }
  static deleteAllProductOfShoppingCart() {
    let saveShoppingCart = [];

    localStorage.setItem("ShoppingCart", JSON.stringify(saveShoppingCart));

    Menu.displayShoppingCart();
    const pathname = window.location.pathname;
    if (pathname === "/buy.html") {
      Ui.displayBuyPage();
    } else if (pathname === "/shopSingle.html") {
      Ui.displaySingleShop();
    }
  }
}
