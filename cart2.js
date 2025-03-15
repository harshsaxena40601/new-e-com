// ✅ Select Elements
const iconCart = document.querySelector(".iconCart");
const cartButton = document.querySelector("#cartButton");
const cart = document.querySelector(".cart");
const container = document.querySelector(".container");
const close = document.querySelector(".close");
const listProductHTML = document.querySelector(".listProduct");
const listCartHTML = document.querySelector(".listCart");
const totalHTML = document.querySelector(".totalQuantity");

// ✅ Set API Base URL
const BASE_URL = "https://new-e-com-wirq.onrender.com";

// ✅ Store Products & Cart Data
let products = [];
let cartData = JSON.parse(localStorage.getItem("cart")) || [];

// ✅ Fetch Products from Backend & Display Them
async function fetchProducts() {
  try {
    const response = await fetch(`${BASE_URL}/api/products/`);
    if (!response.ok) throw new Error("Failed to fetch products");

    const data = await response.json();
    if (Array.isArray(data)) {
      products = data;
      displayProducts();

      // Share products data with the cart API
      if (window.cartApi) {
        window.cartApi.setProductData(products);
      }
    } else {
      console.error("Invalid product data format:", data);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// ✅ Display Products in the HTML
function displayProducts() {
  listProductHTML.innerHTML = "";

  if (products.length > 0) {
    products.forEach((product) => {
      let productImage = product.image.startsWith("http")
        ? product.image
        : `${BASE_URL}${product.image}`; // Ensure correct image path

      let productHTML = `
                <div class="item">
                    <img src="${productImage}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <div class="price">$${product.price}</div>
                    <button onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${productImage}')">Add To Cart</button>
                    <a href="productDescription.html?id=${product.id}" class="viewProductButton">View Product Details</a>
                </div>
            `;
      listProductHTML.innerHTML += productHTML;
    });
  } else {
    listProductHTML.innerHTML = "<p>No products available.</p>";
  }
}

// ✅ Add Product to Cart
function addToCart(productId, productName, price, image) {
  let existingItem = cartData.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartData.push({ productId, productName, price, image, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cartData));
  updateCartDisplay();

  // Also update the advanced cart functionality
  if (window.cartApi) {
    window.cartApi.addProduct(productId);
  }
}

// ✅ Display Cart Data in HTML
function updateCartDisplay() {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;

  cartData.forEach((product) => {
    let cartHTML = `
            <div class="item">
                <a href="productDescription.html?id=${product.productId}">
                    <img src="${product.image}" alt="${product.productName}">
                </a>
                <div class="content">
                    <div class="name">${product.productName}</div>
                    <div class="price">$${product.price} / 1 product</div>
                </div>
                <div class="quantity">
                    <button onclick="updateQuantity('${product.productId}', '-')">-</button>
                    <span class="value">${product.quantity}</span>
                    <button onclick="updateQuantity('${product.productId}', '+')">+</button>
                </div>
            </div>
        `;
    listCartHTML.innerHTML += cartHTML;
    totalQuantity += product.quantity;
  });

  totalHTML.innerText = totalQuantity;
}

// ✅ Update Product Quantity in Cart
function updateQuantity(productId, type) {
  let product = cartData.find((item) => item.productId === productId);

  if (product) {
    if (type === "+") {
      product.quantity++;
      // Sync with advanced cart
      if (window.cartApi) {
        window.cartApi.updateProductQuantity(productId, product.quantity);
      }
    } else if (type === "-") {
      product.quantity--;
      if (product.quantity <= 0) {
        cartData = cartData.filter((item) => item.productId !== productId);
        // Remove from advanced cart
        if (window.cartApi) {
          window.cartApi.removeProduct(productId);
        }
      } else {
        // Sync with advanced cart
        if (window.cartApi) {
          window.cartApi.updateProductQuantity(productId, product.quantity);
        }
      }
    }

    localStorage.setItem("cart", JSON.stringify(cartData));
    updateCartDisplay();
  }
}

// ✅ Toggle Cart View - Using CSS classes instead of inline styles
function toggleCart() {
  cart.classList.toggle("active");
  container.classList.toggle("shifted");
}

// ✅ Event Listeners for Cart Actions
iconCart.addEventListener("click", toggleCart);
cartButton.addEventListener("click", toggleCart);
close.addEventListener("click", () => {
  cart.classList.remove("active");
  container.classList.remove("shifted");
});

// ✅ Initialize App
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts(); // Fetch and display products
  updateCartDisplay(); // Load cart data from localStorage

  // Initialize the advanced cart functionality
  initializeAdvancedCartFunctionality();
});

// =====================================================
// ✅ ADVANCED CART FUNCTIONALITY (FROM SECOND JS FILE)
// =====================================================

function initializeAdvancedCartFunctionality() {
  // Cart data storage
  let cartItems = [];
  let productData = [];

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
    if (applyBtn) {
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
    }

    // Shipping option change
    const shippingSelect = document.querySelector(".shipping-options");
    if (shippingSelect) {
      shippingSelect.addEventListener("change", function () {
        updateTotals();
      });
    }

    // Checkout button
    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", async function () {
        try {
          // Use the cartData from the main JS file for checkout
          const checkoutItems = cartData.map((item) => ({
            id: item.productId,
            name: item.productName,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
          }));

          // Send cart data to server for checkout
          const response = await fetch(`${BASE_URL}/api/checkout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ items: checkoutItems }),
          });

          if (response.ok) {
            alert("Order placed successfully! Thank you for your purchase.");
            // Clear cart
            cartData = [];
            localStorage.setItem("cart", JSON.stringify(cartData));
            updateCartDisplay();

            // Update advanced cart display
            document
              .querySelectorAll(".cart-item")
              .forEach((item) => item.remove());
            cartItems = [];
            updateCartCount();
            updateTotals();

            const emptyCartElement = document.querySelector(".empty-cart");
            const backLinkElement = document.querySelector(".back-link");

            if (emptyCartElement) emptyCartElement.style.display = "block";
            if (backLinkElement) backLinkElement.style.display = "none";
          } else {
            alert("Failed to place order. Please try again.");
          }
        } catch (error) {
          console.error("Error during checkout:", error);
          alert("Failed to process checkout. Please try again later.");
        }
      });
    }
  }

  // Helper functions
  function updateCartItemQuantity(cartItemElement, quantity) {
    if (!cartItemElement) return;

    const itemName = cartItemElement.querySelector(".item-name")?.textContent;
    if (!itemName) return;

    const cartItem = cartItems.find((item) => item.name === itemName);

    if (cartItem) {
      cartItem.quantity = quantity;

      // Also update in the main cartData array
      const mainCartItem = cartData.find(
        (item) => item.productName === itemName
      );
      if (mainCartItem) {
        mainCartItem.quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(cartData));
        updateCartDisplay();
      }
    }
  }

  function updateProductQuantity(productId, quantity) {
    const cartItemElements = document.querySelectorAll(".cart-item");

    cartItemElements.forEach((item) => {
      const itemProductId = item.dataset.productId;
      if (itemProductId === productId) {
        const quantityElement = item.querySelector(".quantity-value");
        if (quantityElement) {
          quantityElement.textContent = quantity;
          updateTotals();
        }
      }
    });
  }

  function removeCartItem(cartItemElement) {
    if (!cartItemElement) return;

    const itemName = cartItemElement.querySelector(".item-name")?.textContent;
    if (!itemName) return;

    cartItems = cartItems.filter((item) => item.name !== itemName);

    // Also remove from main cartData
    const itemProductId = cartItemElement.dataset.productId;
    if (itemProductId) {
      cartData = cartData.filter((item) => item.productId !== itemProductId);
      localStorage.setItem("cart", JSON.stringify(cartData));
      updateCartDisplay();
    }
  }

  // Update cart count
  function updateCartCount() {
    const cartCountElement = document.querySelector(".cart-count");
    if (!cartCountElement) return;

    const itemCount = document.querySelectorAll(".cart-item").length;
    cartCountElement.textContent =
      itemCount + (itemCount === 1 ? " item" : " items");

    // Update subtotal label
    const subtotalElement = document.querySelector(
      ".summary-row:first-of-type div:first-child"
    );
    if (subtotalElement) {
      subtotalElement.textContent =
        "Subtotal (" + itemCount + (itemCount === 1 ? " item)" : " items)");
    }
  }

  // Update totals
  function updateTotals(promoDiscount = 0) {
    const subtotalElement = document.querySelector(
      ".summary-row:first-of-type div:last-child"
    );
    const discountElement = document.querySelector(
      ".summary-row:nth-of-type(2) div:last-child"
    );
    const totalElement = document.querySelector(".total-row div:last-child");

    if (!subtotalElement || !discountElement || !totalElement) return;

    const items = document.querySelectorAll(".cart-item");
    let subtotal = 0;

    items.forEach((item) => {
      const priceText = item
        .querySelector(".item-price")
        ?.textContent.trim()
        .split("\n")[0];
      if (!priceText) return;

      const price = parseFloat(priceText.replace("₹", "").replace(",", ""));
      const quantity = parseInt(
        item.querySelector(".quantity-value")?.textContent || "1"
      );
      subtotal += price * quantity;
    });

    // Calculate discount (server-based or default)
    let discount = items.length > 0 ? 1500 : 0;

    // Apply promo discount if available
    if (promoDiscount > 0) {
      discount += subtotal * (promoDiscount / 100);
    }

    const shippingOption = document.querySelector(".shipping-options")?.value;
    const shipping = shippingOption
      ? parseFloat(shippingOption.split("- ₹")[1] || 99)
      : 99;
    const total = subtotal - discount + shipping;

    // Format numbers with commas for Indian currency format
    function formatIndianCurrency(num) {
      return num.toLocaleString("en-IN");
    }

    // Update summary
    subtotalElement.textContent = "₹" + formatIndianCurrency(subtotal);
    discountElement.textContent = "-₹" + formatIndianCurrency(discount);
    totalElement.textContent = "₹" + formatIndianCurrency(total);
  }

  // Add a new product to the cart from server data
  function addServerProductToCart(productId) {
    // Find product in products array
    const product = productData.find((p) => p.id === productId);
    if (!product) return;

    // Check if we already have this product in cartItems
    const existingItem = cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity++;

      // Update quantity in the DOM
      const cartItemElements = document.querySelectorAll(".cart-item");
      cartItemElements.forEach((item) => {
        if (item.dataset.productId === productId) {
          const quantityElement = item.querySelector(".quantity-value");
          if (quantityElement) {
            quantityElement.textContent = existingItem.quantity;
          }
        }
      });
    } else {
      // Create new cart item
      const cartSection = document.querySelector(".cart-section");
      if (!cartSection) return;

      const cartItemTemplate = `
        <div class="cart-item" data-product-id="${productId}">
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
    }

    // Hide empty cart message if shown
    const emptyCartElement = document.querySelector(".empty-cart");
    const backLinkElement = document.querySelector(".back-link");

    if (emptyCartElement) emptyCartElement.style.display = "none";
    if (backLinkElement) backLinkElement.style.display = "block";

    // Update counts and totals
    updateCartCount();
    updateTotals();

    // Reattach event listeners to the new elements
    setupCartFunctionality();
  }

  // Set product data from main JS
  function setProductData(data) {
    productData = data;

    // Sync with cartData from main JS
    cartData.forEach((item) => {
      const existingItem = cartItems.find(
        (cartItem) => cartItem.id === item.productId
      );
      if (!existingItem) {
        cartItems.push({
          id: item.productId,
          name: item.productName,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        });
      }
    });
  }

  // Function to display cart items
  function updateAdvancedCartDisplay() {
    // This function would be used if we're loading cart from localStorage
    // or if we need to refresh the entire cart display
    updateCartCount();
    updateTotals();
  }

  // Setup initial event listeners
  setupCartFunctionality();

  // Public API - these functions can be called from outside
  window.cartApi = {
    addProduct: addServerProductToCart,
    updateProductQuantity: updateProductQuantity,
    removeProduct: removeCartItem,
    refreshCart: updateAdvancedCartDisplay,
    setProductData: setProductData,
  };
}
