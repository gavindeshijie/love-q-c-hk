import type { Article, Banner, Category, Coupon, Product, Review, StoreSettings } from "../types";

const now = new Date().toISOString();

export const mockCategories: Category[] = [
  { id: "cat_new", name: "新手入门", slug: "starter", icon: "月", description: "温和、安心、容易选择", sort: 1, featured: true },
  { id: "cat_couple", name: "情侣精选", slug: "couple", icon: "心", description: "为两个人准备的仪式感", sort: 2, featured: true },
  { id: "cat_care", name: "个人护理", slug: "care", icon: "露", description: "清洁、护理与舒适体验", sort: 3, featured: true },
  { id: "cat_safe", name: "安全防护", slug: "protection", icon: "盾", description: "安心、防护、可靠选择", sort: 4, featured: true },
  { id: "cat_scent", name: "氛围香氛", slug: "scent", icon: "香", description: "灯光、香气和夜晚氛围", sort: 5, featured: true },
  { id: "cat_gift", name: "轻奢礼盒", slug: "gift-box", icon: "礼", description: "送礼更体面，收货更私密", sort: 6, featured: true },
  { id: "cat_storage", name: "收纳清洁", slug: "storage-clean", icon: "盒", description: "日常维护与隐私收纳", sort: 7, featured: true },
  { id: "cat_sale", name: "特价专区", slug: "sale", icon: "惠", description: "限时优惠与组合价", sort: 8, featured: true }
];

const descriptions = {
  default:
    "为成年人私密生活设计的精选好物，注重材质、清洁、收纳与配送隐私。页面信息仅作一般选购参考，建议按个人需求谨慎选择。",
  care:
    "温和护理系列强调清洁、收纳与日常维护，适合关注舒适度、卫生与隐私感的成年人。",
  gift:
    "礼盒系列以克制包装和中性外箱呈现，适合希望提升仪式感又重视收货隐私的用户。"
};

