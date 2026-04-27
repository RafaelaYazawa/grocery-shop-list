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
  const name =
    productNameInput.value.trim().charAt(0).toUpperCase() +
    productNameInput.value.trim().slice(1).toLowerCase();
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

    product.name = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  saveProductsToLocalStorage(products);
  console.log("Product updated:", product);
});

function updateTableAndTotal(products) {
  renderTable(tableBody, products);
  const total = calculateTotalPrice(products);
  totalPriceElement.textContent = `¥${total}`;
}

tableBody.addEventListener("click", (e) => {
  const products = getProductsFromLocalStorage();

  const row = e.target.closest("tr");
  if (!row) return;

  const index = Number(row.dataset.index);
  const product = products[index];
  if (!product) return;

  const increaseBtn = e.target.classList.contains("increase-btn");
  const decreaseBtn = e.target.classList.contains("decrease-btn");

  if (increaseBtn) {
    product.quantity += 1;
  } else if (decreaseBtn) {
    if (product.quantity <= 1) {
      products.splice(index, 1);
      updateTableAndTotal(products);
      return;
    } else {
      product.quantity -= 1;
    }
  } else {
    return;
  }

  saveProductsToLocalStorage(products);

  const quantityValue = row.querySelector(".quantity-value");
  const totalCell = row.querySelector('[data-field="total"]');

  quantityValue.textContent = product.quantity;
  totalCell.textContent = `¥${product.quantity * product.price}`;

  const total = calculateTotalPrice(products);
  totalPriceElement.textContent = `¥${total}`;
});
