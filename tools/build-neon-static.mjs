import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const version = "neon-future-store-v1-20260704";

const write = (file, content) => {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content.trimStart() + "\n");
};

const noCache = `
    <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">`;

const cssHref = (prefix = "") => `${prefix}assets/neon-theme.css?v=${version}`;
const shellSrc = (prefix = "") => `${prefix}assets/site-shell.js?v=${version}`;
const dataSrc = (prefix = "") => `${prefix}assets/china-catalog-data.js?v=${version}`;

const html = ({ lang = "zh-CN", title, description, prefix = "", body, extraHead = "", scripts = "" }) => `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${noCache}
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="${cssHref(prefix)}">
${extraHead}
  </head>
  <body>
${body}
    <script src="${shellSrc(prefix)}" defer></script>
${scripts}
  </body>
</html>`;

const header = (prefix = "", active = "") => `
    <header class="mobile-header" data-header>
      <a class="brand-lockup" href="${prefix}?v=${version}" aria-label="返回语言入口">
        <span class="brand-mark">SL</span>
        <span>
          <strong>私语贸易</strong>
          <em>Private · COD · Secure</em>
        </span>
      </a>
      <nav class="header-actions" aria-label="快捷操作">
        <a class="icon-pill ${active === "cart" ? "is-active" : ""}" href="${prefix}china/cart/?v=${version}" aria-label="购物车">购物车</a>
        <button class="icon-pill" type="button" data-menu-open aria-label="打开菜单">菜单</button>
      </nav>
    </header>
    <div class="site-menu" data-menu hidden>
      <div class="site-menu__panel">
        <button class="site-menu__close" type="button" data-menu-close aria-label="关闭菜单">关闭</button>
        <a href="${prefix}?v=${version}">语言入口</a>
        <a href="${prefix}china/?v=${version}">首页</a>
        <a href="${prefix}china/catalog/?category=panty&v=${version}">商品分类</a>
        <a href="${prefix}china/catalog/?category=roleplay&v=${version}">热卖商品</a>
        <a href="${prefix}china/cart/?v=${version}">购物车</a>
        <a href="${prefix}china/checkout/?v=${version}">COD 结算</a>
        <a href="${prefix}china/support/?v=${version}">联系客服</a>
      </div>
    </div>`;

const bottomNav = (prefix = "../", active = "") => `
    <nav class="mobile-bottom-nav" aria-label="底部导航">
      <a class="${active === "home" ? "is-active" : ""}" href="${prefix}?v=${version}"><span>首页</span></a>
      <a class="${active === "catalog" ? "is-active" : ""}" href="${prefix}catalog/?category=panty&v=${version}"><span>分类</span></a>
      <a class="${active === "hot" ? "is-active" : ""}" href="${prefix}catalog/?category=roleplay&v=${version}"><span>热卖</span></a>
      <a class="${active === "cart" ? "is-active" : ""}" href="${prefix}cart/?v=${version}"><span>购物车</span></a>
      <a class="${active === "support" ? "is-active" : ""}" href="${prefix}support/?v=${version}"><span>客服</span></a>
    </nav>`;

const languageCards = [
  ["china", "中文", "中国地区价格", "CN", "flag-china.png", "china/?v=" + version, "zh-CN", "CN"],
  ["singapore", "English", "Price for Singapore", "SG", "flag-singapore.png", "singapore/?v=" + version, "en-SG", "SG"],
  ["thailand", "ภาษาไทย", "ราคาในประเทศไทย", "TH", "flag-thailand.png", "thailand/?v=" + version, "th-TH", "TH"],
  ["vietnam", "Tiếng Việt", "Giá tại Việt Nam", "VN", "flag-vietnam.png", "vietnam/?v=" + version, "vi-VN", "VN"],
  ["malaysia", "Bahasa Melayu", "Harga di Malaysia", "MY", "flag-malaysia.png", "malaysia/?v=" + version, "ms-MY", "MY"],
  ["laos", "ພາສາລາວ", "ລາຄາໃນລາວ", "LA", "flag-laos.png", "laos/?v=" + version, "lo-LA", "LA"]
];

const categoryCards = [
  ["panty", "女用精选", "柔和触感，新手友好", "panty-1.jpg"],
  ["bra", "舒适内搭", "亲肤面料，日常安心", "bra-1.jpg"],
  ["roleplay", "亲密互动", "氛围感主题精选", "roleplay-1.jpg"],
  ["dress", "新手推荐", "轻盈好穿，风格克制", "dress-1.jpg"],
  ["bodysuit", "高端系列", "流线剪裁，贴合体验", "bodysuit-1.jpg"],
  ["bag", "隐私出行", "收纳搭配，轻便耐用", "bag-1.jpg"]
];