export const mockProducts: Product[] = [
  ["p01", "LQ-BOX-001", "午夜丝绒情侣礼盒", "生活用品", "cat_gift", "轻奢礼盒", 699, 899, 88, 368, 4.9, ["礼盒", "热卖", "隐私包装"]],
  ["p02", "LQ-NEW-002", "初次探索安心套装", "护理套装", "cat_new", "新手入门", 299, 359, 120, 502, 4.8, ["新手友好", "套装", "隐私包装"]],
  ["p03", "LQ-CARE-003", "私密护理清洁喷雾", "清洁用品", "cat_care", "个人护理", 88, 108, 310, 980, 4.7, ["护理", "便携"]],
  ["p04", "LQ-STO-004", "旅行便携收纳包", "收纳包", "cat_storage", "收纳清洁", 128, 168, 210, 443, 4.6, ["便携", "收纳"]],
  ["p05", "LQ-SC-005", "香氛氛围蜡烛礼盒", "香氛礼盒", "cat_scent", "氛围香氛", 198, 268, 80, 226, 4.8, ["香氛", "礼盒"]],
  ["p06", "LQ-SAFE-006", "安全防护精选组合", "日用品组合", "cat_safe", "安全防护", 168, 218, 160, 612, 4.8, ["安全防护", "组合"]],
  ["p07", "LQ-CARE-007", "柔感护理凝露", "护理凝露", "cat_care", "个人护理", 118, 148, 220, 719, 4.7, ["护理", "新手友好"]],
  ["p08", "LQ-BOX-008", "黑金限定礼盒", "礼品套装", "cat_gift", "轻奢礼盒", 899, 1099, 32, 146, 4.9, ["黑金", "高端", "礼盒"]],
  ["p09", "LQ-SET-009", "玫瑰紫氛围套装", "氛围套装", "cat_couple", "情侣精选", 399, 499, 66, 280, 4.8, ["情侣", "氛围"]],
  ["p10", "LQ-CLEAN-010", "私密用品清洁套装", "清洁套装", "cat_storage", "收纳清洁", 158, 198, 230, 657, 4.7, ["清洁", "收纳"]],
  ["p11", "LQ-NEW-011", "新手友好精选包", "精选包", "cat_new", "新手入门", 238, 299, 95, 381, 4.6, ["新手友好", "热卖"]],
  ["p12", "LQ-CP-012", "情侣仪式感组合", "生活组合", "cat_couple", "情侣精选", 468, 568, 54, 204, 4.8, ["情侣", "礼盒", "隐私包装"]],
  ["p13", "LQ-BOX-013", "防尘收纳盒", "收纳盒", "cat_storage", "收纳清洁", 98, 128, 340, 830, 4.6, ["收纳", "便携"]],
  ["p14", "LQ-WIPE-014", "温和护理湿巾", "护理湿巾", "cat_care", "个人护理", 68, 88, 420, 1204, 4.5, ["护理", "日常"]],
  ["p15", "LQ-GIFT-015", "高级礼品包装服务", "包装服务", "cat_gift", "轻奢礼盒", 78, 98, 999, 523, 4.7, ["礼盒", "送礼"]],
  ["p16", "LQ-WKND-016", "周末氛围精选套装", "氛围用品", "cat_scent", "氛围香氛", 328, 428, 76, 319, 4.8, ["氛围", "套装", "热卖"]]
].map(([id, sku, name, discreetName, categoryId, categoryName, price, originalPrice, stock, sales, rating, tags], index) => ({
  id: id as string,
  sku: sku as string,
  name: name as string,
  discreetName: discreetName as string,
  categoryId: categoryId as string,
  categoryName: categoryName as string,
  tags: tags as string[],
  shortDescription: index % 3 === 0 ? "隐私包装，克制礼盒感，适合安心下单。" : index % 3 === 1 ? "材质与收纳说明清晰，新手也容易选择。" : "日常护理与氛围场景都适用。",
  description: categoryId === "cat_care" ? descriptions.care : categoryId === "cat_gift" ? descriptions.gift : descriptions.default,
  price: price as number,
  originalPrice: originalPrice as number,
  stock: stock as number,
  sales: sales as number,
  rating: rating as number,
  reviewCount: Math.round((sales as number) / 8),
  images: [`tone-${(index % 8) + 1}`],
  variants: [
    { id: "standard", name: "标准款", priceDelta: 0, stock: stock as number },
    { id: "gift", name: "礼盒升级", priceDelta: 38, stock: Math.max(8, Math.floor((stock as number) * 0.55)) },
    { id: "travel", name: "便携组合", priceDelta: 58, stock: Math.max(6, Math.floor((stock as number) * 0.42)) }
  ],
  isActive: true,
  isFeatured: index < 10,
  isAdultOnly: true,
  privacyPackaging: true,
  careGuide: "建议按商品材质温和清洁，保持干燥并独立收纳。请仅限成年人按说明使用。",
  shippingNote: "默认隐私包装，外箱与面单使用中性名称，不显示敏感商品信息。",
  returnPolicyNote: "个人护理及敏感类商品因卫生原因，拆封后通常不支持无理由退换；质量问题请联系客服。",
  createdAt: now,
  updatedAt: now
}));

export const mockCoupons: Coupon[] = [
  { id: "c_new", name: "新人私密礼遇 HK$40", type: "amount", threshold: 299, value: 40, startAt: "2026-01-01", endAt: "2026-12-31", status: "available" },
  { id: "c_gift", name: "礼盒九折券", type: "discount", threshold: 399, value: 0.9, startAt: "2026-01-01", endAt: "2026-12-31", status: "available", categoryIds: ["cat_gift"] },
  { id: "c_ship", name: "隐私配送包邮券", type: "free_shipping", threshold: 199, value: 0, startAt: "2026-01-01", endAt: "2026-12-31", status: "available" }
];

