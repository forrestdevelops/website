// Store page: category filter for the preview grid, and the Stamped plugin loader.
interface ProductDesignerSdk {
  loadDesigner(o: { scriptUrl: string; timeoutMs?: number }): Promise<void>;
}
declare global {
  interface Window {
    ProductDesigner?: ProductDesignerSdk;
  }
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
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-filter]");
  if (btn?.dataset.filter) applyFilter(btn.dataset.filter);
});

const storeEl = document.querySelector<HTMLElement>("brand-store[data-stamped]");
if (storeEl) {
  const showError = (err: unknown) => {
    console.warn("[stamped] store failed to load", err);
    document.querySelector<HTMLElement>("[data-store-error]")?.removeAttribute("hidden");
  };
  const scriptUrl = storeEl.dataset.scriptUrl ?? "";
  // The SDK's loader injects the designer bundle once and resolves when the elements are defined.
  if (window.ProductDesigner && scriptUrl) {
    window.ProductDesigner.loadDesigner({ scriptUrl, timeoutMs: 20000 }).catch(showError);
  } else {
    showError(new Error("Stamped SDK not loaded"));
  }
  document.addEventListener("pd:error", (e) => console.warn("[stamped] brand-store error", (e as CustomEvent).detail));
}

export {};
