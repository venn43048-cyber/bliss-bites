
/* ==================================
   BLISS BITES - SHOPPING CART
================================== */

const cart = [];

const cartCount = document.getElementById("cart-count");
const cartToggle = document.getElementById("cart-toggle");
const cartPanel = document.getElementById("cart-panel");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const closeCart = document.getElementById("close-cart");

const cartSubtotal = document.getElementById("cart-subtotal");
const cartDelivery = document.getElementById("cart-delivery");

/* ADD TO CART */

document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        if (!name || !Number.isFinite(price)) return;

        const existingItem = cart.find((item) => item.name === name);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name: name,
                price: price,
                quantity: 1
            });
        }

        updateCart();

        button.textContent = "Added ✓";

        setTimeout(() => {
            button.textContent = "Add to Cart";
        }, 1000);
    });
});

/* UPDATE CART COUNT */

function updateCart() {
    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    if (cartCount) {
        cartCount.textContent = totalQuantity;
    }
}

/* OPEN CART */

if (cartToggle && cartPanel) {
    cartToggle.addEventListener("click", () => {
        cartPanel.hidden = false;
        renderCart();

        cartPanel.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
}

/* CLOSE CART */

if (closeCart && cartPanel) {
    closeCart.addEventListener("click", () => {
        cartPanel.hidden = true;
    });
}

/* DISPLAY CART ITEMS AND TOTALS */

function renderCart() {
    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.textContent = "Your cart is empty.";
    }

    cart.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "cart-item";

        const name = document.createElement("span");
        name.textContent = item.name;

        const controls = document.createElement("div");
        controls.className = "cart-controls";

        const minus = document.createElement("button");
        minus.textContent = "−";
        minus.className = "cart-quantity-btn";
        minus.dataset.action = "decrease";
        minus.dataset.index = index;
        minus.setAttribute("aria-label", "Decrease quantity");

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.className = "cart-quantity-btn";
        plus.dataset.action = "increase";
        plus.dataset.index = index;
        plus.setAttribute("aria-label", "Increase quantity");

        controls.append(minus, quantity, plus);

        const price = document.createElement("strong");
        price.textContent = "₹" + (item.price * item.quantity);

        const remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.className = "cart-remove-btn";
        remove.dataset.action = "remove";
        remove.dataset.index = index;

        row.append(name, controls, price, remove);
        cartItems.appendChild(row);
    });

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const deliveryFee = subtotal > 0 ? 40 : 0;
    const grandTotal = subtotal + deliveryFee;

    if (cartSubtotal) {
        cartSubtotal.textContent = "₹" + subtotal;
    }

    if (cartDelivery) {
        cartDelivery.textContent = "₹" + deliveryFee;
    }

    if (cartTotal) {
        cartTotal.textContent = "₹" + grandTotal;
    }
}

/* INCREASE, DECREASE AND REMOVE ITEMS */

if (cartItems) {
    cartItems.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const index = Number(button.dataset.index);
        const action = button.dataset.action;
        const item = cart[index];

        if (!item) return;

        if (action === "increase") {
            item.quantity++;
        }

        if (action === "decrease") {
            item.quantity--;

            if (item.quantity <= 0) {
                cart.splice(index, 1);
            }
        }

        if (action === "remove") {
            cart.splice(index, 1);
        }

        updateCart();
        renderCart();
    });
}

/* SEARCH FOOD */

const foodSearch = document.getElementById("food-search");
const filterButtons = document.querySelectorAll(".filter-btn");
const foodCards = document.querySelectorAll(".food-card");
const noResults = document.getElementById("no-results");

let selectedCategory = "all";

function filterFoods() {
    if (!foodSearch) return;

    const searchText = foodSearch.value.trim().toLowerCase();
    let visibleCount = 0;

    foodCards.forEach((card) => {
        const heading = card.querySelector("h3");
        const description = card.querySelector(".food-details > p");

        const foodName = heading ? heading.textContent.toLowerCase() : "";
        const foodDescription = description
            ? description.textContent.toLowerCase()
            : "";

        const category = card.dataset.category || "all";

        const matchesSearch =
            foodName.includes(searchText) ||
            foodDescription.includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            category === selectedCategory;

        const showCard = matchesSearch && matchesCategory;

        card.hidden = !showCard;

        if (showCard) {
            visibleCount++;
        }
    });

    if (noResults) {
        noResults.hidden = visibleCount > 0;
    }
}

if (foodSearch) {
    foodSearch.addEventListener("input", filterFoods);
}

/* CATEGORY FILTER BUTTONS */

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category || "all";

        filterButtons.forEach((filterButton) => {
            filterButton.classList.toggle(
                "active",
                filterButton === button
            );
        });

        filterFoods();
    });
});

updateCart();

/* ===== CHECKOUT FUNCTIONALITY ===== */

const checkoutButton = document.getElementById("checkout-btn");
const checkoutSection = document.getElementById("checkout-section");
const checkoutForm = document.getElementById("checkout-form");
const backToCartButton = document.getElementById("back-to-cart");
const orderSuccess = document.getElementById("order-success");
const orderMessage = document.getElementById("order-message");
const continueShoppingButton = document.getElementById("continue-shopping");

if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Please add food items to your cart first.");
            return;
        }

        cartPanel.hidden = true;
        checkoutSection.hidden = false;

        checkoutSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}

if (backToCartButton) {
    backToCartButton.addEventListener("click", () => {
        checkoutSection.hidden = true;
        cartPanel.hidden = false;
        renderCart();

        cartPanel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}

if (checkoutForm) {
    checkoutForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty. Please add items first.");
            return;
        }

        const customerName =
            document.getElementById("customer-name").value.trim();

        const subtotal = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const deliveryFee = subtotal > 0 ? 40 : 0;
        const grandTotal = subtotal + deliveryFee;

        orderMessage.textContent =
    "Thank you, " + customerName +
    "! Your order total is ₹" + grandTotal + ".";

        checkoutForm.hidden = true;
        orderSuccess.hidden = false;
    });
}

if (continueShoppingButton) {
    continueShoppingButton.addEventListener("click", () => {
        cart.length = 0;
        updateCart();
        renderCart();

        checkoutForm.reset();
        checkoutForm.hidden = false;
        orderSuccess.hidden = true;
        checkoutSection.hidden = true;
        cartPanel.hidden = true;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}
