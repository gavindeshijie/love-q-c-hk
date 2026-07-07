export function money(value: number) {
  return `HK$${value.toLocaleString("en-HK", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function dateText(value: string) {
  return new Date(value).toLocaleString("zh-HK", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function maskContact(value: string) {
  if (!value) return "";
  if (value.includes("@")) {
    const [name, domain] = value.split("@");
    return `${name.slice(0, 2)}***@${domain}`;
  }
  return value.replace(/^(.{2}).*(.{3})$/, "$1****$2");
}

export function slugTitle(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
}