write("public/assets/neon-theme.css", `
:root {
  color-scheme: dark;
  --bg-main: #050510;
  --bg-deep: #080812;
  --bg-card: rgba(255,255,255,0.045);
  --bg-card-strong: rgba(255,255,255,0.075);
  --text-main: #fff;
  --text-sub: #d7d7e8;
  --text-muted: #8f90a6;
  --neon-pink: #ff2bd6;
  --neon-purple: #8b5cff;
  --neon-blue: #00e5ff;
  --neon-cyan: #00ffc6;
  --danger: #ff5a7a;
  --success: #00ffc6;
  --border-soft: rgba(255,255,255,0.10);
  --border-neon: rgba(255,43,214,0.45);
  --gradient-main: linear-gradient(135deg, #ff2bd6 0%, #8b5cff 48%, #00e5ff 100%);
  --shadow-neon: 0 0 24px rgba(139,92,255,0.14);
  --radius-card: 22px;
  --page-max: 480px;
  font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", Inter, Poppins, Roboto, sans-serif;
}
* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; background: var(--bg-main); }
body {
  color: var(--text-main);
  overflow-x: hidden;
  -webkit-text-size-adjust: 100%;
  letter-spacing: 0;
  background:
    radial-gradient(circle at 12% 0%, rgba(255,43,214,.18), transparent 26rem),
    radial-gradient(circle at 94% 92%, rgba(0,229,255,.15), transparent 24rem),
    linear-gradient(180deg, #050510 0%, #070711 58%, #030308 100%);
}
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: .34;
  background-image:
    linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
  background-size: 34px 34px;
  mask-image: radial-gradient(circle at 50% 30%, #000, transparent 72%);
}
a { color: inherit; text-decoration: none; }
button, input, textarea, select { font: inherit; }
button, a { -webkit-tap-highlight-color: transparent; }
img { max-width: 100%; display: block; }
.app-shell {
  width: 100%;
  max-width: var(--page-max);
  min-height: 100svh;
  margin: 0 auto;
  position: relative;
  padding: 76px 16px calc(88px + env(safe-area-inset-bottom));
}
.app-shell.no-bottom-nav { padding-bottom: calc(116px + env(safe-area-inset-bottom)); }
.mobile-header {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--page-max);
  min-height: 64px;
  padding: max(8px, env(safe-area-inset-top)) 16px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: rgba(5,5,16,.76);
  border-bottom: 1px solid rgba(255,255,255,.08);
  backdrop-filter: blur(16px);
}
.brand-lockup { display: flex; align-items: center; gap: 10px; min-width: 0; }
.brand-mark {
  width: 34px; height: 34px; display: grid; place-items: center;
  border-radius: 12px; font-size: 13px; font-weight: 900;
  background: var(--gradient-main);
  box-shadow: 0 0 22px rgba(255,43,214,.28);
}
.brand-lockup strong { display: block; font-size: 15px; line-height: 1.05; }
.brand-lockup em { display: block; margin-top: 3px; font-style: normal; font-size: 10px; color: var(--text-muted); white-space: nowrap; }
.header-actions { display: flex; align-items: center; gap: 8px; }
.icon-pill {
  min-height: 44px; min-width: 44px; padding: 0 12px;
  display: inline-grid; place-items: center;
  border-radius: 999px; border: 1px solid rgba(255,255,255,.11);
  background: rgba(255,255,255,.055); color: #fff; font-size: 12px;
}
.icon-pill.is-active { border-color: var(--border-neon); box-shadow: 0 0 16px rgba(255,43,214,.18); }
.site-menu[hidden], .age-gate[hidden], .bottom-sheet[hidden] { display: none !important; }
.site-menu {
  position: fixed; z-index: 1500; inset: 0; display: grid; align-items: end;
  background: rgba(0,0,0,.62); backdrop-filter: blur(10px);
}
.site-menu__panel {
  width: min(100%, var(--page-max)); margin: 0 auto;
  padding: 18px 16px calc(20px + env(safe-area-inset-bottom));
  border-radius: 24px 24px 0 0; border: 1px solid rgba(255,43,214,.28);
  background: rgba(8,8,18,.96); box-shadow: 0 -16px 44px rgba(255,43,214,.16);
}
.site-menu__panel a, .site-menu__close {
  min-height: 50px; width: 100%; display: flex; align-items: center; justify-content: space-between;
  padding: 0 14px; margin-top: 8px; border-radius: 16px;
  border: 1px solid rgba(255,255,255,.09); background: rgba(255,255,255,.045); color: #fff;
}
.section { margin-top: 28px; }
.section-header { display: flex; align-items: end; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
.eyebrow { margin: 0 0 8px; color: var(--neon-cyan); font-size: 12px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
h1, h2, h3, p { margin-top: 0; }
h1 { font-size: clamp(28px, 8.3vw, 34px); line-height: 1.08; font-weight: 850; letter-spacing: 0; }
h2 { font-size: clamp(20px, 5.6vw, 24px); line-height: 1.15; font-weight: 800; }
h3 { font-size: 16px; line-height: 1.2; }
p { color: var(--text-sub); line-height: 1.65; }
.muted { color: var(--text-muted); }
.neon-text {
  background: var(--gradient-main); -webkit-background-clip: text; background-clip: text; color: transparent;
  text-shadow: 0 0 24px rgba(255,43,214,.18);
}
.glass-card {
  background: var(--bg-card);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-neon);
  backdrop-filter: blur(14px);
}
.glass-card.strong { background: var(--bg-card-strong); }
.primary-button, .secondary-button {
  min-height: 52px; width: 100%; display: inline-flex; align-items: center; justify-content: center;
  border-radius: 999px; font-weight: 800; border: 0; color: #fff; text-align: center;
}
.primary-button { background: var(--gradient-main); box-shadow: 0 0 26px rgba(255,43,214,.22); }
.secondary-button { border: 1px solid rgba(255,255,255,.14); background: rgba(255,255,255,.06); }
.primary-button:active, .secondary-button:active, .product-card:active, .language-card:active { transform: scale(.98); }
.chip-row { display: flex; flex-wrap: wrap; gap: 8px; }
.chip {
  min-height: 30px; display: inline-flex; align-items: center; padding: 0 10px; border-radius: 999px;
  border: 1px solid rgba(255,255,255,.11); background: rgba(255,255,255,.055); color: var(--text-sub); font-size: 12px;
}
.chip.hot { border-color: rgba(255,43,214,.42); color: #ffd9fb; }
.hero {
  min-height: 560px;
  padding: 58px 8px 24px;
  display: flex; flex-direction: column; justify-content: center;
  position: relative; isolation: isolate;
}
.hero::before {
  content: ""; position: absolute; width: 280px; height: 280px; right: -90px; top: 72px; z-index: -1;
  border-radius: 50%; background: radial-gradient(circle, rgba(255,43,214,.38), rgba(139,92,255,.16) 45%, transparent 70%);
  filter: blur(2px); animation: neon-orbit 9s ease-in-out infinite alternate;
}
.hero::after {
  content: ""; position: absolute; inset: 150px -20px auto; height: 230px; z-index: -2;
  background: radial-gradient(circle at center, rgba(0,229,255,.14), transparent 68%);
}
@keyframes neon-orbit { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(-18px, 18px, 0) scale(1.06); } }
.hero p { font-size: 15px; }
.hero-actions { display: grid; gap: 12px; margin-top: 22px; }
.trust-grid, .feature-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.trust-card { min-height: 104px; padding: 14px; }
.trust-card b { display: block; margin-bottom: 7px; font-size: 14px; }
.trust-card span { display: block; color: var(--text-muted); font-size: 12px; line-height: 1.45; }
.horizontal-rail { display: flex; gap: 12px; overflow-x: auto; padding: 2px 0 8px; scroll-snap-type: x mandatory; scrollbar-width: none; }
.horizontal-rail::-webkit-scrollbar { display: none; }
.category-card {
  flex: 0 0 144px; min-height: 156px; padding: 12px; scroll-snap-align: start;
  display: flex; flex-direction: column; justify-content: end; overflow: hidden; position: relative;
}
.category-card img { position: absolute; inset: 10px 10px 48px; width: calc(100% - 20px); height: 88px; object-fit: cover; border-radius: 16px; opacity: .82; }
.category-card strong, .category-card span { position: relative; z-index: 1; }
.category-card span { color: var(--text-muted); font-size: 12px; margin-top: 5px; line-height: 1.35; }
.product-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.product-card {
  min-width: 0; overflow: hidden; border-radius: 20px; background: rgba(255,255,255,.045);
  border: 1px solid rgba(255,255,255,.10); box-shadow: 0 0 24px rgba(139,92,255,.12);
}
.product-card__media { position: relative; aspect-ratio: 1 / 1.08; background: #090915; overflow: hidden; }
.product-card__media img { width: 100%; height: 100%; object-fit: cover; }
.badge {
  position: absolute; left: 8px; top: 8px; min-height: 24px; padding: 0 8px;
  display: inline-flex; align-items: center; border-radius: 999px;
  background: rgba(255,43,214,.88); color: #fff; font-size: 10px; font-weight: 900;
}
.product-card__body { padding: 10px; }
.product-card h3 { margin-bottom: 6px; min-height: 38px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.product-card p { margin-bottom: 9px; color: var(--text-muted); font-size: 12px; line-height: 1.4; min-height: 34px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.price { font-size: 22px; font-weight: 900; color: #fff; text-shadow: 0 0 14px rgba(255,43,214,.28); }
.mini-button {
  min-height: 42px; margin-top: 10px; display: flex; align-items: center; justify-content: center;
  border-radius: 999px; background: var(--gradient-main); font-size: 13px; font-weight: 800;
}
.mobile-bottom-nav {
  position: fixed; z-index: 900; left: 50%; bottom: 0; transform: translateX(-50%);
  width: 100%; max-width: var(--page-max); height: calc(64px + env(safe-area-inset-bottom));
  padding: 7px 8px calc(7px + env(safe-area-inset-bottom));
  display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px;
  background: rgba(5,5,16,.88); border-top: 1px solid rgba(255,255,255,.08); backdrop-filter: blur(16px);
}
.mobile-bottom-nav a { display: grid; place-items: center; border-radius: 14px; color: var(--text-muted); font-size: 12px; min-width: 0; }
.mobile-bottom-nav a.is-active { color: #fff; background: rgba(255,43,214,.10); box-shadow: inset 0 0 0 1px rgba(255,43,214,.22); }
.form-stack { display: grid; gap: 14px; }
.field label { display: block; margin-bottom: 7px; color: var(--text-sub); font-size: 13px; font-weight: 700; }
.field input, .field textarea, .field select {
  width: 100%; min-height: 54px; padding: 0 14px; border-radius: 16px;
  border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.055);
  color: #fff; outline: 0;
}
.field textarea { padding-top: 13px; min-height: 92px; resize: vertical; }
.field input:focus, .field textarea:focus, .field select:focus {
  border-color: var(--neon-blue); box-shadow: 0 0 0 3px rgba(0,229,255,.14);
}
.error-text { color: var(--danger); font-size: 12px; min-height: 16px; margin-top: 5px; }
.sticky-buy-bar, .sticky-checkout-bar {
  position: fixed; z-index: 880; left: 50%; bottom: 0; transform: translateX(-50%);
  width: 100%; max-width: var(--page-max); min-height: calc(84px + env(safe-area-inset-bottom));
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  display: grid; grid-template-columns: 1fr 1.45fr; gap: 12px; align-items: center;
  background: rgba(5,5,16,.90); border-top: 1px solid rgba(255,43,214,.22); backdrop-filter: blur(18px);
}
.sticky-buy-bar .price, .sticky-checkout-bar .price { font-size: 24px; }
.bottom-sheet {
  position: fixed; z-index: 1300; inset: 0; display: grid; align-items: end; background: rgba(0,0,0,.55);
}
.bottom-sheet__panel {
  width: min(100%, var(--page-max)); margin: 0 auto; max-height: 70vh; overflow: auto;
  padding: 18px 16px calc(20px + env(safe-area-inset-bottom)); border-radius: 24px 24px 0 0;
  background: rgba(8,8,18,.96); border-top: 1px solid rgba(255,43,214,.35); box-shadow: 0 -12px 40px rgba(255,43,214,.18);
}
.sheet-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.sheet-choice { min-height: 46px; border-radius: 999px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.045); color: #fff; }
.sheet-choice.is-active { border-color: var(--border-neon); background: rgba(255,43,214,.14); }
.age-gate {
  position: fixed; z-index: 2000; inset: 0; display: grid; place-items: center; padding: 20px;
  background: rgba(0,0,0,.76); backdrop-filter: blur(12px);
}
.age-gate__panel { width: min(100%, 390px); padding: 22px; border-radius: 24px; border: 1px solid rgba(255,43,214,.36); background: rgba(8,8,18,.96); box-shadow: 0 0 40px rgba(139,92,255,.2); }
.age-gate__actions { display: grid; gap: 10px; margin-top: 18px; }
.toast {
  position: fixed; z-index: 2100; left: 50%; bottom: calc(86px + env(safe-area-inset-bottom));
  transform: translateX(-50%) translateY(18px); opacity: 0; pointer-events: none;
  width: min(calc(100vw - 32px), 420px); padding: 12px 14px; border-radius: 16px;
  border: 1px solid rgba(0,229,255,.28); background: rgba(8,8,18,.94); color: #fff; text-align: center;
  transition: opacity .22s ease, transform .22s ease;
}
.toast.is-visible { opacity: 1; transform: translateX(-50%) translateY(0); }
.faq-item { padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,.08); }
.faq-item summary { cursor: pointer; font-weight: 800; min-height: 44px; display: flex; align-items: center; }
.flow-steps { display: grid; gap: 12px; }
.flow-step { display: grid; grid-template-columns: 42px 1fr; gap: 12px; align-items: start; padding: 14px; }
.flow-step b:first-child { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 50%; background: var(--gradient-main); }
@media (max-width: 370px) {
  .app-shell { padding-left: 14px; padding-right: 14px; }
  .product-grid, .trust-grid, .feature-grid { gap: 10px; }
  .product-card__body { padding: 9px; }
  .price { font-size: 20px; }
}
`);

