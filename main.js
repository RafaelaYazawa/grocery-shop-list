import { validateInput, mergeProducts, calculateTotalPrice } from "./utils.js";
import { renderTable, clearForm } from "./ui.js";
import {
  getProductsFromLocalStorage,
  saveProductsToLocalStorage,
  removeProductsFromLocalStorage,
} from "./storage.js";

const AddProductBtn = document.querySelector(".btn");
const productNameInput = document.querySelector("#product-name");
const productQuantity = document.querySelector("#quantity");
const productPrice = document.querySelector("#price");
const tableBody = document.querySelector("tbody");
const nameError = document.querySelector(".name-error");
const quantityError = document.querySelector(".quantity-error");
const priceError = document.querySelector(".price-error");

const totalPriceElement = document.querySelector(".total-price-value");

const resetTableBtn = document.querySelector(".reset-table");
resetTableBtn.addEventListener("click", () => {
  removeProductsFromLocalStorage();
  renderTable(tableBody, []);
  nameError.textContent = "";
  quantityError.textContent = "";
  priceError.textContent = "";

  totalPriceElement.textContent = "¥0";
});

AddProductBtn.addEventListener("click", () => {
  const name = productNameInput.value.trim().toLowerCase();
  const quantity = Number(productQuantity.value);
  const price = Number(productPrice.value);

  const errors = validateInput(name, quantity, price);
  nameError.textContent = errors.name || "";
  quantityError.textContent = errors.quantity || "";
  priceError.textContent = errors.price || "";

  if (Object.keys(errors).length > 0) return;

  const product = { name, quantity, price };

  const updatedProducts = mergeProducts(getProductsFromLocalStorage(), product);
  // const productsWithTotals = addProductWithTotalPrice(updatedProducts);

  saveProductsToLocalStorage(updatedProducts);

  updateTableAndTotal(updatedProducts);
  clearForm();
});

// Load products from localStorage and render the table on page load
document.addEventListener("DOMContentLoaded", () => {
  const products = getProductsFromLocalStorage();

  renderTable(tableBody, products);

  const total = calculateTotalPrice(products);
  totalPriceElement.textContent = `¥${total}`;
});

tableBody.addEventListener("focusout", (e) => {
  const cell = e.target;
  if (!cell || !cell.dataset.field) return;

  const row = cell.closest("tr");
  const index = Number(row.dataset.index);
  const field = cell.dataset.field;
  const value = cell.textContent.trim();

  const products = getProductsFromLocalStorage();
  const product = products[index];
  if (!product) return;

  if (field === "name") {
    if (!value || value.length < 1) {
      cell.textContent = product.name;
      return;
    }

    product.name = value.toLowerCase();
  }

  if (field === "quantity") {
    const quantity = Number(value);
    if (isNaN(quantity) || quantity <= 0) {
      cell.textContent = product.quantity;
      return;
    }
    product.quantity = quantity;
  }

  saveProductsToLocalStorage(products);
  updateTableAndTotal(products);
});

function updateTableAndTotal(products) {
  renderTable(tableBody, products);
  const total = calculateTotalPrice(products);
  totalPriceElement.textContent = `¥${total}`;
}