export const mockArticles: Article[] = [
  {
    id: "a01",
    title: "第一次购买私密用品，如何更安心？",
    category: "新手指南",
    excerpt: "从预算、材质、隐私包装到售后条款，快速建立安全感。",
    body: "初次选择时，建议先看清商品用途、材质说明、清洁方式与售后条件。LOVE QC 默认使用隐私包装，并在包裹面单使用中性名称。选购时不需要追求复杂配置，适合自己的体验、容易清洁和便于收纳更重要。",
    coverTone: "guide-a",
    readMinutes: 4,
    productIds: ["p02", "p11", "p03"],
    publishedAt: "2026-06-01"
  },
  {
    id: "a02",
    title: "隐私包装到底会显示什么？",
    category: "隐私配送",
    excerpt: "外箱、面单、账单名称和客服沟通的隐私边界。",
    body: "隐私包装会使用中性外箱，不在外部显示具体商品名称。配送信息只用于履约，客服沟通也会尽量使用中性表达。你仍应确保收货地址、电话和配送时间准确。",
    coverTone: "guide-b",
    readMinutes: 3,
    productIds: ["p04", "p13"],
    publishedAt: "2026-06-03"
  },
  {
    id: "a03",
    title: "私密用品清洁与收纳基础",
    category: "私密护理",
    excerpt: "温和清洁、干燥存放和独立收纳的基础建议。",
    body: "不同材质的护理方式不同，建议按商品说明温和清洁。使用后保持干燥，避免高温暴晒，尽量使用独立收纳袋或防尘盒。内容仅供一般信息参考，不替代专业医疗建议。",
    coverTone: "guide-c",
    readMinutes: 5,
    productIds: ["p10", "p14", "p13"],
    publishedAt: "2026-06-08"
  },
  {
    id: "a04",
    title: "情侣礼盒如何挑选才不尴尬？",
    category: "送礼指南",
    excerpt: "用礼盒、香氛和收纳把表达变得自然。",
    body: "送礼场景建议优先选择包装克制、说明清晰、搭配完整的礼盒。加入香氛、灯光或收纳配件，能让礼物更像一份生活方式提案，而不是造成压力的单一商品。",
    coverTone: "guide-d",
    readMinutes: 4,
    productIds: ["p01", "p08", "p12"],
    publishedAt: "2026-06-12"
  },
  {
    id: "a05",
    title: "如何用香氛与灯光提升氛围感？",
    category: "氛围生活",
    excerpt: "保持克制、舒适和可沟通的夜晚仪式感。",
    body: "氛围感来自光线、香气、音乐和整洁环境。选择柔和香氛和温暖光源，能让空间更放松。任何亲密体验都应建立在成年人自愿、尊重和沟通基础上。",
    coverTone: "guide-e",
    readMinutes: 4,
    productIds: ["p05", "p16"],
    publishedAt: "2026-06-16"
  }
];

export const mockBanners: Banner[] = [
  { id: "b1", title: "午夜私语礼盒", subtitle: "高级、克制、私密送达", cta: "立即探索", href: "/category/gift-box", tone: "velvet", active: true },
  { id: "b2", title: "新手安心专区", subtitle: "从选择到护理，一步一步更自在", cta: "查看指南", href: "/articles/a01", tone: "amethyst", active: true },
  { id: "b3", title: "情侣氛围计划", subtitle: "把日常变成值得期待的夜晚", cta: "挑选套装", href: "/category/couple", tone: "rose", active: true }
];

export const mockReviews: Review[] = [
  { id: "r1", productId: "p01", productName: "午夜丝绒情侣礼盒", userName: "L***e", rating: 5, content: "包装很克制，收货时没有尴尬，礼盒质感不错。", status: "approved", createdAt: now },
  { id: "r2", productId: "p03", productName: "私密护理清洁喷雾", userName: "A***n", rating: 4, content: "便携，说明清楚，适合日常清洁收纳。", status: "approved", createdAt: now },
  { id: "r3", productId: "p12", productName: "情侣仪式感组合", userName: "M***y", rating: 5, content: "配送隐私做得好，客服回复也比较自然。", status: "pending", createdAt: now }
];

export const defaultSettings: StoreSettings = {
  storeName: "LOVE QC Private Select",
  supportEmail: "support@example.com",
  currency: "HKD",
  freeShippingThreshold: 499,
  defaultShippingFee: 35,
  discreetParcelName: "生活用品",
  ageGateEnabled: true,
  ageGateDays: 30,
  enabledPayments: ["fps_mock", "card_mock", "wallet_mock", "bank_manual"],
  enabledDeliveries: ["standard", "express", "pickup"],
  seoTitle: "LOVE QC Private Select",
  seoDescription: "18+ 私密精选商城，隐私包装，安心配送。"
};