write("public/assets/site-shell.js", `
(function () {
  const VERSION = "${version}";
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
    const parsed = Number.parseFloat(String(value || "").replace(/[^\\d.]/g, ""));
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
`);

write("public/index.html", html({
  title: "私语贸易 | Secret Language Trade",
  description: "私语贸易多国家入口，支持隐私包装、多语言和 COD 货到付款。",
  prefix: "",
  body: `
    ${header("", "")}
    <main class="app-shell language-shell" aria-label="Secret Language Trade language entrance">
      <section class="hero language-hero">
        <p class="eyebrow">Secret Language Trade</p>
        <h1>私语贸易欢迎您<br><span class="neon-text">Welcome to Secret Language Trade</span></h1>
        <p>私密购物 · 多语言支持 · COD 货到付款。选择你的国家/语言后进入对应价格页面。</p>
      </section>

      <section class="section">
        <div class="language-grid">
          ${languageCards.map(([key, title, sub, currency, flag, href, locale, market]) => `
          <a class="language-card glass-card" href="${href}" data-locale="${locale}" data-market="${market}" aria-label="进入 ${title} ${sub}">
            <img src="assets/${flag}?v=${version}" alt="" width="140" height="84" loading="${key === "china" ? "eager" : "lazy"}">
            <strong>${title}</strong>
            <span>${sub}</span>
            <em>${currency}</em>
          </a>`).join("")}
        </div>
      </section>

      <section class="section trust-strip glass-card">
        <div><b>安全可靠</b><span>SAFE & SECURE</span></div>
        <div><b>快速访问</b><span>FAST ACCESS</span></div>
        <div><b>多语言支持</b><span>MULTI-LANGUAGE</span></div>
        <div><b>优质服务</b><span>PREMIUM SERVICE</span></div>
      </section>
    </main>`
}));

