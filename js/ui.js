import Menu from "./menu.js";
import { ProductsApi, ShoppingCartApi } from "./storageAPI.js";

const card = document.querySelector(".card");
const buyDetails = document.querySelector(".buy-details");
const tittleBuy = document.querySelector(".buy .buy-inner h2");
const buyProduct = document.querySelector(".buy-product");
const buyInnerContainer = document.querySelector(".buy-inner");
const shopSingleContainer = document.querySelector(".shop-single > .container");
const relatedSlider = document.querySelector(".related-slider");
const relatedProductsContainer = document.querySelector(".related-products");
const editModal = document.querySelector(".modal-edit");
const editBackDray = document.querySelector(".modal-edit-back-dray");
const updateBtn = document.querySelector(".update-btn");

class Ui {
  constructor() {}

  displayProduct(products) {
    card.innerHTML = "";

    if (products.length < 1) {
      card.innerHTML = ` <div class="not-found-product">
      <div>
        <span><i class="fa fa-info-circle"></i></span>
        <div>
          <p>We did not find a product with this specification</p>
          <p>We suggest you change the filters</p>
        </div>
      </div>
    </div>`;
      return;
    }

    products.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("product");
      div.innerHTML = this.displayProductHTML(item);
      card.appendChild(div);

      // product rating
      const stars = [
        ...card.lastElementChild.lastElementChild.lastElementChild
          .firstElementChild.children,
      ];
      this.displayActiveStars(item.rating, stars);
    });
  }

  displayRelatedProduct() {
    relatedSlider.innerHTML = "";

    let products = ProductsApi.getLocalProducts();

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("productId");
    const productType = urlParams.get("productType");
    const productGender = urlParams.get("productGender");

    // related product
    const relatedProduct = products.filter(
      (item) =>
        item.type.toLowerCase() === productType.toLowerCase() &&
        item.gender.toLowerCase() === productGender.toLowerCase() &&
        item.id !== productId
    );

    const related = relatedProduct.slice(0, 6);

    if (related.length > 0) {
      relatedProductsContainer.classList.add("active");
    } else {
      return;
    }

    related.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("product");
      div.innerHTML = this.displayProductHTML(item);

      relatedSlider.appendChild(div);

      if (related.length < 3) {
        div.classList.add("active");
      }

      //  product rating
      const stars = [
        ...relatedSlider.lastElementChild.lastElementChild.lastElementChild
          .firstElementChild.children,
      ];
      this.displayActiveStars(item.rating, stars);
    });
  }

  displaySingleShop() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("productId");
    shopSingleContainer.innerHTML = "";

    console.log(productId);
    if (!productId) {
      shopSingleContainer.innerHTML = `<a href='shop.html' class='go-shop-link'> <span>Go Shop</span> <i class="fa fa-long-arrow-right"></i></a>`;
      return;
    }

    const product = ProductsApi.getOneProductOfProducts(productId);
    const div = document.createElement("div");
    div.classList.add("shop-single-inner");
    div.innerHTML = this.shopSingleHTML(product);
    shopSingleContainer.appendChild(div);

    this.displayDetailesOfProductInSingleShopPage(product);

    this.displayRelatedProduct();
    this.updateProductInSingleShopPage();

    const addProductToCartBtn = document.querySelector(
      ".shop-single .addProductToCart"
    );
    const increasetBtn = document.querySelector(".shop-single .increase");
    const decreasetBtn = document.querySelector(".shop-single .decrease");
    const shopSingleError = document.querySelector(".shop-single .error");
    const buyLink = document.querySelector(".shop-single a");
    const quantity = document.querySelector(".quantity span");
    const colorInput = [
      ...document.querySelectorAll(".shop-single .color-input"),
    ];
    const sizeInput = [
      ...document.querySelectorAll(".shop-single .size-input"),
    ];

    addProductToCartBtn.addEventListener("click", (e) => {
      const item = e.target;
      if (item.innerText === "Add To Cart") {
        this.addProductToCartInShopSinglePage(item);
      } else {
        this.removeProductOfCartInShopSinglePage(item);
      }
    });

    colorInput.forEach((item) =>
      item.addEventListener("change", () =>
        this.displayCheckedColorAndSizeOfProductInSingleShopPage(productId)
      )
    );
    sizeInput.forEach((item) =>
      item.addEventListener("change", () =>
        this.displayCheckedColorAndSizeOfProductInSingleShopPage(productId)
      )
    );

    [increasetBtn, decreasetBtn].forEach((item) => {
      item.addEventListener("click", (e) =>
        this.increaseDecrease(e.target, quantity)
      );
    });

    buyLink.addEventListener("click", (e) =>
      this.buyLinkFunction(e, shopSingleError)
    );
  }

  displayDetailesOfProductInSingleShopPage(product) {
    //  product rating
    const stars = [...document.querySelectorAll(".rating .fa-star")];
    this.displayActiveStars(product.rating, stars);

    // product specification
    const descriptionUl = document.querySelector(".shop-single-description ul");
    const specificationLength = product.specification.length;
    let result = "";
    for (let i = 0; i < specificationLength; i++) {
      result += `<li>${product.specification[i]}</li>`;
    }
    descriptionUl.innerHTML = result;

    // product color
    const descriptionColor = document.querySelector(
      ".shop-single-description .color > div"
    );
    this.displayColorProduct(product.color, descriptionColor);

    // product size
    const descriptionSize = document.querySelector(
      ".shop-single-description .size > div"
    );
    this.displaySizeProduct(product.size, descriptionSize);
  }

  addProductToCartInShopSinglePage(item) {
    const quantity = document.querySelector(".quantity span");
    const shopSingleError = document.querySelector(".shop-single .error");

    const colorInputChecked = document.querySelector(
      '.shop-single input[name="color"]:checked'
    );
    const sizeInputChecked = document.querySelector(
      '.shop-single input[name="size"]:checked'
    );

    const product = ProductsApi.getOneProductOfProducts(item.id);

    if (colorInputChecked && sizeInputChecked && quantity.innerText > 0) {
      item.innerText = "In Cart";
      item.classList.add("btn-secondry");

      product.quantity = parseInt(quantity.innerText);
      product.color = colorInputChecked.value;
      product.size = sizeInputChecked.value;

      shopSingleError.innerText = ``;

      ShoppingCartApi.saveLocalShoppingCart(product);
    } else if (
      !colorInputChecked &&
      !sizeInputChecked &&
      quantity.innerText < 1
    ) {
      shopSingleError.innerText = `select color, size and qauntity of product`;
    } else if (!colorInputChecked && !sizeInputChecked) {
      shopSingleError.innerText = `select color and size of product`;
    } else if (!colorInputChecked && quantity.innerText < 1) {
      shopSingleError.innerText = `select color and qauntity of product`;
    } else if (!sizeInputChecked && quantity.innerText < 1) {
      shopSingleError.innerText = `select size and qauntity of product`;
    } else if (!colorInputChecked) {
      shopSingleError.innerText = `select color`;
    } else if (!sizeInputChecked) {
      shopSingleError.innerText = `select size`;
    } else if (quantity.innerText < 1) {
      shopSingleError.innerText = `select qauntity of product`;
    }
  }

  removeProductOfCartInShopSinglePage(item) {
    const quantity = document.querySelector(".quantity span");

    const colorInputChecked = document.querySelector(
      '.shop-single input[name="color"]:checked'
    );
    const sizeInputChecked = document.querySelector(
      '.shop-single input[name="size"]:checked'
    );

    item.innerText = "Add To Cart";
    quantity.innerText = 1;
    item.classList.remove("btn-secondry");
    colorInputChecked.checked = false;
    sizeInputChecked.checked = false;

    ShoppingCartApi.deleteProductOfShoppingCart(item.id);
  }

  displayCheckedColorAndSizeOfProductInSingleShopPage(id) {
    const colorInputChecked = document.querySelector(
      '.shop-single input[name="color"]:checked'
    );
    const sizeInputChecked = document.querySelector(
      '.shop-single input[name="size"]:checked'
    );
    const isShoppingCart = ShoppingCartApi.getOneProductOfShoppingCart(id);

    if (isShoppingCart) {
      isShoppingCart.color = colorInputChecked.value;
      isShoppingCart.size = sizeInputChecked.value;
      ShoppingCartApi.saveLocalShoppingCart(isShoppingCart);
    }
  }

  shopSingleHTML(product) {
    return `<div class="shop-single-images">
            <div class="shop-single-img">
                <input type="radio" name="slide" id="slide1" checked>
                <input type="radio" name="slide" id="slide2">
                <input type="radio" name="slide" id="slide3">
                <input type="radio" name="slide" id="slide4">
                <input type="radio" name="slide" id="slide5">
                <input type="radio" name="slide" id="slide6">
                <input type="radio" name="slide" id="slide7">
                <input type="radio" name="slide" id="slide8">
                <input type="radio" name="slide" id="slide9">
    
                <img class="img-slide1" src=${
                  product.url[0]
                } alt="product single">
                <img src=${product.url[1]} alt="product single">
                <img src=${product.url[2]} alt="product single">
                <img src=${product.url[3]} alt="product single">
                <img src=${product.url[4]} alt="product single">
                <img src=${product.url[5]} alt="product single">
                <img src=${product.url[6]} alt="product single">
                <img src=${product.url[7]} alt="product single">
                <img src=${product.url[8]} alt="product single">
            </div>
            <div class="shop-single-nav-slider">
                <div class="shop-single-nav-slider-inner">
                    <div>
                        <input type="radio" name="nav slide" id="nav-slide1" checked>
                        <input type="radio" name="nav slide" id="nav-slide2">
                        <input type="radio" name="nav slide" id="nav-slide3">
                        <div class="nav-slider-img nav-slider-img-1">
                            <label class="label-slide" for="slide1">
                                <img src=${product.url[0]} alt="product single">
                            </label>
                            <label class="label-slide" for="slide2">
                                <img src=${product.url[1]} alt="product single">
                            </label>
                            <label class="label-slide" for="slide3">
                                <img src=${product.url[2]} alt="product single">
                            </label>
                        </div>
                        <div class="nav-slider-img">
                            <label class="label-slide" for="slide4">
                                <img src=${product.url[3]} alt="product single">
                            </label>
                            <label class="label-slide" for="slide5">
                                <img src=${product.url[4]} alt="product single">
                            </label>
                            <label class="label-slide" for="slide6">
                                <img src=${product.url[5]} alt="product single">
                            </label>
                        </div>
                        <div class="nav-slider-img">
                            <label class="label-slide" for="slide7">
                                <img src=${product.url[6]} alt="product single">
                            </label>
                            <label class="label-slide" for="slide8">
                                <img src=${product.url[7]} alt="product single">
                            </label>
                            <label class="label-slide" for="slide9">
                                <img src=${product.url[8]} alt="product single">
                            </label>
                        </div>
                        <label class="label-nav-slide label-nav1" for="nav-slide1"></label>
                        <label class="label-nav-slide label-nav2" for="nav-slide2"></label>
                        <label class="label-nav-slide label-nav3" for="nav-slide3"></label>
                    </div>
    
                </div>
    
            </div>
        </div>
        <div class="shop-single-description">
            <div>
                <h1>${product.name}</h1>
                <p>$${product.price.toFixed(2)}</p>
                <p class="rating">
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                    Rating ${product.rating} | 36 Comments
                </p>
    
                <div class="product-brand-name"><h3>Brand: </h3><p> ${
                  product.brand
                }</p></div>
    
                <h3>Description:</h3>
                <p class="description">${product.description}</p>
                
                <h3>Specification:</h3>
                <ul></ul>
    
                <div class="color-size-quantity">
                    <div class="color">
                        <h4>Color : </h4>
                        <div></div>
                    </div>
                    <div class="size">
                        <h4>Size : </h4>
                        <div></div>
                    </div>
    
                    <div class="quantity">
                        <h4>Quantity : </h4>
                        <button class="btn btn-primary"><i class="fa fa-minus decrease" id=${
                          product.id
                        }></i></button>
                        <span>1</span>
                        <button class="btn btn-primary"><i class="fa fa-plus increase" id=${
                          product.id
                        }></i></button>
                    </div>
                </div>
                <div class="add-buy">
                    <a href="buy.html">
                        <button class="btn btn-primary buy-btn">Buy</button>
                    </a>
                    <button class="btn btn-primary addProductToCart" id=${
                      product.id
                    }>Add To Cart</button>
                </div>
                <p class="error"></p>
    
            </div>
            </div>`;
  }

  // product rating function
  displayActiveStars(rating, stars) {
    const productRating = Math.floor(rating);
    for (let i = 0; i < productRating; i++) {
      stars[i].classList.add("active");
    }
  }

  // product color function
  displayColorProduct(productColor, div) {
    let result = "";
    const colorLength = productColor.length;
    result = "";
    for (let i = 0; i < colorLength; i++) {
      result += `<input class="color-input" type="radio" name="color" id="color${
        i + 1
      }" value="${productColor[i]}">
                <label for="color${i + 1}" class="btn btn-primary">${
        productColor[i]
      }</label>`;
      div.innerHTML = result;
    }
  }

  // product size function
  displaySizeProduct(productSize, div) {
    let result = "";
    const sizeLength = productSize.length;
    for (let i = 0; i < sizeLength; i++) {
      result += `<input class="size-input" type="radio" name="size" id="size${
        i + 1
      }" value="${productSize[i]}">
                    <label for="size${i + 1}" class="btn btn-primary">${
        productSize[i]
      }</label>`;
      div.innerHTML = result;
    }
  }

  updateProductInSingleShopPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("productId");

    const addProductToCartBtn = document.querySelector(".addProductToCart");
    const quantity = document.querySelector(".shop-single .quantity span");
    if (productId) {
      const isShoppingCart =
        ShoppingCartApi.getOneProductOfShoppingCart(productId);

      if (isShoppingCart) {
        addProductToCartBtn.innerText = "In Cart";
        addProductToCartBtn.classList.add("btn-secondry");

        const colorInput = document.querySelector(
          `.shop-single input[value='${isShoppingCart.color}']`
        );
        const sizeInput = document.querySelector(
          `.shop-single input[value='${isShoppingCart.size}']`
        );

        colorInput.checked = true;
        sizeInput.checked = true;

        quantity.innerText = isShoppingCart.quantity;
      } else if (
        !isShoppingCart &&
        addProductToCartBtn.innerText === "In Cart"
      ) {
        const colorInput = document.querySelectorAll(
          `.shop-single input[name='color']`
        );
        const sizeInput = document.querySelectorAll(
          `.shop-single input[name='size']`
        );

        addProductToCartBtn.innerText = "Add To Cart";
        addProductToCartBtn.classList.remove("btn-secondry");

        colorInput.forEach((item) => (item.checked = false));
        sizeInput.forEach((item) => (item.checked = false));
        quantity.innerText = 1;

        quantity.innerText = 1;
      }
    }
  }

  displayCheckedColorAndSizeOfProductInEditModal(id) {
    const colorInput = [
      ...document.querySelectorAll('.modal-edit input[name="color"]'),
    ];
    const sizeInput = [
      ...document.querySelectorAll('.modal-edit input[name="size"]'),
    ];
    const isShoppingCart = ShoppingCartApi.getOneProductOfShoppingCart(id);

    colorInput.forEach((item) => {
      if (item.value === isShoppingCart.color) {
        item.checked = true;
      }
    });
    sizeInput.forEach((item) => {
      if (item.value === isShoppingCart.size) {
        item.checked = true;
      }
    });
  }

  displayBuyPage() {
    let saveShoppingCart = ShoppingCartApi.getLocalShoppingCart();
    buyProduct.innerHTML = "";

    if (saveShoppingCart.length < 1) {
      buyInnerContainer.innerHTML = `<a href='shop.html' class='go-shop-link'> <span>Go Shop</span> <i class="fa fa-long-arrow-right"></i></a>`;
      return;
    }

    saveShoppingCart.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("shopping-cart-product");

      div.innerHTML = this.buyPageHTML(item);

      buyProduct.appendChild(div);
      const quantity = document.querySelector(
        `.shopping-cart-quantity span#${item.id}`
      );

      const increasetBtn = document.querySelector(
        `.buy-product .increase#${item.id}`
      );
      const decreasetBtn = document.querySelector(
        `.buy-product .decrease#${item.id}`
      );

      const editIcon = document.querySelector(
        `.buy-product .fa-pencil#${item.id}`
      );
      const trashIcon = document.querySelector(
        `.buy-product .fa-trash-o#${item.id}`
      );

      trashIcon.addEventListener("click", (e) => {
        const id = e.target.id;
        ShoppingCartApi.deleteProductOfShoppingCart(id);
      });

      editIcon.addEventListener("click", (e) => {
        this.showEditModalFuction(e);
      });

      increasetBtn.addEventListener("click", (e) => {
        this.increaseDecrease(e.target, quantity);
      });

      decreasetBtn.addEventListener("click", (e) => {
        this.increaseDecrease(e.target, quantity);
      });
    });
    buyDetails.classList.add("active");
    tittleBuy.classList.add("active");
  }

  showEditModalFuction(e) {
    const item = e.target;

    editModal.classList.toggle("active");
    editBackDray.classList.toggle("active");
    updateBtn.setAttribute("id", item.id);

    const product = ProductsApi.getOneProductOfProducts(item.id);

    // product color
    const color = document.querySelector(".modal-edit .color > div");
    this.displayColorProduct(product.color, color);

    // product size
    const size = document.querySelector(".modal-edit .size > div");
    this.displaySizeProduct(product.size, size);

    this.displayCheckedColorAndSizeOfProductInEditModal(item.id);
  }

  closeEditModalFunction(e) {
    const item = e.target;

    if (
      item.classList.contains("close-edit") ||
      item.classList.contains("cancel-btn") ||
      (item.classList.contains("modal-edit-back-dray") &&
        editModal.classList.contains("active"))
    ) {
      editModal.classList.toggle("active");
      editBackDray.classList.toggle("active");
    } else if (item.classList.contains("update-btn")) {
      const colorInputChecked = document.querySelector(
        '.modal-edit input[name="color"]:checked'
      );
      const sizeInputChecked = document.querySelector(
        '.modal-edit input[name="size"]:checked'
      );
      const product = ShoppingCartApi.getOneProductOfShoppingCart(item.id);
      product.color = colorInputChecked.value;
      product.size = sizeInputChecked.value;
      ShoppingCartApi.saveLocalShoppingCart(product);
      editModal.classList.toggle("active");
      editBackDray.classList.toggle("active");
    }
  }

  buyPageHTML(product) {
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
                <i class="fa fa-pencil" id=${product.id}></i>
                <i class="fa fa-trash-o" id=${product.id}></i>
            </span>
            <p>$${product.price.toFixed(2)}</p>
        </div>
    </div>`;
  }

  setPriceAndQuantityOfProductsInBuyPage(price, qauntity) {
    // const tittleBuy = document.querySelector(".buy .buy-inner h2");
    const subTotalPrice = document.querySelector(".buy .sub-total-price");
    const estimatedTotalPrice = document.querySelector(
      ".buy .estimated-total-price"
    );

    if (tittleBuy) {
      tittleBuy.innerText = `MY SHOPPING CART (${qauntity})`;
      subTotalPrice.innerText = `$${price.toFixed(2)}`;
      estimatedTotalPrice.innerText = `$${price.toFixed(2)}`;
    }
  }

  // increase & decrease quantity
  increaseDecrease(item, quantityElement) {
    const id = item.id;
    const product = ShoppingCartApi.getOneProductOfShoppingCart(id);
    let count = parseInt(quantityElement.innerText);

    if (item.classList.contains("increase")) {
      count += 1;
      quantityElement.innerText = count;

      if (product) {
        product.quantity = count;
        ShoppingCartApi.saveLocalShoppingCart(product);
      }
    } else if (item.classList.contains("decrease")) {
      if (count > 1) {
        count -= 1;
        quantityElement.innerText = count;

        if (product) {
          product.quantity = count;
          ShoppingCartApi.saveLocalShoppingCart(product);
        }
      } else {
        quantityElement.innerText = 0;

        if (product) {
          ShoppingCartApi.deleteProductOfShoppingCart(product.id);
        }
      }
    }
    Menu.setCartValue();
  }

  buyLinkFunction(e, errorTag) {
    let saveShoppingCart = ShoppingCartApi.getLocalShoppingCart();
    if (saveShoppingCart.length < 1) {
      e.preventDefault();
      console.log(errorTag);
      errorTag.innerText = `your cart is empty`;
    }
  }

  displayProductHTML(product) {
    return `<div class="product-img">
    <img src=${product.url[0]} alt=${product.name}>
    <div class="layer">
        <a href="shopSingle.html?productId=${product.id}&productType=${
      product.type
    }&productGender=${product.gender}" id=${
      product.id
    }><span><i class="fa fa-shopping-cart btn btn-primary" id=${
      product.id
    }></i></span></a>
    </div>

    </div>
    <div class="details-product">
        <span>${product.name}</span>
        <div>
            <span class="stars-box">
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
            </span>
            <span class="price">$${product.price.toFixed(2)}</span>
        </div>
    </div>`;
  }
}
export default new Ui();
