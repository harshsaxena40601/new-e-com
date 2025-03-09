// ✅ Select Elements
const productImage = document.querySelector(".product-image");
const productName = document.querySelector(".product-name");
const productPrice = document.querySelector(".product-price");
const productDescription = document.querySelector(".product-description");
const addToCartButton = document.querySelector("#addToCartButton");

// ✅ Set API Base URL
const BASE_URL = "https://new-e-com-wirq.onrender.com";

// ✅ Get Product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// ✅ Fetch Product Details from Backend
async function fetchProductDetails() {
  try {
    const response = await fetch(`${BASE_URL}/api/products/${productId}/`);
    if (!response.ok) throw new Error("Failed to fetch product details");

    const product = await response.json();

    // Ensure correct image path
    let productImageUrl = product.image.startsWith("http")
      ? product.image
      : `${BASE_URL}${product.image}`;

    // ✅ Display Product Details
    productImage.src = productImageUrl;
    productImage.alt = product.name;
    productName.innerText = product.name;
    productPrice.innerText = `$${product.price}`;
    productDescription.innerText = product.description;

    // ✅ Add to Cart Button Event
    addToCartButton.addEventListener("click", () => {
      addToCart(product.id, product.name, product.price, productImageUrl);
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}

// ✅ Add Product to Cart
function addToCart(productId, productName, price, image) {
  let cartData = JSON.parse(localStorage.getItem("cart")) || [];
  let existingItem = cartData.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartData.push({ productId, productName, price, image, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cartData));
  alert("Product added to cart!");
}

// ✅ Initialize Fetch on Page Load
document.addEventListener("DOMContentLoaded", fetchProductDetails);
