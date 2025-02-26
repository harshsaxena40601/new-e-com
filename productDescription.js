document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    console.error("Product ID not found in URL.");
    return;
  }

  try {
    const response = await fetch(
      `https://new-e-com-wirq.onrender.com/api/products/${productId}/`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const product = await response.json();

    // Ensure elements exist before updating
    const productImage = document.querySelector(".product-main-image");
    const productName = document.querySelector(".product-name");
    const productPrice = document.querySelector(".product-price");
    const productDescription = document.querySelector(".product-description");

    if (productImage) {
      productImage.src = product.image;
      productImage.alt = product.name;
    }

    if (productName) productName.textContent = product.name;
    if (productPrice)
      productPrice.textContent = `$${parseFloat(product.price).toFixed(2)}`;
    if (productDescription)
      productDescription.textContent = product.description;
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
});
if (productImage) {
  let productImageUrl = product.image.startsWith("http")
    ? product.image
    : `https://new-e-com-wirq.onrender.com${product.image}`;

  console.log("Final Product Image URL:", productImageUrl); // Debugging

  productImage.src = productImageUrl;
  productImage.alt = product.name;
}
