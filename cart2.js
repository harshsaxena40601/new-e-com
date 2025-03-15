// Cart Server Connection - Connects the shopping cart to the Python server
document.addEventListener("DOMContentLoaded", function () {
  // Base URL for the Python server
  const BASE_URL = "https://new-e-com-wirq.onrender.com";

  // Cart data storage
  let cartItems = [];
  let productData = [];

  // Initial setup
  async function initializeCart() {
    try {
      await fetchProductData();
      setupCartFunctionality();
      updateCartDisplay();
    } catch (error) {
      console.error("Failed to initialize cart:", error);
    }
  }

  // Fetch product data from server
  async function fetchProductData() {
    try {
      const response = await fetch(`${BASE_URL}/api/products/`);
      if (!response.ok)
        throw new Error(`Server responded with status: ${response.status}`);

      const data = await response.json();
      console.log("Product data fetched:", data);

      if (Array.isArray(data)) {
        productData = data;
        updateCartWithProductData();
      } else {
        console.error("Invalid product data format:", data);
      }
    } catch (error) {
      console.error("Error fetching products from server:", error);
    }
  }

  // Update cart items with fresh product data
  function updateCartWithProductData() {
    // Get existing cart items from DOM
    const cartItemElements = document.querySelectorAll(".cart-item");

    cartItemElements.forEach((item) => {
      const itemName = item.querySelector(".item-name").textContent;
      const quantityValue = parseInt(
        item.querySelector(".quantity-value").textContent
      );

      // Find matching product from server data
      const matchedProduct = productData.find(
        (product) => product.name === itemName
      );

      if (matchedProduct) {
        // Update product details with server data
        const priceElement = item.querySelector(".item-price");
        const priceText = priceElement.textContent.trim().split("\n")[0];

        // Update price if different
        const serverPrice = `₹${matchedProduct.price}`;
        if (priceText !== serverPrice) {
          priceElement.innerHTML = `${serverPrice}<span class="remove-btn">×</span>`;
        }

        // Update image if needed
        const imgElement = item.querySelector(".item-image img");
        const productImage = matchedProduct.image.startsWith("http")
          ? matchedProduct.image
          : `${BASE_URL}${matchedProduct.image}`;

        if (imgElement.src !== productImage) {
          imgElement.src = productImage;
        }

        // Add to cart items array
        cartItems.push({
          id: matchedProduct.id,
          name: matchedProduct.name,
          price: matchedProduct.price,
          image: productImage,
          quantity: quantityValue,
        });
      }
    });

    console.log("Cart updated with server data:", cartItems);
  }

  // Set up cart event listeners and functionality
  function setupCartFunctionality() {
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
          updateCartItemQuantity(this.closest(".cart-item"), quantity);
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
        updateCartItemQuantity(this.closest(".cart-item"), quantity);
        updateTotals();
      });
    });

    // Remove buttons functionality
    const removeBtns = document.querySelectorAll(".remove-btn");
    removeBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const cartItem = this.closest(".cart-item");
        removeCartItem(cartItem);
        cartItem.remove();
        updateCartCount();
        updateTotals();

        // Show empty cart state if no items
        if (document.querySelectorAll(".cart-item").length === 0) {
          document.querySelector(".empty-cart").style.display = "block";
          document.querySelector(".back-link").style.display = "none";
        }
      });
    });

    // Apply promo code
    const applyBtn = document.querySelector(".apply-btn");
    applyBtn.addEventListener("click", async function () {
      const promoInput = document.querySelector(".code-input");
      const promoCode = promoInput.value.trim();

      if (promoCode !== "") {
        try {
          // Validate promo code with server
          const response = await fetch(`${BASE_URL}/api/validate-promo`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: promoCode }),
          });

          if (response.ok) {
            const data = await response.json();
            alert(
              `Promo code applied: ${promoCode}. Discount: ${data.discount}%`
            );
            promoInput.value = "";
            updateTotals(data.discount);
          } else {
            alert("Invalid promo code. Please try again.");
          }
        } catch (error) {
          console.error("Error validating promo code:", error);
          alert("Failed to validate promo code. Please try again later.");
        }
      }
    });

    // Shipping option change
    const shippingSelect = document.querySelector(".shipping-options");
    shippingSelect.addEventListener("change", function () {
      updateTotals();
    });

    // Checkout button
    const checkoutBtn = document.querySelector(".checkout-btn");
    checkoutBtn.addEventListener("click", async function () {
      try {
        // Send cart data to server for checkout
        const response = await fetch(`${BASE_URL}/api/checkout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ items: cartItems }),
        });

        if (response.ok) {
          alert("Order placed successfully! Thank you for your purchase.");
          // Clear cart
          document
            .querySelectorAll(".cart-item")
            .forEach((item) => item.remove());
          cartItems = [];
          updateCartCount();
          updateTotals();
          document.querySelector(".empty-cart").style.display = "block";
          document.querySelector(".back-link").style.display = "none";
        } else {
          alert("Failed to place order. Please try again.");
        }
      } catch (error) {
        console.error("Error during checkout:", error);
        alert("Failed to process checkout. Please try again later.");
      }
    });
  }

  // Helper functions
  function updateCartItemQuantity(cartItemElement, quantity) {
    const itemName = cartItemElement.querySelector(".item-name").textContent;
    const cartItem = cartItems.find((item) => item.name === itemName);

    if (cartItem) {
      cartItem.quantity = quantity;
    }
  }

  function removeCartItem(cartItemElement) {
    const itemName = cartItemElement.querySelector(".item-name").textContent;
    cartItems = cartItems.filter((item) => item.name !== itemName);
  }

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
  function updateTotals(promoDiscount = 0) {
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

    // Calculate discount (server-based or default)
    let discount = items.length > 0 ? 1500 : 0;

    // Apply promo discount if available
    if (promoDiscount > 0) {
      discount += subtotal * (promoDiscount / 100);
    }

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

  // Add a new product to the cart from server data
  function addServerProductToCart(productId) {
    const product = productData.find((p) => p.id === productId);

    if (!product) return;

    const cartItemTemplate = `
      <div class="cart-item">
        <div class="item-image">
          <img src="${
            product.image.startsWith("http")
              ? product.image
              : `${BASE_URL}${product.image}`
          }" alt="${product.name}" />
        </div>
        <div class="item-details">
          <div class="item-category">${product.category || "Product"}</div>
          <div class="item-name">${product.name}</div>
          ${
            product.originalPrice
              ? `<div class="savings">
            <span class="original-price">₹${product.originalPrice}</span> ${
                  product.discountPercentage || "-20%"
                }
          </div>`
              : ""
          }
        </div>
        <div class="item-quantity">
          <button class="quantity-btn minus">-</button>
          <span class="quantity-value">1</span>
          <button class="quantity-btn plus">+</button>
        </div>
        <div class="item-price">
          ₹${product.price}
          <span class="remove-btn">×</span>
        </div>
      </div>
    `;

    // Add to DOM
    const cartSection = document.querySelector(".cart-section");
    const backLink = document.querySelector(".back-link");
    cartSection.insertAdjacentHTML("beforeend", cartItemTemplate);

    // Add to cart items array
    cartItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image.startsWith("http")
        ? product.image
        : `${BASE_URL}${product.image}`,
      quantity: 1,
    });

    // Hide empty cart message if shown
    document.querySelector(".empty-cart").style.display = "none";
    document.querySelector(".back-link").style.display = "block";

    // Update counts and totals
    updateCartCount();
    updateTotals();

    // Reattach event listeners to the new elements
    setupCartFunctionality();
  }

  // Function to display cart items
  function updateCartDisplay() {
    // This function would be used if we're loading cart from localStorage
    // or if we need to refresh the entire cart display
    updateCartCount();
    updateTotals();
  }

  // Public API - these functions can be called from outside
  window.cartApi = {
    addProduct: addServerProductToCart,
    updateQuantity: updateCartItemQuantity,
    removeProduct: removeCartItem,
    refreshCart: initializeCart,
  };

  // Initialize cart when DOM is loaded
  initializeCart();
});