const marketPage = (lang, title, subtitle) => html({
  lang,
  title: `${title} | Secret Language Trade`,
  description: `${title} market page placeholder for future products.`,
  prefix: "../",
  body: `
    ${header("../", "")}
    <main class="app-shell">
      <section class="hero">
        <p class="eyebrow">Market prepared</p>
        <h1>${title}</h1>
        <p>${subtitle}</p>
        <div class="hero-actions">
          <a class="primary-button" href="../china/?v=${version}">先查看中文商品</a>
          <a class="secondary-button" href="../?v=${version}">返回语言入口</a>
        </div>
      </section>
    </main>`
});

write("public/singapore/index.html", marketPage("en", "English · Singapore", "This market is ready for future content. Current product data is available in the Chinese market."));
write("public/thailand/index.html", marketPage("th", "ภาษาไทย · Thailand", "หน้านี้เตรียมไว้สำหรับสินค้าในอนาคต ตอนนี้สามารถดูสินค้าภาษาจีนได้ก่อน"));
write("public/vietnam/index.html", marketPage("vi", "Tiếng Việt · Việt Nam", "Trang này đã sẵn sàng cho nội dung tương lai. Hiện có thể xem khu vực tiếng Trung."));
write("public/malaysia/index.html", marketPage("ms", "Bahasa Melayu · Malaysia", "Halaman ini disediakan untuk kandungan akan datang. Produk semasa tersedia di pasaran Cina."));
write("public/laos/index.html", marketPage("lo", "ພາສາລາວ · Laos", "ໜ້ານີ້ກຽມໄວ້ສໍາລັບສິນຄ້າໃນອະນາຄົດ. ຕອນນີ້ສາມາດເບິ່ງພາກພາສາຈີນໄດ້."));

