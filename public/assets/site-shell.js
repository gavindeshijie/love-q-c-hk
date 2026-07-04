(function () {
  const VERSION = "neon-future-store-v1-20260704";
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const toast = (message) => {
    let node = $(".toast");
    if (!node) {
      node = document.createElement("div");
      node.className = "toast";
      node.setAttribute("role", "status");
      document.body.append(node);
    }
    node.textContent = message;
    node.classList.add("is-visible");
    window.clearTimeout(node._timer);
    node._timer = window.setTimeout(() => node.classList.remove("is-visible"), 2200);
  };

  const readCart = () => {
    try {
      const value = JSON.parse(localStorage.getItem("loveCart") || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      localStorage.removeItem("loveCart");
      return [];
    }
  };

  const writeCart = (items) => {
    localStorage.setItem("loveCart", JSON.stringify(items));
    updateCartCount();
  };

  const parsePrice = (value) => {
    const parsed = Number.parseFloat(String(value || "").replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const formatPrice = (value) => "¥" + Number(value || 0).toFixed(2);

  const updateCartCount = () => {
    const count = readCart().reduce((sum, item) => sum + (Number(item.qty) || 1), 0);
    $$("[data-cart-count]").forEach((node) => {
      node.textContent = String(count);
      node.hidden = count === 0;
    });
  };

  const ensureAgeGate = () => {
    if (localStorage.getItem("loveAgeConfirmed") === "1") return;
    const gate = document.createElement("div");
    gate.className = "age-gate";
    gate.innerHTML =
      '<section class="age-gate__panel" role="dialog" aria-modal="true" aria-labelledby="ageTitle">' +
      '<p class="eyebrow">Age verification</p>' +
      '<h2 id="ageTitle">请确认你已达到当地法定年龄</h2>' +
      '<p>本网站包含成人用品相关内容，仅面向符合法定年龄的用户。我们会使用隐私包装与 COD 货到付款说明，减少购买顾虑。</p>' +
      '<div class="age-gate__actions">' +
      '<button class="primary-button" type="button" data-age-confirm>我已达到法定年龄，继续访问</button>' +
      '<button class="secondary-button" type="button" data-age-leave>离开网站</button>' +
      '</div></section>';
    document.body.append(gate);
    $("[data-age-confirm]", gate).addEventListener("click", () => {
      localStorage.setItem("loveAgeConfirmed", "1");
      gate.hidden = true;
      toast("欢迎进入私密购物体验");
    });
    $("[data-age-leave]", gate).addEventListener("click", () => {
      window.location.href = "https://www.google.com/";
    });
  };

  document.addEventListener("click", (event) => {
    const open = event.target.closest("[data-menu-open]");
    if (open) {
      const menu = $("[data-menu]");
      if (menu) menu.hidden = false;
    }
    const close = event.target.closest("[data-menu-close]");
    if (close) {
      const menu = $("[data-menu]");
      if (menu) menu.hidden = true;
    }
    const locale = event.target.closest("[data-locale][data-market]");
    if (locale) {
      localStorage.setItem("selectedLocale", locale.dataset.locale);
      localStorage.setItem("selectedMarket", locale.dataset.market);
    }
  });

  window.SLT = { VERSION, toast, readCart, writeCart, parsePrice, formatPrice, updateCartCount };
  updateCartCount();
  ensureAgeGate();
})();

