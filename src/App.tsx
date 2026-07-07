import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { mockCategories, mockProducts } from "./data/mockData";
import { dateText, maskContact, money, slugTitle } from "./lib/format";
import { paymentMethods, submitMockPayment } from "./lib/paymentAdapter";
import { isAdultVerified, validateAddress } from "./lib/validators";
import {
  addressStore,
  adminStore,
  cartStore,
  couponStore,
  favoriteStore,
  getArticles,
  getBanners,
  getCategories,
  getCoupons,
  getProducts,
  getReviews,
  getSettings,
  historyStore,
  orderStore,
  saveArticles,
  saveBanners,
  saveCategories,
  saveCoupons,
  saveProducts,
  saveReviews,
  saveSettings,
  userStore
} from "./store/stores";
import type { Address, Article, Banner, Category, Coupon, Order, OrderStatus, Product, Review, StoreSettings } from "./types";

type ToastState = { text: string; tone?: "success" | "danger" };

function go(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function useRoute() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    if (redirect) {
      window.history.replaceState({}, "", redirect);
      setPath(redirect);
    }
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return path.replace(/\/+$/, "") || "/";
}

function useLiveData() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick((x) => x + 1);
    window.addEventListener("loveqc-storage", bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener("loveqc-storage", bump);
      window.removeEventListener("storage", bump);
    };
  }, []);
}

function App() {
  useLiveData();
  const path = useRoute();
  const [toast, setToast] = useState<ToastState | null>(null);
  const showToast = (text: string, tone?: ToastState["tone"]) => {
    setToast({ text, tone });
    window.setTimeout(() => setToast(null), 2400);
  };
  const adminPath = path.startsWith("/admin");
  const verified = isAdultVerified();

  if (path === "/age-denied") return <AgeDeniedPage />;
  if (!adminPath && !verified) return <AgeGate />;
  if (adminPath) return <AdminRouter path={path} toast={showToast} />;

  return (
    <AppShell path={path}>
      <Router path={path} toast={showToast} />
      {toast && <Toast text={toast.text} tone={toast.tone} />}
    </AppShell>
  );
}

function AppShell({ children, path }: { children: ReactNode; path: string }) {
  const hideBottom = ["/checkout", "/payment-result", "/login"].some((p) => path.startsWith(p)) || path.startsWith("/product/");
  return (
    <div className="phone-frame">
      <div className="app-shell">
        <MobileHeader path={path} />
        <main className={`main-content ${hideBottom ? "no-bottom" : ""}`}>{children}</main>
        {!hideBottom && <BottomNav path={path} />}
      </div>
    </div>
  );
}

function MobileHeader({ path }: { path: string }) {
  const isHome = path === "/";
  return (
    <header className="header">
      {!isHome && (
        <button className="icon-btn" onClick={() => history.length > 1 ? history.back() : go("/") } aria-label="返回">
          ‹
        </button>
      )}
      <div className="brand">
        <div className="brand-logo">{isHome ? "LOVE QC" : titleForPath(path)}</div>
        <div className="brand-sub">{isHome ? "Private Select" : "18+ Private Store"}</div>
      </div>
      <button className="icon-btn" onClick={() => go("/support")} aria-label="客服">客</button>
      <button className="icon-btn" onClick={() => go("/account")} aria-label="通知">铃</button>
    </header>
  );
}

function titleForPath(path: string) {
  if (path.startsWith("/category/")) return getCategories().find((c) => c.slug === path.split("/")[2])?.name ?? "分类";
  if (path.startsWith("/product/")) return "商品详情";
  if (path.startsWith("/orders/")) return "订单详情";
  if (path.startsWith("/articles/")) return "私密指南";
  const map: Record<string, string> = {
    "/categories": "分类",
    "/search": "搜索",
    "/cart": "购物车",
    "/checkout": "确认订单",
    "/payment-result": "订单结果",
    "/login": "登录注册",
    "/account": "我的",
    "/orders": "我的订单",
    "/favorites": "收藏",
    "/history": "浏览历史",
    "/coupons": "优惠券",
    "/membership": "会员权益",
    "/addresses": "地址管理",
    "/articles": "私密指南",
    "/privacy-delivery": "隐私配送",
    "/support": "客服帮助",
    "/policy/privacy": "隐私政策",
    "/policy/terms": "服务条款",
    "/policy/return": "售后政策"
  };
  return map[path] ?? "LOVE QC";
}

function BottomNav({ path }: { path: string }) {
  const count = cartStore.getCartCount();
  const items = [
    ["/", "首页", "⌂"],
    ["/categories", "分类", "◇"],
    ["/articles", "发现", "✦"],
    ["/cart", "购物车", "□"],
    ["/account", "我的", "○"]
  ];
  return (
    <nav className="bottom-nav">
      {items.map(([href, label, icon]) => (
        <button key={href} className={`bottom-item ${path === href || (href !== "/" && path.startsWith(href)) ? "active" : ""}`} onClick={() => go(href)}>
          <strong>{icon}</strong>
          <span>{label}</span>
          {href === "/cart" && count > 0 && <span className="badge">{count}</span>}
        </button>
      ))}
    </nav>
  );
}

function Router({ path, toast }: { path: string; toast: (text: string, tone?: ToastState["tone"]) => void }) {
  if (path === "/") return <HomePage toast={toast} />;
  if (path === "/categories") return <CategoriesPage />;
  if (path.startsWith("/category/")) return <CategoryPage slug={path.split("/")[2]} toast={toast} />;
  if (path === "/search") return <SearchPage toast={toast} />;
  if (path.startsWith("/product/")) return <ProductDetailPage id={path.split("/")[2]} toast={toast} />;
  if (path === "/cart") return <CartPage toast={toast} />;
  if (path === "/checkout") return <CheckoutPage toast={toast} />;
  if (path === "/payment-result") return <PaymentResultPage />;
  if (path === "/login") return <LoginPage toast={toast} />;
  if (path === "/account") return <AccountPage toast={toast} />;
  if (path === "/orders") return <OrdersPage />;
  if (path.startsWith("/orders/")) return <OrderDetailPage id={path.split("/")[2]} toast={toast} />;
  if (path === "/favorites") return <FavoritesPage toast={toast} />;
  if (path === "/history") return <HistoryPage />;
  if (path === "/coupons") return <CouponsPage toast={toast} />;
  if (path === "/membership") return <MembershipPage />;
  if (path === "/addresses") return <AddressesPage toast={toast} />;
  if (path === "/articles") return <ArticlesPage />;
  if (path.startsWith("/articles/")) return <ArticleDetailPage id={path.split("/")[2]} />;
  if (path === "/privacy-delivery") return <PrivacyDeliveryPage />;
  if (path === "/support") return <SupportPage toast={toast} />;
  if (path === "/policy/privacy") return <PolicyPage type="privacy" />;
  if (path === "/policy/terms") return <PolicyPage type="terms" />;
  if (path === "/policy/return") return <PolicyPage type="return" />;
  return <NotFoundPage />;
}

function AgeGate() {
  const enter = () => {
    localStorage.setItem("loveqc_ageVerified", JSON.stringify({ value: true, at: Date.now(), days: getSettings().ageGateDays }));
    go("/");
  };
  return (
    <div className="age-gate">
      <section className="glass-card">
        <div className="age-mark">18+</div>
        <div className="brand-logo">LOVE QC</div>
        <p className="brand-sub">Private Select</p>
        <h1>本网站仅供 18 岁或以上人士浏览</h1>
        <p className="muted">这里展示的是成人私密用品商城。请确认你已达到当地法定年龄，并愿意继续浏览。</p>
        <button className="gradient-btn" style={{ width: "100%", marginTop: 18 }} onClick={enter}>我已满 18 岁，进入</button>
        <button className="ghost-btn" style={{ width: "100%", marginTop: 10 }} onClick={() => go("/age-denied")}>未满 18 岁，离开</button>
        <p className="muted" style={{ fontSize: 12 }}>进入即表示你同意服务条款与隐私政策。</p>
      </section>
    </div>
  );
}

