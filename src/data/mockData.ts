import type { Article, Banner, Category, Coupon, Product, Review, StoreSettings } from "../types";

const now = new Date().toISOString();

export const mockCategories: Category[] = [
  { id: "cat_starter", name: "新手入门", slug: "starter", icon: "月", description: "温和、安心、容易选择", sort: 1, featured: true },
  { id: "cat_couple", name: "情侣精选", slug: "couple", icon: "心", description: "两个人的仪式感与沟通", sort: 2, featured: true },
  { id: "cat_care", name: "个人护理", slug: "care", icon: "露", description: "清洁、护理与舒适体验", sort: 3, featured: true },
  { id: "cat_protection", name: "安全防护", slug: "protection", icon: "盾", description: "安心、防护、可靠选择", sort: 4, featured: true },
  { id: "cat_scent", name: "氛围香氛", slug: "scent", icon: "香", description: "香气、灯光与夜晚情绪", sort: 5, featured: true },
  { id: "cat_gift", name: "轻奢礼盒", slug: "gift-box", icon: "礼", description: "克制包装，适合送礼", sort: 6, featured: true },
  { id: "cat_storage", name: "收纳清洁", slug: "storage-clean", icon: "盒", description: "日常维护与隐私收纳", sort: 7, featured: true },
  { id: "cat_apparel", name: "私密衣橱", slug: "apparel", icon: "衣", description: "蕾丝、丝绒、轻奢内搭", sort: 8, featured: true },
  { id: "cat_sleepwear", name: "睡衣家居", slug: "sleepwear", icon: "寝", description: "柔软睡衣与居家氛围", sort: 9, featured: true },
  { id: "cat_roleplay", name: "角色氛围服", slug: "roleplay", icon: "幕", description: "克制不露骨的主题造型", sort: 10, featured: true },
  { id: "cat_tools", name: "私密探索工具", slug: "tools", icon: "器", description: "静音、便携、易清洁", sort: 11, featured: true },
  { id: "cat_wellness", name: "放松按摩", slug: "wellness", icon: "波", description: "肩颈、手持与舒缓工具", sort: 12, featured: true },
  { id: "cat_games", name: "互动小物", slug: "games", icon: "牌", description: "轻松沟通与氛围互动", sort: 13, featured: true },
  { id: "cat_sale", name: "特价专区", slug: "sale", icon: "惠", description: "限时优惠与组合价", sort: 14, featured: true }
];

type Seed = {
  slug: string;
  baseSku: string;
  names: string[];
  prices: number[];
  tags: string[];
  discreetName: string;
  description: string;
};

