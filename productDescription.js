// ✅ Store Cart Data
let cartData = JSON.parse(localStorage.getItem("cart")) || [];

// ✅ Set API Base URL
const BASE_URL = "https://new-e-com-wirq.onrender.com";

// ✅ Product Data (Hardcoded for this specific page)
const currentProduct = {
  id: "product-001",
  name: "Quality Men's Hoodie for Winter",
  price: 75.0,
  image: "image_large.jpg",
};

// ✅ Product Quantity Functions
function decreaseQuantity() {
  const quantityInput = document.querySelector(".quantity-input input");
  const currentValue = parseInt(quantityInput.value);
  if (currentValue > 1) {
    quantityInput.value = currentValue - 1;
  }
}

function increaseQuantity() {
  const quantityInput = document.querySelector(".quantity-input input");
  const currentValue = parseInt(quantityInput.value);
  quantityInput.value = currentValue + 1;
}

// ✅ Add to Cart Function
function addToCart() {
  const quantityInput = document.querySelector(".quantity-input input");
  const quantity = parseInt(quantityInput.value);

  let existingItem = cartData.find(
    (item) => item.productId === currentProduct.id
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cartData.push({
      productId: currentProduct.id,
      productName: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.image,
      quantity: quantity,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cartData));
  updateCartBadge();
  alert(`${quantity} item(s) added to your cart!`);
}

// ✅ Update Cart Badge (small indicator showing cart items)
function updateCartBadge() {
  // You can add a cart badge later if needed
  let totalItems = 0;
  cartData.forEach((item) => {
    totalItems += item.quantity;
  });

  // If you add a cart badge to your HTML, uncomment this:
  // const badge = document.querySelector('.cart-badge');
  // if (badge) badge.textContent = totalItems;

  console.log(`Cart updated: ${totalItems} items`);
}

// ✅ Initialize Page
document.addEventListener("DOMContentLoaded", function () {
  // Set up decrease quantity button
  const decreaseBtn = document.querySelector(
    ".quantity-input button:first-child"
  );
  if (decreaseBtn) {
    decreaseBtn.addEventListener("click", function (e) {
      e.preventDefault();
      decreaseQuantity();
    });
  }

  // Set up increase quantity button
  const increaseBtn = document.querySelector(
    ".quantity-input button:last-child"
  );
  if (increaseBtn) {
    increaseBtn.addEventListener("click", function (e) {
      e.preventDefault();
      increaseQuantity();
    });
  }

  // Set up add to cart button
  const addToCartBtn = document.querySelector(".btn-primary");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function (e) {
      e.preventDefault();
      addToCart();
    });
  }

  // Initialize cart badge
  updateCartBadge();

  // Fetch Product Details (for future use)
  // This would normally fetch the product data from your API
  // but we're using the hardcoded data for now
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (productId) {
    console.log(`Product ID from URL: ${productId}`);
    // You could fetch product details here in the future
    // fetchProductDetails(productId);
  }
});

// ✅ Function to fetch product details (for future implementation)
async function fetchProductDetails(productId) {
  try {
    const response = await fetch(`${BASE_URL}/api/products/${productId}/`);
    if (!response.ok) throw new Error("Failed to fetch product details");

    const product = await response.json();
    console.log("Product details:", product);
    // You would update the page with product details here
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}
