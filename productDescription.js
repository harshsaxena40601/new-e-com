// ✅ Select Elements
const productTitle = document.querySelector(".product-title");
const productImage = document.querySelector(".image-container img");
const productPrice = document.querySelector(".price-value");
const productDescription = document.querySelector(".product-details p");
const addToCartButton = document.querySelector(".checkout");

// ✅ Set API Base URL
const BASE_URL = "https://new-e-com-wirq.onrender.com";

// ✅ Get Product ID from URL Parameters
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// ✅ Fetch Product Details from Backend
async function fetchProductDetails() {
  if (!productId) {
    console.error("Product ID not found in URL");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/products/${productId}`);
    if (!response.ok) throw new Error("Failed to fetch product details");

    const product = await response.json();
    displayProductDetails(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}

// ✅ Display Product Details in HTML
function displayProductDetails(product) {
  if (!product) {
    console.error("Invalid product data");
    return;
  }

  let productImg = product.image.startsWith("http")
    ? product.image
    : `${BASE_URL}${product.image}`; // Ensure correct image path

  productTitle.textContent = product.name;
  productImage.src = productImg;
  productImage.alt = product.name;
  productPrice.textContent = `$${product.price}`;
  productDescription.textContent = product.description;

  // Add event listener to add to cart button
  addToCartButton.onclick = () =>
    addToCart(product.id, product.name, product.price, productImg);
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