const seeds: Seed[] = [
  {
    slug: "starter",
    baseSku: "NEW",
    discreetName: "护理套装",
    tags: ["新手友好", "隐私包装", "温和"],
    prices: [128, 168, 198, 238, 268, 299, 328, 368, 398, 438],
    names: ["初次探索安心套装", "新手友好精选包", "温和护理入门组", "低调收纳入门盒", "柔感体验组合", "私密护理基础包", "旅行安心小套装", "夜间放松入门礼", "简约仪式感套装", "安心选择体验盒"],
    description: "适合首次购买的成年人，从清洁、收纳、护理与隐私包装开始，减少选择压力。"
  },
  {
    slug: "couple",
    baseSku: "CP",
    discreetName: "生活组合",
    tags: ["情侣", "礼盒", "氛围"],
    prices: [268, 328, 368, 428, 468, 528, 588, 638, 699, 799],
    names: ["情侣仪式感组合", "玫瑰紫氛围套装", "双人夜谈礼盒", "亲密沟通卡套组", "柔光香氛组合", "两人周末精选", "黑紫丝绒双人礼", "微醺氛围计划", "安心互动精选盒", "私密夜晚礼遇装"],
    description: "为成年人之间的自愿沟通和亲密氛围设计，强调克制、尊重与隐私配送。"
  },
  {
    slug: "care",
    baseSku: "CARE",
    discreetName: "清洁用品",
    tags: ["护理", "清洁", "日常"],
    prices: [68, 78, 88, 98, 118, 128, 148, 168, 188, 218],
    names: ["私密护理清洁喷雾", "柔感护理凝露", "温和护理湿巾", "日常清洁泡沫", "旅行护理小瓶", "低敏护理补充装", "温和清洁棉片", "清爽护理便携包", "丝绒触感护理油", "私密护理月光套"],
    description: "日常护理与清洁收纳用品，注重温和配方、便携包装和清楚说明。"
  },
  {
    slug: "protection",
    baseSku: "SAFE",
    discreetName: "日用品组合",
    tags: ["安全防护", "安心", "便携"],
    prices: [58, 68, 88, 108, 128, 148, 168, 188, 218, 258],
    names: ["安全防护精选组合", "轻薄防护便携盒", "安心出行保护包", "日常防护补充装", "经典安全组合", "高端防护礼袋", "低敏安心系列", "迷你随身防护盒", "双人安心组合", "防护与护理搭配装"],
    description: "安全防护类日用品，适合成年人根据个人需要选择，页面不替代专业医疗建议。"
  },
  {
    slug: "scent",
    baseSku: "SC",
    discreetName: "香氛用品",
    tags: ["香氛", "氛围", "礼盒"],
    prices: [98, 128, 168, 198, 238, 268, 328, 398, 468, 568],
    names: ["香氛氛围蜡烛礼盒", "午夜紫藤香氛", "玫瑰木调扩香", "暖光氛围灯组", "丝绒香气喷雾", "黑金夜色蜡烛", "微光卧室套组", "木质调香氛礼", "轻奢香氛组合", "周末氛围精选套装"],
    description: "用香气、柔光和收纳细节提升空间氛围，适合克制、放松的成年人夜晚场景。"
  },
  {
    slug: "gift-box",
    baseSku: "BOX",
    discreetName: "礼品套装",
    tags: ["礼盒", "高端", "隐私包装"],
    prices: [328, 398, 468, 568, 638, 699, 799, 899, 1080, 1280],
    names: ["午夜丝绒情侣礼盒", "黑金限定礼盒", "香槟金礼品套装", "玫瑰紫轻奢礼", "私密护理礼盒", "新手安心礼盒", "双人仪式感礼盒", "旅行便携礼盒", "高阶黑钻套装", "年度精选礼盒"],
    description: "礼盒采用中性外箱和克制视觉，适合送礼、节日和需要更强隐私感的用户。"
  },
  {
    slug: "storage-clean",
    baseSku: "STO",
    discreetName: "收纳用品",
    tags: ["收纳", "清洁", "隐私"],
    prices: [78, 88, 98, 118, 128, 148, 168, 198, 238, 268],
    names: ["旅行便携收纳包", "私密用品清洁套装", "防尘收纳盒", "抽屉隐私收纳袋", "黑紫硬壳收纳盒", "柔感清洁布套装", "旅行洗护分装包", "桌面中性收纳盒", "防潮防尘储物组", "隐私锁扣收纳盒"],
    description: "帮助用户把私密用品以中性、整洁和可维护的方式保存，适合日常收纳。"
  },
  {
    slug: "apparel",
    baseSku: "APP",
    discreetName: "服饰用品",
    tags: ["服饰", "丝绒", "礼盒"],
    prices: [128, 158, 188, 228, 268, 328, 368, 428, 498, 568],
    names: ["午夜蕾丝内搭", "黑金丝绒连体衣", "玫瑰紫轻薄罩衫", "香槟金边短裙", "柔纱氛围上衣", "丝缎吊带套装", "低调蕾丝长袜", "轻奢居家披肩", "黑紫腰封搭配", "礼盒装私密衣橱"],
    description: "以成年人私密衣橱为场景，强调高级材质、克制剪裁和礼盒包装，不使用露骨视觉。"
  },
  {
    slug: "sleepwear",
    baseSku: "SLP",
    discreetName: "家居服饰",
    tags: ["睡衣", "柔软", "居家"],
    prices: [138, 168, 198, 238, 268, 328, 398, 468, 538, 628],
    names: ["丝缎家居睡裙", "月光柔纱睡袍", "黑紫丝绒睡衣", "香槟金边吊带裙", "柔软居家短套", "午夜长袍套装", "玫瑰紫睡眠礼盒", "轻奢家居披肩", "低调丝缎两件套", "周末慵懒睡衣组"],
    description: "睡衣和居家氛围服饰，适合重视舒适、质感和私密仪式感的成年人。"
  },
  {
    slug: "roleplay",
    baseSku: "ROLE",
    discreetName: "主题服饰",
    tags: ["主题", "造型", "克制"],
    prices: [168, 198, 228, 268, 328, 368, 428, 498, 568, 668],
    names: ["黑紫学院风套装", "轻奢护士风造型", "丝绒侍者主题服", "简约制服风套装", "月夜猫感配饰组", "优雅和风外搭", "复古旗袍氛围装", "礼宾主题服饰", "暗夜舞台感套装", "主题造型礼盒"],
    description: "角色氛围服以成年人自愿、尊重和沟通为前提，视觉表达保持克制，不包含露骨图像。"
  },
  {
    slug: "tools",
    baseSku: "TLS",
    discreetName: "生活工具",
    tags: ["工具", "静音", "便携"],
    prices: [128, 168, 198, 238, 299, 368, 438, 528, 638, 799],
    names: ["静音掌心放松仪", "柔感便携探索器", "月光曲线小工具", "低噪旅行随身款", "温感放松体验仪", "黑金高阶静音款", "迷你收纳探索器", "多档舒缓小工具", "礼盒装静音工具", "高级触感探索套"],
    description: "私密探索工具以静音、便携、易清洁和中性包装为核心，适合成年人按说明谨慎使用。"
  },
  {
    slug: "wellness",
    baseSku: "WEL",
    discreetName: "放松用品",
    tags: ["按摩", "放松", "护理"],
    prices: [118, 148, 188, 238, 288, 338, 398, 468, 568, 688],
    names: ["肩颈舒缓按摩棒", "手持放松按摩仪", "温热眼部舒缓器", "香氛按摩护理油", "旅行放松组合", "低噪舒缓仪", "柔光肩颈套装", "黑紫放松礼盒", "深夜舒压工具", "全身护理按摩组"],
    description: "放松按摩类商品偏向肩颈、居家舒缓和护理场景，适合非医疗用途的日常放松。"
  },
  {
    slug: "games",
    baseSku: "GAME",
    discreetName: "互动用品",
    tags: ["互动", "游戏", "沟通"],
    prices: [68, 88, 108, 128, 168, 198, 238, 268, 328, 398],
    names: ["亲密沟通卡牌", "夜谈问题卡组", "情侣任务盲盒", "氛围骰子礼盒", "微醺约会卡", "双人默契挑战", "周末互动小物", "仪式感签筒", "黑金互动套装", "轻松破冰礼盒"],
    description: "互动小物用于成年人之间的沟通和氛围营造，强调尊重边界、轻松表达和自愿参与。"
  },
  {
    slug: "sale",
    baseSku: "SALE",
    discreetName: "优惠商品",
    tags: ["热卖", "限时", "优惠"],
    prices: [58, 78, 98, 128, 158, 198, 238, 299, 368, 468],
    names: ["限时护理补充装", "热卖收纳小套", "新手优惠礼袋", "香氛体验小盒", "便携旅行套装", "安全防护组合价", "轻奢礼盒折扣款", "周末氛围特惠", "黑紫精选优惠包", "年度热卖组合"],
    description: "特价专区用于限时优惠、组合价和入门体验，仍默认隐私包装与中性名称。"
  }
];

