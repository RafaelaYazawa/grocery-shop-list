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

function mergeProducts(products, newProduct) {
  const existingProductIndex = products.findIndex(
    (item) => item.name.toLowerCase() === newProduct.name.toLowerCase(),
  );

  if (existingProductIndex !== -1) {
    return products.map((item, index) =>
      index === existingProductIndex
        ? {
            ...item,
            quantity: item.quantity + newProduct.quantity,
            price: newProduct.price,
          }
        : item,
    );
  }

  return [...products, newProduct];
}

function calculateTotalPrice(products) {
  return products.reduce((total, product) => {
    return total + product.quantity * product.price;
  }, 0);
}

export { validateInput, mergeProducts, calculateTotalPrice };
