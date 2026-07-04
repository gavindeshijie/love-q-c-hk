(function () {
  const VERSION = "neon-future-store-v1-20260704";
  const data = window.CHINA_CATALOG_DATA || {};
  const params = new URLSearchParams(location.search);
  const category = data[params.get("category")] ? params.get("category") : "panty";
  const page = data[category];
  const requested = Number.parseInt(params.get("item") || "1", 10);
  const itemIndex = Math.min(Math.max(Number.isFinite(requested) ? requested : 1, 1), page.products.length);
  const product = page.products[itemIndex - 1];
  const tone = (text) => String(text || "")
    .replace(/性感诱惑/g, "精致氛围")
    .replace(/性感迷人/g, "高级氛围")
    .replace(/甜辣/g, "精致")
    .replace(/诱惑/g, "氛围")
    .replace(/性感/g, "高级")
    .replace(/迷人/g, "出众");
  const desc = tone(product[0]);
  const price = product[1];
  const code = product[2];
  const parts = desc.split("|").map((part) => part.trim()).filter(Boolean);
  const imageIndexes = [itemIndex, (itemIndex % page.products.length) + 1, ((itemIndex + 1) % page.products.length) + 1];
  const images = imageIndexes.map((index) => "../../assets/china-product-items/" + category + "-" + index + ".jpg?v=" + VERSION);
  let active = 0;

  const setImage = (next) => {
    active = (next + images.length) % images.length;
    const img = document.getElementById("heroImage");
    img.src = images[active];
    img.alt = parts[0] || page.title;
    document.getElementById("galleryDots").innerHTML = images.map((_, index) => '<button class="' + (index === active ? 'is-active' : '') + '" type="button" data-dot="' + index + '" aria-label="查看图片 ' + (index + 1) + '"></button>').join("");
  };
  const addToCart = () => {
    const cart = window.SLT.readCart();
    cart.push({ category, item: itemIndex, code, price, qty: 1, selected: true, title: parts[0] || page.title });
    window.SLT.writeCart(cart);
    window.SLT.toast("已加入购物车");
  };
  document.title = code + " | " + page.title + " | Secret Language Trade";
  document.getElementById("backLink").href = "../catalog/?category=" + category + "&v=" + VERSION;
  document.getElementById("productTitle").textContent = parts[0] || page.title;
  document.getElementById("productSubtitle").textContent = (parts.slice(1).join("，") || "柔和触感，适合日常私密体验") + "。";
  document.getElementById("productPrice").textContent = price;
  document.getElementById("barPrice").textContent = price;
  document.getElementById("detailCopy").textContent = "这款产品采用克制的外观与亲肤材质，适合个人放松或亲密互动场景。细节设计保持高级和私密感，搭配隐私包装配送，购买体验更自然、更无压力。商品编号：" + code + "。";
  const featureCopy = [
    ["亲肤材质", "触感柔和，适合贴身使用。"],
    ["低调体验", "减少使用尴尬，私密场景更安心。"],
    ["新手友好", "选择简单，适合初次尝试。"],
    ["隐私包装", "外箱不显示敏感商品信息。"]
  ];
  document.getElementById("featureGrid").innerHTML = featureCopy.map((item) => '<div class="trust-card glass-card"><b>' + item[0] + '</b><span>' + item[1] + '</span></div>').join("");
  document.getElementById("addCart").addEventListener("click", addToCart);
  document.getElementById("buyNow").addEventListener("click", () => { addToCart(); location.href = "../checkout/?v=" + VERSION; });
  document.addEventListener("click", (event) => {
    const dot = event.target.closest("[data-dot]");
    if (dot) setImage(Number(dot.dataset.dot));
  });
  let startX = 0;
  const stage = document.querySelector(".product-gallery");
  stage.addEventListener("touchstart", (event) => { startX = event.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", (event) => {
    const delta = event.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 42) setImage(active + (delta < 0 ? 1 : -1));
  }, { passive: true });
  setImage(0);
})();

