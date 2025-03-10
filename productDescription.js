// ✅ Select Elements
const minusButton = document.querySelector(
  ".quantity-input button:first-child"
);
const plusButton = document.querySelector(".quantity-input button:last-child");
const quantityInput = document.querySelector(".quantity-input input");
const addToCartBtn = document.querySelector(".btn-primary");

// ✅ Set API Base URL
const BASE_URL = "https://new-e-com-wirq.onrender.com";

// ✅ Store Cart Data
let cartData = JSON.parse(localStorage.getItem("cart")) || [];

// ✅ Product Data (This would normally come from an API)
const currentProduct = {
  id: "product-001",
  name: "Quality Men's Hoodie for Winter",
  price: 75.0,
  image: "image_large.jpg",
};

// ✅ Update Quantity
function updateQuantity(type) {
  let currentValue = parseInt(quantityInput.value);

  if (type === "+") {
    quantityInput.value = currentValue + 1;
  } else if (type === "-" && currentValue > 1) {
    quantityInput.value = currentValue - 1;
  }
}

// ✅ Add to Cart
function addToCart() {
  const quantity = parseInt(quantityInput.value);
  const productId = currentProduct.id;
  const productName = currentProduct.name;
  const price = currentProduct.price;
  const image = currentProduct.image;

  // Check if product already exists in cart
  let existingItem = cartData.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cartData.push({ productId, productName, price, image, quantity });
  }

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cartData));

  // Show confirmation to user
  alert(`${quantity} ${productName} added to cart!`);
}

// ✅ Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Setup quantity buttons
  if (minusButton) {
    minusButton.addEventListener("click", (e) => {
      e.preventDefault();
      updateQuantity("-");
    });
  }

  if (plusButton) {
    plusButton.addEventListener("click", (e) => {
      e.preventDefault();
      updateQuantity("+");
    });
  }

  // Setup add to cart button
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      addToCart();
    });
  }
});
