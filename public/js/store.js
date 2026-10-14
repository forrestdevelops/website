function applyFilter(category) {
    document.querySelectorAll("[data-filter]").forEach((b) => {
        b.setAttribute("aria-pressed", String(b.dataset.filter === category));
    });
    document.querySelectorAll(".product").forEach((card) => {
        card.hidden = category !== "All" && card.dataset.category !== category;
    });
}
document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (btn?.dataset.filter)
        applyFilter(btn.dataset.filter);
});
const storeEl = document.querySelector("brand-store[data-stamped]");
if (storeEl) {
    const showError = (err) => {
        console.warn("[stamped] store failed to load", err);
        document.querySelector("[data-store-error]")?.removeAttribute("hidden");
    };
    const scriptUrl = storeEl.dataset.scriptUrl ?? "";
    // The SDK's loader injects the designer bundle once and resolves when the elements are defined.
    if (window.ProductDesigner && scriptUrl) {
        window.ProductDesigner.loadDesigner({ scriptUrl, timeoutMs: 20000 }).catch(showError);
    }
    else {
        showError(new Error("Stamped SDK not loaded"));
    }
    document.addEventListener("pd:error", (e) => console.warn("[stamped] brand-store error", e.detail));
    // Add to cart goes straight to the stampedpromo.com cart. The store keeps added designs in a
    // per-tab "bag" (sessionStorage); hand all of them to Stamped's checkout link, which adds them to the
    // WooCommerce cart (skipping any already there), then empty the bag so they aren't sent twice.
    const shopUrl = (storeEl.dataset.shopUrl ?? "").replace(/\/+$/, "");
    const storeId = storeEl.getAttribute("store") ?? "";
    const bagKey = `pd-brand-store:${storeId}:bag`;
    const readBag = () => {
        try {
            const v = JSON.parse(sessionStorage.getItem(bagKey) ?? "[]");
            return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
        }
        catch {
            return [];
        }
    };
    storeEl.addEventListener("pd:add-to-cart", (e) => {
        const designId = e.detail?.designId;
        if (!shopUrl || !designId)
            return;
        // Let the store record the design first (it updates the bag right after this event).
        window.setTimeout(() => {
            const ids = [...new Set([...readBag(), designId])].slice(0, 20);
            try {
                sessionStorage.setItem(bagKey, "[]");
            }
            catch {
                /* storage unavailable */
            }
            window.location.href = `${shopUrl}/?pd_checkout=${ids.map(encodeURIComponent).join(",")}&pd_to=cart`;
        }, 0);
    });
}
export {};