write("public/china/index.html", html({
  title: "中国地区价格 | Secret Language Trade",
  description: "高品质私密好物，隐私包装配送，支持 COD 货到付款。",
  prefix: "../",
  body: `
    ${header("../", "home")}
    <main class="app-shell" aria-label="中国地区首页">
      <section class="hero">
        <p class="eyebrow">Neon Future Pleasure Store</p>
        <h1>探索未来感<br><span class="neon-text">私密愉悦体验</span></h1>
        <p>精选高品质私密好物，隐私包装配送，支持货到付款，让每一次选择都更安心。</p>
        <div class="chip-row">
          <span class="chip hot">隐私包装</span>
          <span class="chip">COD 货到付款</span>
          <span class="chip">快速发货</span>
        </div>
        <div class="hero-actions">
          <a class="primary-button" href="catalog/?category=panty&v=${version}">立即选购</a>
          <a class="secondary-button" href="catalog/?category=roleplay&v=${version}">查看热卖商品</a>
        </div>
      </section>

      <section class="section">
        <div class="section-header"><h2>更私密、更安心</h2></div>
        <div class="trust-grid">
          <div class="trust-card glass-card"><b>隐私包装</b><span>外箱不显示敏感信息，收货更安心。</span></div>
          <div class="trust-card glass-card"><b>COD 货到付款</b><span>收到商品后再付款，降低购买顾虑。</span></div>
          <div class="trust-card glass-card"><b>快速发货</b><span>订单确认后尽快安排配送。</span></div>
          <div class="trust-card glass-card"><b>精选品质</b><span>甄选实用热门款，体验更稳定。</span></div>
        </div>
      </section>

      <section class="section">
        <div class="section-header"><h2>商品分类</h2><a class="chip" href="catalog/?category=panty&v=${version}">全部</a></div>
        <div class="horizontal-rail">
          ${categoryCards.map(([cat, title, sub, image]) => `
          <a class="category-card glass-card" href="catalog/?category=${cat}&v=${version}">
            <img src="../assets/china-product-items/${image}?v=${version}" alt="${title}" loading="lazy">
            <strong>${title}</strong>
            <span>${sub}</span>
          </a>`).join("")}
        </div>
      </section>

      <section class="section">
        <div class="section-header"><div><h2>本周热卖</h2><p class="muted">更多用户选择的私密好物</p></div></div>
        <div class="product-grid">
          ${[
            ["panty", 1, "柔和触感，适合日常私密体验", "¥ 7.80"],
            ["bra", 2, "亲肤承托，低调舒适", "¥ 29.80"],
            ["dress", 1, "轻盈风格，新手友好", "¥ 39.90"],
            ["bag", 2, "轻便出行，经典耐用", "¥ 179.90"]
          ].map(([cat, item, copy, price], index) => `
          <a class="product-card" href="product/?category=${cat}&item=${item}&v=${version}">
            <div class="product-card__media"><img src="../assets/china-product-items/${cat}-${item}.jpg?v=${version}" alt="${copy}" loading="${index < 2 ? "eager" : "lazy"}"><span class="badge">${index === 0 ? "HOT" : "COD"}</span></div>
            <div class="product-card__body"><h3>${copy}</h3><p>隐私包装 · 支持货到付款</p><strong class="price">${price}</strong><span class="mini-button">立即购买</span></div>
          </a>`).join("")}
        </div>
      </section>

      <section class="section">
        <div class="section-header"><h2>简单 3 步，安心下单</h2></div>
        <div class="flow-steps">
          <div class="flow-step glass-card"><b>1</b><div><b>选择商品</b><p>浏览分类或热卖推荐，选择适合你的私密好物。</p></div></div>
          <div class="flow-step glass-card"><b>2</b><div><b>填写收货信息</b><p>只填写配送需要的信息，表单简短清晰。</p></div></div>
          <div class="flow-step glass-card"><b>3</b><div><b>收货后付款</b><p>支持 COD 货到付款，包裹采用隐私包装。</p></div></div>
        </div>
      </section>

      <section class="section">
        <h2>常见问题</h2>
        <details class="faq-item"><summary>包装会显示商品内容吗？</summary><p>不会。我们采用隐私包装，外箱不显示敏感商品名称。</p></details>
        <details class="faq-item"><summary>是否支持货到付款？</summary><p>支持。用户可在收货时完成付款。</p></details>
        <details class="faq-item"><summary>多久发货？</summary><p>订单确认后会尽快安排发货，具体时间以所在地区配送情况为准。</p></details>
      </section>
    </main>
    ${bottomNav("", "home")}`
}));

