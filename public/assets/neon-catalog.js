(function () {
  const VERSION = "neon-future-store-v1-20260704";
  const data = window.CHINA_CATALOG_DATA || {};
  const params = new URLSearchParams(location.search);
  let category = data[params.get("category")] ? params.get("category") : "panty";
  let activeFilter = params.get("filter") || "";
  let query = params.get("q") || "";
  let sortMode = "hot";
  const grid = document.getElementById("productGrid");
  const title = document.getElementById("pageTitle");
  const empty = document.getElementById("emptyState");
  const searchInput = document.getElementById("searchInput");
  const categoryChoices = document.getElementById("categoryChoices");
  const filterChoices = document.getElementById("filterChoices");
  searchInput.value = query;

  const tone = (text) => String(text || "")
    .replace(/性感诱惑/g, "精致氛围")
    .replace(/性感迷人/g, "高级氛围")
    .replace(/甜辣/g, "精致")
    .replace(/诱惑/g, "氛围")
    .replace(/性感/g, "高级")
    .replace(/迷人/g, "出众");
  const cleanTitle = (text) => tone(text).split("|").map((p) => p.trim()).filter(Boolean)[0] || "精选商品";
  const sellingPoint = (text) => tone(text).split("|").map((p) => p.trim()).filter(Boolean).slice(1).join(" · ") || "隐私包装 · 支持货到付款";

  function syncUrl() {
    const next = new URL(location.href);
    next.searchParams.set("category", category);
    next.searchParams.set("v", VERSION);
    if (activeFilter) next.searchParams.set("filter", activeFilter); else next.searchParams.delete("filter");
    if (query) next.searchParams.set("q", query); else next.searchParams.delete("q");
    history.replaceState(null, "", next);
  }

  function renderChoices() {
    categoryChoices.innerHTML = Object.entries(data).map(([key, page]) =>
      '<button class="sheet-choice ' + (key === category ? 'is-active' : '') + '" type="button" data-category="' + key + '">' + page.title + '</button>'
    ).join("");
    const page = data[category];
    filterChoices.innerHTML = page.filters.map((filter) =>
      '<button class="sheet-choice ' + (filter === activeFilter ? 'is-active' : '') + '" type="button" data-filter="' + filter + '">' + filter + '</button>'
    ).join("");
  }

  function render() {
    const page = data[category];
    if (!page) return;
    if (!activeFilter) activeFilter = page.active;
    title.textContent = page.title;
    document.title = page.title + " | Secret Language Trade";
    renderChoices();
    let products = page.products.map((product, index) => ({ product, index }));
    if (query) {
      const q = query.toLowerCase();
      products = products.filter(({ product }) => product.join(" ").toLowerCase().includes(q));
    }
    if (sortMode === "price") products.sort((a, b) => window.SLT.parsePrice(a.product[1]) - window.SLT.parsePrice(b.product[1]));
    grid.innerHTML = products.map(({ product, index }) => {
      const desc = product[0];
      const price = product[1];
      const code = product[2];
      return '<article class="product-card">' +
        '<a href="../product/?category=' + category + '&item=' + (index + 1) + '&v=' + VERSION + '">' +
        '<div class="product-card__media"><img src="../../assets/china-product-items/' + category + '-' + (index + 1) + '.jpg?v=' + VERSION + '" alt="' + cleanTitle(desc) + '" loading="lazy"><span class="badge">COD</span></div>' +
        '<div class="product-card__body"><h3>' + cleanTitle(desc) + '</h3><p>' + sellingPoint(desc) + '</p><div class="chip-row"><span class="chip">隐私包装</span><span class="chip">COD</span></div><strong class="price">' + price + '</strong><span class="mini-button">立即购买</span></div>' +
        '</a></article>';
    }).join("");
    empty.hidden = products.length !== 0;
    syncUrl();
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-filter-open]")) document.querySelector("[data-filter-sheet]").hidden = false;
    if (event.target.closest("[data-filter-close]")) document.querySelector("[data-filter-sheet]").hidden = true;
    const cat = event.target.closest("[data-category]");
    if (cat) { category = cat.dataset.category; activeFilter = data[category].active; render(); }
    const filter = event.target.closest("[data-filter]");
    if (filter) { activeFilter = filter.dataset.filter; render(); }
    if (event.target.closest("[data-reset-filter]")) { query = ""; searchInput.value = ""; activeFilter = data[category].active; render(); }
    const sort = event.target.closest("[data-sort]");
    if (sort) { sortMode = sort.dataset.sort; window.SLT.toast(sortMode === "price" ? "已按价格排序" : "已切回热卖优先"); render(); }
  });
  document.getElementById("searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    query = searchInput.value.trim();
    render();
  });
  render();
})();

