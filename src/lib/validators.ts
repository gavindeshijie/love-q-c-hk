import type { Address } from "../types";

export function validateAddress(address: Address) {
  const errors: string[] = [];
  if (!address.name.trim()) errors.push("请填写收件人姓名");
  if (!address.phone.trim()) errors.push("请填写联系电话");
  if (!address.region.trim()) errors.push("请选择地区");
  if (!address.detail.trim()) errors.push("请填写详细地址");
  return errors;
}

export function isAdultVerified() {
  const raw = localStorage.getItem("loveqc_ageVerified");
  if (!raw) return false;
  try {
    const data = JSON.parse(raw) as { value: boolean; at: number; days: number };
    return data.value && Date.now() - data.at < data.days * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}
