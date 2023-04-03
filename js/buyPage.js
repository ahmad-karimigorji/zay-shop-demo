import Menu from "./menu.js";
import Ui from "./ui.js";

const editModal = document.querySelector(".modal-edit");
const editBackDray = document.querySelector(".modal-edit-back-dray");

const promoCodeBody = document.querySelector(".promo-code-body");
const promoChevron = document.querySelector(".buy .fa-chevron-down");
const buy = document.querySelector(".buy");

document.addEventListener("DOMContentLoaded", (e) => {
  Menu;
  Ui.displayBuyPage();
});

buy.addEventListener("click", (e) => {
  const item = e.target;

  if (
    item.classList.contains("promo-title") ||
    item.classList.contains("fa-chevron-down")
  ) {
    promoCodeBody.classList.toggle("active");
    promoChevron.classList.toggle("active");
  }
});

editModal.addEventListener("click", Ui.closeEditModalFunction);
editBackDray.addEventListener("click", Ui.closeEditModalFunction);
