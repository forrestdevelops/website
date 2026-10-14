// Store page interactivity: category filter + local cart counter.
const CART_KEY = "fd-cart";

type Cart = Record<string, number>;

function loadCart(): Cart {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as Cart) : {};
  } catch {
    return {};
  }
}

function saveCart(cart: Cart): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    /* storage unavailable: keep in memory */
  }
}

let cart = loadCart();

function renderCart(): void {
  const total = Object.values(cart).reduce((a, b) => a + b, 0);
  const count = document.querySelector<HTMLElement>("[data-cart-count]");
  const btn = document.querySelector<HTMLElement>("[data-cart]");
  if (count) count.textContent = String(total);
  if (btn) btn.setAttribute("aria-label", `Cart, ${total} item${total === 1 ? "" : "s"}`);
  document.querySelectorAll<HTMLButtonElement>("[data-add]").forEach((b) => {
    const n = cart[b.dataset.add ?? ""] ?? 0;
    b.textContent = n ? `Added (${n})` : "Add to cart";
  });
}

function applyFilter(category: string): void {
  document.querySelectorAll<HTMLButtonElement>("[data-filter]").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.filter === category));
  });
  document.querySelectorAll<HTMLElement>(".product").forEach((card) => {
    card.hidden = category !== "All" && card.dataset.category !== category;
  });
}

document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  const filterBtn = target.closest<HTMLButtonElement>("[data-filter]");
  if (filterBtn?.dataset.filter) {
    applyFilter(filterBtn.dataset.filter);
    return;
  }
  const addBtn = target.closest<HTMLButtonElement>("[data-add]");
  if (addBtn?.dataset.add) {
    const id = addBtn.dataset.add;
    cart = { ...cart, [id]: (cart[id] ?? 0) + 1 };
    saveCart(cart);
    renderCart();
  }
});

renderCart();