write("public/china/catalog/index.html", html({
  title: "商品分类 | Secret Language Trade",
  description: "移动端商品列表，支持筛选、搜索、排序和 COD 快速购买。",
  prefix: "../../",
  body: `
    ${header("../../", "catalog")}
    <main class="app-shell" aria-label="商品列表">
      <section class="section compact-top">
        <p class="eyebrow">China market · CNY</p>
        <h1 id="pageTitle">商品分类</h1>
        <p class="muted">双列浏览，支持隐私包装与 COD 货到付款。</p>
        <div class="chip-row">
          <button class="chip" type="button" data-filter-open>筛选</button>
          <button class="chip" type="button" data-sort="hot">热卖优先</button>
          <button class="chip" type="button" data-sort="price">价格从低到高</button>
        </div>
      </section>
      <form class="form-stack search-form" id="searchForm">
        <div class="field"><input id="searchInput" type="search" placeholder="搜索商品名称、编号或卖点" autocomplete="off"></div>
      </form>
      <section class="product-grid" id="productGrid" aria-label="商品"></section>
      <section class="empty-state glass-card" id="emptyState" hidden>
        <h2>暂时没有符合条件的商品</h2>
        <p>请尝试调整筛选条件或查看热卖推荐。</p>
        <a class="primary-button" href="?category=roleplay&v=${version}">查看热卖商品</a>
      </section>
    </main>
    ${bottomNav("../", "catalog")}
    <div class="bottom-sheet" data-filter-sheet hidden>
      <section class="bottom-sheet__panel">
        <div class="section-header"><h2>筛选商品</h2><button class="chip" type="button" data-filter-close>关闭</button></div>
        <p class="muted">选择分类或小分类，结果会立即更新。</p>
        <div class="sheet-grid" id="categoryChoices"></div>
        <h3>小分类</h3>
        <div class="sheet-grid" id="filterChoices"></div>
        <div class="hero-actions"><button class="primary-button" type="button" data-filter-close>应用筛选</button><button class="secondary-button" type="button" data-reset-filter>重置</button></div>
      </section>
    </div>`,
  scripts: `
    <script src="${dataSrc("../../")}"></script>
    <script src="../../assets/neon-catalog.js?v=${version}" defer></script>`
}));

write("public/assets/neon-catalog.js", `
(function () {
  const VERSION = "${version}";
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
`);

write("public/china/product/index.html", html({
  title: "商品详情 | Secret Language Trade",
  description: "商品详情，支持加入购物车与 COD 货到付款购买。",
  prefix: "../../",
  body: `
    <main class="product-detail app-shell no-bottom-nav" aria-label="商品详情">
      <section class="product-gallery">
        <a class="floating-back" id="backLink" href="../catalog/?category=panty&v=${version}" aria-label="返回上一页">返回</a>
        <a class="floating-cart" href="../cart/?v=${version}" aria-label="购物车">购物车</a>
        <img id="heroImage" src="" alt="" fetchpriority="high">
        <div class="gallery-dots" id="galleryDots"></div>
      </section>
      <section class="section product-info-panel">
        <p class="eyebrow">Private selection</p>
        <h1 id="productTitle">商品详情</h1>
        <p id="productSubtitle">柔和触感，低噪运行，适合私密放松与亲密互动场景。</p>
        <strong class="price" id="productPrice">¥0.00</strong>
        <div class="chip-row"><span class="chip hot">隐私包装</span><span class="chip">COD 货到付款</span><span class="chip">新手友好</span></div>
      </section>
      <section class="section">
        <h2>核心卖点</h2>
        <div class="feature-grid" id="featureGrid"></div>
      </section>
      <section class="section glass-card strong detail-copy">
        <h2>为私密时刻设计的高级体验</h2>
        <p id="detailCopy"></p>
      </section>
      <section class="section">
        <h2>配送与隐私</h2>
        <div class="trust-grid">
          <div class="trust-card glass-card"><b>隐私包装</b><span>外箱不显示敏感商品名称。</span></div>
          <div class="trust-card glass-card"><b>货到付款</b><span>收货时完成付款，减少顾虑。</span></div>
        </div>
      </section>
      <section class="section">
        <h2>常见问题</h2>
        <details class="faq-item"><summary>包装会显示商品内容吗？</summary><p>不会。我们采用隐私包装，外箱不显示敏感商品名称。</p></details>
        <details class="faq-item"><summary>是否支持货到付款？</summary><p>支持。用户可在收货时完成付款。</p></details>
        <details class="faq-item"><summary>适合新手吗？</summary><p>请查看商品标签。标记“新手友好”的商品更适合初次尝试。</p></details>
      </section>
    </main>
    <section class="sticky-buy-bar" aria-label="购买操作">
      <div><span class="muted">到手价</span><strong class="price" id="barPrice">¥0.00</strong></div>
      <div class="form-stack"><button class="primary-button" type="button" id="buyNow">立即购买 · 货到付款</button><button class="secondary-button" type="button" id="addCart">加入购物车</button></div>
    </section>`,
  scripts: `
    <script src="${dataSrc("../../")}"></script>
    <script src="../../assets/neon-product.js?v=${version}" defer></script>`
}));

write("public/assets/neon-product.js", `
(function () {
  const VERSION = "${version}";
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
`);

write("public/china/cart/index.html", html({
  title: "购物车 | Secret Language Trade",
  description: "购物车，支持数量修改、隐私包装提示和 COD 结算。",
  prefix: "../../",
  body: `
    ${header("../../", "cart")}
    <main class="app-shell no-bottom-nav" aria-label="购物车">
      <section class="section compact-top">
        <p class="eyebrow">Cart</p>
        <h1>购物车</h1>
        <p class="muted">已为你启用隐私包装，支持货到付款。</p>
      </section>
      <section id="cartList" class="form-stack"></section>
      <section class="section trust-grid">
        <div class="trust-card glass-card"><b>隐私包装</b><span>包裹外部不会显示敏感商品信息。</span></div>
        <div class="trust-card glass-card"><b>货到付款</b><span>确认订单后，收货时再付款。</span></div>
      </section>
    </main>
    <section class="sticky-checkout-bar" aria-label="购物车结算">
      <div><span class="muted">总计</span><strong class="price" id="totalPrice">¥0.00</strong></div>
      <a class="primary-button" href="../checkout/?v=${version}">去结算 · COD 付款</a>
    </section>`,
  scripts: `
    <script src="${dataSrc("../../")}"></script>
    <script src="../../assets/neon-cart.js?v=${version}" defer></script>`
}));

write("public/assets/neon-cart.js", `
(function () {
  const VERSION = "${version}";
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
`);

