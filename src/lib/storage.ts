const PREFIX = "loveqc_";

export function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function storageSet<T>(key: string, value: T) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("loveqc-storage", { detail: { key } }));
}

export function storageRemove(key: string) {
  localStorage.removeItem(PREFIX + key);
  window.dispatchEvent(new CustomEvent("loveqc-storage", { detail: { key } }));
}

export function makeId(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
