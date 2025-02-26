document.addEventListener("DOMContentLoaded", async function () {
  let cartContainer = document.querySelector(".shop");
  let totalElement = document.querySelector(".totalPrice");
  let summaryElement = document.querySelector(".right-bar");

  let subtotal = 0;
  let shipping = 15; // Flat shipping fee
  let taxRate = 0.05; // 5% tax

  cartContainer.innerHTML = ""; // Clear old cart content

  try {
    let response = await fetch("https://new-e-com-wirq.onrender.com/api/cart/");
    if (!response.ok) {
      throw new Error("Failed to fetch cart data");
    }
    let cart = await response.json();

    console.log("Loaded cart from backend:", cart);

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty!</p>";
      totalElement.innerText = "Total: $0.00";
      summaryElement.innerHTML = `
        <p><span>Subtotal</span> <span>$0.00</span></p>
        <hr />
        <p><span>Tax (5%)</span> <span>$0.00</span></p>
        <hr />
        <p><span>Shipping</span> <span>$${shipping.toFixed(2)}</span></p>
        <hr />
        <p><span>Total</span> <span>$${shipping.toFixed(2)}</span></p>
        <a href="checkout.html"><i class="fa fa-shopping-cart"></i> Checkout</a>
      `;
      return;
    }

    cart.forEach((item) => {
      let itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      let cartItem = document.createElement("div");
      cartItem.classList.add("box");
      cartItem.innerHTML = `
          <img src="${item.image}" />
          <div class="content">
            <h3>${item.productName}</h3>
            <h4>Price: $${item.price}</h4>
            <p class="unit">Quantity: ${item.quantity}</p>
            <p class="subtotal">Subtotal: $${itemTotal.toFixed(2)}</p>
          </div>
        `;
      cartContainer.appendChild(cartItem);
    });

    let tax = subtotal * taxRate;
    let total = subtotal + tax + shipping;

    summaryElement.innerHTML = `
        <p><span>Subtotal</span> <span>$${subtotal.toFixed(2)}</span></p>
        <hr />
        <p><span>Tax (5%)</span> <span>$${tax.toFixed(2)}</span></p>
        <hr />
        <p><span>Shipping</span> <span>$${shipping.toFixed(2)}</span></p>
        <hr />
        <p><span>Total</span> <span>$${total.toFixed(2)}</span></p>
        <a href="checkout.html"><i class="fa fa-shopping-cart"></i> Checkout</a>
      `;

    totalElement.innerText = `Total: $${total.toFixed(2)}`;
  } catch (error) {
    console.error("Error fetching cart data:", error);
    cartContainer.innerHTML =
      "<p>Failed to load cart. Please try again later.</p>";
  }
});
