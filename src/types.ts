export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  sort: number;
  featured: boolean;
};

export type SubCategory = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  sort: number;
  featured: boolean;
};

export type ProductVariant = {
  id: string;
  name: string;
  priceDelta: number;
  stock: number;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  discreetName: string;
  categoryId: string;
  categoryName: string;
  subCategoryId: string;
  subCategoryName: string;
  tags: string[];
  shortDescription: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sales: number;
  rating: number;
  reviewCount: number;
  images: string[];
  variants: ProductVariant[];
  isActive: boolean;
  isFeatured: boolean;
  isAdultOnly: boolean;
  privacyPackaging: boolean;
  careGuide: string;
  shippingNote: string;
  returnPolicyNote: string;
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  productId: string;
  variantId?: string;
  quantity: number;
  selected: boolean;
};

export type Address = {
  id: string;
  name: string;
  phone: string;
  region: string;
  detail: string;
  isDefault: boolean;
};

export type Coupon = {
  id: string;
  name: string;
  type: "amount" | "discount" | "free_shipping";
  threshold: number;
  value: number;
  startAt: string;
  endAt: string;
  status: "available" | "used" | "expired";
  categoryIds?: string[];
};

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "pending_confirm"
  | "processing"
  | "shipped"
  | "delivered"
  | "completed"
  | "refund_requested"
  | "refunded"
  | "cancelled";

export type Order = {
  id: string;
  orderNo: string;
  userId: string;
  items: {
    productId: string;
    productName: string;
    discreetName: string;
    variantName?: string;
    price: number;
    quantity: number;
  }[];
  address: Address;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  discount: number;
  pointsDiscount: number;
  total: number;
  paymentMethod: string;
  deliveryMethod: string;
  privacyPackaging: boolean;
  note?: string;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
  timeline: {
    status: string;
    text: string;
    time: string;
  }[];
};

export type User = {
  id: string;
  identifier: string;
  nickname: string;
  level: "Velvet" | "Amethyst" | "Noir";
  points: number;
};

export type Article = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  coverTone: string;
  readMinutes: number;
  productIds: string[];
  publishedAt: string;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  tone: string;
  active: boolean;
};

export type Review = {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  rating: number;
  content: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export type StoreSettings = {
  storeName: string;
  supportEmail: string;
  currency: "HKD";
  freeShippingThreshold: number;
  defaultShippingFee: number;
  discreetParcelName: string;
  ageGateEnabled: boolean;
  ageGateDays: number;
  enabledPayments: string[];
  enabledDeliveries: string[];
  seoTitle: string;
  seoDescription: string;
};
