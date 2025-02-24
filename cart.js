let iconCart = document.querySelector(".iconCart");
let cartButton = document.querySelector("#cartButton");
let cart = document.querySelector(".cart");
let container = document.querySelector(".container");
let close = document.querySelector(".close");

const BASE_URL = "http://127.0.0.1:8000"; // Change to your actual backend URL

// Function to toggle the cart view
function toggleCart() {
  if (cart.style.right === "-100%" || cart.style.right === "") {
    cart.style.right = "0";
    container.style.transform = "translateX(-400px)";
  } else {
    cart.style.right = "-100%";
    container.style.transform = "translateX(0)";
  }
}

iconCart.addEventListener("click", toggleCart);
cartButton.addEventListener("click", toggleCart);
close.addEventListener("click", function () {
  cart.style.right = "-100%";
  container.style.transform = "translateX(0)";
});

let products = [];

// ✅ Fetch products from Django backend API
fetch(`${BASE_URL}/api/products/`)
  .then((response) => response.json())
  .then((data) => {
    if (Array.isArray(data)) {
      products = data;
      addDataToHTML();
    } else {
      console.error("Invalid product data format", data);
    }
  })
  .catch((error) => console.error("Error fetching products:", error));

// ✅ Display products in the HTML
function addDataToHTML() {
  let listProductHTML = document.querySelector(".listProduct");
  listProductHTML.innerHTML = "";

  if (products.length > 0) {
    products.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.classList.add("item");

      let productImage = product.image.startsWith("http")
        ? product.image
        : `${BASE_URL}${product.image}`;

      newProduct.innerHTML = `
            <img src="${productImage}" alt="${product.name}">
            <h2>${product.name}</h2>
            <div class="price">$${product.price}</div>
            <button onclick="addCart('${product.id}', '${product.name}', ${product.price}, '${productImage}')">Add To Cart</button>
            <a href="productDescription.html?id=${product.id}" class="viewProductButton">View Product Details</a>
        `;

      listProductHTML.appendChild(newProduct);
    });
  } else {
    listProductHTML.innerHTML = "<p>No products available.</p>";
  }
}

// ✅ Use localStorage for the cart
let cartData = JSON.parse(localStorage.getItem("cart")) || [];

// ✅ Add product to cart & sync storage
function addCart(productId, productName, price, image) {
  let existingItem = cartData.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartData.push({ productId, productName, price, image, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cartData));
  addCartToHTML();
}

// ✅ Display cart data
function addCartToHTML() {
  let listCartHTML = document.querySelector(".listCart");
  listCartHTML.innerHTML = "";

  let totalHTML = document.querySelector(".totalQuantity");
  let totalQuantity = 0;

  cartData.forEach((product) => {
    let newCart = document.createElement("div");
    newCart.classList.add("item");

    newCart.innerHTML = `
        <a href="productDescription.html?id=${product.productId}">
          <img src="${product.image}" alt="${product.productName}">
        </a>
        <div class="content">
            <div class="name">${product.productName}</div>
            <div class="price">$${product.price} / 1 product</div>
        </div>
        <div class="quantity">
            <button onclick="changeQuantity('${product.productId}', '-')">-</button>
            <span class="value">${product.quantity}</span>
            <button onclick="changeQuantity('${product.productId}', '+')">+</button>
        </div>`;

    listCartHTML.appendChild(newCart);
    totalQuantity += product.quantity;
  });

  totalHTML.innerText = totalQuantity;
}

// ✅ Change product quantity in cart
function changeQuantity(productId, type) {
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
    addCartToHTML();
  }
}

// ✅ Initialize cart display
addCartToHTML();