function AgeDeniedPage() {
  return (
    <div className="age-gate">
      <section className="glass-card">
        <div className="age-mark">锁</div>
        <h1>暂时无法访问</h1>
        <p className="muted">本网站仅面向达到当地法定年龄的成年人。该页面不展示任何成人商品内容。</p>
      </section>
    </div>
  );
}

function Toast({ text, tone }: ToastState) {
  return <div className="toast" style={tone === "danger" ? { borderColor: "rgba(255,71,126,.42)" } : undefined}>{text}</div>;
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function GlassCard({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return <div className={`glass-card ${className}`} onClick={onClick}>{children}</div>;
}

function GradientButton({ children, onClick, type = "button", disabled }: { children: ReactNode; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean }) {
  return <button className="gradient-btn" type={type} onClick={onClick} disabled={disabled}>{children}</button>;
}

function SearchBar({ placeholder = "搜索礼盒、护理、安全防护、氛围好物", value, onChange, autoFocus }: { placeholder?: string; value?: string; onChange?: (v: string) => void; autoFocus?: boolean }) {
  return (
    <label className="search-bar" onClick={() => !onChange && go("/search")}>
      <span>⌕</span>
      {onChange ? <input autoFocus={autoFocus} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /> : <span>{placeholder}</span>}
    </label>
  );
}

function RatingStars({ value }: { value: number }) {
  return <span style={{ color: "var(--gold)", fontSize: 12 }}>★★★★★ <span className="muted">{value.toFixed(1)}</span></span>;
}

function PriceText({ product, variantId }: { product: Product; variantId?: string }) {
  const variant = product.variants.find((v) => v.id === variantId);
  const value = product.price + (variant?.priceDelta ?? 0);
  return <span><span className="price">{money(value)}</span>{product.originalPrice && <span className="old-price">{money(product.originalPrice)}</span>}</span>;
}

function ProductCard({ product, toast }: { product: Product; toast?: (text: string) => void }) {
  return (
    <article className="product-card" onClick={() => go(`/product/${product.id}`)}>
      <ProductArt product={product} />
      <div className="tag-row" style={{ marginTop: 9 }}>{product.tags.slice(0, 2).map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
      <h3>{product.name}</h3>
      <p>{product.shortDescription}</p>
      <RatingStars value={product.rating} />
      <div style={{ marginTop: 8 }}><PriceText product={product} /></div>
      <button
        className="mini-btn"
        onClick={(e) => {
          e.stopPropagation();
          cartStore.addToCart(product.id);
          toast?.("已加入购物车，外包装将使用中性名称");
        }}
      >
        加入购物车
      </button>
    </article>
  );
}

function ProductArt({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <div className={large ? "detail-art" : "product-art"}>
      <strong>{product.categoryName.slice(0, 1)}礼</strong>
    </div>
  );
}

function ProductGrid({ products, toast }: { products: Product[]; toast?: (text: string) => void }) {
  if (!products.length) return <EmptyState title="暂时没有符合条件的商品" text="请尝试调整筛选条件或查看热卖推荐。" action="查看热卖" onAction={() => go("/category/sale")} />;
  return <div className="grid-2">{products.map((product) => <ProductCard key={product.id} product={product} toast={toast} />)}</div>;
}

function EmptyState({ title, text, action, onAction }: { title: string; text: string; action?: string; onAction?: () => void }) {
  return (
    <GlassCard className="empty">
      <strong>{title}</strong>
      <p className="muted">{text}</p>
      {action && <button className="ghost-btn" onClick={onAction}>{action}</button>}
    </GlassCard>
  );
}

function LoadingSkeleton() {
  return <div className="grid-2">{Array.from({ length: 4 }).map((_, i) => <div className="product-card" key={i}><div className="product-art" /><p className="muted">加载中...</p></div>)}</div>;
}

function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return <div className="modal-backdrop" onClick={onClose}><div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>{children}</div></div>;
}

function BottomSheet({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <SectionHeader title={title} action={<button className="icon-btn" onClick={onClose}>×</button>} />
        {children}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const success = ["paid", "completed", "delivered", "approved", "active"].includes(status);
  const danger = ["cancelled", "rejected", "refunded"].includes(status);
  return <span className={`status ${success ? "success" : danger ? "danger" : ""}`}>{statusText(status)}</span>;
}

function statusText(status: string) {
  const map: Record<string, string> = {
    pending_payment: "待付款",
    paid: "已支付",
    pending_confirm: "待确认",
    processing: "处理中",
    shipped: "已发货",
    delivered: "待收货",
    completed: "已完成",
    refund_requested: "售后中",
    refunded: "已退款",
    cancelled: "已取消",
    pending: "待审核",
    approved: "已通过",
    rejected: "已拒绝"
  };
  return map[status] ?? status;
}

function HomePage({ toast }: { toast: (text: string) => void }) {
  const banners = getBanners().filter((b) => b.active);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setActive((v) => (v + 1) % banners.length), 3600);
    return () => window.clearInterval(id);
  }, [banners.length]);
  const banner = banners[active] ?? banners[0];
  const featured = getProducts().filter((p) => p.isFeatured).slice(0, 8);
  return (
    <>
      <section className="hero glass-card">
        <p className="brand-sub">18+ Only · Privacy First</p>
        <h1>{banner?.title ?? "LOVE QC 私密精选"}</h1>
        <p>{banner?.subtitle ?? "隐私包装，安心配送，高级克制的成年人精选商城。"}</p>
        <GradientButton onClick={() => go(banner?.href ?? "/categories")}>{banner?.cta ?? "立即探索"}</GradientButton>
      </section>
      <div className="section"><SearchBar /></div>
      <div className="trust">
        {["18+ 成人专属", "隐私包装", "私密账单名"].map((item) => <GlassCard key={item}><strong>{item.slice(0, 2)}</strong>{item}</GlassCard>)}
      </div>
      <section className="section">
        <SectionHeader title="精选分类" subtitle="从新手、护理、礼盒到隐私收纳" action={<button className="ghost-btn" onClick={() => go("/categories")}>全部</button>} />
        <div className="grid-2">{getCategories().map((cat) => <CategoryPill key={cat.id} category={cat} />)}</div>
      </section>
      <section className="section">
        <SectionHeader title="今夜限时" subtitle={<CountdownText />} />
        <div className="scroll-row">{featured.slice(0, 5).map((p) => <div style={{ width: 168 }} key={p.id}><ProductCard product={p} toast={toast} /></div>)}</div>
      </section>
      <section className="section">
        <SectionHeader title="第一次挑选？从这里开始" subtitle="私密指南、清洁收纳与放心收货" />
        {getArticles().slice(0, 3).map((article) => <ArticleCard key={article.id} article={article} />)}
      </section>
      <section className="section">
        <SectionHeader title="大家都在看" subtitle="更多用户选择的私密好物" />
        <ProductGrid products={featured} toast={toast} />
      </section>
      <GlassCard className="section">
        <h2>为两个人准备的仪式感</h2>
        <p className="muted">精选套装、隐私包装、适合送礼。礼盒外观克制，不显示敏感商品名。</p>
        <GradientButton onClick={() => go("/category/gift-box")}>查看礼盒</GradientButton>
      </GlassCard>
      <GlassCard className="section">
        <h2>放心收货</h2>
        <p className="muted">外包装不显示敏感商品名，订单与账单使用中性名称。配送信息仅用于履约。</p>
        <button className="ghost-btn" onClick={() => go("/privacy-delivery")}>了解隐私配送</button>
      </GlassCard>
      <footer className="section muted" style={{ textAlign: "center" }}>
        LOVE QC Private Select · 18+ Only<br />
        <button className="chip" onClick={() => go("/policy/privacy")}>隐私政策</button>
        <button className="chip" onClick={() => go("/policy/terms")}>条款</button>
        <button className="chip" onClick={() => go("/policy/return")}>售后</button>
      </footer>
    </>
  );
}

