import { defaultSettings, mockArticles, mockBanners, mockCategories, mockCoupons, mockProducts, mockReviews, mockSubCategories } from "../data/mockData";
import { money } from "../lib/format";
import { makeId, storageGet, storageRemove, storageSet } from "../lib/storage";
import type { Address, Article, Banner, CartItem, Category, Coupon, Order, OrderStatus, Product, StoreSettings, SubCategory, User } from "../types";

export function getProducts() {
  const products = storageGet<Product[]>("mockProducts", mockProducts);
  const staleCatalog = products.some((product) => product.images.length < 3 || product.images.some((image) => image.startsWith("visual-")));
  const stalePhotoCatalog = products.find((product) => product.id === "p_scent_01")?.images[0] !== "/assets/ai-products/scent-gift-candle-01-main.png";
  if (!products.length || !("subCategoryId" in products[0]) || staleCatalog || stalePhotoCatalog) {
    storageSet("mockProducts", mockProducts);
    return mockProducts;
  }
  return products;
}

export function saveProducts(products: Product[]) {
  storageSet("mockProducts", products);
}

export function getCategories() {
  return storageGet<Category[]>("mockCategories", mockCategories);
}

export function saveCategories(categories: Category[]) {
  storageSet("mockCategories", categories);
}

export function getSubCategories() {
  const subCategories = storageGet<SubCategory[]>("mockSubCategories", mockSubCategories);
  if (!subCategories.length) {
    storageSet("mockSubCategories", mockSubCategories);
    return mockSubCategories;
  }
  return subCategories;
}

export function saveSubCategories(subCategories: SubCategory[]) {
  storageSet("mockSubCategories", subCategories);
}

export function getCoupons() {
  return storageGet<Coupon[]>("mockCoupons", mockCoupons);
}

export function saveCoupons(coupons: Coupon[]) {
  storageSet("mockCoupons", coupons);
}

export function getArticles() {
  return storageGet<Article[]>("mockArticles", mockArticles);
}

export function saveArticles(articles: Article[]) {
  storageSet("mockArticles", articles);
}

export function getBanners() {
  return storageGet<Banner[]>("mockBanners", mockBanners);
}

export function saveBanners(banners: Banner[]) {
  storageSet("mockBanners", banners);
}

export function getReviews() {
  return storageGet("mockReviews", mockReviews);
}

export function saveReviews(reviews: typeof mockReviews) {
  storageSet("mockReviews", reviews);
}

export function getSettings() {
  return storageGet<StoreSettings>("settings", defaultSettings);
}

export function saveSettings(settings: StoreSettings) {
  storageSet("settings", settings);
}

export const cartStore = {
  get(): CartItem[] {
    return storageGet<CartItem[]>("cart", []);
  },
  set(items: CartItem[]) {
    storageSet("cart", items);
  },
  addToCart(productId: string, variantId = "standard", quantity = 1) {
    const items = this.get();
    const found = items.find((item) => item.productId === productId && item.variantId === variantId);
    if (found) found.quantity += quantity;
    else items.push({ productId, variantId, quantity, selected: true });
    this.set(items);
  },
  removeFromCart(productId: string, variantId = "standard") {
    this.set(this.get().filter((item) => item.productId !== productId || item.variantId !== variantId));
  },
  updateQuantity(productId: string, variantId = "standard", quantity: number) {
    this.set(this.get().map((item) => (item.productId === productId && item.variantId === variantId ? { ...item, quantity: Math.max(1, quantity) } : item)));
  },
  toggleSelected(productId: string, variantId = "standard") {
    this.set(this.get().map((item) => (item.productId === productId && item.variantId === variantId ? { ...item, selected: !item.selected } : item)));
  },
  selectAll(selected: boolean) {
    this.set(this.get().map((item) => ({ ...item, selected })));
  },
  clearSelected() {
    this.set(this.get().filter((item) => !item.selected));
  },
  getCartCount() {
    return this.get().reduce((sum, item) => sum + item.quantity, 0);
  },
  getCartTotal() {
    const products = getProducts();
    return this.get()
      .filter((item) => item.selected)
      .reduce((sum, item) => {
        const product = products.find((p) => p.id === item.productId);
        const variant = product?.variants.find((v) => v.id === item.variantId);
        return sum + (product ? (product.price + (variant?.priceDelta ?? 0)) * item.quantity : 0);
      }, 0);
  }
};

export const favoriteStore = {
  getFavorites(): string[] {
    return storageGet<string[]>("favorites", []);
  },
  toggleFavorite(productId: string) {
    const ids = this.getFavorites();
    storageSet("favorites", ids.includes(productId) ? ids.filter((id) => id !== productId) : [productId, ...ids]);
  },
  isFavorite(productId: string) {
    return this.getFavorites().includes(productId);
  }
};

export const historyStore = {
  getHistory(): string[] {
    return storageGet<string[]>("history", []);
  },
  addHistory(productId: string) {
    storageSet("history", [productId, ...this.getHistory().filter((id) => id !== productId)].slice(0, 50));
  },
  clearHistory() {
    storageSet("history", []);
  }
};

