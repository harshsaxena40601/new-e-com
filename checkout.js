let listCart = [];

function checkCart() {
  var cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("listCart="));
  if (cookieValue) {
    listCart = JSON.parse(cookieValue.split("=")[1]);
  }
}

checkCart();
addCartToHTML();

function addCartToHTML() {
  // clear data default
  let listCartHTML = document.querySelector(".returnCart .list");
  listCartHTML.innerHTML = "";

  let totalQuantityHTML = document.querySelector(".totalQuantity");
  let totalPriceHTML = document.querySelector(".totalPrice");
  let totalQuantity = 0;
  let totalPrice = 0;

  // if has product in Cart
  if (listCart) {
    listCart.forEach((product) => {
      if (product) {
        let newCart = document.createElement("div");
        newCart.classList.add("item");
        newCart.innerHTML = `<img src="${product.image}">
                    <div class="info">
                        <div class="name">${product.name}</div>
                        <div class="price">$${product.price}/1 product</div>
                    </div>
                    <div class="quantity">${product.quantity}</div>
                    <div class="returnPrice">$${
                      product.price * product.quantity
                    }</div>`;
        listCartHTML.appendChild(newCart);
        totalQuantity += product.quantity;
        totalPrice += product.price * product.quantity;
      }
    });
  }

  totalQuantityHTML.innerText = totalQuantity;
  totalPriceHTML.innerText = "$" + totalPrice;
}

document.addEventListener("DOMContentLoaded", async () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.querySelector(".list");
  const totalQuantityElement = document.querySelector(".totalQuantity");
  const totalPriceElement = document.querySelector(".totalPrice");

  let totalQuantity = 0;
  let totalPrice = 0;

  cartContainer.innerHTML = ""; // Clear previous cart items

  try {
    // ✅ Fetch product details from the deployed backend
    const response = await fetch(
      "https://new-e-com-wirq.onrender.com/api/products/"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const products = await response.json();

    cart.forEach((cartItem) => {
      let product = products.find((p) => p.id === cartItem.id);
      if (!product) return;

      totalQuantity += cartItem.quantity;
      totalPrice += product.price * cartItem.quantity;

      let itemElement = document.createElement("div");
      itemElement.classList.add("item");
      itemElement.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <div class="info">
              <div class="name">${product.name}</div>
              <div class="price">$${product.price} per item</div>
          </div>
          <div class="quantity">${cartItem.quantity}</div>
          <div class="returnPrice">$${(
            product.price * cartItem.quantity
          ).toFixed(2)}</div>
      `;

      cartContainer.appendChild(itemElement);
    });

    // Update total values
    totalQuantityElement.innerText = totalQuantity;
    totalPriceElement.innerText = `$${totalPrice.toFixed(2)}`;
  } catch (error) {
    console.error("Error fetching cart product data:", error);
  }
});