function CountdownText() {
  const [left, setLeft] = useState(3 * 60 * 60 + 28 * 60);
  useEffect(() => {
    const id = window.setInterval(() => setLeft((v) => Math.max(0, v - 1)), 1000);
    return () => window.clearInterval(id);
  }, []);
  const h = String(Math.floor(left / 3600)).padStart(2, "0");
  const m = String(Math.floor((left % 3600) / 60)).padStart(2, "0");
  const s = String(left % 60).padStart(2, "0");
  return <span>限时、满减、包邮 · {h}:{m}:{s}</span>;
}

function CategoryPill({ category }: { category: Category }) {
  return (
    <button className="category-pill" onClick={() => go(`/category/${category.slug}`)}>
      <div className="orb" style={{ width: 44, height: 44, borderRadius: 16, fontSize: 18 }}>{category.icon}</div>
      <b>{category.name}</b>
      <span>{category.description}</span>
    </button>
  );
}

function CategoriesPage() {
  return (
    <>
      <SearchBar />
      <section className="section">
        <SectionHeader title="分类" subtitle="按场景选择，减少犹豫" />
        <div className="grid-2">
          {getCategories().map((cat) => (
            <GlassCard key={cat.id} onClick={() => go(`/category/${cat.slug}`)}>
              <div className="orb" style={{ width: 54, height: 54, borderRadius: 18, fontSize: 20 }}>{cat.icon}</div>
              <h3>{cat.name}</h3>
              <p className="muted">{cat.description}</p>
              <span className="tag">{getProducts().filter((p) => p.categoryId === cat.id || cat.slug === "sale").length} 件商品</span>
            </GlassCard>
          ))}
        </div>
      </section>
      <section className="section">
        <SectionHeader title="热门标签" />
        <div className="tag-row">{["隐私包装", "新手友好", "礼盒", "热卖", "护理", "便携", "高端"].map((tag) => <span className="chip" key={tag}>{tag}</span>)}</div>
      </section>
    </>
  );
}

function CategoryPage({ slug, toast }: { slug: string; toast: (text: string) => void }) {
  const [sort, setSort] = useState("综合推荐");
  const [sheet, setSheet] = useState(false);
  const [tag, setTag] = useState("");
  const category = getCategories().find((c) => c.slug === slug);
  const products = useMemo(() => {
    let list = getProducts().filter((p) => slug === "sale" ? Boolean(p.originalPrice) : p.categoryId === category?.id);
    if (tag) list = list.filter((p) => p.tags.includes(tag));
    if (sort === "价格从低到高") list.sort((a, b) => a.price - b.price);
    if (sort === "价格从高到低") list.sort((a, b) => b.price - a.price);
    if (sort === "销量优先") list.sort((a, b) => b.sales - a.sales);
    if (sort === "最新上架") list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return list;
  }, [category?.id, slug, sort, tag]);
  if (!category && slug !== "sale") return <NotFoundPage />;
  return (
    <>
      <SearchBar />
      <section className="section">
        <SectionHeader title={category?.name ?? "特价专区"} subtitle={category?.description ?? "限时优惠与组合价"} action={<button className="ghost-btn" onClick={() => setSheet(true)}>筛选</button>} />
        <div className="chips">{["综合推荐", "销量优先", "价格从低到高", "价格从高到低", "最新上架"].map((s) => <button key={s} className={`chip ${sort === s ? "active" : ""}`} onClick={() => setSort(s)}>{s}</button>)}</div>
        <div className="chips">{["", "新手友好", "礼盒", "便携", "护理", "安全防护", "热卖"].map((s) => <button key={s || "all"} className={`chip ${tag === s ? "active" : ""}`} onClick={() => setTag(s)}>{s || "全部"}</button>)}</div>
      </section>
      <ProductGrid products={products} toast={toast} />
      {sheet && <BottomSheet title="筛选商品" onClose={() => setSheet(false)}>
        <div className="grid-2">
          {["仅看有货", "仅看优惠商品", "新手友好", "隐私包装"].map((s) => <button className="category-pill" key={s} onClick={() => setSheet(false)}>{s}</button>)}
        </div>
        <GradientButton onClick={() => setSheet(false)}>应用筛选</GradientButton>
      </BottomSheet>}
    </>
  );
}

function SearchPage({ toast }: { toast: (text: string) => void }) {
  const [keyword, setKeyword] = useState("");
  const [history, setHistory] = useState<string[]>(JSON.parse(localStorage.getItem("loveqc_searchHistory") ?? "[]"));
  const products = getProducts().filter((p) => [p.name, p.categoryName, ...p.tags].join(" ").includes(keyword));
  const update = (value: string) => {
    setKeyword(value);
    if (value.trim()) {
      const next = [value.trim(), ...history.filter((h) => h !== value.trim())].slice(0, 10);
      setHistory(next);
      localStorage.setItem("loveqc_searchHistory", JSON.stringify(next));
    }
  };
  return (
    <>
      <SearchBar value={keyword} onChange={update} autoFocus />
      {!keyword && <section className="section">
        <SectionHeader title="热门搜索" />
        <div className="tag-row">{["礼盒", "新手", "护理", "安全防护", "香氛", "收纳"].map((s) => <button className="chip" onClick={() => update(s)} key={s}>{s}</button>)}</div>
        <SectionHeader title="搜索历史" action={<button className="ghost-btn" onClick={() => { setHistory([]); localStorage.removeItem("loveqc_searchHistory"); }}>清空</button>} />
        <div className="tag-row">{history.map((s) => <button className="chip" onClick={() => update(s)} key={s}>{s}</button>)}</div>
      </section>}
      {keyword && <section className="section"><SectionHeader title={`搜索结果 ${products.length} 件`} /><ProductGrid products={products} toast={toast} /></section>}
    </>
  );
}

function ProductDetailPage({ id, toast }: { id: string; toast: (text: string) => void }) {
  const product = getProducts().find((p) => p.id === id);
  const [variantId, setVariantId] = useState("standard");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("商品介绍");
  const [sheet, setSheet] = useState(false);
  useEffect(() => { if (product) historyStore.addHistory(product.id); }, [product?.id]);
  if (!product) return <NotFoundPage />;
  const favorite = favoriteStore.isFavorite(product.id);
  const add = () => {
    cartStore.addToCart(product.id, variantId, qty);
    toast("已加入购物车，外包装将使用中性名称");
  };
  return (
    <>
      <section className="detail-hero">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <button className="icon-btn" onClick={() => history.back()}>‹</button>
          <button className="icon-btn" onClick={() => { favoriteStore.toggleFavorite(product.id); toast(favorite ? "已取消收藏" : "已收藏"); }}>{favorite ? "♥" : "♡"}</button>
        </div>
        <ProductArt product={product} large />
        <p className="muted" style={{ textAlign: "right" }}>1 / 1</p>
      </section>
      <GlassCard className="section">
        <div className="tag-row">{["18+", "隐私包装", ...product.tags.slice(0, 3)].map((t) => <span className="tag" key={t}>{t}</span>)}</div>
        <h1>{product.name}</h1>
        <p className="muted">包裹/账单中性名称：{product.discreetName}</p>
        <p>{product.shortDescription}</p>
        <RatingStars value={product.rating} /> <span className="muted">{product.reviewCount} 条评价 · 销量 {product.sales}</span>
        <div style={{ marginTop: 12 }}><PriceText product={product} variantId={variantId} /></div>
        <p className="muted">库存 {product.stock} · 仅限成年人购买与使用</p>
      </GlassCard>
      <GlassCard className="section">
        <SectionHeader title="优惠与服务" subtitle="可领取优惠券，默认隐私包装" action={<button className="ghost-btn" onClick={() => go("/coupons")}>领券</button>} />
        <div className="tag-row">{["满 HK$499 包邮", "中性快递面单", "安全支付", "客服咨询"].map((t) => <span className="tag" key={t}>{t}</span>)}</div>
      </GlassCard>
      <GlassCard className="section">
        <SectionHeader title="规格与数量" action={<button className="ghost-btn" onClick={() => setSheet(true)}>选择规格</button>} />
        <p>{product.variants.find((v) => v.id === variantId)?.name}</p>
        <QuantityStepper value={qty} onChange={setQty} />
      </GlassCard>
      <section className="section">
        <div className="tabs">{["商品介绍", "使用与护理", "配送与售后", "评价"].map((t) => <button className={`chip ${tab === t ? "active" : ""}`} key={t} onClick={() => setTab(t)}>{t}</button>)}</div>
        <GlassCard>{detailTab(product, tab)}</GlassCard>
      </section>
      <section className="section">
        <SectionHeader title="相关推荐" />
        <ProductGrid products={getProducts().filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4)} toast={toast} />
      </section>
      <div className="sticky-buy">
        <button className="icon-btn" onClick={() => go("/support")}>客</button>
        <button className="icon-btn" onClick={() => { favoriteStore.toggleFavorite(product.id); toast("收藏已更新"); }}>♡</button>
        <button className="icon-btn hide-small" onClick={() => go("/cart")}>□</button>
        <button className="ghost-btn" onClick={add}>加购</button>
        <button className="gradient-btn" onClick={() => { add(); go("/checkout"); }}>立即购买</button>
      </div>
      {sheet && <VariantSelector product={product} value={variantId} onChange={setVariantId} onClose={() => setSheet(false)} />}
    </>
  );
}