function categoryBySlug(slug: string) {
  const category = mockCategories.find((item) => item.slug === slug);
  if (!category) throw new Error(`Missing category ${slug}`);
  return category;
}

export const mockProducts: Product[] = seeds.flatMap((seed) => {
  const category = categoryBySlug(seed.slug);
  return seed.names.map((name, index) => {
    const price = seed.prices[index];
    const originalPrice = index % 3 === 0 ? Math.round(price * 1.22) : index % 4 === 0 ? Math.round(price * 1.15) : undefined;
    const id = `p_${seed.slug.replace(/-/g, "_")}_${String(index + 1).padStart(2, "0")}`;
    return {
      id,
      sku: `LQ-${seed.baseSku}-${String(index + 1).padStart(3, "0")}`,
      name,
      discreetName: seed.discreetName,
      categoryId: category.id,
      categoryName: category.name,
      tags: [...seed.tags, index % 2 === 0 ? "隐私配送" : "新款"].slice(0, 4),
      shortDescription: index % 2 === 0 ? "高级克制包装，适合安心下单与隐私收货。" : "清楚说明、便于收纳，适合成年人按需选择。",
      description: seed.description,
      price,
      originalPrice,
      stock: 36 + ((index + category.sort) * 17) % 280,
      sales: 80 + ((index + 3) * (category.sort + 11) * 9) % 1280,
      rating: Number((4.5 + ((index + category.sort) % 5) * 0.1).toFixed(1)),
      reviewCount: 18 + ((index + 1) * category.sort * 3) % 260,
      images: [`visual-${seed.slug}-${String(index + 1).padStart(2, "0")}`],
      variants: [
        { id: "standard", name: "标准款", priceDelta: 0, stock: 26 + index * 4 },
        { id: "gift", name: "礼盒升级", priceDelta: seed.slug.includes("gift") ? 68 : 38, stock: 12 + index * 2 },
        { id: "travel", name: "便携组合", priceDelta: seed.slug.includes("storage") ? 28 : 58, stock: 10 + index * 2 }
      ],
      isActive: true,
      isFeatured: category.featured && index < 4,
      isAdultOnly: true,
      privacyPackaging: true,
      careGuide: "建议按商品材质温和清洁，保持干燥并独立收纳。请仅限成年人按说明使用。",
      shippingNote: "默认隐私包装，外箱与面单使用中性名称，不显示敏感商品信息。",
      returnPolicyNote: "个人护理及敏感类商品因卫生原因，拆封后通常不支持无理由退换；质量问题请联系客服。",
      createdAt: now,
      updatedAt: now
    };
  });
});

