"use strict";
// Store page interactivity: category filter + local cart counter.
const CART_KEY = "fd-cart";
function loadCart() {
    try {
        const raw = localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : {};
    }
    catch {
        return {};
    }
}
function saveCart(cart) {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
    catch {
        /* storage unavailable: keep in memory */
    }
}
let cart = loadCart();
function renderCart() {
    const total = Object.values(cart).reduce((a, b) => a + b, 0);
    const count = document.querySelector("[data-cart-count]");
    const btn = document.querySelector("[data-cart]");
    if (count)
        count.textContent = String(total);
    if (btn)
        btn.setAttribute("aria-label", `Cart, ${total} item${total === 1 ? "" : "s"}`);
    document.querySelectorAll("[data-add]").forEach((b) => {
        const n = cart[b.dataset.add ?? ""] ?? 0;
        b.textContent = n ? `Added (${n})` : "Add to cart";
    });
}
function applyFilter(category) {
    document.querySelectorAll("[data-filter]").forEach((b) => {
        b.setAttribute("aria-pressed", String(b.dataset.filter === category));
    });
    document.querySelectorAll(".product").forEach((card) => {
        card.hidden = category !== "All" && card.dataset.category !== category;
    });
}
document.addEventListener("click", (e) => {
    const target = e.target;
    const filterBtn = target.closest("[data-filter]");
    if (filterBtn?.dataset.filter) {
        applyFilter(filterBtn.dataset.filter);
        return;
    }
    const addBtn = target.closest("[data-add]");
    if (addBtn?.dataset.add) {
        const id = addBtn.dataset.add;
        cart = { ...cart, [id]: (cart[id] ?? 0) + 1 };
        saveCart(cart);
        renderCart();
    }
});
renderCart();