function detailTab(product: Product, tab: string) {
  if (tab === "商品介绍") return <p className="policy">{product.description}</p>;
  if (tab === "使用与护理") return <p className="policy">{product.careGuide}<br />内容仅供一般信息参考，不替代专业医疗建议。如有身体不适，请咨询专业人士。</p>;
  if (tab === "配送与售后") return <p className="policy">{product.shippingNote}<br />{product.returnPolicyNote}</p>;
  return <div>{getReviews().filter((r: Review) => r.productId === product.id).map((r: Review) => <GlassCard key={r.id} className="section"><RatingStars value={r.rating} /><b>{r.userName}</b><p>{r.content}</p></GlassCard>)}</div>;
}

function VariantSelector({ product, value, onChange, onClose }: { product: Product; value: string; onChange: (v: string) => void; onClose: () => void }) {
  return <BottomSheet title="选择规格" onClose={onClose}>{product.variants.map((variant) => <button className={`category-pill ${value === variant.id ? "active" : ""}`} key={variant.id} onClick={() => { onChange(variant.id); onClose(); }}><b>{variant.name}</b><span>库存 {variant.stock} · +{money(variant.priceDelta)}</span></button>)}</BottomSheet>;
}

function QuantityStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return <span className="stepper"><button onClick={() => onChange(Math.max(1, value - 1))}>−</button><b>{value}</b><button onClick={() => onChange(value + 1)}>+</button></span>;
}

function CartPage({ toast }: { toast: (text: string, tone?: ToastState["tone"]) => void }) {
  const items = cartStore.get();
  const products = getProducts();
  const selectedCount = items.filter((i) => i.selected).reduce((s, i) => s + i.quantity, 0);
  if (!items.length) return <EmptyState title="购物车还是空的" text="去挑选一些私密好物，默认隐私包装。" action="去首页" onAction={() => go("/")} />;
  return (
    <>
      <SectionHeader title="购物车" subtitle="已启用隐私包装与中性包裹名称" action={<button className="ghost-btn" onClick={() => cartStore.selectAll(!items.every((i) => i.selected))}>全选</button>} />
      {items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        const variant = product.variants.find((v) => v.id === item.variantId);
        return (
          <GlassCard className="cart-row" key={product.id + item.variantId}>
            <input type="checkbox" checked={item.selected} onChange={() => cartStore.toggleSelected(product.id, item.variantId)} />
            <div className="thumb">{product.categoryName.slice(0, 1)}</div>
            <div>
              <b>{product.name}</b>
              <p className="muted">{variant?.name} · 隐私包装</p>
              <PriceText product={product} variantId={item.variantId} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <QuantityStepper value={item.quantity} onChange={(v) => cartStore.updateQuantity(product.id, item.variantId, v)} />
                <button className="ghost-btn" onClick={() => { cartStore.removeFromCart(product.id, item.variantId); toast("已删除商品"); }}>删除</button>
              </div>
            </div>
          </GlassCard>
        );
      })}
      <GlassCard className="section"><b>再买 {money(Math.max(0, getSettings().freeShippingThreshold - cartStore.getCartTotal()))} 可包邮</b><p className="muted">可用优惠券 {couponStore.getAvailableCoupons(cartStore.getCartTotal()).length} 张 · 包裹外部不显示敏感信息。</p></GlassCard>
      <section className="section"><SectionHeader title="推荐加购" /><ProductGrid products={getProducts().filter((p) => ["cat_storage", "cat_safe"].includes(p.categoryId)).slice(0, 4)} toast={toast} /></section>
      <div className="checkout-bar">
        <div><b>已选 {selectedCount} 件</b><br /><span className="price">{money(cartStore.getCartTotal())}</span></div>
        <GradientButton onClick={() => selectedCount ? go("/checkout") : toast("请先选择商品", "danger")}>去结算</GradientButton>
      </div>
    </>
  );
}

function CheckoutPage({ toast }: { toast: (text: string, tone?: ToastState["tone"]) => void }) {
  const items = cartStore.get().filter((i) => i.selected);
  const products = getProducts();
  const [address, setAddress] = useState<Address>(addressStore.get().find((a) => a.isDefault) ?? { id: "checkout", name: "", phone: "", region: "香港", detail: "", isDefault: true });
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("fps_mock");
  const [couponId, setCouponId] = useState("");
  const [points, setPoints] = useState(false);
  const [note, setNote] = useState("");
  if (!items.length) return <EmptyState title="没有待结算商品" text="请先在购物车选择商品。" action="返回购物车" onAction={() => go("/cart")} />;
  const subtotal = cartStore.getCartTotal();
  const shippingFee = subtotal >= getSettings().freeShippingThreshold ? 0 : getSettings().defaultShippingFee;
  const discount = couponStore.calculate(couponId, subtotal, shippingFee);
  const pointsDiscount = points ? Math.min(30, Math.floor((userStore.getCurrentUser()?.points ?? 0) / 100)) : 0;
  const total = Math.max(0, subtotal + shippingFee - discount - pointsDiscount);
  const submit = async () => {
    const errors = validateAddress(address);
    if (errors.length) return toast(errors[0], "danger");
    addressStore.save(address);
    const order = orderStore.createOrder({ address, deliveryMethod: delivery, paymentMethod: payment, couponId, note, pointsEnabled: points });
    const result = await submitMockPayment(payment);
    localStorage.setItem("loveqc_lastOrderId", order.id);
    localStorage.setItem("loveqc_lastPaymentStatus", result.status);
    go("/payment-result");
  };
  return (
    <>
      <SectionHeader title="确认订单" subtitle="填写收货信息，支持模拟支付与隐私包装。" />
      <GlassCard className="section">
        <Field label="收件人" value={address.name} onChange={(v) => setAddress({ ...address, name: v })} />
        <Field label="手机号码" value={address.phone} onChange={(v) => setAddress({ ...address, phone: v })} />
        <Field label="地区" value={address.region} onChange={(v) => setAddress({ ...address, region: v })} />
        <Field label="详细地址" value={address.detail} onChange={(v) => setAddress({ ...address, detail: v })} />
      </GlassCard>
      <GlassCard className="section">
        <SectionHeader title="商品清单" />
        {items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          return <p key={item.productId} className="muted">{product.name} × {item.quantity} · {product.discreetName}</p>;
        })}
      </GlassCard>
      <GlassCard className="section">
        <SelectField label="配送方式" value={delivery} onChange={setDelivery} options={[["standard", "标准配送 HK$35"], ["express", "加急配送 HK$68"], ["pickup", "自提/门店自取 HK$0"]]} />
        <SelectField label="支付方式" value={payment} onChange={setPayment} options={paymentMethods.map((m) => [m.id, m.name])} />
        <SelectField label="优惠券" value={couponId} onChange={setCouponId} options={[["", "不使用优惠券"], ...couponStore.getAvailableCoupons(subtotal).map((c) => [c.id, c.name] as [string, string])]} />
        <label className="chip"><input type="checkbox" checked={points} onChange={(e) => setPoints(e.target.checked)} /> 使用积分抵扣</label>
        <Field label="订单备注" value={note} onChange={setNote} textarea placeholder="如需特殊配送时间，可在这里备注。请勿填写敏感隐私内容。" />
      </GlassCard>
      <GlassCard className="section">
        <b>隐私包装设置</b>
        <p className="muted">默认开启：外包装不显示敏感商品名，面单显示中性名称，订单备注不出现成人用品字样。包裹名称：生活用品 / 日用品。</p>
      </GlassCard>
      <GlassCard className="section">
        <p>商品小计 {money(subtotal)}</p><p>配送费 {money(shippingFee)}</p><p>优惠 -{money(discount)}</p><p>积分抵扣 -{money(pointsDiscount)}</p><h2>应付 {money(total)}</h2>
      </GlassCard>
      <GradientButton onClick={submit}>提交订单 · 模拟支付</GradientButton>
    </>
  );
}

