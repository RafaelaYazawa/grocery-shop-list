function renderTable(table, products) {
  table.innerHTML = "";

  if (products.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML =
      "<td class='p-3' colspan='3'>Add some products to your list!</td>";
    table.appendChild(row);
    return;
  }

  products.forEach((product, rowIndex) => {
    const total = product.quantity * product.price;
    const row = document.createElement("tr");
    row.dataset.index = rowIndex;
    row.innerHTML = `
      <td class="p-2 border-b border-gray-500" data-field="name" contenteditable="true">${product.name}</td>
      <td class="p-2 border-b border-gray-500 flex items-center justify-between" data-field="quantity" >
        <button class="decrease-btn">-</button>
        <p class="quantity-value">${product.quantity}</p>
        <button class="increase-btn">+</button>
      </td>
      <td class="p-2 border-b border-gray-500" data-field="total">¥${total}</td>
    `;
    table.appendChild(row);
  });
}

function clearForm() {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => (input.value = ""));
}

export { renderTable, clearForm };
