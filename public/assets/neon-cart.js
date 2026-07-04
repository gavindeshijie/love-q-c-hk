(function () {
  const VERSION = "neon-future-store-v1-20260704";
  const data = window.CHINA_CATALOG_DATA || {};
  const list = document.getElementById("cartList");
  const total = document.getElementById("totalPrice");
  const cleanTitle = (text) => String(text || "").split("|").map((p) => p.trim()).filter(Boolean)[0] || "精选商品";
  const enrich = (entry) => {
    const category = data[entry.category] ? entry.category : "panty";
    const page = data[category];
    const item = Math.min(Math.max(Number(entry.item) || 1, 1), page.products.length);
    const product = page.products[item - 1];
    return { category, item, title: entry.title || cleanTitle(product[0]), code: entry.code || product[2], price: entry.price || product[1], qty: Math.max(1, Number(entry.qty) || 1), selected: entry.selected !== false };
  };
  let items = window.SLT.readCart().map(enrich);
  const persist = () => window.SLT.writeCart(items);
  const render = () => {
    if (!items.length) {
      list.innerHTML = '<section class="glass-card strong empty-state" style="padding:18px"><h2>购物车还是空的</h2><p>去看看本周热卖商品，选择适合你的私密好物。</p><a class="primary-button" href="../catalog/?category=roleplay&v=' + VERSION + '">查看热卖商品</a></section>';
    } else {
      list.innerHTML = items.map((item, index) => {
        const subtotal = window.SLT.parsePrice(item.price) * item.qty;
        return '<article class="cart-line glass-card">' +
          '<img src="../../assets/china-product-items/' + item.category + '-' + item.item + '.jpg?v=' + VERSION + '" alt="' + item.title + '" loading="lazy">' +
          '<div><h3>' + item.title + '</h3><p class="muted">' + item.code + ' · 隐私包装 · COD</p><strong class="price">' + window.SLT.formatPrice(subtotal) + '</strong><div class="qty-control"><button data-action="minus" data-index="' + index + '">-</button><span>' + item.qty + '</span><button data-action="plus" data-index="' + index + '">+</button><button data-action="delete" data-index="' + index + '">删除</button></div></div>' +
          '</article>';
      }).join("");
    }
    const sum = items.reduce((acc, item) => acc + window.SLT.parsePrice(item.price) * item.qty, 0);
    total.textContent = window.SLT.formatPrice(sum);
    persist();
  };
  list.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    if (!action) return;
    const index = Number(action.dataset.index);
    if (!items[index]) return;
    if (action.dataset.action === "minus") items[index].qty = Math.max(1, items[index].qty - 1);
    if (action.dataset.action === "plus") items[index].qty += 1;
    if (action.dataset.action === "delete") items.splice(index, 1);
    render();
  });
  render();
})();