function PaymentResultPage() {
  const id = localStorage.getItem("loveqc_lastOrderId") ?? "";
  const status = localStorage.getItem("loveqc_lastPaymentStatus") ?? "success";
  const order = orderStore.getOrderById(id);
  if (!order) return <EmptyState title="没有找到订单" text="请返回订单中心查看。" action="我的订单" onAction={() => go("/orders")} />;
  return (
    <GlassCard className="empty">
      <div className="age-mark">{status === "pending" ? "待" : "✓"}</div>
      <h1>{status === "pending" ? "订单待确认" : "订单已提交"}</h1>
      <p className="muted">我们会使用隐私包装为你发货。包裹外部不会显示敏感商品信息。</p>
      <p>订单号：{order.orderNo}</p><p>金额：{money(order.total)}</p><p>配送方式：{order.deliveryMethod}</p>
      <GradientButton onClick={() => go(`/orders/${order.id}`)}>查看订单</GradientButton>
      <button className="ghost-btn" onClick={() => go("/")}>继续逛逛</button>
    </GlassCard>
  );
}

function LoginPage({ toast }: { toast: (text: string) => void }) {
  const [identifier, setIdentifier] = useState("");
  const [agree, setAgree] = useState(false);
  const [sec, setSec] = useState(0);
  useEffect(() => {
    if (!sec) return;
    const id = window.setInterval(() => setSec((v) => Math.max(0, v - 1)), 1000);
    return () => window.clearInterval(id);
  }, [sec]);
  const login = () => {
    if (!identifier || !agree) return toast("请填写手机号/邮箱并同意条款");
    userStore.mockLogin(identifier);
    toast("登录成功");
    go("/account");
  };
  return <GlassCard><div className="age-mark">LQ</div><h1>私密账户</h1><p className="muted">安心管理订单、优惠和隐私配送信息。</p><Field label="手机号或邮箱" value={identifier} onChange={setIdentifier} /><button className="ghost-btn" onClick={() => setSec(60)} disabled={sec > 0}>{sec ? `${sec}s` : "获取验证码"}</button><label className="chip"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> 同意条款与隐私政策</label><GradientButton onClick={login}>登录 / 注册</GradientButton><button className="ghost-btn" onClick={() => go("/")}>游客继续浏览</button></GlassCard>;
}

function AccountPage({ toast }: { toast: (text: string) => void }) {
  const user = userStore.getCurrentUser();
  if (!user) return <EmptyState title="还没有登录" text="登录后可管理订单、收藏、优惠券和地址。" action="登录 / 注册" onAction={() => go("/login")} />;
  const orders = orderStore.getOrders();
  const entries = [["我的订单", "/orders"], ["我的收藏", "/favorites"], ["浏览历史", "/history"], ["地址管理", "/addresses"], ["优惠券", "/coupons"], ["会员权益", "/membership"], ["隐私配送", "/privacy-delivery"], ["客服帮助", "/support"], ["隐私政策", "/policy/privacy"], ["设置", "/account"]];
  return (
    <>
      <GlassCard>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}><div className="age-mark" style={{ width: 64, height: 64 }}>会</div><div><h2>{user.nickname}</h2><p className="muted">{user.level} · {user.points} 积分 · {couponStore.getUserCoupons().length} 张优惠券</p></div></div>
      </GlassCard>
      <section className="section"><div className="grid-2">{["待付款", "待发货", "待收货", "已完成"].map((s) => <GlassCard key={s} onClick={() => go("/orders")}><b>{s}</b><p className="muted">{orders.length} 笔</p></GlassCard>)}</div></section>
      <section className="section">{entries.map(([label, href]) => <button className="search-bar" style={{ marginBottom: 10 }} key={label} onClick={() => go(href)}><span>{label}</span><span style={{ marginLeft: "auto" }}>›</span></button>)}</section>
      <GlassCard><b>隐私模式</b><p className="muted">开启后隐藏首页个性化推荐标题中的敏感词，包裹/账单名提示更明显。</p><button className="ghost-btn" onClick={() => toast("隐私模式已更新")}>切换</button></GlassCard>
      <button className="ghost-btn" style={{ width: "100%", marginTop: 16 }} onClick={() => { userStore.logout(); toast("已退出登录"); }}>退出登录</button>
    </>
  );
}

function OrdersPage() {
  const [tab, setTab] = useState("全部");
  const tabs: [string, OrderStatus | ""][] = [["全部", ""], ["待付款", "pending_payment"], ["待发货", "processing"], ["待收货", "delivered"], ["已完成", "completed"], ["售后", "refund_requested"]];
  const status = tabs.find(([t]) => t === tab)?.[1];
  const orders = orderStore.getOrders().filter((o) => !status || o.status === status);
  return <><div className="tabs">{tabs.map(([t]) => <button className={`chip ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} key={t}>{t}</button>)}</div>{orders.length ? orders.map((o) => <OrderCard key={o.id} order={o} />) : <EmptyState title="暂无订单" text="下单后可在这里查看状态。" />}</>;
}

function OrderCard({ order }: { order: Order }) {
  return <GlassCard className="section" onClick={() => go(`/orders/${order.id}`)}><div style={{ display: "flex", justifyContent: "space-between" }}><b>{order.orderNo}</b><StatusBadge status={order.status} /></div><p className="muted">{order.items.length} 件商品 · 隐私包装</p><p className="price">{money(order.total)}</p><button className="ghost-btn">查看详情</button><button className="ghost-btn" onClick={(e) => { e.stopPropagation(); order.items.forEach((i) => cartStore.addToCart(i.productId)); go("/cart"); }}>再次购买</button></GlassCard>;
}

function OrderDetailPage({ id, toast }: { id: string; toast: (text: string) => void }) {
  const order = orderStore.getOrderById(id);
  if (!order) return <NotFoundPage />;
  return <><GlassCard><StatusBadge status={order.status} /><h2>{order.orderNo}</h2><p className="muted">隐私包装：已开启 · 包裹名称：生活用品</p></GlassCard><section className="section"><SectionHeader title="状态时间线" />{order.timeline.map((t) => <GlassCard key={t.time} className="section"><b>{t.text}</b><p className="muted">{dateText(t.time)}</p></GlassCard>)}</section><GlassCard className="section"><h3>配送信息</h3><p>{order.address.name} · {maskContact(order.address.phone)}</p><p className="muted">{order.address.region} {order.address.detail}</p></GlassCard><GlassCard className="section"><h3>商品清单</h3>{order.items.map((i) => <p className="muted" key={i.productId}>{i.productName} · {i.discreetName} × {i.quantity}</p>)}<h2>{money(order.total)}</h2></GlassCard><GradientButton onClick={() => toast("客服入口已打开")}>联系客服</GradientButton><button className="ghost-btn" onClick={() => toast("售后申请已生成")}>申请售后</button></>;
}

function FavoritesPage({ toast }: { toast: (text: string) => void }) {
  const ids = favoriteStore.getFavorites();
  const products = getProducts().filter((p) => ids.includes(p.id));
  return <><SectionHeader title="我的收藏" action={<button className="ghost-btn" onClick={() => { products.forEach((p) => cartStore.addToCart(p.id)); toast("已批量加入购物车"); }}>批量加购</button>} /><ProductGrid products={products} toast={toast} /></>;
}

function HistoryPage() {
  const products = historyStore.getHistory().map((id) => getProducts().find((p) => p.id === id)).filter(Boolean) as Product[];
  return <><SectionHeader title="浏览历史" action={<button className="ghost-btn" onClick={() => historyStore.clearHistory()}>清空</button>} /><ProductGrid products={products} /></>;
}

function CouponsPage({ toast }: { toast: (text: string) => void }) {
  const [tab, setTab] = useState("可领取");
  const claimed = couponStore.claimed();
  const coupons = getCoupons().filter((c) => tab === "可领取" ? !claimed.includes(c.id) : tab === "可使用" ? claimed.includes(c.id) && c.status === "available" : c.status !== "available");
  return <><div className="tabs">{["可领取", "可使用", "已使用/过期"].map((t) => <button className={`chip ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} key={t}>{t}</button>)}</div>{coupons.map((c) => <CouponCard key={c.id} coupon={c} onClaim={() => { couponStore.claimCoupon(c.id); toast("优惠券已领取"); }} />)}</>;
}

