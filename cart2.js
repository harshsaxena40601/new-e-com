// Add JavaScript functionality
document.addEventListener("DOMContentLoaded", function () {
  // Quantity buttons functionality
  const minusBtns = document.querySelectorAll(".quantity-btn.minus");
  const plusBtns = document.querySelectorAll(".quantity-btn.plus");

  minusBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const valueSpan = this.parentNode.querySelector(".quantity-value");
      let quantity = parseInt(valueSpan.textContent);

      if (quantity > 1) {
        quantity--;
        valueSpan.textContent = quantity;
        updateTotals();
      }
    });
  });

  plusBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const valueSpan = this.parentNode.querySelector(".quantity-value");
      let quantity = parseInt(valueSpan.textContent);

      quantity++;
      valueSpan.textContent = quantity;
      updateTotals();
    });
  });

  // Remove buttons functionality
  const removeBtns = document.querySelectorAll(".remove-btn");
  removeBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      this.closest(".cart-item").remove();
      updateCartCount();
      updateTotals();

      // Show empty cart state if no items
      if (document.querySelectorAll(".cart-item").length === 0) {
        document.querySelector(".empty-cart").style.display = "block";
        document.querySelector(".back-link").style.display = "none";
      }
    });
  });

  // Update cart count
  function updateCartCount() {
    const itemCount = document.querySelectorAll(".cart-item").length;
    document.querySelector(".cart-count").textContent =
      itemCount + (itemCount === 1 ? " item" : " items");

    // Update subtotal label
    document.querySelector(
      ".summary-row:first-of-type div:first-child"
    ).textContent =
      "Subtotal (" + itemCount + (itemCount === 1 ? " item)" : " items)");
  }

  // Update totals
  function updateTotals() {
    const items = document.querySelectorAll(".cart-item");
    let subtotal = 0;

    items.forEach((item) => {
      const priceText = item
        .querySelector(".item-price")
        .textContent.trim()
        .split("\n")[0];
      const price = parseFloat(priceText.replace("₹", "").replace(",", ""));
      const quantity = parseInt(
        item.querySelector(".quantity-value").textContent
      );
      subtotal += price * quantity;
    });

    // Calculate discount (simplified for demo)
    const discount = items.length > 0 ? 1500 : 0;

    const shippingOption = document.querySelector(".shipping-options").value;
    const shipping = parseFloat(shippingOption.split("- ₹")[1] || 99);
    const total = subtotal - discount + shipping;

    // Format numbers with commas for Indian currency format
    function formatIndianCurrency(num) {
      return num.toLocaleString("en-IN");
    }

    // Update summary
    document.querySelector(
      ".summary-row:first-of-type div:last-child"
    ).textContent = "₹" + formatIndianCurrency(subtotal);

    document.querySelector(
      ".summary-row:nth-of-type(2) div:last-child"
    ).textContent = "-₹" + formatIndianCurrency(discount);

    document.querySelector(".total-row div:last-child").textContent =
      "₹" + formatIndianCurrency(total);
  }

  // Apply promo code
  const applyBtn = document.querySelector(".apply-btn");
  applyBtn.addEventListener("click", function () {
    const promoInput = document.querySelector(".code-input");
    if (promoInput.value.trim() !== "") {
      // Simple example - in real app, you'd validate the code
      alert("Promo code applied: " + promoInput.value);
      promoInput.value = "";
    }
  });

  // Shipping option change
  const shippingSelect = document.querySelector(".shipping-options");
  shippingSelect.addEventListener("change", function () {
    updateTotals();
  });
});
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("https://new-e-com-wirq.onrender.com");
    const data = await response.json();
    console.log("Server response:", data);
    // Process data and update the cart UI if needed
  } catch (error) {
    console.error("Error connecting to server:", error);
  }
});
