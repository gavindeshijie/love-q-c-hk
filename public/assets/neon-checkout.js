(function () {
  const VERSION = "neon-future-store-v1-20260704";
  const data = window.CHINA_CATALOG_DATA || {};
  const cart = window.SLT.readCart();
  const summary = document.getElementById("orderSummary");
  const form = document.getElementById("checkoutForm");
  const success = document.getElementById("successScreen");
  const successInfo = document.getElementById("successInfo");
  const getProduct = (entry) => {
    const category = data[entry.category] ? entry.category : "panty";
    const page = data[category];
    const item = Math.min(Math.max(Number(entry.item) || 1, 1), page.products.length);
    const product = page.products[item - 1];
    return { category, item, title: entry.title || product[0].split("|")[0].trim(), code: entry.code || product[2], price: entry.price || product[1], qty: Math.max(1, Number(entry.qty) || 1) };
  };
  const items = cart.length ? cart.map(getProduct) : [];
  const total = items.reduce((sum, item) => sum + window.SLT.parsePrice(item.price) * item.qty, 0);
  const renderSummary = () => {
    if (!items.length) {
      summary.innerHTML = '<h2>订单摘要</h2><p>当前购物车为空。你仍可以先填写信息，或返回商品列表选择商品。</p><a class="secondary-button" href="../catalog/?category=panty&v=' + VERSION + '">返回选择商品</a>';
      return;
    }
    summary.innerHTML = '<h2>订单摘要</h2>' + items.map((item) =>
      '<div class="summary-line"><img src="../../assets/china-product-items/' + item.category + '-' + item.item + '.jpg?v=' + VERSION + '" alt="' + item.title + '"><div><b>' + item.title + '</b><span>' + item.code + ' · x' + item.qty + '</span></div><strong>' + window.SLT.formatPrice(window.SLT.parsePrice(item.price) * item.qty) + '</strong></div>'
    ).join("") + '<div class="summary-total"><span>总计</span><strong class="price">' + window.SLT.formatPrice(total) + '</strong></div><div class="chip-row"><span class="chip hot">COD 货到付款</span><span class="chip">隐私包装</span></div>';
  };
  const error = (name, message) => {
    const node = document.querySelector('[data-error="' + name + '"]');
    if (node) node.textContent = message || "";
  };
  const validate = (fields) => {
    let ok = true;
    ["name", "phone", "city", "address"].forEach((name) => error(name, ""));
    if (!fields.name.trim()) { error("name", "请填写收货人姓名。"); ok = false; }
    if (!/^\+?[0-9\s-]{6,18}$/.test(fields.phone.trim())) { error("phone", "请输入正确的手机号码，方便配送员联系你。"); ok = false; }
    if (!fields.city.trim()) { error("city", "请填写城市或省份。"); ok = false; }
    if (fields.address.trim().length < 8) { error("address", "请输入详细收货地址，方便准确配送。"); ok = false; }
    return ok;
  };
  const showSuccess = (order) => {
    document.querySelectorAll("[data-checkout-form]").forEach((node) => node.hidden = true);
    form.hidden = true;
    success.hidden = false;
    successInfo.innerHTML = '<p>订单号：' + order.id + '</p><p>商品数量：' + order.count + '</p><p>收货地区：' + order.city + '</p><p>付款方式：货到付款</p>';
    let remaining = 3;
    const counter = document.getElementById("successCountdown");
    counter.textContent = String(remaining);
    window.clearInterval(window.__successTimer);
    window.__successTimer = window.setInterval(() => {
      remaining -= 1;
      if (remaining > 0) counter.textContent = String(remaining);
      else {
        window.clearInterval(window.__successTimer);
        location.href = "../member/?view=profile&source=checkout-success&v=" + VERSION;
      }
    }, 1000);
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const dataForm = Object.fromEntries(new FormData(form).entries());
    if (!validate(dataForm)) return;
    const order = { id: "SLT" + Date.now().toString().slice(-8), count: items.reduce((sum, item) => sum + item.qty, 0), total, city: dataForm.country + " · " + dataForm.city, items, customer: dataForm, payment: "COD" };
    localStorage.setItem("loveLastOrder", JSON.stringify(order));
    const url = new URL(location.href);
    url.searchParams.set("success", "1");
    url.searchParams.set("order", order.id);
    url.searchParams.set("v", VERSION);
    history.replaceState(null, "", url);
    showSuccess(order);
  });
  renderSummary();
  if (new URLSearchParams(location.search).get("success") === "1") {
    try {
      const stored = JSON.parse(localStorage.getItem("loveLastOrder") || "{}");
      showSuccess(stored.id ? stored : { id: "SLT00000000", count: items.length, city: "待确认" });
    } catch {
      showSuccess({ id: "SLT00000000", count: items.length, city: "待确认" });
    }
  }
})();