function CouponCard({ coupon, onClaim }: { coupon: Coupon; onClaim?: () => void }) {
  return <GlassCard className="section"><h2>{coupon.name}</h2><p className="muted">满 {money(coupon.threshold)} 可用 · 有效期至 {coupon.endAt}</p><span className="price">{coupon.type === "discount" ? `${coupon.value * 10}折` : coupon.type === "free_shipping" ? "包邮" : money(coupon.value)}</span>{onClaim && <button className="ghost-btn" onClick={onClaim}>领取</button>}</GlassCard>;
}

function MembershipPage() {
  return <><SectionHeader title="会员权益" subtitle="Velvet / Amethyst / Noir" />{["Velvet 入门", "Amethyst 银紫", "Noir 黑金"].map((name, i) => <GlassCard className="section" key={name}><h2>{name}</h2><p className="muted">积分倍率 {1 + i * 0.5}x · 生日券 · 隐私包装升级 · 专属客服 · 新品优先看</p><div style={{ height: 8, borderRadius: 9, background: "rgba(255,255,255,.08)" }}><div style={{ width: `${40 + i * 25}%`, height: 8, borderRadius: 9, background: "linear-gradient(135deg,var(--secondary),var(--gold))" }} /></div></GlassCard>)}</>;
}

function AddressesPage({ toast }: { toast: (text: string, tone?: ToastState["tone"]) => void }) {
  const [editing, setEditing] = useState<Address | null>(null);
  const addresses = addressStore.get();
  return <><SectionHeader title="地址管理" action={<button className="ghost-btn" onClick={() => setEditing({ id: "", name: "", phone: "", region: "香港", detail: "", isDefault: !addresses.length })}>新增</button>} />{addresses.map((a) => <GlassCard key={a.id} className="section"><b>{a.name} {maskContact(a.phone)}</b>{a.isDefault && <span className="tag">默认</span>}<p className="muted">{a.region} {a.detail}</p><button className="ghost-btn" onClick={() => setEditing(a)}>编辑</button><button className="ghost-btn" onClick={() => addressStore.remove(a.id)}>删除</button><button className="ghost-btn" onClick={() => addressStore.setDefault(a.id)}>设默认</button></GlassCard>)}{editing && <AddressForm address={editing} onClose={() => setEditing(null)} toast={toast} />}</>;
}

function AddressForm({ address, onClose, toast }: { address: Address; onClose: () => void; toast: (text: string, tone?: ToastState["tone"]) => void }) {
  const [value, setValue] = useState(address);
  const save = () => {
    const errors = validateAddress(value);
    if (errors.length) return toast(errors[0], "danger");
    addressStore.save(value);
    toast("地址已保存");
    onClose();
  };
  return <BottomSheet title="地址信息" onClose={onClose}><Field label="收件人" value={value.name} onChange={(v) => setValue({ ...value, name: v })} /><Field label="电话" value={value.phone} onChange={(v) => setValue({ ...value, phone: v })} /><Field label="地区" value={value.region} onChange={(v) => setValue({ ...value, region: v })} /><Field label="详细地址" value={value.detail} onChange={(v) => setValue({ ...value, detail: v })} /><label className="chip"><input type="checkbox" checked={value.isDefault} onChange={(e) => setValue({ ...value, isDefault: e.target.checked })} /> 默认地址</label><GradientButton onClick={save}>保存</GradientButton></BottomSheet>;
}

function ArticlesPage() {
  const [cat, setCat] = useState("全部");
  const cats = ["全部", "新手指南", "私密护理", "送礼指南", "隐私配送", "安全常识", "氛围生活"];
  const articles = getArticles().filter((a) => cat === "全部" || a.category === cat);
  return <><GlassCard className="hero"><h1>私密指南</h1><p>高级杂志感的选购、护理、配送与氛围生活内容。</p></GlassCard><div className="tabs">{cats.map((c) => <button className={`chip ${cat === c ? "active" : ""}`} onClick={() => setCat(c)} key={c}>{c}</button>)}</div>{articles.map((a) => <ArticleCard key={a.id} article={a} />)}</>;
}

function ArticleCard({ article }: { article: Article }) {
  return <GlassCard className="section" onClick={() => go(`/articles/${article.id}`)}><span className="tag">{article.category}</span><h2>{article.title}</h2><p className="muted">{article.excerpt}</p><p className="muted">{article.readMinutes} 分钟阅读 · {article.publishedAt}</p></GlassCard>;
}

function ArticleDetailPage({ id }: { id: string }) {
  const article = getArticles().find((a) => a.id === id);
  if (!article) return <NotFoundPage />;
  return <><GlassCard><span className="tag">{article.category}</span><h1>{article.title}</h1><p className="muted">{article.publishedAt} · {article.readMinutes} 分钟阅读</p></GlassCard><GlassCard className="section policy"><p>{article.body}</p><p><b>免责声明：</b>内容仅供一般信息参考，不替代专业医疗建议。如有身体不适，请咨询专业人士。</p></GlassCard><SectionHeader title="关联商品" /><ProductGrid products={getProducts().filter((p) => article.productIds.includes(p.id)).slice(0, 4)} /></>;
}

function PrivacyDeliveryPage() {
  return <><SectionHeader title="隐私配送说明" subtitle="外包装中性，配送信息仅用于履约" /><div className="grid-2">{["外包装中性", "面单不显示敏感商品名", "订单资料仅用于配送", "可备注配送时间"].map((t) => <GlassCard key={t}><b>{t}</b><p className="muted">包裹名称：生活用品 / 日用品。</p></GlassCard>)}</div><FAQ items={["家人能看到商品名吗？不会，外箱和面单使用中性名称。", "快递员知道里面是什么吗？不会显示具体商品内容。", "可以指定配送时间吗？可在订单备注填写。", "可以自提吗？可配置自提方式。"]} /><GradientButton onClick={() => go("/categories")}>开始选购</GradientButton></>;
}

function SupportPage({ toast }: { toast: (text: string) => void }) {
  const [chat, setChat] = useState(false);
  const [ticket, setTicket] = useState("");
  return <><SearchBar placeholder="搜索 FAQ" /><FAQ items={["如何下单支付？选择商品后进入结算页，选择模拟支付方式提交。", "隐私包装会显示什么？外包装与面单使用中性名称。", "配送时效多久？以地区和配送方式为准。", "售后退换如何处理？敏感类商品拆封后通常不支持无理由退换。"]} /><GlassCard className="section"><h2>联系客服</h2><p className="muted">WhatsApp / Email 为占位配置，上线前请商家替换真实方式。</p><button className="ghost-btn" onClick={() => setChat(true)}>在线客服</button></GlassCard><GlassCard className="section"><Field label="问题描述" value={ticket} onChange={setTicket} textarea /><GradientButton onClick={() => { toast("工单已提交"); setTicket(""); }}>提交工单</GradientButton></GlassCard>{chat && <BottomSheet title="在线咨询" onClose={() => setChat(false)}><GlassCard><b>LOVE QC 客服</b><p className="muted">您好，这里是 LOVE QC 客服。请描述你的问题，我们会尽快处理。</p></GlassCard><Field label="输入你的问题" value="" onChange={() => undefined} placeholder="请输入..." /></BottomSheet>}</>;
}

