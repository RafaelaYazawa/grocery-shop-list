function getProductsFromLocalStorage() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  return products.filter((p) => p && p.name && p.quantity && p.price);
}

function saveProductsToLocalStorage(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

function removeProductsFromLocalStorage() {
  localStorage.removeItem("products");
}

export {
  getProductsFromLocalStorage,
  saveProductsToLocalStorage,
  removeProductsFromLocalStorage,
};
