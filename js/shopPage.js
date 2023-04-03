import Menu from "./menu.js";
import Ui from "./ui.js";
import { productData } from "./product.js";
import { ProductsApi } from "./storageAPI.js";

const all = document.querySelector("[data-key='filter']");
const sizeSelect = document.querySelector("select[name='size']");
const sortSelect = document.querySelector("select[name='sort']");
const categoriesFilter = document.querySelectorAll(".header-categories-filter");

const genderCategoriesItems = document.querySelectorAll(".gender");

const typeCategories = document.querySelector(
  ".type-categories .body-categories-filter"
);
const saleCategories = document.querySelector(
  ".sale-categories .body-categories-filter"
);

document.addEventListener("DOMContentLoaded", (e) => {
  Menu;
  ProductsApi.saveLocalProducts(productData);
  filteredProducts();
  displayFilterItemsInSidebar(productData);
  displaySizeOfProductInSelect(productData);
  addActiveClassToFilterItems();

  all.classList.add("active");

  const typeCategoriesItems = document.querySelectorAll(".type-categories p");
  const saleCategoriesItems = document.querySelectorAll(".sale-categories p");

  typeCategoriesItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (e.target.classList.contains("active")) {
        e.target.classList.remove("active");
      } else {
        const activeItem = document.querySelector(".type-categories p.active");
        activeItem && activeItem.classList.remove("active");
        e.target.classList.toggle("active");
      }
      changeUrlSearchParams(e);
    });
  });

  saleCategoriesItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (e.target.classList.contains("active")) {
        e.target.classList.remove("active");
      } else {
        const activeItem = document.querySelector(".sale-categories p.active");
        activeItem && activeItem.classList.remove("active");
        e.target.classList.toggle("active");
      }
      changeUrlSearchParams(e);
    });
  });
});

window.addEventListener("popstate", () => {
  filteredProducts();
  addActiveClassToFilterItems();
});

[sizeSelect, sortSelect].forEach((selectItem) =>
  selectItem.addEventListener("change", (e) => {
    const item = e.target;
    item.setAttribute("data-value", item.value);
    changeUrlSearchParams(e);
    filteredProducts();
  })
);

categoriesFilter.forEach((item) =>
  item.addEventListener("click", (e) => {
    e.currentTarget.nextElementSibling.classList.toggle("active");
    e.currentTarget.lastElementChild.classList.toggle("active");
  })
);

genderCategoriesItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    const value = e.target.dataset.value;

    if (e.target.classList.contains("active")) {
      const activeItems = document.querySelectorAll(`.gender.active`);
      activeItems && activeItems.forEach((i) => i.classList.remove("active"));
      all.classList.add("active");
    } else {
      const activeItems = document.querySelectorAll(`.gender.active`);
      activeItems && activeItems.forEach((i) => i.classList.remove("active"));
      document
        .querySelectorAll(`[data-value=${value}]`)
        .forEach((i) => i.classList.add("active"));
    }
    changeUrlSearchParams(e);
  });
});

all.addEventListener("click", () => {
  addActiveClassToFilterItems();
  all.classList.add("active");
});

function filteredProducts() {
  const allProducts = ProductsApi.getLocalProducts();
  const urlParams = new URLSearchParams(window.location.search);
  let result = [];

  const sort = urlParams.get("sort") || "";
  const gender = urlParams.get("gender") || "";
  const type = urlParams.get("type") || "";
  const sale = urlParams.get("sale") || "";
  const size = urlParams.get("size") || "";

  if (sort === "") result = allProducts;
  else if (sort === "PRICE (HIGH - LOW)")
    result = allProducts.sort((a, b) => b.price - a.price);
  else result = allProducts.sort((a, b) => a.price - b.price);

  if (gender !== "")
    result = result.filter(
      (item) => item.gender.toLowerCase() === gender.toLowerCase()
    );

  if (type !== "")
    result = result.filter(
      (item) => item.type.toLowerCase() === type.toLowerCase()
    );

  if (sale !== "")
    result = result.filter(
      (item) => item.sale.toLowerCase() === sale.toLowerCase()
    );

  if (size !== "") {
    let sizeFilter = [];
    for (const item of result) {
      const isExist = item.size.find(
        (sizeItem) =>
          sizeItem.toString().toLowerCase() === size.toString().toLowerCase()
      );
      if (isExist) sizeFilter.push(item);
    }
    result = sizeFilter;
  }

  Ui.displayProduct(result);
}

function changeUrlSearchParams(e) {
  const key = e.target.dataset.key;
  const value = e.target.dataset.value;

  let url = new URL(window.location);
  const searchQuery = url.searchParams.get(key);

  if (key === "filter") url = url.href.split("?")[0];
  else if (searchQuery === value) url.searchParams.delete(key);
  else url.searchParams.set(key, value);

  window.history.pushState(null, "", url.toString());
  filteredProducts();
}

function displaySizeOfProductInSelect(products) {
  let sizeOfProduct = [];
  for (const product of products) {
    for (const item of product.size) {
      typeof item === "string"
        ? sizeOfProduct.push(item.toLowerCase())
        : sizeOfProduct.push(item);
    }
  }
  sizeOfProduct = [...new Set([...sizeOfProduct])];
  sizeOfProduct.sort((a, b) => {
    if (typeof a === "string") {
      return -1;
    }
  });
  sizeOfProduct.sort((a, b) => a - b);

  for (const item of sizeOfProduct) {
    const option = document.createElement("option");
    option.value = item;
    option.innerText = `SIZE ${item}`;
    sizeSelect.appendChild(option);
  }
}

function displayFilterItemsInSidebar(products) {
  let typeOfProduct = [];
  let saleOfProduct = [];
  for (const product of products) {
    typeOfProduct.push(product.type.toLowerCase());
    saleOfProduct.push(product.sale.toLowerCase());
  }

  typeOfProduct = [...new Set([...typeOfProduct])];
  saleOfProduct = [...new Set([...saleOfProduct])];

  for (const item of typeOfProduct) {
    const pTag = document.createElement("p");
    pTag.setAttribute("data-key", "type");
    pTag.setAttribute("data-value", item);
    pTag.innerText = item;
    typeCategories.appendChild(pTag);
  }

  for (const item of saleOfProduct) {
    const pTag = document.createElement("p");
    pTag.setAttribute("data-key", "sale");
    pTag.setAttribute("data-value", item);
    pTag.innerText = item;
    saleCategories.appendChild(pTag);
  }
}

function addActiveClassToFilterItems() {
  const urlParams = new URLSearchParams(window.location.search);

  const sort = urlParams.get("sort") || "";
  const gender = urlParams.get("gender") || "";
  const type = urlParams.get("type") || "";
  const sale = urlParams.get("sale") || "";
  const size = urlParams.get("size") || "";

  genderCategoriesItems.forEach((item) => {
    item.classList.remove("active");
    if (item.dataset.value === gender) {
      item.classList.add("active");
    }
  });

  const typeCategoriesItems = document.querySelectorAll(".type-categories p");
  const saleCategoriesItems = document.querySelectorAll(".sale-categories p");

  typeCategoriesItems.forEach((item) => {
    item.classList.remove("active");
    if (item.dataset.value === type) {
      item.classList.add("active");
    }
  });

  saleCategoriesItems.forEach((item) => {
    item.classList.remove("active");
    if (item.dataset.value === sale) {
      item.classList.add("active");
    }
  });
  sortSelect.value = sort;
  sizeSelect.value = size;
}