write("public/china/checkout/index.html", html({
  title: "确认订单 | Secret Language Trade",
  description: "COD 货到付款结算页，填写收货信息并提交订单。",
  prefix: "../../",
  body: `
    ${header("../../", "")}
    <main class="app-shell no-bottom-nav" id="checkoutApp" aria-label="确认订单">
      <section class="section compact-top" data-checkout-form>
        <p class="eyebrow">COD Checkout</p>
        <h1>确认订单</h1>
        <p class="muted">填写收货信息，支持货到付款与隐私包装。</p>
      </section>
      <section class="glass-card strong order-summary" id="orderSummary" data-checkout-form></section>
      <form class="form-stack" id="checkoutForm" data-checkout-form novalidate>
        <div class="field"><label for="name">姓名</label><input id="name" name="name" autocomplete="name"><div class="error-text" data-error="name"></div></div>
        <div class="field"><label for="phone">手机号码</label><input id="phone" name="phone" inputmode="tel" autocomplete="tel"><div class="error-text" data-error="phone"></div></div>
        <div class="field"><label for="country">国家/地区</label><select id="country" name="country"><option>中国</option><option>新加坡</option><option>泰国</option><option>越南</option><option>马来西亚</option><option>老挝</option></select></div>
        <div class="field"><label for="city">城市/省份</label><input id="city" name="city" autocomplete="address-level1"><div class="error-text" data-error="city"></div></div>
        <div class="field"><label for="address">详细地址</label><textarea id="address" name="address" autocomplete="street-address"></textarea><div class="error-text" data-error="address"></div></div>
        <div class="field"><label for="note">备注，可选</label><textarea id="note" name="note" placeholder="例如配送时间、备用电话等"></textarea></div>
        <button class="primary-button" type="submit">提交订单 · 货到付款</button>
        <p class="muted">我们会尽快联系你确认订单，包裹采用隐私包装。</p>
      </form>
      <section class="section trust-grid" data-checkout-form>
        <div class="trust-card glass-card"><b>外包装不显示敏感信息</b><span>更自然地完成收货。</span></div>
        <div class="trust-card glass-card"><b>支持货到付款</b><span>收货时再付款。</span></div>
        <div class="trust-card glass-card"><b>信息仅用于配送</b><span>用于订单确认与配送联系。</span></div>
        <div class="trust-card glass-card"><b>客服确认发货</b><span>确认后尽快安排配送。</span></div>
      </section>
      <section class="success-screen" id="successScreen" hidden>
        <div class="success-ring">✓</div>
        <h1>订单已提交成功</h1>
        <p>我们会尽快确认订单并安排发货。你的包裹将采用隐私包装，外部不会显示商品信息。</p>
        <div class="glass-card strong success-info" id="successInfo"></div>
        <div class="hero-actions">
          <a class="primary-button" href="../catalog/?category=roleplay&v=${version}">继续浏览商品</a>
          <a class="secondary-button" href="../?v=${version}">返回首页</a>
        </div>
        <p class="muted"><strong id="successCountdown">3</strong> 秒后进入会员信息页面</p>
      </section>
    </main>`,
  scripts: `
    <script src="${dataSrc("../../")}"></script>
    <script src="../../assets/neon-checkout.js?v=${version}" defer></script>`
}));

write("public/assets/neon-checkout.js", `
(function () {
  const VERSION = "${version}";
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
    if (!/^\\+?[0-9\\s-]{6,18}$/.test(fields.phone.trim())) { error("phone", "请输入正确的手机号码，方便配送员联系你。"); ok = false; }
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
`);

write("public/china/support/index.html", html({
  title: "客服中心 | Secret Language Trade",
  description: "客服中心，支持 FAQ、在线咨询、邮箱支持和服务保障。",
  prefix: "../../",
  body: `
    ${header("../../", "support")}
    <main class="app-shell" aria-label="客服中心">
      <section class="hero support-hero">
        <p class="eyebrow">Support</p>
        <h1>客服中心</h1>
        <p>常见问题、在线咨询、邮箱支持与服务保障。默认不打开聊天框，点击在线咨询后再展开。</p>
      </section>
      <section class="service-list glass-card strong">
        <button type="button"><b>FAQ 常见问题</b><span>查看常见问题解答，快速解决疑问</span></button>
        <button type="button" data-open-chat><b>在线咨询</b><span>与客服实时沟通，获取专业帮助</span></button>
        <button type="button"><b>邮箱支持</b><span>发送邮件至客服邮箱，我们会尽快回复</span></button>
        <button type="button"><b>服务时间</b><span>周一至周五 9:00 - 22:00</span></button>
        <button type="button"><b>服务保障</b><span>保护隐私，提供安全、优质的服务</span></button>
      </section>
      <section class="chat-panel glass-card" id="chatPanel" hidden>
        <div class="section-header"><h2>在线咨询</h2><button class="chip" type="button" data-close-chat>关闭</button></div>
        <p class="message agent">您好，很高兴为您服务。</p>
        <p class="message user">请问这款产品支持货到付款吗？</p>
        <p class="message agent">您好，支持货到付款。我们会通过订单信息联系确认，并使用隐私包装配送。</p>
        <form class="chat-input" id="chatForm"><input placeholder="输入您的问题..." aria-label="输入您的问题"><button class="primary-button" type="submit">发送</button></form>
      </section>
    </main>
    ${bottomNav("../", "support")}`,
  scripts: `
    <script>
      document.addEventListener("click", function(event) {
        if (event.target.closest("[data-open-chat]")) document.getElementById("chatPanel").hidden = false;
        if (event.target.closest("[data-close-chat]")) document.getElementById("chatPanel").hidden = true;
      });
      document.getElementById("chatForm").addEventListener("submit", function(event) {
        event.preventDefault();
        window.SLT.toast("消息已记录，客服会尽快回复");
        event.currentTarget.reset();
      });
    </script>`
}));

