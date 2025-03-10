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

// ✅ Fetch Products & Display
async function fetchProducts() {
  try {
    const response = await fetch(`${BASE_URL}/api/products/`);
    if (!response.ok) throw new Error("Failed to fetch products");

    const data = await response.json();
    if (Array.isArray(data)) {
      products = data;
      displayProducts();
    } else {
      console.error("Invalid product data format:", data);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// ✅ Display Products
function displayProducts() {
  if (!listProductHTML) return; // If not on the product listing page, exit

  listProductHTML.innerHTML = "";

  if (products.length > 0) {
    products.forEach((product) => {
      let productImage = product.image.startsWith("http")
        ? product.image
        : `${BASE_URL}${product.image}`;

      let productHTML = `
                <div class="item">
                    <img src="${productImage}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <div class="price">$${product.price}</div>
                    <button onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${productImage}')">Add To Cart</button>
                    <a href="productDescription.html?id=${product.id}" class="viewProductButton">View Details</a>
                </div>
            `;
      listProductHTML.innerHTML += productHTML;
    });
  } else {
    listProductHTML.innerHTML = "<p>No products available.</p>";
  }
}

// ✅ Fetch Product Details (If on product description page)
async function fetchProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) return; // Exit if not on product page

  try {
    const response = await fetch(`${BASE_URL}/api/products/${productId}/`);
    if (!response.ok) throw new Error("Failed to fetch product details");

    const product = await response.json();
    displayProductDetails(product);
  } catch (error) {
    console.error("Error loading product:", error);
  }
}

// ✅ Display Single Product Details
function displayProductDetails(product) {
  const productContainer = document.querySelector("main.col-lg-6");
  if (!productContainer) return;

  productContainer.innerHTML = `
        <h1>${product.name}</h1>
        <img src="${BASE_URL}${product.image}" alt="${product.name}">
        <p>${product.description}</p>
        <div class="price">$${product.price}</div>
        <button onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${BASE_URL}${product.image}')">Add To Cart</button>
    `;
}

// ✅ Add to Cart
function addToCart(productId, productName, price, image) {
  let existingItem = cartData.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartData.push({ productId, productName, price, image, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cartData));
  updateCartDisplay();
}

// ✅ Display Cart
function updateCartDisplay() {
  if (!listCartHTML) return; // If cart section doesn't exist, exit

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

// ✅ Update Cart Quantity
function updateQuantity(productId, type) {
  let product = cartData.find((item) => item.productId === productId);

  if (product) {
    if (type === "+") {
      product.quantity++;
    } else if (type === "-") {
      product.quantity--;
      if (product.quantity <= 0) {
        cartData = cartData.filter((item) => item.productId !== productId);
      }
    }

    localStorage.setItem("cart", JSON.stringify(cartData));
    updateCartDisplay();
  }
}

// ✅ Toggle Cart Visibility
function toggleCart() {
  if (cart.style.right === "-100%" || cart.style.right === "") {
    cart.style.right = "0";
    container.style.transform = "translateX(-400px)";
  } else {
    cart.style.right = "-100%";
    container.style.transform = "translateX(0)";
  }
}

// ✅ Event Listeners
if (iconCart) iconCart.addEventListener("click", toggleCart);
if (cartButton) cartButton.addEventListener("click", toggleCart);
if (close)
  close.addEventListener("click", () => {
    cart.style.right = "-100%";
    container.style.transform = "translateX(0)";
  });

// ✅ Initialize Everything on Page Load
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts(); // Load products on home page
  fetchProductDetails(); // Load single product if on product page
  updateCartDisplay(); // Load cart from localStorage
});
