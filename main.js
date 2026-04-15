const AddProductBtn = document.querySelector(".btn");
const productNameInput = document.querySelector("#product-name");
const productQuantity = document.querySelector("#quantity");
const productPrice = document.querySelector("#price");
const tableBody = document.querySelector("tbody");

const resetTableBtn = document.querySelector(".reset-table");
resetTableBtn.addEventListener("click", () => {
  localStorage.clear();
  tableBody.innerHTML = "";

  const row = document.createElement("tr");
  row.innerHTML =
    "<td class='p-3' colspan='3'>Add some products to your list!</td>";
  tableBody.appendChild(row);
});

AddProductBtn.addEventListener("click", () => {
  const name = productNameInput.value;
  const quantity = Number(productQuantity.value);
  const price = Number(productPrice.value);

  const errors = validateInput(name, quantity, price);
  document.querySelector(".name-error").textContent = errors.name || "";
  document.querySelector(".quantity-error").textContent = errors.quantity || "";
  document.querySelector(".price-error").textContent = errors.price || "";

  if (Object.keys(errors).length > 0) return;

  const product = { name, quantity, price };

  const updatedProducts = updateProductInLocalStorage(product);

  renderTable(updatedProducts);
  clearForm();
});

function calculateTotalPricePerItem(quantity, price) {
  return quantity * price;
}

//  Check if fields are empty || 0 || null || undefined
function validateInput(name, quantity, price) {
  const errors = {};

  if (!name || name.trim() === "") {
    errors.name = "Product name cannot be empty.";
  }
  if (Number.isNaN(quantity) || quantity <= 0) {
    errors.quantity = "Quantity must be greater than 0.";
  }
  if (Number.isNaN(price) || price <= 0) {
    errors.price = "Price must be greater than 0.";
  }

  return errors;
}

function renderTable(products) {
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = "";

  products.forEach((product) => {
    const totalPricePerItem = calculateTotalPricePerItem(
      product.quantity,
      product.price,
    );

    const row = document.createElement("tr");
    row.innerHTML = rowTemplate(product, totalPricePerItem);
    tableBody.appendChild(row);
  });
}

// Add row template to table body
function rowTemplate(product, totalPricePerItem) {
  return `
      <td class="p-2 border-b border-gray-500">${product.name}</td>
      <td class="p-2 border-b border-gray-500">${product.quantity}</td>
      <td class="p-2 border-b border-gray-500">¥${totalPricePerItem}</td>
  `;
}

// Check if product exists in localStorage. If it does, add the quantity to the existing product and update the total price of it. If it doesn't, add the new product to localStorage and display it in the table.
function updateProductInLocalStorage(product) {
  const products = JSON.parse(localStorage.getItem("products")) || [];

  const existingProductIndex = products.findIndex(
    (item) => item.name === product.name,
  );

  if (existingProductIndex !== -1) {
    const existingProduct = products[existingProductIndex];

    const updatedQuantity =
      Number(existingProduct.quantity) + Number(product.quantity);

    products[existingProductIndex] = {
      ...existingProduct,
      quantity: updatedQuantity,
      // price: product.price,
    };
  } else {
    products.push(product);
  }

  localStorage.setItem("products", JSON.stringify(products));

  return products;
}

function clearForm() {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => (input.value = ""));
}

// Load products from localStorage and render the table on page load
document.addEventListener("DOMContentLoaded", () => {
  const products = JSON.parse(localStorage.getItem("products")) || [];

  if (products.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML =
      "<td class='p-3' colspan='3'>Add some products to your list!</td>";
    tableBody.appendChild(row);
  } else {
    renderTable(products);
  }
});