write("public/404.html", html({
  title: "页面不存在 | Secret Language Trade",
  description: "页面不存在，返回 Secret Language Trade 首页。",
  prefix: "",
  body: `
    ${header("", "")}
    <main class="app-shell">
      <section class="hero">
        <p class="eyebrow">404</p>
        <h1>页面暂时不存在</h1>
        <p>可能是链接过期或内容正在准备中。你可以返回首页继续浏览。</p>
        <a class="primary-button" href="/?v=${version}">返回首页</a>
      </section>
    </main>`
}));

// Small page-specific CSS appended after the shared system.
fs.appendFileSync(path.join(publicDir, "assets/neon-theme.css"), `
.language-hero { min-height: 400px; padding-top: 42px; padding-bottom: 12px; }
.support-hero { min-height: 390px; padding-top: 42px; padding-bottom: 12px; }
.language-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.language-card { min-height: 166px; padding: 13px; position: relative; overflow: hidden; }
.language-card img { width: 100%; height: 74px; object-fit: cover; border-radius: 16px; margin-bottom: 10px; box-shadow: 0 10px 22px rgba(0,0,0,.25); }
.language-card strong { display: block; font-size: 18px; line-height: 1.1; }
.language-card span { display: block; margin-top: 6px; color: var(--text-sub); font-size: 12px; line-height: 1.35; }
.language-card em { position: absolute; right: 12px; bottom: 12px; font-style: normal; color: var(--neon-cyan); font-weight: 900; }
.trust-strip { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; padding: 12px 8px; text-align: center; }
.trust-strip b { display: block; font-size: 11px; }
.trust-strip span { display: block; margin-top: 5px; color: var(--text-muted); font-size: 8px; line-height: 1.2; }
.compact-top { margin-top: 4px; }
.search-form { margin-bottom: 14px; }
.empty-state { padding: 18px; margin-top: 16px; }
.product-gallery { position: relative; width: calc(100% + 32px); margin: -76px -16px 0; height: clamp(390px, 112vw, 460px); background: #080812; overflow: hidden; }
.product-gallery::after { content: ""; position: absolute; inset: 44% 0 0; background: linear-gradient(180deg, transparent, var(--bg-main)); pointer-events: none; }
.product-gallery img { width: 100%; height: 100%; object-fit: cover; }
.floating-back, .floating-cart { position: absolute; z-index: 2; top: max(44px, env(safe-area-inset-top)); min-width: 48px; height: 44px; display: grid; place-items: center; border-radius: 999px; background: rgba(5,5,16,.64); border: 1px solid rgba(255,255,255,.14); backdrop-filter: blur(12px); font-size: 12px; }
.floating-back { left: 16px; }
.floating-cart { right: 16px; }
.gallery-dots { position: absolute; z-index: 3; left: 0; right: 0; bottom: 22px; display: flex; justify-content: center; gap: 8px; }
.gallery-dots button { width: 8px; height: 8px; padding: 0; border: 0; border-radius: 50%; background: rgba(255,255,255,.36); }
.gallery-dots button.is-active { width: 22px; border-radius: 999px; background: var(--gradient-main); }
.product-info-panel { margin-top: 18px; }
.detail-copy { padding: 18px; }
.cart-line { min-height: 128px; padding: 12px; display: grid; grid-template-columns: 92px 1fr; gap: 12px; }
.cart-line img { width: 92px; height: 108px; object-fit: cover; border-radius: 16px; }
.qty-control { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 10px; }
.qty-control button { min-width: 38px; min-height: 38px; border-radius: 999px; border: 1px solid rgba(255,255,255,.14); background: rgba(255,255,255,.05); color: #fff; }
.qty-control span { min-width: 30px; text-align: center; }
.order-summary { padding: 16px; margin-bottom: 16px; }
.summary-line { display: grid; grid-template-columns: 58px 1fr auto; gap: 10px; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,.08); }
.summary-line img { width: 58px; height: 58px; border-radius: 14px; object-fit: cover; }
.summary-line span { display: block; margin-top: 5px; color: var(--text-muted); font-size: 12px; }
.summary-total { display: flex; justify-content: space-between; align-items: center; padding: 14px 0 10px; }
.success-screen { min-height: calc(100svh - 76px); display: grid; align-content: center; gap: 16px; text-align: center; }
.success-ring { width: 108px; height: 108px; margin: 0 auto; display: grid; place-items: center; border-radius: 50%; border: 1px solid rgba(0,229,255,.48); color: var(--success); font-size: 50px; box-shadow: 0 0 34px rgba(0,255,198,.24), inset 0 0 26px rgba(139,92,255,.24); }
.success-info { padding: 16px; text-align: left; }
.service-list { padding: 10px; }
.service-list button { width: 100%; min-height: 76px; padding: 12px; text-align: left; border: 0; border-bottom: 1px solid rgba(255,255,255,.08); background: transparent; color: #fff; }
.service-list button:last-child { border-bottom: 0; }
.service-list span { display: block; margin-top: 6px; color: var(--text-muted); font-size: 13px; }
.chat-panel { margin-top: 18px; padding: 16px; }
.message { max-width: 82%; padding: 10px 12px; border-radius: 16px; background: rgba(255,255,255,.065); }
.message.user { margin-left: auto; background: rgba(255,43,214,.14); }
.chat-input { display: grid; grid-template-columns: 1fr 82px; gap: 8px; margin-top: 12px; }
.chat-input input { min-width: 0; min-height: 48px; padding: 0 12px; border-radius: 999px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.055); color: #fff; }
`);
console.log("Built neon static site", version);