export const userStore = {
  mockLogin(identifier: string) {
    const user: User = { id: "u_mock", identifier, nickname: "Private Member", level: "Amethyst", points: 1260 };
    storageSet("user", user);
    return user;
  },
  logout() {
    storageRemove("user");
  },
  getCurrentUser() {
    return storageGet<User | null>("user", null);
  },
  updateUser(user: User) {
    storageSet("user", user);
  }
};

export const addressStore = {
  get(): Address[] {
    return storageGet<Address[]>("addresses", []);
  },
  save(address: Address) {
    const existing = this.get();
    const normalized = { ...address, id: address.id || makeId("addr") };
    const next = existing.some((item) => item.id === normalized.id)
      ? existing.map((item) => (item.id === normalized.id ? normalized : item))
      : [...existing, normalized];
    storageSet("addresses", normalized.isDefault ? next.map((item) => ({ ...item, isDefault: item.id === normalized.id })) : next);
  },
  remove(id: string) {
    storageSet("addresses", this.get().filter((item) => item.id !== id));
  },
  setDefault(id: string) {
    storageSet("addresses", this.get().map((item) => ({ ...item, isDefault: item.id === id })));
  }
};

export const couponStore = {
  claimed(): string[] {
    return storageGet<string[]>("claimedCoupons", []);
  },
  claimCoupon(couponId: string) {
    const ids = this.claimed();
    if (!ids.includes(couponId)) storageSet("claimedCoupons", [couponId, ...ids]);
  },
  getUserCoupons() {
    const ids = this.claimed();
    return getCoupons().filter((coupon) => ids.includes(coupon.id));
  },
  getAvailableCoupons(subtotal: number) {
    return this.getUserCoupons().filter((coupon) => coupon.status === "available" && subtotal >= coupon.threshold);
  },
  calculate(couponId: string | undefined, subtotal: number, shipping: number) {
    const coupon = getCoupons().find((item) => item.id === couponId);
    if (!coupon || subtotal < coupon.threshold) return 0;
    if (coupon.type === "amount") return coupon.value;
    if (coupon.type === "discount") return Math.max(0, subtotal - subtotal * coupon.value);
    if (coupon.type === "free_shipping") return shipping;
    return 0;
  }
};

export const orderStore = {
  getOrders(): Order[] {
    return storageGet<Order[]>("orders", []);
  },
  getOrderById(id: string) {
    return this.getOrders().find((order) => order.id === id || order.orderNo === id);
  },
  createOrder(payload: {
    address: Address;
    paymentMethod: string;
    deliveryMethod: string;
    couponId?: string;
    note?: string;
    pointsEnabled?: boolean;
  }) {
    const products = getProducts();
    const selected = cartStore.get().filter((item) => item.selected);
    const settings = getSettings();
    const subtotal = cartStore.getCartTotal();
    const shippingFee = subtotal >= settings.freeShippingThreshold ? 0 : settings.defaultShippingFee;
    const discount = couponStore.calculate(payload.couponId, subtotal, shippingFee);
    const pointsDiscount = payload.pointsEnabled ? Math.min(30, Math.floor((userStore.getCurrentUser()?.points ?? 0) / 100)) : 0;
    const total = Math.max(0, subtotal + shippingFee - discount - pointsDiscount);
    const time = new Date().toISOString();
    const order: Order = {
      id: makeId("order"),
      orderNo: `LQ${Date.now()}`,
      userId: userStore.getCurrentUser()?.id ?? "guest",
      items: selected.map((item) => {
        const product = products.find((p) => p.id === item.productId)!;
        const variant = product.variants.find((v) => v.id === item.variantId);
        return {
          productId: product.id,
          productName: product.name,
          discreetName: product.discreetName,
          variantName: variant?.name,
          price: product.price + (variant?.priceDelta ?? 0),
          quantity: item.quantity
        };
      }),
      address: payload.address,
      status: payload.paymentMethod === "bank_manual" ? "pending_confirm" : "paid",
      subtotal,
      shippingFee,
      discount,
      pointsDiscount,
      total,
      paymentMethod: payload.paymentMethod,
      deliveryMethod: payload.deliveryMethod,
      privacyPackaging: true,
      note: payload.note,
      createdAt: time,
      updatedAt: time,
      timeline: [{ status: "submitted", text: `订单已提交，应付 ${money(total)}`, time }]
    };
    storageSet("orders", [order, ...this.getOrders()]);
    cartStore.clearSelected();
    return order;
  },
  updateOrderStatus(id: string, status: OrderStatus, text?: string) {
    const time = new Date().toISOString();
    storageSet(
      "orders",
      this.getOrders().map((order) =>
        order.id === id || order.orderNo === id
          ? { ...order, status, updatedAt: time, timeline: [...order.timeline, { status, text: text ?? `订单状态更新为 ${status}`, time }] }
          : order
      )
    );
  }
};

export const adminStore = {
  mockAdminLogin(username: string, password: string) {
    if (username === "admin" && password === "loveqc2026") {
      storageSet("admin", { username, loginAt: new Date().toISOString() });
      return true;
    }
    return false;
  },
  adminLogout() {
    storageRemove("admin");
  },
  isLoggedIn() {
    return Boolean(storageGet<{ username: string } | null>("admin", null));
  }
};