export const mockCoupons: Coupon[] = [
  { id: "c_new", name: "新人私密礼遇 HK$40", type: "amount", threshold: 299, value: 40, startAt: "2026-01-01", endAt: "2026-12-31", status: "available" },
  { id: "c_gift", name: "礼盒九折券", type: "discount", threshold: 399, value: 0.9, startAt: "2026-01-01", endAt: "2026-12-31", status: "available", categoryIds: ["cat_gift"] },
  { id: "c_ship", name: "隐私配送包邮券", type: "free_shipping", threshold: 199, value: 0, startAt: "2026-01-01", endAt: "2026-12-31", status: "available" },
  { id: "c_apparel", name: "衣橱搭配 HK$60", type: "amount", threshold: 488, value: 60, startAt: "2026-01-01", endAt: "2026-12-31", status: "available", categoryIds: ["cat_apparel", "cat_sleepwear", "cat_roleplay"] }
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
    productIds: ["p_starter_01", "p_starter_02", "p_care_01"],
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
    productIds: ["p_storage_clean_01", "p_storage_clean_03"],
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
    productIds: ["p_storage_clean_02", "p_care_03", "p_storage_clean_10"],
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
    productIds: ["p_gift_box_01", "p_gift_box_02", "p_couple_01"],
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
    productIds: ["p_scent_01", "p_scent_10"],
    publishedAt: "2026-06-16"
  }
];

export const mockBanners: Banner[] = [
  { id: "b1", title: "午夜私语礼盒", subtitle: "高级、克制、私密送达", cta: "立即探索", href: "/category/gift-box", tone: "velvet", active: true },
  { id: "b2", title: "新手安心专区", subtitle: "从选择到护理，一步一步更自在", cta: "查看指南", href: "/articles/a01", tone: "amethyst", active: true },
  { id: "b3", title: "情侣氛围计划", subtitle: "把日常变成值得期待的夜晚", cta: "挑选套装", href: "/category/couple", tone: "rose", active: true }
];

export const mockReviews: Review[] = [
  { id: "r1", productId: "p_gift_box_01", productName: "午夜丝绒情侣礼盒", userName: "L***e", rating: 5, content: "包装很克制，收货时没有尴尬，礼盒质感不错。", status: "approved", createdAt: now },
  { id: "r2", productId: "p_care_01", productName: "私密护理清洁喷雾", userName: "A***n", rating: 4, content: "便携，说明清楚，适合日常清洁收纳。", status: "approved", createdAt: now },
  { id: "r3", productId: "p_couple_01", productName: "情侣仪式感组合", userName: "M***y", rating: 5, content: "配送隐私做得好，客服回复也比较自然。", status: "pending", createdAt: now }
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
