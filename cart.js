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

// ✅ Toggle Cart View
function toggleCart() {
  if (cart.style.right === "-100%" || cart.style.right === "") {
    cart.style.right = "0";
    container.style.transform = "translateX(-400px)";
  } else {
    cart.style.right = "-100%";
    container.style.transform = "translateX(0)";
  }
}

// ✅ Event Listeners for Cart Actions
iconCart.addEventListener("click", toggleCart);
cartButton.addEventListener("click", toggleCart);
close.addEventListener("click", () => {
  cart.style.right = "-100%";
  container.style.transform = "translateX(0)";
});

// ✅ Initialize App
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts(); // Fetch and display products
  updateCartDisplay(); // Load cart data from localStorage
});
