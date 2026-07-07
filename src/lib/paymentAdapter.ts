export type PaymentMethod = {
  id: string;
  name: string;
  description: string;
  mode: "mock" | "manual";
};

export const paymentMethods: PaymentMethod[] = [
  { id: "fps_mock", name: "FPS / 转数快", description: "模拟转数快付款流程，不含真实商户密钥。", mode: "mock" },
  { id: "card_mock", name: "信用卡", description: "模拟卡支付确认，商家上线前需接入合规渠道。", mode: "mock" },
  { id: "wallet_mock", name: "电子钱包", description: "模拟电子钱包付款。", mode: "mock" },
  { id: "bank_manual", name: "线下转账", description: "提交后由客服确认付款。", mode: "manual" }
];

export async function submitMockPayment(methodId: string) {
  await new Promise((resolve) => window.setTimeout(resolve, 450));
  if (methodId === "bank_manual") return { status: "pending" as const };
  return { status: "success" as const };
}