function FAQ({ items }: { items: string[] }) {
  return <section className="section"><SectionHeader title="常见问题" />{items.map((item) => { const [q, a] = item.split("？"); return <GlassCard key={item} className="section"><b>{q}？</b><p className="muted">{a}</p></GlassCard>; })}</section>;
}

function PolicyPage({ type }: { type: "privacy" | "terms" | "return" }) {
  const content = {
    privacy: ["隐私政策", "我们收集收货人、联系方式、地址、订单、客服与必要风控信息，仅用于订单、配送、客服和安全管理。我们不会公开售卖个人资料。Cookie 与 localStorage 用于购物车、年龄确认、登录状态和偏好保存。用户可通过客服占位联系方式请求访问、更正或删除资料。数据保留以履约和合规需要为限。"],
    terms: ["服务条款", "本网站仅限 18 岁或以上人士访问。用户需保证资料真实、合法使用网站，不得滥用服务。商品信息以页面展示为准，订单、支付、配送和售后按商城政策执行。禁止任何违法、骚扰、欺诈或绕过年龄限制的行为。"],
    return: ["售后政策", "敏感/个人护理类商品因卫生原因，拆封后不支持无理由退换。质量问题、错发漏发请联系客服处理。退款路径按原支付或商家确认方式执行，具体以客服审核结果为准。"]
  }[type];
  return <GlassCard className="policy"><h1>{content[0]}</h1><p>{content[1]}</p><p>联系方式：support@example.com（上线前请商家替换）。</p></GlassCard>;
}

function NotFoundPage() {
  return <EmptyState title="页面不存在" text="可能链接已更新或内容暂时不可用。" action="返回首页" onAction={() => go("/")} />;
}

function Field({ label, value, onChange, textarea, placeholder }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; placeholder?: string }) {
  return <div className="field" style={{ marginBottom: 12 }}><label>{label}</label>{textarea ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /> : <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />}</div>;
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return <div className="field" style={{ marginBottom: 12 }}><label>{label}</label><select value={value} onChange={(e) => onChange(e.target.value)}>{options.map(([v, t]) => <option value={v} key={v}>{t}</option>)}</select></div>;
}

function AdminRouter({ path, toast }: { path: string; toast: (text: string, tone?: ToastState["tone"]) => void }) {
  if (path === "/admin/login") return <AdminLoginPage toast={toast} />;
  if (!adminStore.isLoggedIn()) return <AdminLoginPage toast={toast} />;
  return <AdminLayout path={path}>{adminPage(path, toast)}</AdminLayout>;
}

function AdminLoginPage({ toast }: { toast: (text: string, tone?: ToastState["tone"]) => void }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const login = () => adminStore.mockAdminLogin(u, p) ? go("/admin") : toast("后台账号或密码不正确", "danger");
  return <div className="phone-frame"><div className="age-gate"><GlassCard><h1>后台登录</h1><Field label="账号" value={u} onChange={setU} /><Field label="密码" value={p} onChange={setP} /><GradientButton onClick={login}>登录</GradientButton><p className="muted">测试账号：admin / loveqc2026</p></GlassCard></div></div>;
}

function AdminLayout({ path, children }: { path: string; children: ReactNode }) {
  const nav = [["/admin", "仪表盘"], ["/admin/products", "商品"], ["/admin/categories", "分类"], ["/admin/orders", "订单"], ["/admin/coupons", "优惠券"], ["/admin/banners", "Banner"], ["/admin/articles", "文章"], ["/admin/reviews", "评论"], ["/admin/users", "会员"], ["/admin/settings", "设置"]];
  return <div className="phone-frame"><main className="admin-layout" style={{ maxWidth: 480, margin: "0 auto" }}><div className="brand-logo">LOVE QC Admin</div><div className="admin-nav">{nav.map(([href, label]) => <button key={href} className={`chip ${path === href || (href !== "/admin" && path.startsWith(href)) ? "active" : ""}`} onClick={() => go(href)}>{label}</button>)}</div>{children}</main></div>;
}

function adminPage(path: string, toast: (text: string, tone?: ToastState["tone"]) => void) {
  if (path === "/admin") return <AdminDashboardPage />;
  if (path === "/admin/products") return <AdminProductsPage />;
  if (path === "/admin/products/new") return <AdminProductEditPage toast={toast} />;
  if (path.startsWith("/admin/products/")) return <AdminProductEditPage id={path.split("/")[3]} toast={toast} />;
  if (path === "/admin/categories") return <AdminCrudPage title="分类管理" items={getCategories()} save={saveCategories} fields={["name", "slug", "icon", "description"]} blank={{ id: "", name: "", slug: "", icon: "月", description: "", sort: 9, featured: true } as Category} />;
  if (path === "/admin/orders") return <AdminOrdersPage />;
  if (path.startsWith("/admin/orders/")) return <AdminOrderDetailPage id={path.split("/")[3]} toast={toast} />;
  if (path === "/admin/coupons") return <AdminCrudPage title="优惠券管理" items={getCoupons()} save={saveCoupons} fields={["name", "type", "threshold", "value", "endAt"]} blank={{ id: "", name: "", type: "amount", threshold: 0, value: 0, startAt: "2026-01-01", endAt: "2026-12-31", status: "available" } as Coupon} />;
  if (path === "/admin/banners") return <AdminCrudPage title="Banner 管理" items={getBanners()} save={saveBanners} fields={["title", "subtitle", "cta", "href", "tone"]} blank={{ id: "", title: "", subtitle: "", cta: "", href: "/", tone: "velvet", active: true } as Banner} />;
  if (path === "/admin/articles") return <AdminCrudPage title="文章管理" items={getArticles()} save={saveArticles} fields={["title", "category", "excerpt", "body", "readMinutes"]} blank={{ id: "", title: "", category: "新手指南", excerpt: "", body: "", coverTone: "guide", readMinutes: 3, productIds: [], publishedAt: new Date().toISOString().slice(0, 10) } as Article} />;
  if (path === "/admin/reviews") return <AdminReviewsPage />;
  if (path === "/admin/users") return <AdminUsersPage />;
  if (path === "/admin/settings") return <AdminSettingsPage toast={toast} />;
  return <NotFoundPage />;
}

function AdminDashboardPage() {
  const orders = orderStore.getOrders();
  const total = orders.reduce((s, o) => s + o.total, 0);
  return <><SectionHeader title="仪表盘" /><div className="grid-2">{[["今日销售额", money(total)], ["今日订单数", String(orders.length)], ["待发货订单", String(orders.filter((o) => ["paid", "processing"].includes(o.status)).length)], ["库存预警", String(getProducts().filter((p) => p.stock < 40).length)], ["新增会员", "1"], ["优惠券使用率", "28%"]].map(([k, v]) => <GlassCard key={k}><b>{k}</b><h2>{v}</h2></GlassCard>)}</div><SectionHeader title="热卖商品 Top 5" />{getProducts().sort((a, b) => b.sales - a.sales).slice(0, 5).map((p) => <GlassCard className="admin-card" key={p.id}>{p.name}<span className="muted"> · {p.sales}</span></GlassCard>)}<SectionHeader title="最近订单" />{orders.slice(0, 3).map((o) => <OrderCard order={o} key={o.id} />)}</>;
}

