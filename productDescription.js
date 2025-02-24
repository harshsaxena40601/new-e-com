document.addEventListener("DOMContentLoaded", async function () {
  // Get product ID from the URL (assuming the format is product.html?id=1)
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    console.error("Product ID not found in URL.");
    return;
  }

  try {
    // Fetch product details from the API
    const response = await fetch(
      `http://127.0.0.1:8000/api/products/${productId}/`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const product = await response.json();

    // Update the HTML elements with product data
    document.querySelector(".product-main-image").src = product.image;
    document.querySelector(".product-main-image").alt = product.name;
    document.querySelector(".product-name").textContent = product.name;
    document.querySelector(".product-price").textContent = product.price;

    // ✅ FIX: Update the description paragraph properly
    document.querySelector(".product-description").textContent =
      product.description;
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
});
