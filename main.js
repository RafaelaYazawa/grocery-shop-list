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

  renderTable(tableBody, updatedProducts);
  const total = calculateTotalPrice(updatedProducts);
  totalPriceElement.textContent = `¥${total}`;

  clearForm();
});

// Load products from localStorage and render the table on page load
document.addEventListener("DOMContentLoaded", () => {
  const products = getProductsFromLocalStorage();

  renderTable(tableBody, products);

  const total = calculateTotalPrice(products);
  totalPriceElement.textContent = `¥${total}`;
});