function AdminProductsPage() {
  const [q, setQ] = useState("");
  const products = getProducts().filter((p) => p.name.includes(q) || p.sku.includes(q));
  return <><SectionHeader title="商品管理" action={<button className="ghost-btn" onClick={() => go("/admin/products/new")}>新增</button>} /><SearchBar value={q} onChange={setQ} placeholder="搜索商品名/SKU" />{products.map((p) => <GlassCard className="admin-card" key={p.id}><b>{p.name}</b><p className="muted">{p.sku} · {p.categoryName} · 库存 {p.stock}</p><StatusBadge status={p.isActive ? "active" : "cancelled"} /><button className="ghost-btn" onClick={() => go(`/admin/products/${p.id}/edit`)}>编辑</button><button className="ghost-btn" onClick={() => { saveProducts(getProducts().filter((x) => x.id !== p.id)); }}>删除</button></GlassCard>)}</>;
}

function AdminProductEditPage({ id, toast }: { id?: string; toast: (text: string) => void }) {
  const existing = getProducts().find((p) => p.id === id);
  const [p, setP] = useState<Product>(existing ?? { ...mockProducts[0], id: "", sku: "", name: "", price: 99, stock: 10, sales: 0, rating: 5, reviewCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  const save = () => {
    const products = getProducts();
    const next = { ...p, id: p.id || `p${Date.now()}`, updatedAt: new Date().toISOString() };
    saveProducts(products.some((x) => x.id === next.id) ? products.map((x) => x.id === next.id ? next : x) : [next, ...products]);
    toast("商品已保存");
    go("/admin/products");
  };
  return <><SectionHeader title={existing ? "编辑商品" : "新增商品"} /><GlassCard><Field label="商品名称" value={p.name} onChange={(v) => setP({ ...p, name: v })} /><Field label="隐私包裹名称" value={p.discreetName} onChange={(v) => setP({ ...p, discreetName: v })} /><Field label="SKU" value={p.sku} onChange={(v) => setP({ ...p, sku: v })} /><Field label="简短卖点" value={p.shortDescription} onChange={(v) => setP({ ...p, shortDescription: v })} /><Field label="详细介绍" value={p.description} onChange={(v) => setP({ ...p, description: v })} textarea /><Field label="价格" value={String(p.price)} onChange={(v) => setP({ ...p, price: Number(v) || 0 })} /><Field label="库存" value={String(p.stock)} onChange={(v) => setP({ ...p, stock: Number(v) || 0 })} /><label className="chip"><input type="checkbox" checked={p.isActive} onChange={(e) => setP({ ...p, isActive: e.target.checked })} /> 上架</label><label className="chip"><input type="checkbox" checked={p.privacyPackaging} onChange={(e) => setP({ ...p, privacyPackaging: e.target.checked })} /> 隐私包装</label><GradientButton onClick={save}>保存商品</GradientButton></GlassCard></>;
}

function AdminOrdersPage() {
  const [status, setStatus] = useState("");
  const orders = orderStore.getOrders().filter((o) => !status || o.status === status);
  return <><SectionHeader title="订单管理" /><SelectField label="状态筛选" value={status} onChange={setStatus} options={[["", "全部"], ["paid", "已支付"], ["pending_confirm", "待确认"], ["processing", "处理中"], ["shipped", "已发货"], ["completed", "已完成"]]} />{orders.map((o) => <GlassCard className="admin-card" key={o.id} onClick={() => go(`/admin/orders/${o.id}`)}><b>{o.orderNo}</b><StatusBadge status={o.status} /><p className="muted">{money(o.total)} · {maskContact(o.address.phone)}</p></GlassCard>)}</>;
}

function AdminOrderDetailPage({ id, toast }: { id: string; toast: (text: string) => void }) {
  const order = orderStore.getOrderById(id);
  if (!order) return <NotFoundPage />;
  const update = (status: OrderStatus) => { orderStore.updateOrderStatus(order.id, status); toast("订单状态已更新"); };
  return <><OrderDetailPage id={id} toast={toast} /><div className="grid-2">{(["paid", "processing", "shipped", "completed", "cancelled"] as OrderStatus[]).map((s) => <button className="ghost-btn" key={s} onClick={() => update(s)}>{statusText(s)}</button>)}</div></>;
}

function AdminCrudPage<T extends { id: string }>({ title, items, save, fields, blank }: { title: string; items: T[]; save: (items: T[]) => void; fields: string[]; blank: T }) {
  const [editing, setEditing] = useState<T | null>(null);
  const updateField = (key: string, value: string) => setEditing((old) => old ? ({ ...old, [key]: key.includes("price") || key.includes("threshold") || key.includes("value") || key.includes("Minutes") ? Number(value) : value } as T) : old);
  return <><SectionHeader title={title} action={<button className="ghost-btn" onClick={() => setEditing({ ...blank, id: "" })}>新增</button>} />{items.map((item) => <GlassCard className="admin-card" key={item.id}><b>{String((item as Record<string, unknown>).name || (item as Record<string, unknown>).title || item.id)}</b><button className="ghost-btn" onClick={() => setEditing(item)}>编辑</button><button className="ghost-btn" onClick={() => save(items.filter((x) => x.id !== item.id))}>删除</button></GlassCard>)}{editing && <BottomSheet title="编辑" onClose={() => setEditing(null)}>{fields.map((field) => <Field key={field} label={field} value={String((editing as Record<string, unknown>)[field] ?? "")} onChange={(v) => updateField(field, v)} textarea={field === "body"} />)}<GradientButton onClick={() => { const next = { ...editing, id: editing.id || `${title}_${Date.now()}` }; save(items.some((i) => i.id === next.id) ? items.map((i) => i.id === next.id ? next : i) : [next, ...items]); setEditing(null); }}>保存</GradientButton></BottomSheet>}</>;
}

function AdminReviewsPage() {
  const reviews = getReviews();
  const update = (id: string, status: Review["status"]) => saveReviews(reviews.map((r: Review) => r.id === id ? { ...r, status } : r));
  return <><SectionHeader title="评论审核" />{reviews.map((r: Review) => <GlassCard className="admin-card" key={r.id}><b>{r.productName}</b><p className="muted">{r.userName} · {r.content}</p><StatusBadge status={r.status} /><button className="ghost-btn" onClick={() => update(r.id, "approved")}>通过</button><button className="ghost-btn" onClick={() => update(r.id, "rejected")}>拒绝</button></GlassCard>)}</>;
}

function AdminUsersPage() {
  const user = userStore.getCurrentUser();
  return <><SectionHeader title="会员管理" />{[user ?? { id: "u_demo", identifier: "member@example.com", nickname: "Private Member", level: "Velvet", points: 360 }].map((u) => <GlassCard className="admin-card" key={u.id}><b>{u.nickname}</b><p className="muted">{maskContact(u.identifier)} · {u.level} · {u.points} 积分</p><p className="muted">订单数 {orderStore.getOrders().length} · 消费金额 {money(orderStore.getOrders().reduce((s, o) => s + o.total, 0))}</p></GlassCard>)}</>;
}

function AdminSettingsPage({ toast }: { toast: (text: string) => void }) {
  const [s, setS] = useState<StoreSettings>(getSettings());
  return <><SectionHeader title="商城设置" /><GlassCard><Field label="商城名称" value={s.storeName} onChange={(v) => setS({ ...s, storeName: v })} /><Field label="客服邮箱" value={s.supportEmail} onChange={(v) => setS({ ...s, supportEmail: v })} /><Field label="包邮门槛" value={String(s.freeShippingThreshold)} onChange={(v) => setS({ ...s, freeShippingThreshold: Number(v) || 0 })} /><Field label="默认配送费" value={String(s.defaultShippingFee)} onChange={(v) => setS({ ...s, defaultShippingFee: Number(v) || 0 })} /><Field label="隐私包裹名称" value={s.discreetParcelName} onChange={(v) => setS({ ...s, discreetParcelName: v })} /><Field label="合规提示文案" value={s.seoDescription} onChange={(v) => setS({ ...s, seoDescription: v })} textarea /><GradientButton onClick={() => { saveSettings(s); toast("设置已保存"); }}>保存设置</GradientButton></GlassCard><button className="ghost-btn" onClick={() => { adminStore.adminLogout(); go("/admin/login"); }}>退出后台</button></>;
}

export default App;
