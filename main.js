const AddProductBtn = document.querySelector(".btn");
const productNameInput = document.querySelector("#product-name");
const productQuantity = document.querySelector("#quantity");
const productPrice = document.querySelector("#product-price");

AddProductBtn.addEventListener("click", () => {
  const name = productNameInput.value;
  const quantity = productQuantity.value;
  const price = productPrice.value;

  if (name && quantity && price) {
    const product = {
      name,
      quantity,
      price,
    };

    console.log("Product added:", product);
  }
});
