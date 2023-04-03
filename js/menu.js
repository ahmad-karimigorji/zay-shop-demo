import Ui from "./ui.js";
import { ShoppingCartApi } from "./storageAPI.js";

const modalCartInner = document.querySelector(".modal-cart-inner");
const menuIcon = document.querySelector(".fa-bars");
const headerMenuList = document.querySelector(".menu__list");
const searchModal = document.querySelector(".search-modal");
const searchIcon = document.querySelector(".fa-search");
const searchBackDray = document.querySelector(".search-modal-back-dray");
const searchModalClose = document.querySelector(".search-modal__close");
const shoppingCartIcon = document.querySelector(".fa-shopping-cart");
const cartModal = document.querySelector(".modal-cart");
const cartBackDray = document.querySelector(".modal-cart-back-dray");
const modalError = document.querySelector(".modal-cart .error");
const modalBuyLink = document.querySelector(".modal-cart .modal-buy-link");
const quantityCart = document.querySelector(".quantity-cart");
const totalPrice = document.querySelector(".modal-btn > p");

class Menu {
  constructor() {
    menuIcon.addEventListener("click", this.showMenuFunction);
    searchIcon.addEventListener("click", this.showSearchModalFunction);
    searchBackDray.addEventListener("click", this.closeSearchModalFunction);
    searchModalClose.addEventListener("click", this.closeSearchModalFunction);
    shoppingCartIcon.addEventListener("click", this.showCartModalFuction);
    cartModal.addEventListener("click", (e) => {
      this.cartLogic(e);
      this.closeCartModalFunction(e);
    });
    cartBackDray.addEventListener("click", this.closeCartModalFunction);
    modalBuyLink.addEventListener("click", (e) =>
      Ui.buyLinkFunction(e, modalError)
    );

    this.displayShoppingCart();
    this.setCartValue();
  }

  displayShoppingCart() {
    modalError.innerText = "";
    let saveShoppingCart = ShoppingCartApi.getLocalShoppingCart();

    modalCartInner.innerHTML = "";

    if (saveShoppingCart.length > 0) {
      cartModal.classList.add("full");
      quantityCart.classList.add("active");

      saveShoppingCart.forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("shopping-cart-product");
        div.innerHTML = this.shoppingCartHTML(item);
        modalCartInner.appendChild(div);
      });
    } else {
      cartModal.classList.remove("full");
      quantityCart.classList.remove("active");
    }
    this.setCartValue();
  }

  // set total price and quantity
  setCartValue() {
    let saveShoppingCart = ShoppingCartApi.getLocalShoppingCart();
    let quantityCartItem = 0;
    const total = saveShoppingCart.reduce((accu, curr) => {
      quantityCartItem += curr.quantity;
      return accu + curr.price * curr.quantity;
    }, 0);

    totalPrice.innerText = `Total Price : $${total.toFixed(2)}`;
    quantityCart.innerText = saveShoppingCart.length;

    Ui.setPriceAndQuantityOfProductsInBuyPage(total, quantityCartItem);
  }

  // show header menu
  showMenuFunction(e) {
    headerMenuList.classList.toggle("active");
  }
  showSearchModalFunction(e) {
    searchModal.classList.toggle("active");
  }
  closeSearchModalFunction(e) {
    if (searchModal.classList.contains("active")) {
      searchModal.classList.toggle("active");
    }
  }
  showCartModalFuction() {
    cartModal.classList.toggle("active");
    cartBackDray.classList.toggle("active");
    modalError.innerText = "";
  }
  closeCartModalFunction(e) {
    const item = e.target;

    if (
      item.classList.contains("close-cart") ||
      (item.classList.contains("modal-cart-back-dray") &&
        cartModal.classList.contains("active"))
    ) {
      cartModal.classList.toggle("active");
      cartBackDray.classList.toggle("active");
    }
  }
  cartLogic(e) {
    const item = e.target;
    const id = item.id;

    if (item.classList.contains("clear-all")) {
      ShoppingCartApi.deleteAllProductOfShoppingCart();
    } else if (item.classList.contains("fa-trash-o")) {
      ShoppingCartApi.deleteProductOfShoppingCart(id);
    } else if (
      item.classList.contains("increase") ||
      item.classList.contains("decrease")
    ) {
      const quantity = document.querySelector(
        `.shopping-cart-quantity span#${id}`
      );
      Ui.increaseDecrease(e.target, quantity);
    }
  }
  shoppingCartHTML(product) {
    return `<img src=${product.url[0]} alt="">
    <div class="shopping-cart-details">
        <div>
            <p>Name : <b>${product.name}</b></p>
            <p>Color : <b>${product.color}</b></p>
            <p>Size : <b>${product.size}</b></p>
            <div class="shopping-cart-quantity">
                <button class="btn btn-primary"><i class="fa fa-minus decrease" id=${
                  product.id
                }></i></button>
                <span id=${product.id}>${product.quantity}</span>
                <button class="btn btn-primary"><i class="fa fa-plus increase" id=${
                  product.id
                }></i></button>
            </div>
        </div>

        <div>
            <span class="details-icon">
                <a href="shopSingle.html?productId=${product.id}&productType=${
      product.type
    }&productGender=${product.gender}"><i class="fa fa-pencil" id=${
      product.id
    }></i></a>
                <i class="fa fa-trash-o" id=${product.id}></i>
            </span>
            <p>$${product.price.toFixed(2)}</p>
        </div>
    </div>`;
  }
}

export default new Menu();
